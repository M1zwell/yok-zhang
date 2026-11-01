export type MusicLoop = "off" | "all" | "one";

export type MusicTrackAudio = {
  audioUrl: string;
  durationSeconds: number;
  loopStartSeconds?: number;
  loopEndSeconds?: number;
};

export type MusicPlayerStatus = {
  status: "idle" | "loading" | "playing" | "paused" | "error";
  error?: string;
};

type MusicPlayerOptions = {
  onStatus: (state: MusicPlayerStatus) => void;
  onEnded: () => void;
  /** Injected by the verification script; browsers use native fetch and Web Audio. */
  fetchAudio?: typeof fetch;
  createAudioContext?: () => AudioContext;
};

function defaultAudioContext() {
  const Context = globalThis.AudioContext ??
    (globalThis as typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) throw new Error("This browser does not support Web Audio playback.");
  return new Context();
}

/** One lazily loaded track, with cancellation guards around every asynchronous step. */
export function createMusicPlayer({
  onStatus,
  onEnded,
  fetchAudio = globalThis.fetch.bind(globalThis),
  createAudioContext = defaultAudioContext,
}: MusicPlayerOptions) {
  let track: MusicTrackAudio | null = null;
  let context: AudioContext | null = null;
  let gain: GainNode | null = null;
  let buffer: AudioBuffer | null = null;
  let source: AudioBufferSourceNode | null = null;
  let controller: AbortController | null = null;
  let generation = 0;
  let disposed = false;
  let status: MusicPlayerStatus["status"] = "idle";
  let loop: MusicLoop = "off";
  let volume = 0.7;
  let muted = false;
  let offset = 0;
  let startedAt = 0;
  let pendingPlay: Promise<void> | null = null;
  let resumingGeneration: number | null = null;

  function publish(next: MusicPlayerStatus) {
    status = next.status;
    if (!disposed) onStatus(next);
  }

  function bounds() {
    const duration = buffer?.duration ?? track?.durationSeconds ?? 0;
    const startValue = track?.loopStartSeconds ?? 0;
    const endValue = track?.loopEndSeconds ?? duration;
    const start = Number.isFinite(startValue) && startValue >= 0 && startValue < duration ? startValue : 0;
    const end = Number.isFinite(endValue) && endValue > start && endValue <= duration ? endValue : duration;
    return { start, end, duration };
  }

  function position() {
    if (!source || !context) return offset;
    const { start, end, duration } = bounds();
    const elapsed = Math.max(0, context.currentTime - startedAt);
    const seconds = offset + elapsed;
    if (loop === "one" && end > start && seconds >= end) {
      return start + ((seconds - start) % (end - start));
    }
    return Math.min(seconds, duration);
  }

  function stopSource() {
    if (!source) return;
    const previous = source;
    source = null;
    previous.onended = null;
    // A failed start (or a browser that has already retired the source) may throw.
    try { previous.stop(); } catch { /* The node is still disconnected below. */ }
    previous.disconnect();
  }

  function cancelPending() {
    generation += 1;
    resumingGeneration = null;
    controller?.abort();
    controller = null;
    pendingPlay = null;
  }

  function applyVolume() {
    if (gain) gain.gain.value = muted ? 0 : volume;
  }

  function interrupt() {
    if (disposed || (status !== "loading" && status !== "playing")) return;
    offset = position();
    cancelPending();
    stopSource();
    publish({ status: "paused", error: "Playback was interrupted. Press Play to continue." });
  }

  function ensureContext() {
    if (!context) {
      const created = createAudioContext();
      context = created;
      gain = created.createGain();
      applyVolume();
      gain.connect(created.destination);
      created.onstatechange = () => {
        if (context !== created || created.state === "running") return;
        // A new context starts suspended; allow the explicit resume to settle.
        if (resumingGeneration === generation) return;
        interrupt();
      };
    }
    return context;
  }

  function setTrack(next: MusicTrackAudio) {
    if (disposed) return;
    cancelPending();
    stopSource();
    track = next;
    buffer = null;
    offset = 0;
    publish({ status: "idle" });
  }

  function startBuffered(token: number, audioContext: AudioContext) {
    if (!buffer || !gain) return;
    if (audioContext.state !== "running") {
      interrupt();
      return;
    }
    const { start, end, duration } = bounds();
    if (offset >= duration) offset = 0;
    if (loop === "one" && offset >= end) offset = start + ((offset - start) % (end - start));
    const next = audioContext.createBufferSource();
    next.buffer = buffer;
    next.loop = loop === "one";
    next.loopStart = start;
    next.loopEnd = end;
    next.connect(gain);
    applyVolume();
    next.onended = () => {
      if (disposed || generation !== token || source !== next) return;
      next.disconnect();
      source = null;
      offset = 0;
      publish({ status: "idle" });
      onEnded();
    };
    source = next;
    startedAt = audioContext.currentTime;
    next.start(0, offset);
    publish({ status: "playing" });
  }

  function play(): Promise<void> {
    if (disposed || !track || status === "playing") return Promise.resolve();
    if (pendingPlay) return pendingPlay;

    const token = ++generation;
    const selected = track;
    const valid = () => !disposed && generation === token && track === selected;
    publish({ status: "loading" });
    resumingGeneration = token;

    // Context creation and resume happen in the user gesture, before fetch/decode.
    let audioContext: AudioContext;
    let resume: Promise<void>;
    try {
      audioContext = ensureContext();
      resume = audioContext.resume();
    } catch (error) {
      resumingGeneration = null;
      publish({ status: "error", error: error instanceof Error ? error.message : "Audio could not start. Please try again." });
      return Promise.resolve();
    }

    const work = (async () => {
      try {
        await resume;
        if (resumingGeneration === token) resumingGeneration = null;
        if (!valid()) return;
        if (audioContext.state !== "running") {
          interrupt();
          return;
        }
        if (!buffer) {
          const request = new AbortController();
          controller = request;
          const response = await fetchAudio(selected.audioUrl, { signal: request.signal });
          if (!valid()) return;
          if (!response.ok) throw new Error("This track could not be loaded. Please try again or choose another track.");
          const encoded = await response.arrayBuffer();
          if (!valid()) return;
          const decoded = await audioContext.decodeAudioData(encoded);
          if (!valid()) return;
          if (!(decoded.duration > 0)) throw new Error("This track contains no playable audio.");
          buffer = decoded;
          controller = null;
        }
        if (!valid()) return;
        startBuffered(token, audioContext);
      } catch (error) {
        if (!valid()) return;
        stopSource();
        controller = null;
        publish({ status: "error", error: error instanceof Error ? error.message : "Audio could not play. Please try again or choose another track." });
      } finally {
        if (resumingGeneration === token) resumingGeneration = null;
        if (generation === token) pendingPlay = null;
      }
    })();
    pendingPlay = work;
    return work;
  }

  function pause() {
    if (disposed || !track) return;
    offset = position();
    cancelPending();
    stopSource();
    publish({ status: "paused" });
  }

  function setLoop(next: MusicLoop) {
    if (disposed) return;
    // Re-anchor elapsed time before changing how the running position wraps.
    offset = position();
    if (context) startedAt = context.currentTime;
    loop = next;
    if (source) {
      const { end } = bounds();
      if (next === "one" && offset >= end && context) {
        // A source already in the rendered tail must re-enter the loop explicitly.
        stopSource();
        try {
          startBuffered(generation, context);
        } catch (error) {
          stopSource();
          publish({ status: "error", error: error instanceof Error ? error.message : "Audio could not play. Please try again." });
        }
      } else {
        source.loop = next === "one";
      }
    }
  }

  function setVolume(next: number) {
    if (disposed) return;
    volume = Number.isFinite(next) ? Math.max(0, Math.min(1, next)) : volume;
    applyVolume();
  }

  function setMuted(next: boolean) {
    if (disposed) return;
    muted = next;
    applyVolume();
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelPending();
    stopSource();
    gain?.disconnect();
    if (context) context.onstatechange = null;
    if (context && context.state !== "closed") void context.close().catch(() => undefined);
    buffer = null;
    track = null;
    context = null;
    gain = null;
    offset = 0;
  }

  return { setTrack, play, pause, setLoop, setVolume, setMuted, getCurrentTime: position, dispose };
}
