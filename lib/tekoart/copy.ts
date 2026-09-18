import type { Locale } from "@/lib/i18n";
import type { TekoFaceId } from "./types";

export type TekoCopy = {
  brand: string;
  brandShort: string;
  kicker: string;
  tagline: string;
  taglineZh: string;
  lead: string;
  announcement: string;
  nav: {
    shop: string;
    window: string;
    holders: string;
    faces: string;
    guide: string;
    all: string;
    cart: string;
    search: string;
    liveShopify: string;
    garden: string;
  };
  searchPlaceholder: string;
  searchEmpty: string;
  searchResults: string;
  heroCta: string;
  heroSecondary: string;
  hubsKicker: string;
  hubsTitle: string;
  facesKicker: string;
  facesTitle: string;
  facesLead: string;
  gridKicker: string;
  gridTitle: string;
  howKicker: string;
  howTitle: string;
  howSteps: [string, string, string];
  shipKicker: string;
  shipTitle: string;
  shipLead: string;
  shipPoints: [string, string, string, string];
  addToCart: string;
  added: string;
  soldOut: string;
  chooseModel: string;
  quantity: string;
  inCart: string;
  checkout: string;
  checkoutShopify: string;
  viewCart: string;
  emptyCart: string;
  emptyCartLead: string;
  continueShopping: string;
  stickyCart: string;
  subtotal: string;
  shippingNote: string;
  model: string;
  from: string;
  stock: string;
  inStock: string;
  outOfStock: string;
  madeInHk: string;
  windowSize: string;
  notIp: string;
  share: string;
  related: string;
  description: string;
  liveOnShopify: string;
  footerHours: string;
  footerHoursValue: string;
  footerLocation: string;
  footerContact: string;
  footerNote: string;
  language: string;
  noResults: string;
  collectionLead: Record<string, string>;
  faces: Record<
    TekoFaceId,
    {
      name: string;
      book: string;
      blurb: string;
    }
  >;
  guideLead: string;
  poetry: string;
  book: string;
  create: string;
};

const en: TekoCopy = {
  brand: "TekO Art",
  brandShort: "TekO",
  kicker: "Hong Kong · 63×88 window",
  tagline: "A case you dress. A card you change.",
  taglineZh: "壳只是画框。我们不卖别人的牌。",
  lead: "A pictorial-book window on the phone. Slide a 63×88. Tomorrow, swap the face. Made to order in Mong Kok.",
  announcement: "Made in Hong Kong · Ships in 7–14 days · Standard 63×88 window",
  nav: {
    shop: "Shop",
    window: "Window cases",
    holders: "Card holders",
    faces: "Faces",
    guide: "Guide",
    all: "All",
    cart: "Cart",
    search: "Search",
    liveShopify: "tekoart.com",
    garden: "Garden",
  },
  searchPlaceholder: "Search Juju, Qilin, Yutu, window, holder…",
  searchEmpty: "Type a face, a model, or a product.",
  searchResults: "Results",
  heroCta: "Shop the window",
  heroSecondary: "Pick a face",
  hubsKicker: "Collections",
  hubsTitle: "Shop by line",
  facesKicker: "Pictorial book",
  facesTitle: "Three faces print today",
  facesLead: "The case is a frame. Only Juju, Qilin, and Yutu print. Poetry is a walk in the book — not a SKU.",
  gridKicker: "In stock",
  gridTitle: "The desk",
  howKicker: "How it works",
  howTitle: "Slide. Dress. Swap.",
  howSteps: ["Slide a 63×88 into the window.", "Put the case on the phone.", "Tomorrow, swap the face."],
  shipKicker: "From jubuddy",
  shipTitle: "Made in Hong Kong. Ships in 7–14 days.",
  shipLead: "The case is a frame. Walk the book. Print only the three ready faces. /jub is extra.",
  shipPoints: ["Made to order in Mong Kok", "7–14 day make", "63×88 TCG window", "Original TekO art"],
  addToCart: "Add to cart",
  added: "Added",
  soldOut: "Sold out",
  chooseModel: "Choose a phone",
  quantity: "Quantity",
  inCart: "in cart",
  checkout: "Checkout",
  checkoutShopify: "Checkout on Shopify",
  viewCart: "View cart",
  emptyCart: "Cart is empty",
  emptyCartLead: "The window is still a frame. Pick a face.",
  continueShopping: "Continue shopping",
  stickyCart: "Cart",
  subtotal: "Subtotal",
  shippingNote: "Shipping calculated at Shopify checkout.",
  model: "Phone",
  from: "from",
  stock: "Stock",
  inStock: "In stock",
  outOfStock: "Sold out",
  madeInHk: "Made in Hong Kong",
  windowSize: "Fits a standard 63×88 card",
  notIp: "Not Pokémon IP. Original TekO art.",
  share: "Share",
  related: "Also on the desk",
  description: "About",
  liveOnShopify: "Open live Shopify",
  footerHours: "Working hours",
  footerHoursValue: "Made to order · reply in Hong Kong hours",
  footerLocation: "Location",
  footerContact: "Contact",
  footerNote: "Checkout completes on tekoart.com (Shopify Dawn). This garden desk keeps TekO tokens.",
  language: "Language",
  noResults: "No matches on this desk.",
  collectionLead: {
    all: "The full TekO desk — window cases and the Juju holder.",
    "pictorial-book-window": "A case you dress. A card you change. Three faces.",
    holders: "A stand for a 63×88. First print is Juju.",
    juju: "Juju is the shop pig, not book #001.",
    qilin: "Qilin from the pictorial book. Window case.",
    yutu: "Yutu — rabbit-yutu in the book. Window case.",
  },
  faces: {
    juju: {
      name: "Juju",
      book: "No. 001 · TekO mark",
      blurb: "Juju is the shop pig, not book #001. Window case and holder.",
    },
    qilin: {
      name: "Qilin",
      book: "Book #003",
      blurb: "Creature from the pictorial book. Wood / mythic.",
    },
    yutu: {
      name: "Yutu",
      book: "Book #021 · rabbit-yutu",
      blurb: "Rabbit-yutu in the book. Shop slug is yutu.",
    },
  },
  guideLead: "Put the case on. Change the card.",
  poetry: "意境",
  book: "Pictorial book",
  create: "Jub create",
};

