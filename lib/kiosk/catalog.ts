import type { HttpMethod } from "./types";

export type EndpointModule =
  | "hal"
  | "security"
  | "workflow"
  | "identity"
  | "payment"
  | "pms"
  | "config";

export type Upstream =
  | { vendor: "creator"; note: string }
  | { vendor: "prousb"; note: string }
  | { vendor: "qfpay"; note: string }
  | { vendor: "cloudbeds"; method: string; note: string }
  | { vendor: "local"; note: string }
  | { vendor: "uvc"; note: string };

export type EndpointSpec = {
  method: HttpMethod;
  path: string;
  module: EndpointModule;
  summary: string;
  summaryZh: string;
  source: "notebook-attributed" | "cloudbeds-kiosk-cert" | "design-extension";
  upstream: Upstream;
};

export const endpoints: EndpointSpec[] = [
  {
    method: "POST",
    path: "/api/v1/hal/card-dispenser/issue",
    module: "hal",
    summary: "Move encoded card from RF station to the take-out mouth",
    summaryZh: "將已編碼房卡從讀寫位送到取卡口",
    source: "notebook-attributed",
    upstream: { vendor: "creator", note: "Creator K750-B serial/USB HID motor + IR sensors" },
  },
  {
    method: "POST",
    path: "/api/v1/hal/card-dispenser/recycle",
    module: "hal",
    summary: "Reverse belt into the scrap bin after jam or encode failure",
    summaryZh: "寫卡失敗或卡阻時將卡片回收至廢卡槽",
    source: "notebook-attributed",
    upstream: { vendor: "creator", note: "K750-B swallow / recycle cassette" },
  },
  {
    method: "POST",
    path: "/api/v1/hal/door-lock/encode",
    module: "hal",
    summary: "Write room, validity window, and sector key via proRFL.dll",
    summaryZh: "經 proRFL.dll 寫入房號、有效期與扇區密鑰",
    source: "notebook-attributed",
    upstream: { vendor: "prousb", note: "Windows DLL at RF station after card is seated" },
  },
  {
    method: "POST",
    path: "/api/v1/hal/door-lock/erase",
    module: "hal",
    summary: "Erase card before recycle so a blank never leaves the mouth",
    summaryZh: "回收前擦除卡片，避免空白卡流出",
    source: "design-extension",
    upstream: { vendor: "prousb", note: "card_erase before recycle" },
  },
  {
    method: "POST",
    path: "/api/v1/hal/pos/terminal-pay",
    module: "hal",
    summary: "Push amount to QFPay POS and wait for capture",
    summaryZh: "把金額下發到 QFPay POS 並等待扣款",
    source: "notebook-attributed",
    upstream: { vendor: "qfpay", note: "POS / ECR for card + Octopus; confirm via enquiry" },
  },
  {
    method: "POST",
    path: "/api/v1/hal/camera/capture",
    module: "hal",
    summary: "Capture live face and document stills from UVC binocular camera",
    summaryZh: "雙目 UVC 鏡頭抓拍人像與證件",
    source: "notebook-attributed",
    upstream: { vendor: "uvc", note: "Local capture only; no cloud vision vendor pinned in source" },
  },
  {
    method: "GET",
    path: "/api/v1/hal/system/health",
    module: "hal",
    summary: "IPC + peripheral heartbeat",
    summaryZh: "工控主機與外設心跳",
    source: "notebook-attributed",
    upstream: { vendor: "local", note: "COM/USB/LAN probes" },
  },
  {
    method: "POST",
    path: "/api/v1/security/pre-payment-check",
    module: "security",
    summary: "Fail closed if dispenser or lock encoder is not ready before charge",
    summaryZh: "扣款前雙向互鎖：發卡機與門鎖編碼器必須就緒",
    source: "notebook-attributed",
    upstream: { vendor: "local", note: "Must pass before QFPay" },
  },
  {
    method: "GET",
    path: "/api/v1/security/card-stock",
    module: "security",
    summary: "Hopper count, jam flag, scrap-bin count",
    summaryZh: "卡箱存量、卡阻、廢卡槽",
    source: "notebook-attributed",
    upstream: { vendor: "creator", note: "IR empty / overlap sensors" },
  },
  {
    method: "POST",
    path: "/api/v1/workflow/walk-in",
    module: "workflow",
    summary: "Start a walk-in stay: assign vacant room, unpaid until POS",
    summaryZh: "散客入住：分配空房，支付前為未付",
    source: "notebook-attributed",
    upstream: { vendor: "cloudbeds", method: "postReservation + postRoomAssign", note: "Requires live PMS" },
  },
  {
    method: "POST",
    path: "/api/v1/workflow/reservation-checkin",
    module: "workflow",
    summary: "Start booked check-in state machine",
    summaryZh: "有預訂入住狀態機",
    source: "notebook-attributed",
    upstream: {
      vendor: "cloudbeds",
      method: "getReservations + putGuest",
      note: "Kiosk cert: only confirmed reservations",
    },
  },
  {
    method: "POST",
    path: "/api/v1/workflow/gate-control",
    module: "workflow",
    summary: "Fail-closed: no encode until identity stub is archived",
    summaryZh: "證件存根未歸檔則不寫卡",
    source: "notebook-attributed",
    upstream: { vendor: "local", note: "HK lodging registration gate" },
  },
  {
    method: "POST",
    path: "/api/v1/workflow/checkout",
    module: "workflow",
    summary: "Self checkout, recycle card, flip room to dirty",
    summaryZh: "自助退房、收卡、房態待清掃",
    source: "notebook-attributed",
    upstream: {
      vendor: "cloudbeds",
      method: "getReservationInvoiceInformation + putReservation checked_out",
      note: "Checkout blocked while folio open",
    },
  },
  {
    method: "POST",
    path: "/api/v1/identity/ocr",
    module: "identity",
    summary: "Parse name and document number from the scan frame",
    summaryZh: "證件 OCR 解析姓名與號碼",
    source: "notebook-attributed",
    upstream: { vendor: "local", note: "HKID / passport; vendor OCR not named in source" },
  },
  {
    method: "POST",
    path: "/api/v1/identity/face-match",
    module: "identity",
    summary: "Live face vs document photo with liveness",
    summaryZh: "現場人像與證件照比對（活體）",
    source: "notebook-attributed",
    upstream: { vendor: "uvc", note: "Binocular liveness on device" },
  },
  {
    method: "POST",
    path: "/api/v1/identity/stub-archive",
    module: "identity",
    summary: "Archive composite stub for lodging compliance",
    summaryZh: "證件存根合成歸檔",
    source: "notebook-attributed",
    upstream: {
      vendor: "cloudbeds",
      method: "postGuestDocument + putGuest",
      note: "Cloudbeds kiosk cert guest document upload",
    },
  },
  {
    method: "POST",
    path: "/api/v1/payment/aggregate-pay",
    module: "payment",
    summary: "Charge due amount on QFPay POS after hardware interlock",
    summaryZh: "互鎖通過後在 QFPay POS 扣款",
    source: "notebook-attributed",
    upstream: { vendor: "qfpay", note: "POS API + async notify + /trade enquiry" },
  },
  {
    method: "POST",
    path: "/api/v1/payment/saga-compensate",
    module: "payment",
    summary: "Refund/void + recycle card + release room lock",
    summaryZh: "沖正退款、回收廢卡、釋放房態",
    source: "notebook-attributed",
    upstream: { vendor: "qfpay", note: "POST /trade/v1/refund against original syssn" },
  },
  {
    method: "GET",
    path: "/api/v1/pms/house-account",
    module: "pms",
    summary: "Folio / house-account balance for the stay",
    summaryZh: "入住賬戶餘額與消費",
    source: "notebook-attributed",
    upstream: {
      vendor: "cloudbeds",
      method: "getReservationInvoiceInformation / getHouseAccountDetails",
      note: "Checkout requires zero open balance",
    },
  },
  {
    method: "POST",
    path: "/api/v1/pms/room-assignment",
    module: "pms",
    summary: "Assign or confirm physical room + lock code",
    summaryZh: "動態分房並綁定鎖號",
    source: "notebook-attributed",
    upstream: {
      vendor: "cloudbeds",
      method: "getRoomsUnassigned + postRoomAssign",
      note: "Also getHouseKeepingStatus before encode",
    },
  },
  {
    method: "GET",
    path: "/api/v1/pms/upsell-rates",
    module: "pms",
    summary: "Late checkout / breakfast add-on rates",
    summaryZh: "延遲退房、早餐等加購費率",
    source: "notebook-attributed",
    upstream: {
      vendor: "cloudbeds",
      method: "getAvailableRoomTypes?detailedRates + getItems",
      note: "postCustomItem / postItem on accept",
    },
  },
  {
    method: "GET",
    path: "/api/v1/pms/reservations",
    module: "pms",
    summary: "Lookup confirmed arrivals by booking ref, phone, or third-party id",
    summaryZh: "以預訂號、手機或第三方單號查今日到達",
    source: "cloudbeds-kiosk-cert",
    upstream: {
      vendor: "cloudbeds",
      method: "getReservations + thirdPartyIdentifier",
      note: "Required by Cloudbeds kiosk certification; omitted from the 3-source API list",
    },
  },
  {
    method: "POST",
    path: "/api/v1/pms/sync-offline",
    module: "pms",
    summary: "Replay local offline check-ins when the WAN returns",
    summaryZh: "網絡恢復後回寫離線入住",
    source: "design-extension",
    upstream: {
      vendor: "cloudbeds",
      method: "putReservation checked_in",
      note: "Not in the 3 sources; required for 7 unattended machines",
    },
  },
  {
    method: "GET",
    path: "/api/v1/terminals",
    module: "config",
    summary: "List the 7 kiosk terminal configs",
    summaryZh: "七台終端配置列表",
    source: "design-extension",
    upstream: { vendor: "local", note: "JSON fleet file on the IPC" },
  },
];

