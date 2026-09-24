import type { Locale } from "@/lib/i18n";

/** The only Google identity that may open ichina.co/planning and the two advisory planets. */
export const PLANNING_OWNER_EMAIL = "yying2010@gmail.com";

export function normalizeEmail(value: string | null | undefined): string {
  return (value || "").trim().toLowerCase();
}

export function isPlanningOwner(email: string | null | undefined): boolean {
  return normalizeEmail(email) === PLANNING_OWNER_EMAIL;
}

export type PlanningGateCopy = {
  kicker: string;
  title: string;
  lead: string;
  signIn: string;
  denied: string;
  deniedHint: string;
  working: string;
  metaDescription: string;
};

const en: PlanningGateCopy = {
  kicker: "Private desk",
  title: "These planets are not public",
  lead: "Continue with Google. Only yying2010@gmail.com can open ichina.co/planning, the Zhengzhou planet, and the Luoyang planet.",
  signIn: "Continue with Google",
  denied: "This desk is not open for this account.",
  deniedHint: "Sign out, then sign in with Google as yying2010@gmail.com.",
  working: "Checking the door…",
  metaDescription: "Private desk. Continue with Google.",
};

const zhHans: PlanningGateCopy = {
  kicker: "私人台面",
  title: "这两颗咨询行星不公开",
  lead: "用 Google 登录。只有 yying2010@gmail.com 能打开 ichina.co/planning、郑州行星和洛阳行星。",
  signIn: "用 Google 继续",
  denied: "这个账号打不开这张台面。",
  deniedHint: "先退出，再用 Google 账号 yying2010@gmail.com 登录。",
  working: "正在核对门口…",
  metaDescription: "私人台面。用 Google 登录。",
};

const zhHant: PlanningGateCopy = {
  kicker: "私人檯面",
  title: "這兩顆諮詢行星不公開",
  lead: "用 Google 登入。只有 yying2010@gmail.com 能打開 ichina.co/planning、鄭州行星和洛陽行星。",
  signIn: "用 Google 繼續",
  denied: "這個帳號打不開這張檯面。",
  deniedHint: "先退出，再用 Google 帳號 yying2010@gmail.com 登入。",
  working: "正在核對門口…",
  metaDescription: "私人檯面。用 Google 登入。",
};

export function planningGateCopy(locale: Locale): PlanningGateCopy {
  switch (locale) {
    case "zh-Hans":
      return zhHans;
    case "zh-Hant":
      return zhHant;
    case "en":
    case "ja":
    case "ko":
    case "th":
    case "nl":
      return en;
    default: {
      const neverLocale: never = locale;
      return neverLocale;
    }
  }
}