const zhHant: TekoCopy = {
  ...en,
  brand: "TekO Art",
  kicker: "香港 · 63×88 窗口",
  tagline: "殼只是畫框。一張牌，明天可換。",
  taglineZh: "殼只是畫框。我們不賣別人的牌。",
  lead: "把圖鑑窗口戴在手機上。塞進一張 63×88。明天換臉。旺角接單製作。",
  announcement: "香港製造 · 7–14 天出貨 · 標準 63×88 窗口",
  nav: {
    shop: "商店",
    window: "窗口殼",
    holders: "卡座",
    faces: "面孔",
    guide: "用法",
    all: "全部",
    cart: "購物車",
    search: "搜尋",
    liveShopify: "tekoart.com",
    garden: "園地",
  },
  searchPlaceholder: "搜 Juju、麒麟、玉兔、窗口、卡座…",
  searchEmpty: "輸入面孔、型號或商品。",
  searchResults: "結果",
  heroCta: "逛窗口殼",
  heroSecondary: "選一張臉",
  hubsKicker: "分類",
  hubsTitle: "按系列逛",
  facesKicker: "圖鑑",
  facesTitle: "今天只印三張臉",
  facesLead: "殼是畫框。只印 Juju、麒麟、玉兔。意境是走路，不是 SKU。",
  gridKicker: "現貨桌",
  gridTitle: "商品",
  howKicker: "用法",
  howTitle: "塞。戴。換。",
  howSteps: ["把 63×88 滑進窗口。", "把殼戴上手機。", "明天，換臉。"],
  shipKicker: "來自 jubuddy",
  shipTitle: "香港製造。7–14 天出貨。",
  shipLead: "殼只是畫框。走進圖鑑。只印三張現成的臉。/jub 另計。",
  shipPoints: ["旺角接單製作", "7–14 天", "63×88 TCG 窗口", "TekO 原作"],
  addToCart: "加入購物車",
  added: "已加入",
  soldOut: "售罄",
  chooseModel: "選擇機型",
  quantity: "數量",
  inCart: "件在車內",
  checkout: "結帳",
  checkoutShopify: "到 Shopify 結帳",
  viewCart: "查看購物車",
  emptyCart: "購物車是空的",
  emptyCartLead: "窗口還是畫框。選一張臉。",
  continueShopping: "繼續逛",
  stickyCart: "購物車",
  subtotal: "小計",
  shippingNote: "運費在 Shopify 結帳計算。",
  model: "機型",
  from: "起",
  stock: "庫存",
  inStock: "有貨",
  outOfStock: "售罄",
  madeInHk: "香港製造",
  windowSize: "標準 63×88 卡",
  notIp: "與寶可夢無關。TekO 原作。",
  share: "分享",
  related: "同桌還有",
  description: "說明",
  liveOnShopify: "打開 Shopify 原店",
  footerHours: "營業",
  footerHoursValue: "接單製作 · 香港時段回覆",
  footerLocation: "地址",
  footerContact: "聯絡",
  footerNote: "結帳在 tekoart.com（Shopify Dawn）完成。這張園地桌子只重做結構，不改 tokens。",
  language: "語言",
  noResults: "這張桌上沒有對上的貨。",
  collectionLead: {
    all: "TekO 全桌 —— 窗口殼與 Juju 卡座。",
    "pictorial-book-window": "殼只是畫框。三張臉。",
    holders: "63×88 卡座。第一張是 Juju。",
    juju: "Juju 是店豬，不是圖鑑 #001。",
    qilin: "圖鑑裡的麒麟。窗口殼。",
    yutu: "玉兔 —— 書裡是 rabbit-yutu。窗口殼。",
  },
  faces: {
    juju: {
      name: "Juju",
      book: "No. 001 · TekO 印",
      blurb: "Juju 是店豬，不是圖鑑 #001。窗口殼與卡座。",
    },
    qilin: {
      name: "麒麟",
      book: "圖鑑 #003",
      blurb: "圖鑑生物。木 / mythic。",
    },
    yutu: {
      name: "玉兔",
      book: "圖鑑 #021 · rabbit-yutu",
      blurb: "書裡是玉兔。店裡 slug 是 yutu。",
    },
  },
  guideLead: "戴上殼。換卡。",
  poetry: "意境",
  book: "圖鑑",
  create: "Jub 自造",
};

