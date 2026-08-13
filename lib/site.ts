export type Product = {
  title: string;
  href: string;
  path: string;
  live: boolean;
  note?: string;
  group?: string;
};

export type Group = {
  id: string;
  label: string;
  items: Product[];
};

export type Tool = {
  id: string;
  title: string;
  href: string;
  path: string;
  note?: string;
  embeddable: boolean;
  embedSrc: string;
  group: string;
};

export const links = {
  jubitSignup: "https://www.jubit.ai/signup",
  jubitLogin: "https://www.jubit.ai/login",
  jubitHome: "https://jubit.ai",
  dseekHome: "https://dseek.ai",
  dseekSignup: "https://dseek.ai/signup",
  dseekLogin: "https://dseek.ai/login",
  dseekTerminal: "https://dseek.ai/terminal",
  dseekResearch: "https://dseek.ai/terminal?tab=research",
  dseekHk: "https://dseek.ai/hk",
  jubuddySignup: "https://jubuddy.com/signup",
  github: "https://github.com/M1zwell",
  linkedin: "https://linkedin.com/in/yok-zhang-8793a611",
  emailPrimary: "mailto:yok@dseek.ai",
  emailGmail: "mailto:yying2010@gmail.com",
} as const;

export const nav = [
  { href: "/", label: "Garden" },
  { href: "/blog", label: "Blog" },
  { href: "/tools", label: "Tools" },
  { href: "/products", label: "Products" },
] as const;

export const heroLine = "Hong Kong. Builds AI. Lives the rest.";

export const quotes = [
  "Hong Kong. Builds AI. Lives the rest.",
  "Scattered feeds, APIs, datasets and maps — held together and made seekable.",
  "Football and philosophy sit in the same life. They are not the work. The work is to ship.",
  "A game id kept as a name: m1zwell.",
  "No account. Open the tab. The city is already there.",
];

export const tools: Tool[] = [
  {
    id: "terminal",
    title: "dseek terminal",
    href: "https://dseek.ai/terminal",
    path: "dseek.ai/terminal",
    group: "dseek",
    embeddable: false,
    embedSrc: "https://dseek.ai/terminal",
  },
  {
    id: "hk",
    title: "Yok-Iso HK",
    href: "https://dseek.ai/hk",
    path: "dseek.ai/hk",
    group: "dseek",
    note: "Isometric/pixel Hong Kong map. Building data © HKSAR Lands Dept via DATA.GOV.HK. Rendered by Jubit.",
    embeddable: false,
    embedSrc: "https://dseek.ai/hk",
  },
  {
    id: "jubit",
    title: "jubit.ai",
    href: "https://jubit.ai",
    path: "jubit.ai",
    group: "jubit",
    embeddable: true,
    embedSrc: "https://www.jubit.ai/",
  },
  {
    id: "jubuddy",
    title: "jubuddy.com",
    href: "https://jubuddy.com",
    path: "jubuddy.com",
    group: "jubit",
    note: "theme factory; chatlab buddy in jubit universe.",
    embeddable: false,
    embedSrc: "https://jubuddy.com",
  },
  {
    id: "planet",
    title: "jubuddy.com/planet",
    href: "https://jubuddy.com/planet",
    path: "jubuddy.com/planet",
    group: "jubit",
    embeddable: false,
    embedSrc: "https://jubuddy.com/planet",
  },
  {
    id: "gghere",
    title: "gghere.com",
    href: "https://gghere.com",
    path: "gghere.com",
    group: "also",
    note: "24 real cities, rebuilt as tiny planets you can walk. 393 planets. 4.5M building footprints. No account. Runs in a browser tab.",
    embeddable: false,
    embedSrc: "https://gghere.com",
  },
  {
    id: "gozayden",
    title: "gozayden.com",
    href: "https://gozayden.com",
    path: "gozayden.com",
    group: "also",
    embeddable: true,
    embedSrc: "https://gozayden.com/",
  },
  {
    id: "hongfa4",
    title: "hongfa4.ichina.co",
    href: "https://hongfa4.ichina.co",
    path: "hongfa4.ichina.co",
    group: "also",
    embeddable: true,
    embedSrc: "https://hongfa4.ichina.co/",
  },
];

export const research = {
  title: "Research",
  href: "https://dseek.ai/terminal?tab=research",
  path: "dseek.ai/terminal?tab=research",
  embeddable: false,
  embedSrc: "https://dseek.ai/terminal?tab=research",
};

