import assert from "node:assert/strict";
import { createMusicPlayer, type MusicPlayerStatus } from "../lib/music/audio-player.ts";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

class FakeSource {
  buffer: AudioBuffer | null = null;
  loop = false;
  loopStart = 0;
  loopEnd = 0;
  onended: (() => void) | null = null;
  connected = false;
  stopped = false;
  offset = -1;
  gainAtStart = -1;
  gain: { gain: { value: number } } | null = null;
  connect(gain: { gain: { value: number } }) { this.connected = true; this.gain = gain; }
  disconnect() { this.connected = false; }
  start(_when: number, offset: number) { this.offset = offset; this.gainAtStart = this.gain!.gain.value; }
  stop() { this.stopped = true; this.onended?.(); }
  end() { this.onended?.(); }
}

class FakeContext {
  currentTime = 0;
  state: AudioContextState = "suspended";
  destination = {};
  sources: FakeSource[] = [];
  gain = { gain: { value: 1 }, connect() {}, disconnect() {} };
  decodeRequests: ReturnType<typeof deferred<AudioBuffer>>[] = [];
  resumeCount = 0;
  closed = false;
  onstatechange: (() => void) | null = null;
  createGain() { return this.gain; }
  createBufferSource() { const source = new FakeSource(); this.sources.push(source); return source; }
  resume() { this.resumeCount += 1; this.state = "running"; return Promise.resolve(); }
  close() { this.closed = true; this.state = "closed"; return Promise.resolve(); }
  decodeAudioData() { const request = deferred<AudioBuffer>(); this.decodeRequests.push(request); return request.promise; }
  transitionTo(state: AudioContextState) { this.state = state; this.onstatechange?.(); }
}

const trackA = { audioUrl: "/music/a.ogg", durationSeconds: 12, loopStartSeconds: 2, loopEndSeconds: 10 };
const trackB = { audioUrl: "/music/b.ogg", durationSeconds: 12, loopStartSeconds: 0, loopEndSeconds: 12 };
const audioBuffer = { duration: 12 } as AudioBuffer;
const tick = () => new Promise<void>((resolve) => setImmediate(resolve));

function harness() {
  const context = new FakeContext();
  let contextsCreated = 0;
  let ended = 0;
  const states: MusicPlayerStatus[] = [];
  const requests: { url: string; signal: AbortSignal; response: ReturnType<typeof deferred<Response>> }[] = [];
  const fetchAudio = ((input: string | URL | Request, init: RequestInit) => {
    const response = deferred<Response>();
    requests.push({ url: String(input), signal: init.signal as AbortSignal, response });
    return response.promise;
  }) as typeof fetch;
  const player = createMusicPlayer({
    onStatus: (state) => states.push(state),
    onEnded: () => { ended += 1; },
    fetchAudio,
    createAudioContext: () => { contextsCreated += 1; return context as unknown as AudioContext; },
  });
  async function respond(index = requests.length - 1) {
    requests[index].response.resolve(new Response(new Uint8Array([1, 2, 3])));
    await tick();
  }
  async function load() {
    const playing = player.play();
    await tick();
    await respond();
    context.decodeRequests.at(-1)!.resolve(audioBuffer);
    await playing;
  }
  return { player, context, requests, states, respond, load, ended: () => ended, contextsCreated: () => contextsCreated };
}

const tests: [string, () => Promise<void> | void][] = [];
function test(name: string, check: () => Promise<void> | void) { tests.push([name, check]); }

test("selection and control changes do not create audio or load assets", () => {
  const h = harness();
  h.player.setTrack(trackA);
  h.player.setVolume(0.3);
  h.player.setMuted(true);
  h.player.setLoop("one");
  assert.equal(h.contextsCreated(), 0);
  assert.equal(h.requests.length, 0);
  assert.equal(h.states.at(-1)?.status, "idle");
});

