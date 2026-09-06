import { KioskRuntime } from "./engine";
import { defaultFaults, type KioskLang, type KioskViewState, type Step } from "./types";

export const KIOSK_MISSION_IDS = ["prepaid", "typhoon", "jam", "annex", "free"] as const;
export type KioskMissionId = (typeof KIOSK_MISSION_IDS)[number];

export const NIGHTSHIFT_SCORE_KEY = "ichina.kiosk.nightshift.v1";
export const FIRST_CLEAR_BONUS = 50;

export type KioskMissionVerdict = {
  pass: boolean;
  open: boolean;
  titleZh: string;
  titleEn: string;
  detailZh: string;
  detailEn: string;
};

export type NightshiftScore = {
  xp: number;
  clears: Partial<Record<KioskMissionId, number>>;
};

export type KioskMission = {
  id: KioskMissionId;
  xp: number;
  titleZh: string;
  titleEn: string;
  briefZh: string;
  briefEn: string;
  hintZh: string;
  hintEn: string;
  setup: (kiosk: KioskRuntime) => void;
  keep: (kiosk: KioskRuntime) => void;
  judge: (state: KioskViewState) => KioskMissionVerdict;
};

function isTerminalStep(step: Step): boolean {
  return step === "success" || step === "blocked" || step === "error";
}

function stillOpen(): KioskMissionVerdict {
  return {
    pass: false,
    open: true,
    titleZh: "",
    titleEn: "",
    detailZh: "",
    detailEn: "",
  };
}

function cleared(detailZh: string, detailEn: string): KioskMissionVerdict {
  return {
    pass: true,
    open: false,
    titleZh: "夜班過關",
    titleEn: "Shift cleared",
    detailZh,
    detailEn,
  };
}

function failed(detailZh: string, detailEn: string): KioskMissionVerdict {
  return {
    pass: false,
    open: false,
    titleZh: "夜班未過",
    titleEn: "Shift failed",
    detailZh,
    detailEn,
  };
}

function isLiveStep(step: Step): boolean {
  return step !== "success" && step !== "blocked" && step !== "error" && step !== "processing";
}

function resetLobby(kiosk: KioskRuntime) {
  kiosk.setTerminal("KSK-HK-01");
  kiosk.setFaults({ ...defaultFaults, cloudConflictRooms: [] });
}

const prepaid: KioskMission = {
  id: "prepaid",
  xp: 100,
  titleZh: "預付入閘",
  titleEn: "Prepaid gate",
  briefZh: "張小明已付清。查 BK80102，核身，出 801 房卡。房卡不得進廢卡箱。",
  briefEn: "Zhang Xiaoming is prepaid. Look up BK80102, verify, issue room 801. Do not swallow the card.",
  hintZh: "預訂入住 → BK80102 → 香港身份證 → 已付清",
  hintEn: "Reservation → BK80102 → HKID → prepaid skip",
  setup: (kiosk) => {
    resetLobby(kiosk);
  },
  keep: (kiosk) => {
    const state = kiosk.getState();
    if (!isLiveStep(state.step)) return;
    if (!state.faults.online) kiosk.setFaults({ online: true });
  },
  judge: (state) => {
    if (!isTerminalStep(state.step)) return stillOpen();
    if (state.step === "success" && state.lastCard?.roomNumber === "801" && !state.lastCard.recycled) {
      return cleared("801 已出卡，鎖號 010801。聯鎖沒有咬人。", "Room 801 issued. Lock 010801. The interlock held.");
    }
    return failed("這班要的是 BK80102 出 801，且房卡不能進廢卡箱。", "Need BK80102 → room 801, card not recycled.");
  },
};

const typhoon: KioskMission = {
  id: "typhoon",
  xp: 120,
  titleZh: "颱風夜",
  titleEn: "Typhoon night",
  briefZh: "WAN 已斷。未付款的 BK83099 不得出卡，只能送櫃檯。",
  briefEn: "WAN is down. Unpaid BK83099 must not issue a card. Send them to the desk.",
  hintZh: "斷網已設好。預訂入住 → BK83099 → 核身 → 確認",
  hintEn: "WAN is already down. Reservation → BK83099 → verify → confirm",
  setup: (kiosk) => {
    resetLobby(kiosk);
    kiosk.setFaults({ online: false });
  },
  keep: (kiosk) => {
    const state = kiosk.getState();
    if (!isLiveStep(state.step)) return;
    if (state.faults.online) kiosk.setFaults({ online: false });
  },
  judge: (state) => {
    if (!isTerminalStep(state.step)) return stillOpen();
    if (state.step === "blocked" && state.error?.code === "UNPAID_OFFLINE") {
      return cleared("未付款、無專線：機子拒絕出卡。這就是夜班。", "Unpaid, no WAN: the kiosk refused. That is the shift.");
    }
    return failed("斷網時出預付卡不算這班。要把未付款客人送到櫃檯。", "Issuing prepaid while the WAN is down is not this shift. Send the unpaid guest to the desk.");
  },
};

