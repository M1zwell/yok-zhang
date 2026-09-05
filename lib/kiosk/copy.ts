import type { KioskErrorCode, KioskLang, Step } from "./types";

export type Copy = {
  brand: string;
  welcomeLead: string;
  checkin: string;
  checkout: string;
  walkin: string;
  identifyTitle: string;
  identifyHint: string;
  confirmLookup: string;
  keyboardDone: string;
  cameraTitle: string;
  cameraHint: string;
  scanHkid: string;
  scanPassport: string;
  paymentTitle: string;
  tapPos: string;
  skipPrepaid: string;
  processingTitle: string;
  processingHint: string;
  successTitle: string;
  takeCard: string;
  roomLabel: string;
  lockLabel: string;
  home: string;
  blockedTitle: string;
  checkoutTitle: string;
  checkoutHint: string;
  checkoutConfirm: string;
  folioClear: string;
  demo: string;
  demoHint: string;
  langZh: string;
  langEn: string;
  footer: string;
  operator: string;
  online: string;
  offline: string;
  vacantTypes: string;
  due: string;
  paid: string;
  nights: string;
};

const zh: Copy = {
  brand: "自助旅宿",
  welcomeLead: "請選擇服務　Select a service",
  checkin: "預訂入住",
  checkout: "快速退房",
  walkin: "現場散客",
  identifyTitle: "查找預訂",
  identifyHint: "輸入預訂編號或香港手機號碼",
  confirmLookup: "確認並查詢",
  keyboardDone: "完成",
  cameraTitle: "身份核實",
  cameraHint: "請將證件放入掃描區，並面向攝影機",
  scanHkid: "掃描香港身份證",
  scanPassport: "掃描護照",
  paymentTitle: "結賬與押金",
  tapPos: "請在 QFPay POS 終端機拍卡或拍八達通",
  skipPrepaid: "此訂單已付清，無需現場扣款",
  processingTitle: "正在寫卡",
  processingHint: "請勿離開取卡口",
  successTitle: "辦理完成",
  takeCard: "請於下方取卡口領取實體房卡",
  roomLabel: "房間號",
  lockLabel: "鎖號",
  home: "返回主頁",
  blockedTitle: "請前往櫃檯",
  checkoutTitle: "自助退房",
  checkoutHint: "輸入預訂編號或房號",
  checkoutConfirm: "確認退房並回收房卡",
  folioClear: "賬單已結清，可退房",
  demo: "演示控制",
  demoHint: "僅供本花園模擬，不是生產機",
  langZh: "繁體",
  langEn: "EN",
  footer: "邊緣硬體狀態",
  operator: "店員",
  online: "在線",
  offline: "斷網",
  vacantTypes: "可售房型",
  due: "應付",
  paid: "已付",
  nights: "晚",
};

const en: Copy = {
  brand: "Self check-in",
  welcomeLead: "Choose a service　請選擇服務",
  checkin: "Reservation check-in",
  checkout: "Check-out",
  walkin: "Walk-in",
  identifyTitle: "Find your booking",
  identifyHint: "Enter booking reference or Hong Kong mobile number",
  confirmLookup: "Search",
  keyboardDone: "Done",
  cameraTitle: "Verify identity",
  cameraHint: "Place your ID in the scan frame and face the camera",
  scanHkid: "Scan HKID",
  scanPassport: "Scan passport",
  paymentTitle: "Folio and deposit",
  tapPos: "Tap the QFPay POS with card or Octopus",
  skipPrepaid: "This stay is prepaid. No kiosk charge.",
  processingTitle: "Encoding your key",
  processingHint: "Stay at the card mouth",
  successTitle: "You are checked in",
  takeCard: "Take your key card from the slot below",
  roomLabel: "Room",
  lockLabel: "Lock",
  home: "Start over",
  blockedTitle: "Please see the desk",
  checkoutTitle: "Self check-out",
  checkoutHint: "Enter booking reference or room number",
  checkoutConfirm: "Check out and swallow the card",
  folioClear: "Folio is clear. You can check out.",
  demo: "Demo controls",
  demoHint: "Garden simulator — not a production IPC",
  langZh: "繁體",
  langEn: "EN",
  footer: "Edge hardware",
  operator: "Staff",
  online: "Online",
  offline: "Offline",
  vacantTypes: "Open types",
  due: "Due",
  paid: "Paid",
  nights: "nights",
};

export function copy(lang: KioskLang): Copy {
  return lang === "zh-Hant" ? zh : en;
}

export const errorText: Record<KioskErrorCode, { zh: string; en: string }> = {
  NOT_FOUND: { zh: "找不到這筆預訂", en: "No booking matches that search" },
  ALREADY_CHECKED_IN: { zh: "此預訂已辦理入住", en: "Already checked in" },
  HARDWARE_NOT_READY: { zh: "設備維護中，請尋求櫃檯協助", en: "Machine is in maintenance. Please see the desk." },
  CARD_EMPTY: { zh: "卡箱已空，請尋求櫃檯協助", en: "Card hopper is empty. Please see the desk." },
  CARD_JAM: { zh: "發卡口卡阻，已攔截交易", en: "Card jam. The stay was not completed." },
  ENCODE_FAIL: { zh: "寫卡失敗，卡片已回收", en: "Encode failed. The card was swallowed." },
  POS_OFFLINE: { zh: "支付終端離線", en: "Payment terminal is offline" },
  PMS_OFFLINE: { zh: "雲端房態離線", en: "PMS gateway is offline" },
  PAYMENT_FAILED: { zh: "扣款失敗，未吐卡", en: "Payment failed. No card was issued." },
  UNPAID_OFFLINE: {
    zh: "網絡不穩定，暫不支持現場支付。已付款住客可繼續，未付款請前往櫃檯。",
    en: "Network is down. Prepaid guests may continue; unpaid stays must use the desk.",
  },
  GATE_CLOSED: { zh: "未完成證件登記，不能發卡", en: "Identity gate is closed. No key can be encoded." },
  IDENTITY_FAIL: { zh: "證件無法辨識，請重試或前往櫃檯", en: "Document could not be read. Retry or see the desk." },
  FACE_MISMATCH: { zh: "人證比對未通過", en: "Face did not match the document" },
  BALANCE_OPEN: { zh: "尚有未結賬項，請先支付或前往櫃檯", en: "Open folio. Pay here or see the desk." },
  NO_VACANCY: { zh: "此房型已滿", en: "That room type is sold out" },
  BAD_REQUEST: { zh: "請先完成上一步", en: "Finish the previous step first" },
  CONFLICT: { zh: "房態衝突，請櫃檯調房", en: "Room conflict. Staff must reassign." },
};

export function errorMessage(code: KioskErrorCode, lang: KioskLang): string {
  const row = errorText[code];
  return lang === "zh-Hant" ? row.zh : row.en;
}

export const stepLabel: Record<Step, { zh: string; en: string }> = {
  welcome: { zh: "歡迎", en: "Welcome" },
  identify: { zh: "查找", en: "Find" },
  camera: { zh: "核身", en: "ID" },
  payment: { zh: "支付", en: "Pay" },
  processing: { zh: "寫卡", en: "Encode" },
  success: { zh: "完成", en: "Done" },
  checkoutIdentify: { zh: "退房", en: "Out" },
  checkoutConfirm: { zh: "確認", en: "Confirm" },
  blocked: { zh: "攔截", en: "Hold" },
  error: { zh: "故障", en: "Fault" },
};
