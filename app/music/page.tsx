import { MusicView } from "@/app/components/music/MusicView";
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "AI Music Play",
  description: "A listening room for 200 original synthetic instrumentals. Explore Hong Kong, China and Japan playlists, with MIDI downloads.",
  path: "/music",
});

export default function MusicPage() {
  return <MusicView />;
}
