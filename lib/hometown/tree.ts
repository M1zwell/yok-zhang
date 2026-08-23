import genealogy from "@/lib/hometown/zhang-xiulong.json";
import type { Genealogy, Person, Place } from "@/lib/hometown/types";
import type { Locale } from "@/lib/i18n";
import { generationName, pickText } from "@/lib/hometown/types";

export const book = genealogy as Genealogy;

export const peopleById: Record<string, Person> = Object.fromEntries(
  book.people.map((p) => [p.id, p]),
);

export const placesById: Record<string, Place> = Object.fromEntries(
  book.places.map((p) => [p.id, p]),
);

export const MAP_PLACE_IDS = [
  "xiulong",
  "hongkong",
  "thailand",
  "shenzhen",
  "nigou",
  "douwen",
  "juntun",
  "sizhupu",
  "niupu",
] as const;

export function person(id: string | undefined | null): Person | undefined {
  if (!id) return undefined;
  return peopleById[id];
}

export function people(ids: string[] | undefined): Person[] {
  if (!ids) return [];
  return ids.map((id) => peopleById[id]).filter((p): p is Person => Boolean(p));
}

export function displayName(p: Person, locale: Locale): string {
  return pickText(p.style ?? p.name, locale);
}

export function givenLine(p: Person, locale: Locale): string {
  const name = pickText(p.name, locale);
  const courtesy = p.courtesy ? pickText(p.courtesy, locale) : null;
  if (!courtesy) return name;
  switch (locale) {
    case "zh-Hans":
    case "zh-Hant":
      return `${name}（${courtesy}）`;
    case "th":
      return `${name} (${courtesy})`;
    case "en":
    case "ja":
    case "ko":
    case "nl":
      return `${name} (${courtesy})`;
    default: {
      const _exhaustive: never = locale;
      return _exhaustive;
    }
  }
}

const GEN_ZH: Record<number, string> = {
  13: "十三",
  14: "十四",
  15: "十五",
  16: "十六",
  17: "十七",
  18: "十八",
  19: "十九",
  20: "二十",
};

export function generationLabel(generation: number | null, locale: Locale): string {
  if (generation == null) {
    switch (locale) {
      case "zh-Hans":
        return "世次未派";
      case "zh-Hant":
        return "世次未派";
      case "th":
        return "ไม่ระบุรุ่น";
      case "en":
      case "ja":
      case "ko":
      case "nl":
        return "Generation unplaced";
      default: {
        const _exhaustive: never = locale;
        return _exhaustive;
      }
    }
  }
  const zi = generationName(generation, book.meta.generationNames, book.meta.generationNameStart);
  const zh = GEN_ZH[generation] ?? String(generation);
  switch (locale) {
    case "zh-Hans":
      return zi ? `${zh}世 · ${zi}` : `${zh}世`;
    case "zh-Hant":
      return zi ? `${zh}世 · ${zi}` : `${zh}世`;
    case "th":
      return zi ? `รุ่น ${generation} · ${zi}` : `รุ่น ${generation}`;
    case "en":
    case "ja":
    case "ko":
    case "nl":
      return zi ? `Gen. ${generation} · ${zi}` : `Gen. ${generation}`;
    default: {
      const _exhaustive: never = locale;
      return _exhaustive;
    }
  }
}

export function parentsOf(p: Person): { father?: Person; mother?: Person } {
  return { father: person(p.fatherId), mother: person(p.motherId) };
}

export function spousesOf(p: Person): Person[] {
  return people(p.spouseIds);
}

export function childrenOf(p: Person): Person[] {
  return people(p.childIds);
}

export function siblingsOf(p: Person): Person[] {
  const parent = person(p.fatherId) ?? person(p.motherId);
  if (!parent) return [];
  return childrenOf(parent).filter((s) => s.id !== p.id && !s.unplaced);
}

/** Father-line ancestors, nearest first, up to `limit`. */
export function ancestorsOf(p: Person, limit = 4): Person[] {
  const out: Person[] = [];
  let cur: Person | undefined = p;
  while (cur && out.length < limit) {
    const next = person(cur.fatherId);
    if (!next) break;
    out.push(next);
    cur = next;
  }
  return out;
}

export function descendantsOf(p: Person, depth = 4): Person[][] {
  const rows: Person[][] = [];
  let frontier = childrenOf(p);
  for (let i = 0; i < depth && frontier.length > 0; i += 1) {
    rows.push(frontier);
    frontier = frontier.flatMap((c) => childrenOf(c));
  }
  return rows;
}

export function peopleAtPlace(placeId: string): Person[] {
  return book.people.filter((p) => p.places.includes(placeId) && !p.placeholder);
}

export function yearText(p: Person): string | null {
  const bits: string[] = [];
  if (p.birth) bits.push(p.birth);
  if (p.deceased && p.age) bits.push(`寿${p.age}`);
  else if (p.deceased) bits.push("—");
  return bits.length ? bits.join(" · ") : null;
}

export const CLAIMABLE_IDS = book.people
  .filter((p) => !p.placeholder && !p.unplaced)
  .map((p) => p.id);