export const productGroups: Group[] = [
  {
    id: "jubit",
    label: "Jubit",
    items: [
      {
        title: "jubit.ai",
        href: "https://jubit.ai",
        path: "jubit.ai",
        live: true,
      },
      {
        title: "jubuddy.com",
        href: "https://jubuddy.com",
        path: "jubuddy.com",
        live: true,
        note: "theme factory; chatlab buddy in jubit universe.",
      },
      {
        title: "jubuddy.com/planet",
        href: "https://jubuddy.com/planet",
        path: "jubuddy.com/planet",
        live: true,
      },
      {
        title: "JubitMind",
        href: "https://github.com/M1zwell/jubitmind",
        path: "github.com/M1zwell/jubitmind",
        live: false,
        note: "AI Interaction Audit & Governance Platform. Human judgement meets AI mind. Every interaction, valued.",
      },
    ],
  },
  {
    id: "dseek",
    label: "dseek.ai",
    items: [
      {
        title: "dseek",
        href: "https://dseek.ai",
        path: "dseek.ai",
        live: true,
        note: "Data Intelligence Platform. Scattered feeds, APIs, datasets and maps, held together and made seekable.",
      },
      {
        title: "dseek terminal",
        href: "https://dseek.ai/terminal",
        path: "dseek.ai/terminal",
        live: true,
      },
      {
        title: "Yok-Iso HK",
        href: "https://dseek.ai/hk",
        path: "dseek.ai/hk",
        live: true,
        note: "Isometric/pixel Hong Kong map. Building data © HKSAR Lands Dept via DATA.GOV.HK. Rendered by Jubit.",
      },
    ],
  },
  {
    id: "other",
    label: "Also live",
    items: [
      {
        title: "gghere.com",
        href: "https://gghere.com",
        path: "gghere.com",
        live: true,
        note: "24 real cities as tiny walkable planets. 393 planets, 4.5M building footprints. No account. Runs in a browser tab.",
      },
      {
        title: "gozayden.com",
        href: "https://gozayden.com",
        path: "gozayden.com",
        live: true,
      },
      {
        title: "hongfa4.ichina.co",
        href: "https://hongfa4.ichina.co",
        path: "hongfa4.ichina.co",
        live: true,
      },
    ],
  },
];

export const products: Product[] = productGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.id })),
);

export const liveProducts = products.filter((p) => p.live);

export type District = {
  name: string;
  region: "Hong Kong Island" | "Kowloon" | "New Territories" | "Outlying";
  href: string;
};

function hkPlace(name: string): string {
  return `https://dseek.ai/hk?place=${encodeURIComponent(name)}`;
}

export const districts: District[] = [
  { name: "Central", region: "Hong Kong Island", href: hkPlace("Central") },
  { name: "The Peak", region: "Hong Kong Island", href: hkPlace("The Peak") },
  { name: "Wan Chai", region: "Hong Kong Island", href: hkPlace("Wan Chai") },
  { name: "Causeway Bay", region: "Hong Kong Island", href: hkPlace("Causeway Bay") },
  { name: "North Point", region: "Hong Kong Island", href: hkPlace("North Point") },
  { name: "HKU / Kennedy Town", region: "Hong Kong Island", href: hkPlace("HKU / Kennedy Town") },
  { name: "Aberdeen", region: "Hong Kong Island", href: hkPlace("Aberdeen") },
  { name: "Repulse Bay", region: "Hong Kong Island", href: hkPlace("Repulse Bay") },
  { name: "Stanley", region: "Hong Kong Island", href: hkPlace("Stanley") },
  { name: "Ocean Park", region: "Hong Kong Island", href: hkPlace("Ocean Park") },
  { name: "Tsim Sha Tsui", region: "Kowloon", href: hkPlace("Tsim Sha Tsui") },
  { name: "Mong Kok", region: "Kowloon", href: hkPlace("Mong Kok") },
  { name: "Sham Shui Po", region: "Kowloon", href: hkPlace("Sham Shui Po") },
  { name: "Wong Tai Sin", region: "Kowloon", href: hkPlace("Wong Tai Sin") },
  { name: "Kai Tak", region: "Kowloon", href: hkPlace("Kai Tak") },
  { name: "Kowloon Tong", region: "Kowloon", href: hkPlace("Kowloon Tong (CityU/HKBU)") },
  { name: "Sha Tin", region: "New Territories", href: hkPlace("Sha Tin") },
  { name: "Tsuen Wan", region: "New Territories", href: hkPlace("Tsuen Wan") },
  { name: "Tuen Mun", region: "New Territories", href: hkPlace("Tuen Mun") },
  { name: "Tai Po", region: "New Territories", href: hkPlace("Tai Po") },
  { name: "Yuen Long", region: "New Territories", href: hkPlace("Yuen Long") },
  { name: "Tin Shui Wai", region: "New Territories", href: hkPlace("Tin Shui Wai") },
  { name: "Tseung Kwan O", region: "New Territories", href: hkPlace("Tseung Kwan O") },
  { name: "Tung Chung", region: "New Territories", href: hkPlace("Tung Chung") },
  { name: "Sai Kung", region: "New Territories", href: hkPlace("Sai Kung") },
  { name: "Fanling / Sheung Shui", region: "New Territories", href: hkPlace("Fanling / Sheung Shui") },
  { name: "CUHK", region: "New Territories", href: hkPlace("CUHK") },
  { name: "HKUST", region: "New Territories", href: hkPlace("HKUST") },
  { name: "Cheung Chau", region: "Outlying", href: hkPlace("Cheung Chau") },
  { name: "HK Airport", region: "Outlying", href: hkPlace("HK Airport") },
  { name: "Disneyland", region: "Outlying", href: hkPlace("Disneyland") },
  { name: "Tian Tan Buddha", region: "Outlying", href: hkPlace("Tian Tan Buddha") },
];
