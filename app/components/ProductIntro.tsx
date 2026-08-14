"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CityPlanet,
  CITY_PLANET_DURATION,
  CITY_PLANET_FPS,
  CITY_PLANET_HEIGHT,
  CITY_PLANET_WIDTH,
  WORLDS_DURATION,
  type CityPlanetProps,
} from "@/remotion/CityPlanet";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { links } from "@/lib/site";

export function ProductIntro({ locale = "en" }: { locale?: Locale }) {
  const m = t(locale);
  const playerRef = useRef<PlayerRef>(null);
  const [reduce, setReduce] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);

  const inputProps = useMemo<CityPlanetProps>(
    () => ({
      worldsTitle: m.intro.worldsTitle,
      worldsLine: m.intro.worldsLine,
      worldsLower: m.intro.worldsLower,
      planetTitle: m.intro.planetTitle,
      planetLine: m.intro.planetLine,
      planetLower: m.intro.planetLower,
    }),
    [m],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onFrame = (e: { detail: { frame: number } }) => setFrame(e.detail.frame);
    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);
    player.addEventListener("frameupdate", onFrame);
    return () => {
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
      player.removeEventListener("frameupdate", onFrame);
    };
  }, [reduce]);

  useEffect(() => {
    if (reduce) {
      playerRef.current?.pause();
      playerRef.current?.seekTo(0);
      setPlaying(false);
    }
  }, [reduce]);

  const activeHref = frame < WORLDS_DURATION ? links.gghereWorlds : links.jubuddyPlanet;
  const activePath = frame < WORLDS_DURATION ? "gghere.com/worlds" : "jubuddy.com/planet";

  return (
    <section className="intro-wrap" aria-label={m.intro.kicker}>
      <div className="pointer-events-none absolute -right-2 -top-10 hidden lg:block" aria-hidden>
        <span className="worlds-planet intro-orbit-planet mx-auto block">
          <span className="worlds-ring orbit-ring" />
          <span className="worlds-globe logo-float" />
          <span className="worlds-spark orbit-spark" />
        </span>
      </div>
      <div className="intro-reel intro-reel-player">
        {reduce === null ? (
          <div className="intro-player-slot" aria-hidden />
        ) : (
          <Player
            ref={playerRef}
            component={CityPlanet}
            inputProps={inputProps}
            durationInFrames={CITY_PLANET_DURATION}
            fps={CITY_PLANET_FPS}
            compositionWidth={CITY_PLANET_WIDTH}
            compositionHeight={CITY_PLANET_HEIGHT}
            autoPlay={!reduce}
            loop={!reduce}
            controls={false}
            clickToPlay={false}
            allowFullscreen={false}
            acknowledgeRemotionLicense
            style={{ width: "100%", height: "100%" }}
          />
        )}
        <a
          href={activeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="intro-hit"
          aria-label={`${m.cta.openLive} ${activePath}`}
        />
        <button
          type="button"
          className="intro-play"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            playerRef.current?.toggle(event);
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </section>
  );
}