export function openApiDocument() {
  const paths: Record<string, Record<string, unknown>> = {};
  for (const ep of endpoints) {
    const item = paths[ep.path] ?? {};
    item[ep.method.toLowerCase()] = {
      tags: [ep.module],
      summary: ep.summary,
      description: `${ep.summaryZh} [${ep.source}] ${ep.upstream.vendor}: ${"method" in ep.upstream ? ep.upstream.method + " — " : ""}${ep.upstream.note}`,
      operationId: ep.path.replace(/[\\/{}]/g, "_").replace(/^_/, "") + "_" + ep.method.toLowerCase(),
      responses: {
        "200": { description: "OK" },
        "400": { description: "Bad request / business rule" },
        "409": { description: "Conflict" },
        "503": { description: "Hardware or upstream unavailable" },
      },
    };
    paths[ep.path] = item;
  }
  return {
    openapi: "3.0.3",
    info: {
      title: "Hostel kiosk edge API",
      version: "1.0.0",
      description:
        "Facade on the Windows IPC. Cloudbeds and QFPay are upstreams, not the guest-facing contract.",
    },
    servers: [{ url: "http://127.0.0.1:8787" }],
    paths,
  };
}

export function endpointsByModule(): Record<EndpointModule, EndpointSpec[]> {
  const grouped = {
    hal: [],
    security: [],
    workflow: [],
    identity: [],
    payment: [],
    pms: [],
    config: [],
  } as Record<EndpointModule, EndpointSpec[]>;
  for (const ep of endpoints) grouped[ep.module].push(ep);
  return grouped;
}