test("play resumes context in the gesture and lazily loads one selected track", async () => {
  const h = harness();
  h.player.setTrack(trackA);
  const playing = h.player.play();
  assert.equal(h.context.resumeCount, 1);
  assert.equal(h.states.at(-1)?.status, "loading");
  await tick();
  assert.equal(h.requests.length, 1);
  assert.equal(h.requests[0].url, trackA.audioUrl);
  await h.respond();
  assert.equal(h.context.sources.length, 0);
  h.context.decodeRequests[0].resolve(audioBuffer);
  await playing;
  assert.equal(h.context.sources.length, 1);
  assert.equal(h.context.sources[0].offset, 0);
  assert.equal(h.states.at(-1)?.status, "playing");
});

test("repeated play while loading shares one request", async () => {
  const h = harness();
  h.player.setTrack(trackA);
  const first = h.player.play();
  const second = h.player.play();
  assert.equal(first, second);
  await tick();
  assert.equal(h.requests.length, 1);
  h.player.pause();
  h.requests[0].response.reject(new DOMException("Aborted", "AbortError"));
  await first;
  assert.equal(h.states.at(-1)?.status, "paused");
});

test("pause and resume preserve position without another fetch or decode", async () => {
  const h = harness();
  h.player.setTrack(trackA);
  await h.load();
  h.context.currentTime = 3.25;
  assert.equal(h.player.getCurrentTime(), 3.25);
  h.player.pause();
  assert.equal(h.context.sources[0].stopped, true);
  assert.equal(h.context.sources[0].connected, false);
  h.context.currentTime = 20;
  assert.equal(h.player.getCurrentTime(), 3.25);
  await h.player.play();
  assert.equal(h.context.sources[1].offset, 3.25);
  assert.equal(h.requests.length, 1);
  assert.equal(h.context.decodeRequests.length, 1);
  assert.equal(h.ended(), 0);
});

test("pause aborts a pending fetch and prevents late playback", async () => {
  const h = harness();
  h.player.setTrack(trackA);
  const playing = h.player.play();
  await tick();
  h.player.pause();
  assert.equal(h.requests[0].signal.aborted, true);
  await h.respond();
  await playing;
  assert.equal(h.context.decodeRequests.length, 0);
  assert.equal(h.context.sources.length, 0);
  assert.equal(h.states.at(-1)?.status, "paused");
});

test("track switches abort a pending request and ignore its stale response", async () => {
  const h = harness();
  h.player.setTrack(trackA);
  const first = h.player.play();
  await tick();
  h.player.setTrack(trackB);
  assert.equal(h.requests[0].signal.aborted, true);
  const second = h.player.play();
  await tick();
  await h.respond(0);
  await first;
  assert.equal(h.context.decodeRequests.length, 0);
  await h.respond(1);
  h.context.decodeRequests[0].resolve(audioBuffer);
  await second;
  assert.equal(h.context.sources.length, 1);
  assert.equal(h.requests[1].url, trackB.audioUrl);
  assert.equal(h.states.at(-1)?.status, "playing");
});

test("stale decode cannot replace the newly selected track", async () => {
  const h = harness();
  h.player.setTrack(trackA);
  const first = h.player.play();
  await tick();
  await h.respond();
  h.player.setTrack(trackB);
  const second = h.player.play();
  await tick();
  await h.respond();
  const secondBuffer = { duration: 8 } as AudioBuffer;
  h.context.decodeRequests[1].resolve(secondBuffer);
  await second;
  h.context.decodeRequests[0].resolve(audioBuffer);
  await first;
  assert.equal(h.context.sources.length, 1);
  assert.equal(h.context.sources[0].buffer, secondBuffer);
  assert.equal(h.states.at(-1)?.status, "playing");
});

test("volume and mute changes during decode apply to the first played sample", async () => {
  const h = harness();
  h.player.setTrack(trackA);
  const playing = h.player.play();
  await tick();
  await h.respond();
  h.player.setVolume(0.22);
  h.player.setMuted(true);
  h.context.decodeRequests[0].resolve(audioBuffer);
  await playing;
  assert.equal(h.context.sources[0].gainAtStart, 0);
  h.player.setMuted(false);
  assert.equal(h.context.gain.gain.value, 0.22);
  h.player.setVolume(2);
  assert.equal(h.context.gain.gain.value, 1);
  h.player.setVolume(-1);
  assert.equal(h.context.gain.gain.value, 0);
});