const zhHans: TekoCopy = {
  ...zhHant,
  kicker: "香港 · 63×88 窗口",
  tagline: "壳只是画框。一张牌，明天可换。",
  taglineZh: "壳只是画框。我们不卖别人的牌。",
  lead: "把图鉴窗口戴在手机上。塞进一张 63×88。明天换脸。旺角接单制作。",
  announcement: "香港制造 · 7–14 天出货 · 标准 63×88 窗口",
  nav: {
    ...zhHant.nav,
    shop: "商店",
    window: "窗口壳",
    holders: "卡座",
    faces: "面孔",
    guide: "用法",
    all: "全部",
    cart: "购物车",
    search: "搜索",
    garden: "园地",
  },
  searchPlaceholder: "搜 Juju、麒麟、玉兔、窗口、卡座…",
  searchEmpty: "输入面孔、型号或商品。",
  searchResults: "结果",
  heroCta: "逛窗口壳",
  heroSecondary: "选一张脸",
  hubsKicker: "分类",
  hubsTitle: "按系列逛",
  facesKicker: "图鉴",
  facesTitle: "今天只印三张脸",
  facesLead: "壳是画框。只印 Juju、麒麟、玉兔。意境是走路，不是 SKU。",
  gridKicker: "现货桌",
  gridTitle: "商品",
  howKicker: "用法",
  howTitle: "塞。戴。换。",
  howSteps: ["把 63×88 滑进窗口。", "把壳戴上手机。", "明天，换脸。"],
  shipKicker: "来自 jubuddy",
  shipTitle: "香港制造。7–14 天出货。",
  shipLead: "壳只是画框。走进图鉴。只印三张现成的脸。/jub 另计。",
  shipPoints: ["旺角接单制作", "7–14 天", "63×88 TCG 窗口", "TekO 原作"],
  addToCart: "加入购物车",
  added: "已加入",
  soldOut: "售罄",
  chooseModel: "选择机型",
  quantity: "数量",
  inCart: "件在车内",
  checkout: "结帐",
  checkoutShopify: "到 Shopify 结帐",
  viewCart: "查看购物车",
  emptyCart: "购物车是空的",
  emptyCartLead: "窗口还是画框。选一张脸。",
  continueShopping: "继续逛",
  stickyCart: "购物车",
  subtotal: "小计",
  shippingNote: "运费在 Shopify 结帐计算。",
  model: "机型",
  from: "起",
  inStock: "有货",
  outOfStock: "售罄",
  madeInHk: "香港制造",
  windowSize: "标准 63×88 卡",
  notIp: "与宝可梦无关。TekO 原作。",
  share: "分享",
  related: "同桌还有",
  description: "说明",
  liveOnShopify: "打开 Shopify 原店",
  footerHours: "营业",
  footerHoursValue: "接单制作 · 香港时段回复",
  footerLocation: "地址",
  footerContact: "联络",
  footerNote: "结帐在 tekoart.com（Shopify Dawn）完成。这张园地桌子只重做结构，不改 tokens。",
  language: "语言",
  noResults: "这张桌上没有对上的货。",
  collectionLead: {
    all: "TekO 全桌 —— 窗口壳与 Juju 卡座。",
    "pictorial-book-window": "壳只是画框。三张脸。",
    holders: "63×88 卡座。第一张是 Juju。",
    juju: "Juju 是店猪，不是图鉴 #001。",
    qilin: "图鉴里的麒麟。窗口壳。",
    yutu: "玉兔 —— 书里是 rabbit-yutu。窗口壳。",
  },
  faces: {
    juju: {
      name: "Juju",
      book: "No. 001 · TekO 印",
      blurb: "Juju 是店猪，不是图鉴 #001。窗口壳与卡座。",
    },
    qilin: {
      name: "麒麟",
      book: "图鉴 #003",
      blurb: "图鉴生物。木 / mythic。",
    },
    yutu: {
      name: "玉兔",
      book: "图鉴 #021 · rabbit-yutu",
      blurb: "书里是玉兔。店里 slug 是 yutu。",
    },
  },
  guideLead: "戴上壳。换卡。",
  poetry: "意境",
  book: "图鉴",
  create: "Jub 自造",
};

