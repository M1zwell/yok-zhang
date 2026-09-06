export type KioskLang = "zh-Hant" | "en";

export type Step =
  | "welcome"
  | "identify"
  | "camera"
  | "payment"
  | "processing"
  | "success"
  | "checkoutIdentify"
  | "checkoutConfirm"
  | "blocked"
  | "error";

export type Intent = "idle" | "reservation-checkin" | "walk-in" | "checkout";

export type PaymentStatus = "PAID" | "UNPAID";

export type CheckinStatus = 0 | 1 | 2;

export type RoomType =
  | "DELUXE_DOUBLE"
  | "TWIN"
  | "EXECUTIVE_SUITE"
  | "PREMIUM_VILLA"
  | "DORM_BED"
  | "POD";

export type LockBrand = "ProUSB-RF" | "ProUSB-Dorm";

export type DeviceHealth = "online" | "offline" | "jammed" | "empty";

export type SyncEventType =
  | "OFFLINE_CHECKIN"
  | "SYNC_SUCCESS"
  | "SYNC_CONFLICT"
  | "SAGA_COMPENSATE"
  | "CARD_RECYCLE"
  | "GATE_CLOSED"
  | "PRE_PAYMENT_BLOCK";

export type KioskErrorCode =
  | "NOT_FOUND"
  | "ALREADY_CHECKED_IN"
  | "HARDWARE_NOT_READY"
  | "CARD_EMPTY"
  | "CARD_JAM"
  | "ENCODE_FAIL"
  | "POS_OFFLINE"
  | "PMS_OFFLINE"
  | "PAYMENT_FAILED"
  | "UNPAID_OFFLINE"
  | "GATE_CLOSED"
  | "IDENTITY_FAIL"
  | "FACE_MISMATCH"
  | "BALANCE_OPEN"
  | "NO_VACANCY"
  | "BAD_REQUEST"
  | "CONFLICT";

export type RoomUnit = {
  pmsRoomId: string;
  roomNumber: string;
  roomType: RoomType;
  lockCode: string;
  floor: number;
  bedId?: string;
  sharedDoorLock?: string;
};

export type HardwareConfig = {
  cardDispenser: {
    model: "Creator-K750-B";
    comPort: string;
    baudRate: number;
    timeoutMs: number;
    hopperSpring: "high" | "low";
    stockCapacity: number;
  };
  doorLockEncoder: {
    dllName: "proRFL.dll";
    connectionType: "USB";
    encoderModel: string;
    lockBrand: LockBrand;
  };
  paymentTerminal: {
    model: "QFPay-POS-T1";
    connection: "LAN";
    ipAddress: string;
    port: number;
  };
  camera: {
    model: "UVC-Binocular";
    liveness: boolean;
  };
};

export type TerminalConfig = {
  terminalId: string;
  location: string;
  propertyName: string;
  building: number;
  roomCount: number;
  hardware: HardwareConfig;
  roomMatrix: RoomUnit[];
};

export type LocalReservation = {
  bookingRef: string;
  pmsReservationId: string;
  guestName: string;
  guestNameEn: string;
  phone: string;
  idHint: string;
  roomNumber: string;
  lockCode: string;
  bedId?: string;
  roomType: RoomType;
  checkInTime: string;
  checkOutTime: string;
  nights: number;
  amountHkdCents: number;
  paymentStatus: PaymentStatus;
  checkinStatus: CheckinStatus;
  localCheckinTimestamp?: string;
  pmsRoomId: string;
  terminalId: string;
};

export type SyncLog = {
  id: string;
  bookingRef: string;
  eventType: SyncEventType;
  details: string;
  timestamp: string;
};

export type IdentityState = {
  captured: boolean;
  docKind?: "hkid" | "passport";
  ocrName?: string;
  ocrId?: string;
  faceScore?: number;
  stubId?: string;
  gateOpen: boolean;
};

export type PaymentRecord = {
  syssn: string;
  outTradeNo: string;
  amountHkdCents: number;
  channel: "pos" | "skipped-prepaid" | "refund";
  respcd: "0000" | "1143" | "FAIL";
};

export type Bill = {
  roomNumber: string;
  roomType: RoomType;
  nights: number;
  amountHkdCents: number;
  alreadyPaid: boolean;
  dueHkdCents: number;
};

export type HealthSnapshot = {
  dispenser: DeviceHealth;
  lockEncoder: DeviceHealth;
  pos: DeviceHealth;
  camera: DeviceHealth;
  pms: DeviceHealth;
  cardStock: number;
  scrapBin: number;
  online: boolean;
};

export type Faults = {
  online: boolean;
  dispenserEmpty: boolean;
  dispenserJamNext: boolean;
  lockOffline: boolean;
  posOffline: boolean;
  cameraOffline: boolean;
  pmsOffline: boolean;
  encodeFailNext: boolean;
  faceMismatch: boolean;
  cloudConflictRooms: string[];
};

export type IssuedCard = {
  roomNumber: string;
  lockCode: string;
  recycled: boolean;
};

export type KioskViewState = {
  lang: KioskLang;
  step: Step;
  intent: Intent;
  terminal: TerminalConfig;
  query: string;
  reservation?: LocalReservation;
  identity: IdentityState;
  bill?: Bill;
  lastPayment?: PaymentRecord;
  lastCard?: IssuedCard;
  error?: ApiErr;
  health: HealthSnapshot;
  faults: Faults;
  logs: SyncLog[];
  demoBookings: LocalReservation[];
  message?: string;
};

export type ApiOk<T> = { ok: true; status: number; data: T };
export type ApiErr = {
  ok: false;
  status: number;
  code: KioskErrorCode;
  message: string;
  messageZh: string;
  messageEn: string;
};
export type ApiResult<T> = ApiOk<T> | ApiErr;

export type HttpMethod = "GET" | "POST";

export function exhaustive(value: never, label: string): never {
  throw new Error(`${label}: unexpected variant`);
}

export const defaultFaults: Faults = {
  online: true,
  dispenserEmpty: false,
  dispenserJamNext: false,
  lockOffline: false,
  posOffline: false,
  cameraOffline: false,
  pmsOffline: false,
  encodeFailNext: false,
  faceMismatch: false,
  cloudConflictRooms: [],
};

export function emptyIdentity(): IdentityState {
  return { captured: false, gateOpen: false };
}
