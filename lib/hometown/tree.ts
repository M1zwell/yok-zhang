import type { Locale } from "@/lib/i18n";
import bookJson from "./zhang-xiulong.json";
import type { GenealogyBook, Gender, Hourglass, I18nText, Person, Place } from "./types";

export const book = bookJson as GenealogyBook;

export const people: Person[] = book.people;
export const places: Place[] = book.places;
export const zibeiHans = book.meta.zibei;
export const zibeiHant = book.meta.zibeiHant;
export const centerId = book.meta.centerId;
export const brotherIds = book.meta.brotherIds;

export const personById = new Map(people.map((p) => [p.id, p]));
export const placeById = new Map(places.map((p) => [p.id, p]));

export function getPerson(id: string): Person | undefined {
  return personById.get(id);
}

export function getPlace(id: string): Place | undefined {
  return placeById.get(id);
}

export function childrenOf(id: string): Person[] {
  return people.filter((p) => !p.unplaced && (p.fatherId === id || p.motherId === id));
}

export function spousesOf(person: Person): Person[] {
  return (person.spouseIds ?? [])
    .map((id) => personById.get(id))
    .filter((p): p is Person => Boolean(p));
}

export function parentsOf(person: Person): Person[] {
  const out: Person[] = [];
  if (person.fatherId) {
    const father = personById.get(person.fatherId);
    if (father) out.push(father);
  }
  if (person.motherId) {
    const mother = personById.get(person.motherId);
    if (mother) out.push(mother);
  }
  return out;
}

export function siblingsOf(person: Person): Person[] {
  if (!person.fatherId && !person.motherId) return [];
  return people.filter((p) => {
    if (p.id === person.id || p.unplaced) return false;
    if (person.fatherId && p.fatherId === person.fatherId) return true;
    if (person.motherId && p.motherId === person.motherId) return true;
    return false;
  });
}

export function ancestorRows(person: Person, maxGens = 4): Person[][] {
  const rows: Person[][] = [];
  let current = parentsOf(person);
  let depth = 0;
  while (current.length && depth < maxGens) {
    const next: Person[] = [];
    const seen = new Set<string>();
    for (const p of current) {
      for (const parent of parentsOf(p)) {
        if (seen.has(parent.id)) continue;
        seen.add(parent.id);
        next.push(parent);
      }
    }
    current = next;
    if (current.length) rows.unshift(current);
    depth += 1;
  }
  return rows;
}

function assertBook() {
  const ids = new Set(people.map((p) => p.id));
  const placeIds = new Set(places.map((p) => p.id));
  for (const person of people) {
    if (person.fatherId && !ids.has(person.fatherId)) {
      throw new Error(`hometown: missing father ${person.fatherId} for ${person.id}`);
    }
    if (person.motherId && !ids.has(person.motherId)) {
      throw new Error(`hometown: missing mother ${person.motherId} for ${person.id}`);
    }
    for (const sid of person.spouseIds ?? []) {
      if (!ids.has(sid)) throw new Error(`hometown: missing spouse ${sid} for ${person.id}`);
    }
    for (const pid of person.placeIds ?? []) {
      if (!placeIds.has(pid)) throw new Error(`hometown: missing place ${pid} for ${person.id}`);
    }
  }
}

assertBook();

export function hourglass(focusId: string): Hourglass | null {
  const focus = personById.get(focusId);
  if (!focus) return null;
  return {
    focus,
    spouses: spousesOf(focus),
    siblings: siblingsOf(focus),
    parents: parentsOf(focus),
    ancestors: ancestorRows(focus, 4),
    children: childrenOf(focus.id),
  };
}

export function peopleAtPlace(placeId: string): Person[] {
  return people.filter((p) => p.placeIds?.includes(placeId));
}

export function claimablePeople(): Person[] {
  return people.filter((p) => !p.unnamedGroup && !p.unplaced);
}

export const unplacedPeople = people.filter((p) => p.unplaced);

export function textFor(locale: Locale, copy: I18nText): string {
  switch (locale) {
    case "zh-Hans":
      return copy.hans;
    case "zh-Hant":
      return copy.hant;
    case "th":
      return copy.th ?? copy.hans;
    case "en":
    case "ja":
    case "ko":
    case "nl":
      return copy.en ?? copy.hans;
    default: {
      const _n: never = locale;
      return _n;
    }
  }
}

export function personName(locale: Locale, person: Person): string {
  switch (locale) {
    case "zh-Hant":
      return person.name.hant;
    case "zh-Hans":
    case "en":
    case "ja":
    case "ko":
    case "th":
    case "nl":
      return person.name.hans;
    default: {
      const _n: never = locale;
      return _n;
    }
  }
}

export function courtesyName(locale: Locale, person: Person): string | undefined {
  if (!person.courtesy) return undefined;
  switch (locale) {
    case "zh-Hant":
      return person.courtesy.hant;
    case "zh-Hans":
    case "en":
    case "ja":
    case "ko":
    case "th":
    case "nl":
      return person.courtesy.hans;
    default: {
      const _n: never = locale;
      return _n;
    }
  }
}

export function pairText(locale: Locale, pair?: { hans: string; hant: string }): string | undefined {
  if (!pair) return undefined;
  switch (locale) {
    case "zh-Hant":
      return pair.hant;
    case "zh-Hans":
    case "en":
    case "ja":
    case "ko":
    case "th":
    case "nl":
      return pair.hans;
    default: {
      const _n: never = locale;
      return _n;
    }
  }
}

export function zibeiLine(locale: Locale): string[] {
  switch (locale) {
    case "zh-Hant":
      return zibeiHant;
    case "zh-Hans":
    case "en":
    case "ja":
    case "ko":
    case "th":
    case "nl":
      return zibeiHans;
    default: {
      const _n: never = locale;
      return _n;
    }
  }
}

export function zibeiIndex(char: string | undefined): number {
  if (!char) return -1;
  const hans = zibeiHans.indexOf(char);
  if (hans >= 0) return hans;
  return zibeiHant.indexOf(char);
}

export function genderKey(gender: Gender): "male" | "female" {
  switch (gender) {
    case "male":
      return "male";
    case "female":
      return "female";
    default: {
      const _n: never = gender;
      return _n;
    }
  }
}