const ja: TekoCopy = {
  ...en,
  kicker: "香港 · 63×88 窓",
  tagline: "ケースは額。カードは替えられる。",
  lead: "図鑑の窓をスマホに。63×88 を滑らせる。明日、顔を替える。旺角で受注生産。",
  announcement: "香港製 · 7–14 日で発送 · 標準 63×88 窓",
  nav: {
    ...en.nav,
    shop: "ショップ",
    window: "窓ケース",
    holders: "ホルダー",
    faces: "顔",
    guide: "使い方",
    all: "すべて",
    cart: "カート",
    search: "検索",
    garden: "庭",
  },
  heroCta: "窓を見る",
  heroSecondary: "顔を選ぶ",
  addToCart: "カートに入れる",
  checkoutShopify: "Shopify で会計",
  soldOut: "売り切れ",
  inStock: "在庫あり",
  howTitle: "滑らせる。着ける。替える。",
  howSteps: ["63×88 を窓へ。", "ケースを着ける。", "明日、顔を替える。"],
  shipTitle: "香港製。7–14 日で発送。",
};

const ko: TekoCopy = {
  ...en,
  kicker: "홍콩 · 63×88 창",
  tagline: "케이스는 액자. 카드는 내일 바꿉니다.",
  lead: "도감 창을 폰에. 63×88을 밀어 넣습니다. 내일 얼굴을 바꿉니다. 몽콕 주문 제작.",
  announcement: "홍콩 제작 · 7–14일 출고 · 표준 63×88 창",
  nav: {
    ...en.nav,
    shop: "상점",
    window: "윈도우 케이스",
    holders: "홀더",
    faces: "얼굴",
    guide: "안내",
    cart: "카트",
    search: "검색",
    garden: "정원",
  },
  heroCta: "윈도우 보기",
  addToCart: "카트에 담기",
  checkoutShopify: "Shopify에서 결제",
  soldOut: "품절",
};

const th: TekoCopy = {
  ...en,
  kicker: "ฮ่องกง · หน้าต่าง 63×88",
  tagline: "เคสคือกรอบ เปลี่ยนการ์ดได้",
  announcement: "ทำในฮ่องกง · ส่งใน 7–14 วัน · หน้าต่าง 63×88",
  nav: { ...en.nav, shop: "ร้าน", cart: "ตะกร้า", search: "ค้นหา", garden: "สวน" },
  addToCart: "ใส่ตะกร้า",
  checkoutShopify: "ชำระบน Shopify",
};

const nl: TekoCopy = {
  ...en,
  kicker: "Hongkong · 63×88-venster",
  tagline: "Een hoes die je aankleedt. Een kaart die je wisselt.",
  announcement: "Gemaakt in Hongkong · 7–14 dagen · standaard 63×88-venster",
  nav: { ...en.nav, shop: "Winkel", cart: "Winkelwagen", search: "Zoeken", garden: "Tuin" },
  addToCart: "In winkelwagen",
  checkoutShopify: "Afrekenen op Shopify",
};

const table: Record<Locale, TekoCopy> = {
  en,
  "zh-Hant": zhHant,
  "zh-Hans": zhHans,
  ja,
  ko,
  th,
  nl,
};

export function tekoCopy(locale: Locale): TekoCopy {
  return table[locale] ?? en;
}

export const tekoTokenNote =
  "Dawn tokens locked: bg #D8CBB3, ink #292321, button #D9899D, gold #AD915F.";
