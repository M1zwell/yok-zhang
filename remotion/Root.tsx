import { Composition } from "remotion";
import {
  CityPlanet,
  CITY_PLANET_DURATION,
  CITY_PLANET_FPS,
  CITY_PLANET_HEIGHT,
  CITY_PLANET_WIDTH,
  cityPlanetDefaultProps,
} from "./CityPlanet";

export function RemotionRoot() {
  return (
    <Composition
      id="CityPlanet"
      component={CityPlanet}
      durationInFrames={CITY_PLANET_DURATION}
      fps={CITY_PLANET_FPS}
      width={CITY_PLANET_WIDTH}
      height={CITY_PLANET_HEIGHT}
      defaultProps={cityPlanetDefaultProps}
    />
  );
}
