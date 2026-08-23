import type { Locale } from "@/lib/i18n";

export type I18nText = {
  "zh-Hans": string;
  "zh-Hant": string;
  en: string;
  th: string;
};

export type Gender = "male" | "female" | "unknown";

export type Person = {
  id: string;
  generation: number | null;
  gender: Gender;
  name: I18nText;
  courtesy?: I18nText;
  /** 谱式姓名，如 孝君余氏 */
  style?: I18nText;
  birth?: string;
  deathNote?: I18nText;
  age?: number;
  /** true = 谱记亡故；false = 在世或谱未记卒 */
  deceased: boolean;
  inLaw?: boolean;
  unplaced?: boolean;
  placeholder?: boolean;
  places: string[];
  fatherId?: string;
  motherId?: string;
  spouseIds?: string[];
  childIds?: string[];
  notes?: I18nText;
};

export type Place = {
  id: string;
  name: I18nText;
  /** 谱中用字；今建制另注 */
  todayNote?: I18nText;
  lat: number;
  lng: number;
  kind: "ancestral" | "residence" | "marriage" | "burial" | "country";
};

export type Genealogy = {
  meta: {
    lineage: I18nText;
    generationNames: string[];
    /** 启 = 十二世 */
    generationNameStart: number;
    defaultFocusId: string;
    brotherIds: string[];
    source: I18nText;
    caution: I18nText;
  };
  places: Place[];
  people: Person[];
};

export function pickText(text: I18nText, locale: Locale): string {
  switch (locale) {
    case "zh-Hans":
      return text["zh-Hans"];
    case "zh-Hant":
      return text["zh-Hant"];
    case "th":
      return text.th;
    case "en":
    case "ja":
    case "ko":
    case "nl":
      return text.en;
    default: {
      const _exhaustive: never = locale;
      return _exhaustive;
    }
  }
}

export function generationName(generation: number | null, names: string[], start: number): string | null {
  if (generation == null) return null;
  const i = generation - start;
  if (i < 0 || i >= names.length) return null;
  return names[i] ?? null;
}
