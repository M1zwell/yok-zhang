import hk from "../../public/audio/music/hk/playlist.json";
import cn from "../../public/audio/music/cn/playlist.json";
import jp from "../../public/audio/music/jp/playlist.json";

export type MusicRegionId = "hk" | "cn" | "jp";

export interface MusicTrack {
  id: string;
  title: string;
  mood: string;
  bpm: number;
  durationSeconds: number;
  audioUrl: string;
  midiUrl: string;
  loop: {
    startSample: number;
    endSampleExclusive: number;
    sampleRate: number;
  };
}

export interface MusicRegion {
  id: MusicRegionId;
  label: string;
  nativeLabel: string;
  description: string;
  tracks: readonly MusicTrack[];
}

/** Existing original synthetic instrumentals, imported without re-rendering. */
export const regions: readonly MusicRegion[] = [
  { id: "hk", label: "Hong Kong", nativeLabel: "香港", description: "Harbour lights, rooftops and homeward paths.", tracks: hk.tracks },
  { id: "cn", label: "China", nativeLabel: "中国", description: "Stone paths, open skies and afternoon daydreams.", tracks: cn.tracks },
  { id: "jp", label: "Japan", nativeLabel: "日本", description: "Sunlit platforms, quiet cafés and small discoveries.", tracks: jp.tracks },
];

export const musicTrackCount = regions.reduce((total, region) => total + region.tracks.length, 0);