test("loop one uses exact supplied boundaries and preserves wrapped position", async () => {
  const h = harness();
  const precise = { ...trackA, loopStartSeconds: 96000 / 48000, loopEndSeconds: 480001 / 48000 };
  h.player.setTrack(precise);
  h.player.setLoop("one");
  await h.load();
  const source = h.context.sources[0];
  assert.equal(source.loop, true);
  assert.equal(source.loopStart, 96000 / 48000);
  assert.equal(source.loopEnd, 480001 / 48000);
  h.context.currentTime = precise.loopEndSeconds + 1;
  assert.ok(Math.abs(h.player.getCurrentTime() - 3) < 0.000001);
  h.player.pause();
  await h.player.play();
  assert.ok(Math.abs(h.context.sources[1].offset - 3) < 0.000001);
  assert.equal(h.ended(), 0);
});

test("changing loop mode keeps elapsed position continuous", async () => {
  const h = harness();
  h.player.setTrack(trackA);
  h.player.setLoop("one");
  await h.load();
  h.context.currentTime = 11;
  h.player.setLoop("all");
  assert.equal(h.context.sources[0].loop, false);
  assert.equal(h.player.getCurrentTime(), 3);
  h.context.currentTime = 12;
  assert.equal(h.player.getCurrentTime(), 4);
});

test("enabling one during the rendered tail re-enters the exact loop", async () => {
  const h = harness();
  h.player.setTrack(trackA);
  await h.load();
  h.context.currentTime = 11;
  h.player.setLoop("one");
  assert.equal(h.context.sources[0].stopped, true);
  assert.equal(h.context.sources[1].loop, true);
  assert.equal(h.context.sources[1].offset, 3);
  assert.equal(h.player.getCurrentTime(), 3);
  assert.equal(h.ended(), 0);
  assert.equal(h.requests.length, 1);
});

for (const loop of ["off", "all"] as const) {
  test(`loop ${loop} completes once, resets elapsed time, and lets UI decide the next track`, async () => {
    const h = harness();
    h.player.setTrack(trackA);
    h.player.setLoop(loop);
    await h.load();
    assert.equal(h.context.sources[0].loop, false);
    h.context.currentTime = 12;
    h.context.sources[0].end();
    assert.equal(h.ended(), 1);
    assert.equal(h.states.at(-1)?.status, "idle");
    assert.equal(h.player.getCurrentTime(), 0);
    assert.equal(h.context.sources.length, 1);
  });
}

test("stopped sources cannot end a replacement track", async () => {
  const h = harness();
  h.player.setTrack(trackA);
  await h.load();
  const staleEnded = h.context.sources[0].onended!;
  h.player.setTrack(trackB);
  await h.load();
  staleEnded();
  assert.equal(h.ended(), 0);
  assert.equal(h.states.at(-1)?.status, "playing");
  assert.equal(h.context.sources[0].stopped, true);
});

test("HTTP errors are visible and a later play can retry", async () => {
  const h = harness();
  h.player.setTrack(trackA);
  const playing = h.player.play();
  await tick();
  h.requests[0].response.resolve(new Response("Missing", { status: 404 }));
  await playing;
  assert.equal(h.states.at(-1)?.status, "error");
  assert.match(h.states.at(-1)?.error ?? "", /could not be loaded/);
  await h.load();
  assert.equal(h.states.at(-1)?.status, "playing");
});

test("decode failure is visible without starting an audio source", async () => {
  const h = harness();
  h.player.setTrack(trackA);
  const playing = h.player.play();
  await tick();
  await h.respond();
  h.context.decodeRequests[0].reject(new Error("Audio format unavailable"));
  await playing;
  assert.equal(h.states.at(-1)?.status, "error");
  assert.equal(h.states.at(-1)?.error, "Audio format unavailable");
  assert.equal(h.context.sources.length, 0);
});

