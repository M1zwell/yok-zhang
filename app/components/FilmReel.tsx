"use client";

import { Player } from "@remotion/player";
import { useMemo } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import {
  CityPlanet,
  CITY_PLANET_DURATION,
  CITY_PLANET_FPS,
  CITY_PLANET_HEIGHT,
  CITY_PLANET_WIDTH,
  type CityPlanetProps,
} from "@/remotion/CityPlanet";

export function FilmReel({ locale = "en" }: { locale?: Locale }) {
  const m = t(locale);
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

  return (
    <div className="film-root" data-testid="film-root">
      <Player
        component={CityPlanet}
        inputProps={inputProps}
        durationInFrames={CITY_PLANET_DURATION}
        fps={CITY_PLANET_FPS}
        compositionWidth={CITY_PLANET_WIDTH}
        compositionHeight={CITY_PLANET_HEIGHT}
        autoPlay
        loop
        controls={false}
        clickToPlay={false}
        allowFullscreen={false}
        acknowledgeRemotionLicense
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