const jam: KioskMission = {
  id: "jam",
  xp: 150,
  titleZh: "寫卡失敗",
  titleEn: "Encode fail",
  briefZh: "未付訂單會先扣款。寫卡失敗必須回收並走 QFPay 退款。",
  briefEn: "An unpaid stay charges first. Encode fail must swallow the card and refund on QFPay.",
  hintZh: "預訂入住 → BK83099 → 護照 → 拍卡。寫卡會失敗。",
  hintEn: "Reservation → BK83099 → passport → tap POS. Encode will fail.",
  setup: (kiosk) => {
    resetLobby(kiosk);
    kiosk.setFaults({ encodeFailNext: true });
  },
  keep: (kiosk) => {
    const state = kiosk.getState();
    if (!isLiveStep(state.step)) return;
    if (!state.faults.encodeFailNext) kiosk.setFaults({ encodeFailNext: true });
  },
  judge: (state) => {
    if (!isTerminalStep(state.step)) return stillOpen();
    const saga =
      state.step === "error" &&
      state.error?.code === "ENCODE_FAIL" &&
      Boolean(state.lastCard?.recycled) &&
      state.lastPayment?.channel === "refund";
    if (saga) {
      return cleared("編碼失敗，SAGA 已退款，廢卡進箱。", "Encode failed. SAGA refunded. Scrap bin took the card.");
    }
    return failed("要用未付的 BK83099。預付跳過 POS，退款聯鎖不會亮。", "Use unpaid BK83099. Prepaid skips POS, so the refund interlock never fires.");
  },
};

const annex: KioskMission = {
  id: "annex",
  xp: 100,
  titleZh: "別館",
  titleEn: "Annex",
  briefZh: "這台是 KSK-HK-07，六間房。別墅 V101 已付清。",
  briefEn: "This machine is KSK-HK-07, six rooms. Villa V101 is prepaid.",
  hintZh: "預訂入住 → BK7V101 → 香港身份證 → 已付清",
  hintEn: "Reservation → BK7V101 → HKID → prepaid skip",
  setup: (kiosk) => {
    kiosk.setTerminal("KSK-HK-07");
    kiosk.setFaults({ ...defaultFaults, cloudConflictRooms: [] });
  },
  keep: (kiosk) => {
    const state = kiosk.getState();
    if (!isLiveStep(state.step)) return;
    if (!state.faults.online) kiosk.setFaults({ online: true });
  },
  judge: (state) => {
    if (!isTerminalStep(state.step)) return stillOpen();
    if (
      state.step === "success" &&
      state.terminal.terminalId === "KSK-HK-07" &&
      state.lastCard?.roomNumber === "V101" &&
      !state.lastCard.recycled
    ) {
      return cleared("別館 V101 已出卡。低彈簧卡機沒有咬卡。", "Annex V101 issued. The low-spring hopper held.");
    }
    return failed("這班在 KSK-HK-07。查 BK7V101，出 V101。", "This shift is KSK-HK-07. Look up BK7V101 and issue V101.");
  },
};

const free: KioskMission = {
  id: "free",
  xp: 0,
  titleZh: "自由機",
  titleEn: "Free play",
  briefZh: "店員面板開著。沒有裁判。七台機、故障、同步都可玩。",
  briefEn: "Operator strip is on. No judge. All seven terminals, faults, and sync are live.",
  hintZh: "底部「演示控制」可斷網、卡機、寫卡、衝突 802。",
  hintEn: "Demo controls at the foot: WAN, hopper, encode, conflict 802.",
  setup: (kiosk) => {
    resetLobby(kiosk);
  },
  keep: () => {
    // Free play does not pin faults.
  },
  judge: () => stillOpen(),
};

export const kioskMissionMap: Record<KioskMissionId, KioskMission> = {
  prepaid,
  typhoon,
  jam,
  annex,
  free,
};

export const kioskMissions: KioskMission[] = KIOSK_MISSION_IDS.map((id) => kioskMissionMap[id]);

export function isKioskMissionId(value: string): value is KioskMissionId {
  return (KIOSK_MISSION_IDS as readonly string[]).includes(value);
}

export function requireMission(id: KioskMissionId): KioskMission {
  return kioskMissionMap[id];
}

export function bootMission(
  id: KioskMissionId,
  opts?: { terminalId?: string; persist?: boolean; lang?: KioskLang; now?: () => Date },
): { mission: KioskMission; runtime: KioskRuntime } {
  const mission = requireMission(id);
  const runtime = new KioskRuntime({ persist: false, ...opts });
  mission.setup(runtime);
  return { mission, runtime };
}

export function emptyScore(): NightshiftScore {
  return { xp: 0, clears: {} };
}

export function parseNightshiftScore(raw: string | null): NightshiftScore {
  if (!raw) return emptyScore();
  try {
    const parsed = JSON.parse(raw) as Partial<NightshiftScore>;
    const clears: NightshiftScore["clears"] = {};
    for (const id of KIOSK_MISSION_IDS) {
      const count = parsed.clears?.[id];
      if (typeof count === "number" && count > 0) clears[id] = count;
    }
    return {
      xp: typeof parsed.xp === "number" && parsed.xp > 0 ? parsed.xp : 0,
      clears,
    };
  } catch {
    return emptyScore();
  }
}

export function applyMissionPass(
  score: NightshiftScore,
  mission: KioskMission,
): { score: NightshiftScore; gained: number } {
  if (mission.id === "free" || mission.xp <= 0) {
    return { score, gained: 0 };
  }
  const first = !score.clears[mission.id];
  const gained = mission.xp + (first ? FIRST_CLEAR_BONUS : 0);
  return {
    gained,
    score: {
      xp: score.xp + gained,
      clears: {
        ...score.clears,
        [mission.id]: (score.clears[mission.id] ?? 0) + 1,
      },
    },
  };
}