test("dispose during decode suppresses callbacks, closes context, and prevents restart", async () => {
  const h = harness();
  h.player.setTrack(trackA);
  const playing = h.player.play();
  await tick();
  await h.respond();
  const stateCount = h.states.length;
  h.player.dispose();
  assert.equal(h.requests[0].signal.aborted, true);
  assert.equal(h.context.closed, true);
  h.context.decodeRequests[0].resolve(audioBuffer);
  await playing;
  await h.player.play();
  assert.equal(h.states.length, stateCount);
  assert.equal(h.context.sources.length, 0);
  assert.equal(h.requests.length, 1);
});

test("dispose while playing stops and disconnects audio without an ended callback", async () => {
  const h = harness();
  h.player.setTrack(trackA);
  await h.load();
  h.player.dispose();
  h.player.dispose();
  assert.equal(h.context.sources[0].stopped, true);
  assert.equal(h.context.sources[0].connected, false);
  assert.equal(h.context.closed, true);
  assert.equal(h.context.onstatechange, null);
  assert.equal(h.ended(), 0);
});

test("initial suspended state can settle through explicit resume without a false interruption", async () => {
  const h = harness();
  const resumed = deferred<void>();
  h.context.resume = () => resumed.promise;
  h.player.setTrack(trackA);
  const playing = h.player.play();
  h.context.transitionTo("suspended");
  assert.equal(h.states.at(-1)?.status, "loading");
  h.context.transitionTo("running");
  resumed.resolve();
  await tick();
  await h.respond();
  h.context.decodeRequests[0].resolve(audioBuffer);
  await playing;
  assert.equal(h.states.at(-1)?.status, "playing");
  assert.equal(h.states.some((state) => state.status === "paused"), false);
});

test("context interruption during decode cancels stale playback and requires an explicit retry", async () => {
  const h = harness();
  h.player.setTrack(trackA);
  const playing = h.player.play();
  await tick();
  await h.respond();
  h.context.transitionTo("suspended");
  assert.equal(h.requests[0].signal.aborted, true);
  assert.deepEqual(h.states.at(-1), { status: "paused", error: "Playback was interrupted. Press Play to continue." });
  h.context.decodeRequests[0].resolve(audioBuffer);
  await playing;
  h.context.transitionTo("running");
  assert.equal(h.context.sources.length, 0);
  assert.equal(h.states.at(-1)?.status, "paused");
  await h.load();
  assert.equal(h.context.sources.length, 1);
  assert.equal(h.requests.length, 2);
  assert.equal(h.states.at(-1)?.status, "playing");
});

test("context interruption while playing stops audio and preserves the resume position", async () => {
  const h = harness();
  h.player.setTrack(trackA);
  await h.load();
  h.context.currentTime = 4.25;
  h.context.transitionTo("suspended");
  assert.equal(h.context.sources[0].stopped, true);
  assert.equal(h.context.sources[0].connected, false);
  assert.equal(h.player.getCurrentTime(), 4.25);
  assert.equal(h.ended(), 0);
  assert.equal(h.states.at(-1)?.status, "paused");
  h.context.transitionTo("running");
  assert.equal(h.context.sources.length, 1);
  assert.equal(h.states.at(-1)?.status, "paused");
  await h.player.play();
  assert.equal(h.context.sources[1].offset, 4.25);
  assert.equal(h.requests.length, 1);
  assert.equal(h.states.at(-1)?.status, "playing");
});

test("a suspended context is checked before source creation even before its event arrives", async () => {
  const h = harness();
  h.player.setTrack(trackA);
  const playing = h.player.play();
  await tick();
  await h.respond();
  h.context.state = "suspended";
  h.context.decodeRequests[0].resolve(audioBuffer);
  await playing;
  assert.equal(h.context.sources.length, 0);
  assert.equal(h.states.at(-1)?.status, "paused");
  assert.equal(h.states.at(-1)?.error, "Playback was interrupted. Press Play to continue.");
});

let passed = 0;
for (const [name, check] of tests) {
  await check();
  passed += 1;
  console.log(`PASS ${name}`);
}
console.log(`${passed} music player checks passed (deterministic fake Web Audio; no ear audition).`);
