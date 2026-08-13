export type Product = {
  title: string;
  href: string;
  path: string;
  live: boolean;
  note?: string;
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
};

export const tools: Tool[] = [
  {
    id: "terminal",
    title: "dseek terminal",
    href: "https://dseek.ai/terminal",
    path: "dseek.ai/terminal",
    embeddable: false,
    embedSrc: "https://dseek.ai/terminal",
  },
  {
    id: "hk",
    title: "Yok-Iso HK",
    href: "https://dseek.ai/hk",
    path: "dseek.ai/hk",
    note: "Isometric/pixel Hong Kong map. Building data © HKSAR Lands Dept via DATA.GOV.HK. Rendered by Jubit.",
    embeddable: false,
    embedSrc: "https://dseek.ai/hk",
  },
  {
    id: "jubit",
    title: "jubit.ai",
    href: "https://jubit.ai",
    path: "jubit.ai",
    embeddable: true,
    embedSrc: "https://www.jubit.ai/",
  },
  {
    id: "jubuddy",
    title: "jubuddy.com",
    href: "https://jubuddy.com",
    path: "jubuddy.com",
    note: "theme factory; chatlab buddy in jubit universe.",
    embeddable: false,
    embedSrc: "https://jubuddy.com",
  },
  {
    id: "planet",
    title: "jubuddy.com/planet",
    href: "https://jubuddy.com/planet",
    path: "jubuddy.com/planet",
    embeddable: false,
    embedSrc: "https://jubuddy.com/planet",
  },
  {
    id: "gghere",
    title: "gghere.com",
    href: "https://gghere.com",
    path: "gghere.com",
    embeddable: false,
    embedSrc: "https://gghere.com",
  },
  {
    id: "gozayden",
    title: "gozayden.com",
    href: "https://gozayden.com",
    path: "gozayden.com",
    embeddable: true,
    embedSrc: "https://gozayden.com/",
  },
  {
    id: "hongfa4",
    title: "hongfa4.ichina.co",
    href: "https://hongfa4.ichina.co",
    path: "hongfa4.ichina.co",
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
