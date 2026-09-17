import { FilmReel } from "@/app/components/FilmReel";
import { seo } from "@/lib/seo";

export const metadata = {
  ...seo({
    title: "CityPlanet film",
    description: "Fullscreen Remotion CityPlanet loop for demo-reel capture. 1920×1080, 30 fps, 9 seconds.",
    path: "/film",
  }),
  robots: { index: false, follow: false },
};

export default function FilmPage() {
  return <FilmReel locale="en" />;
}
