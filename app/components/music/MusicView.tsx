"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { localizeHref, type Locale } from "@/lib/i18n";
import { regions, type MusicTrack } from "@/lib/music/catalog";
import { createMusicPlayer } from "@/lib/music/audio-player";
import styles from "./music.module.css";

type LoopMode = "off" | "all" | "one";
type PlaybackStatus = "idle" | "loading" | "playing" | "paused" | "error";
const loopLabels: Record<LoopMode, string> = { off: "Off", all: "All", one: "One" };
const loopHints: Record<LoopMode, string> = {
  off: "Stops after the current track.",
  all: "Plays the whole playlist, then starts again.",
  one: "Repeats the current track.",
};

function clock(seconds: number) {
  const value = Math.max(0, Math.floor(seconds));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}

function engineTrack(track: MusicTrack) {
  return {
    audioUrl: track.audioUrl,
    durationSeconds: track.durationSeconds,
    loopStartSeconds: track.loop.startSample / track.loop.sampleRate,
    loopEndSeconds: track.loop.endSampleExclusive / track.loop.sampleRate,
  };
}

export function MusicView({ locale = "en" }: { locale?: Locale }) {
  const [regionIndex, setRegionIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [error, setError] = useState("");
  const [loop, setLoop] = useState<LoopMode>("off");
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const player = useRef<ReturnType<typeof createMusicPlayer> | null>(null);
  const current = useRef({ regionIndex: 0, trackIndex: 0, loop: "off" as LoopMode, wantsPlay: false });
  const region = regions[regionIndex];
  const track = region.tracks[trackIndex];

  useEffect(() => {
    const selection = current.current;
    const engine = createMusicPlayer({
      onStatus: (state) => {
        setStatus(state.status);
        setError(state.error || "");
        if (state.status === "error" || state.status === "paused") selection.wantsPlay = false;
      },
      onEnded: () => {
        const selected = selection;
        if (selected.loop === "one" && selected.wantsPlay) {
          // A source can finish just before the user enables One and queues its ended event.
          setElapsed(0);
          void engine.play();
        } else if (selected.loop === "all" && selected.wantsPlay) {
          const playlist = regions[selected.regionIndex].tracks;
          const index = (selected.trackIndex + 1) % playlist.length;
          selected.trackIndex = index;
          setTrackIndex(index);
          setElapsed(0);
          engine.setTrack(engineTrack(playlist[index]));
          void engine.play();
        } else {
          selected.wantsPlay = false;
          setElapsed(0);
        }
      },
    });
    player.current = engine;
    engine.setTrack(engineTrack(regions[0].tracks[0]));
    engine.setVolume(0.7);
    return () => {
      player.current = null;
      selection.wantsPlay = false;
      engine.dispose();
    };
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    const timer = window.setInterval(() => setElapsed(player.current?.getCurrentTime() || 0), 250);
    return () => window.clearInterval(timer);
  }, [status]);

  function chooseTrack(index: number, play: boolean) {
    const selected = current.current;
    selected.trackIndex = index;
    selected.wantsPlay = play;
    setTrackIndex(index);
    setElapsed(0);
    const next = regions[selected.regionIndex].tracks[index];
    player.current?.setTrack(engineTrack(next));
    if (play) void player.current?.play();
  }

  function togglePlay() {
    if (!player.current) return;
    if (current.current.wantsPlay) {
      current.current.wantsPlay = false;
      player.current.pause();
      setElapsed(player.current.getCurrentTime());
    } else {
      current.current.wantsPlay = true;
      void player.current.play();
    }
  }

  function chooseRegion(index: number) {
    if (index === current.current.regionIndex) return;
    current.current.regionIndex = index;
    setRegionIndex(index);
    chooseTrack(0, false);
  }

  function cycleLoop() {
    const next = ({ off: "all", all: "one", one: "off" } as const)[current.current.loop];
    current.current.loop = next;
    setLoop(next);
    player.current?.setLoop(next);
  }

  const active = status === "playing" || status === "loading";
  const statusText = error || (status === "loading" ? "Loading selected track…" : status === "playing" ? "Playing" : status === "paused" ? "Paused · press play to listen" : "Ready when you are · press play to listen");

  return (
    <main lang="en" className={styles.room}>
      <section className="page-x mx-auto max-w-6xl pt-12 pb-10 sm:pt-20 sm:pb-12">
        <div className={styles.eyebrow}>
          <Link href={localizeHref("/", locale)} className={styles.back}>← Garden</Link>
          <span className="kicker">A little room for listening</span>
        </div>
        <div className={styles.heading}>
          <div>
            <h1 className="mt-5 font-display text-[clamp(2.8rem,8vw,5.5rem)] leading-[1] tracking-tight">AI Music Play<span className={styles.dot}>.</span></h1>
            <p className={styles.lead}>Three places. Two hundred little soundtracks.<br className="hidden sm:block" /> Pick a playlist and stay a while.</p>
          </div>
          <p className={styles.collectionNote}><span>200</span> original synthetic<br />instrumentals</p>
        </div>
      </section>

      <section className="page-x mx-auto max-w-6xl pb-16 sm:pb-24" aria-label="Music player">
        <div className={styles.regions} role="group" aria-label="Regional playlists">
          {regions.map((item, index) => (
            <button key={item.id} type="button" aria-pressed={regionIndex === index} onClick={() => chooseRegion(index)} className={styles.region}>
              <span className={styles.regionCode}>{item.id.toUpperCase()}</span>
              <span className={styles.regionName}>{item.label}<span>{item.nativeLabel}</span></span>
              <span className={styles.count}>{item.tracks.length}<span> tracks</span></span>
            </button>
          ))}
        </div>

        <div className={styles.listeningGrid}>
          <div className={styles.playerColumn}>
            <div className={styles.playerCard}>
              <div className={styles.art} data-region={region.id} data-playing={status === "playing"} aria-hidden="true">
                <span className={styles.artIndex}>ICHINA / {region.id.toUpperCase()} / {String(trackIndex + 1).padStart(3, "0")}</span>
                <div className={styles.record}><div className={styles.recordLabel}>{region.nativeLabel}</div></div>
                <span className={styles.artCaption}>Original synthetic instrumentals</span>
              </div>
              <div className={styles.playerBody}>
                <p className="kicker">Selected track · {String(trackIndex + 1).padStart(2, "0")} / {region.tracks.length}</p>
                <h2 className={styles.trackTitle} data-testid="selected-track">{track.title}</h2>
                <p className={styles.trackMeta}>{region.label} · {clock(track.durationSeconds)}{track.bpm ? ` · ${track.bpm} BPM` : ""}</p>
                <p className={styles.status} role={error ? "alert" : "status"} aria-live="polite">{statusText}</p>
                <div className={styles.progress} aria-hidden="true"><span style={{ width: `${Math.min(100, elapsed / track.durationSeconds * 100)}%` }} /></div>
                <div className={styles.time} aria-hidden="true"><span>{clock(elapsed)}</span><span>{clock(track.durationSeconds)}</span></div>

                <div className={styles.transport}>
                  <button className={styles.play} type="button" onClick={togglePlay} aria-label={active ? "Pause playback" : "Play selected track"}>
                    <span aria-hidden="true">{active ? "Ⅱ" : "▶"}</span>{active ? "Pause" : "Play"}
                  </button>
                  <button className={styles.control} type="button" onClick={() => chooseTrack((current.current.trackIndex + 1) % region.tracks.length, current.current.wantsPlay)} aria-label="Next track">Next <span aria-hidden="true">↗</span></button>
                  <button className={styles.control} type="button" onClick={cycleLoop} aria-label={`Loop: ${loopLabels[loop]}`} aria-describedby="music-loop-hint">↻ {loopLabels[loop]}</button>
                </div>
                <p id="music-loop-hint" className={styles.loopHint}>{loopHints[loop]}</p>

                <div className={styles.volume}>
                  <button className={styles.mute} type="button" aria-label={muted ? "Unmute audio" : "Mute audio"} aria-pressed={muted} onClick={() => { setMuted(!muted); player.current?.setMuted(!muted); }}>{muted ? "Unmute" : "Mute"}</button>
                  <label className="sr-only" htmlFor="music-volume">Volume</label>
                  <input id="music-volume" type="range" min="0" max="100" value={volume} onChange={(event) => { const value = Number(event.target.value); setVolume(value); player.current?.setVolume(value / 100); }} aria-valuetext={`${volume}%${muted ? ", muted" : ""}`} />
                  <output htmlFor="music-volume">{volume}%</output>
                </div>
                <a className={styles.download} href={track.midiUrl} download={`${track.id}.mid`} aria-label={`Download MIDI for ${track.title}`}><span aria-hidden="true">↓</span> Download MIDI <span className={styles.downloadType}>.mid</span></a>
              </div>
            </div>
            <p className={styles.provenance}>Programmatically composed and synthesized. No external recordings or samples. Audio loads only when you press play.</p>
          </div>

          <div className={styles.playlist} aria-labelledby="music-playlist-title">
            <div className={styles.playlistHeader}>
              <div><p className="kicker">The playlist</p><h2 id="music-playlist-title">{region.label}<span>{region.nativeLabel}</span></h2></div>
              <span className={styles.playlistCount}>{region.tracks.length} tracks</span>
            </div>
            <p className={styles.playlistDescription}>{region.description}</p>
            <ol className={styles.tracks} aria-label={`${region.label} tracks`}>
              {region.tracks.map((item, index) => {
                const selected = trackIndex === index;
                return <li key={item.id}>
                  <button type="button" className={styles.track} aria-current={selected ? "true" : undefined} onClick={() => selected ? togglePlay() : chooseTrack(index, true)} aria-label={`${selected && active ? "Pause" : "Play"} ${item.title}`}>
                    <span className={styles.trackNumber} aria-hidden="true">{selected && active ? <span className={styles.bars}><i /><i /><i /></span> : String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.trackName}>{item.title}<span>{item.id.toUpperCase()}{item.bpm ? ` · ${item.bpm} BPM` : ""}</span></span>
                    <span className={styles.trackDuration}>{clock(item.durationSeconds)}</span>
                    <span className={styles.trackArrow} aria-hidden="true">{selected && active ? "Ⅱ" : "▶"}</span>
                  </button>
                </li>;
              })}
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}
