export type I18nText = {
  hans: string;
  hant: string;
  en?: string;
  th?: string;
};

export type PlaceKind = "book" | "admin";
export type PlaceCluster = "puning" | "away";
export type Gender = "male" | "female";

export type Place = {
  id: string;
  kind: PlaceKind;
  cluster: PlaceCluster;
  lat: number;
  lng: number;
  name: I18nText;
  region: I18nText;
};

export type PersonName = {
  hans: string;
  hant: string;
  pinyin: string;
};

export type Person = {
  id: string;
  generation: number;
  zibei?: string;
  gender: Gender;
  living: boolean;
  unnamedGroup?: boolean;
  unplaced?: boolean;
  name: PersonName;
  courtesy?: { hans: string; hant: string };
  birth?: string;
  deathNote?: { hans: string; hant: string };
  fatherId?: string;
  motherId?: string;
  spouseIds?: string[];
  placeIds?: string[];
  origin?: { hans: string; hant: string };
  marriedOut?: { hans: string; hant: string };
  notes?: I18nText;
  memory?: {
    photo?: string;
    story?: I18nText;
  };
};

export type GenealogyBook = {
  meta: {
    fang: I18nText;
    zibei: string[];
    zibeiHant: string[];
    source: I18nText;
    centerId: string;
    brotherIds: string[];
  };
  places: Place[];
  people: Person[];
};

export type Hourglass = {
  focus: Person;
  spouses: Person[];
  siblings: Person[];
  parents: Person[];
  ancestors: Person[][];
  children: Person[];
};
