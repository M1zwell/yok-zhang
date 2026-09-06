import { endpoints, openApiDocument } from "./catalog";
import { errorText } from "./copy";
import {
  defaultTerminalId,
  fleetSummary,
  nightlyRate,
  requireTerminal,
  seedReservations,
  terminalById,
  terminals,
} from "./terminals";
import {
  defaultFaults,
  emptyIdentity,
  exhaustive,
  type ApiErr,
  type ApiResult,
  type Bill,
  type CheckinStatus,
  type Faults,
  type HealthSnapshot,
  type HttpMethod,
  type IdentityState,
  type Intent,
  type KioskLang,
  type KioskViewState,
  type LocalReservation,
  type PaymentRecord,
  type RoomType,
  type Step,
  type SyncLog,
  type TerminalConfig,
} from "./types";

export { endpoints, errorText, fleetSummary, openApiDocument, terminals };
export type { KioskViewState, TerminalConfig };

const STORAGE_KEY = "ichina.kiosk.v1";

type PersistShape = {
  reservations: LocalReservation[];
  logs: SyncLog[];
  scrapBin: number;
  stock: Record<string, number>;
  seq: number;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function money(cents: number): string {
  return `HK$ ${(cents / 100).toFixed(2)}`;
}

export function formatHkd(cents: number): string {
  return money(cents);
}

export class KioskRuntime {
  private lang: KioskLang = "zh-Hant";
  private step: Step = "welcome";
  private intent: Intent = "idle";
  private terminal: TerminalConfig;
  private query = "";
  private reservation?: LocalReservation;
  private identity: IdentityState = emptyIdentity();
  private bill?: Bill;
  private lastPayment?: PaymentRecord;
  private lastCard?: { roomNumber: string; lockCode: string; recycled: boolean };
  private error?: ApiErr;
  private faults: Faults = { ...defaultFaults, cloudConflictRooms: [] };
  private logs: SyncLog[] = [];
  private reservations = new Map<string, LocalReservation>();
  private scrapBin = 0;
  private stock = new Map<string, number>();
  private seq = 1;
  private persistEnabled: boolean;
  private listeners = new Set<() => void>();
  private nowFn: () => Date;
  private pmsCheckedIn = new Set<string>();
  private cachedState?: KioskViewState;

  constructor(opts?: {
    terminalId?: string;
    persist?: boolean;
    lang?: KioskLang;
    now?: () => Date;
  }) {
    this.terminal = requireTerminal(opts?.terminalId ?? defaultTerminalId);
    this.persistEnabled = opts?.persist ?? false;
    this.lang = opts?.lang ?? "zh-Hant";
    this.nowFn = opts?.now ?? (() => new Date());
    this.reseedStock();
    this.loadOrSeed();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState(): KioskViewState {
    if (this.cachedState) return this.cachedState;
    const snapshot: KioskViewState = {
      lang: this.lang,
      step: this.step,
      intent: this.intent,
      terminal: this.terminal,
      query: this.query,
      reservation: this.reservation,
      identity: this.identity,
      bill: this.bill,
      lastPayment: this.lastPayment,
      lastCard: this.lastCard,
      error: this.error,
      health: this.health(),
      faults: clone(this.faults),
      logs: [...this.logs].slice(-12).reverse(),
      demoBookings: this.demoBookings(),
    };
    this.cachedState = snapshot;
    return snapshot;
  }

  setLang(lang: KioskLang) {
    this.lang = lang;
    this.emit();
  }

  setQuery(query: string) {
    this.query = query.toUpperCase().replace(/\s+/g, "");
    this.emit();
  }

  setTerminal(terminalId: string): ApiResult<{ terminalId: string }> {
    const next = terminalById(terminalId);
    if (!next) return this.fail("NOT_FOUND", 404);
    this.terminal = next;
    this.resetSession();
    this.ensureTerminalSeed(next);
    this.save();
    this.emit();
    return { ok: true, status: 200, data: { terminalId: next.terminalId } };
  }

  setFaults(patch: Partial<Faults>) {
    this.faults = {
      ...this.faults,
      ...patch,
      cloudConflictRooms: patch.cloudConflictRooms ?? this.faults.cloudConflictRooms,
    };
    this.emit();
  }

  home() {
    this.resetSession();
    this.emit();
  }

  startReservationCheckin() {
    this.resetSession();
    this.intent = "reservation-checkin";
    this.step = "identify";
    this.emit();
  }

  startWalkIn() {
    this.resetSession();
    this.intent = "walk-in";
    this.step = "identify";
    this.emit();
  }

  startCheckout() {
    this.resetSession();
    this.intent = "checkout";
    this.step = "checkoutIdentify";
    this.emit();
  }

  lookup(): ApiResult<LocalReservation> {
    if (this.intent === "walk-in") {
      return this.invoke("POST", "/api/v1/workflow/walk-in", {
        roomType: this.query || "DELUXE_DOUBLE",
      });
    }
    if (this.intent === "checkout") {
      return this.invoke("POST", "/api/v1/workflow/checkout", { lookup: true, q: this.query });
    }
    return this.invoke("POST", "/api/v1/workflow/reservation-checkin", { q: this.query });
  }

  captureIdentity(docKind: "hkid" | "passport"): ApiResult<IdentityState> {
    const cam = this.invoke("POST", "/api/v1/hal/camera/capture", { docKind });
    if (!cam.ok) return cam;
    const ocr = this.invoke("POST", "/api/v1/identity/ocr", { docKind });
    if (!ocr.ok) return ocr;
    const face = this.invoke("POST", "/api/v1/identity/face-match", {});
    if (!face.ok) return face;
    const stub = this.invoke("POST", "/api/v1/identity/stub-archive", {});
    if (!stub.ok) return stub;
    const gate = this.invoke("POST", "/api/v1/workflow/gate-control", { open: true });
    if (!gate.ok) return gate;
    this.step = this.intent === "checkout" ? "checkoutConfirm" : "payment";
    this.error = undefined;
    this.emit();
    return { ok: true, status: 200, data: this.identity };
  }

  confirmStay(): ApiResult<{ roomNumber: string; lockCode: string }> {
    this.step = "processing";
    this.emit();
    const issued = this.issueStay();
    if (!issued.ok) {
      this.step = issued.code === "UNPAID_OFFLINE" ? "blocked" : "error";
      this.error = issued;
      this.emit();
      return issued;
    }
    this.step = "success";
    this.emit();
    return issued;
  }

  confirmCheckout(): ApiResult<{ bookingRef: string }> {
    return this.invoke("POST", "/api/v1/workflow/checkout", { confirm: true });
  }

  syncOffline(): ApiResult<{ synced: number; conflicts: number }> {
    return this.invoke("POST", "/api/v1/pms/sync-offline", {});
  }

  invoke<T = unknown>(method: HttpMethod, path: string, body: Record<string, unknown> = {}): ApiResult<T> {
    const result = this.route(method, path, body);
    this.save();
    this.emit();
    return result as ApiResult<T>;
  }

  private route(method: HttpMethod, path: string, body: Record<string, unknown>): ApiResult<unknown> {
    const key = `${method} ${path}`;
    switch (key) {
      case "GET /api/v1/hal/system/health":
        return this.ok(this.health());
      case "GET /api/v1/security/card-stock":
        return this.ok({
          stock: this.cardStock(),
          scrapBin: this.scrapBin,
          jammed: this.health().dispenser === "jammed",
        });
      case "GET /api/v1/terminals":
        return this.ok(fleetSummary());
      case "GET /api/v1/pms/upsell-rates":
        return this.ok([
          { id: "late-checkout", name: "Late checkout 14:00", amountHkdCents: 15000 },
          { id: "breakfast", name: "Breakfast", amountHkdCents: 8800 },
        ]);
      case "GET /api/v1/pms/house-account":
        return this.houseAccount(String(body.bookingRef ?? this.reservation?.bookingRef ?? ""));
      case "GET /api/v1/pms/reservations":
        return this.findReservation(String(body.q ?? this.query));
      case "POST /api/v1/security/pre-payment-check":
        return this.prePaymentCheck();
      case "POST /api/v1/workflow/reservation-checkin":
        return this.beginReservation(String(body.q ?? this.query));
      case "POST /api/v1/workflow/walk-in":
        return this.beginWalkIn(String(body.roomType ?? "DELUXE_DOUBLE") as RoomType);
      case "POST /api/v1/workflow/gate-control":
        return this.gateControl(Boolean(body.open));
      case "POST /api/v1/workflow/checkout":
        return this.checkout(body);
      case "POST /api/v1/hal/camera/capture":
        return this.cameraCapture();
      case "POST /api/v1/identity/ocr":
        return this.ocr(String(body.docKind ?? "passport") as "hkid" | "passport");
      case "POST /api/v1/identity/face-match":
        return this.faceMatch();
      case "POST /api/v1/identity/stub-archive":
        return this.stubArchive();
      case "POST /api/v1/payment/aggregate-pay":
        return this.aggregatePay();
      case "POST /api/v1/payment/saga-compensate":
        return this.sagaCompensate(String(body.reason ?? "manual"));
      case "POST /api/v1/hal/door-lock/encode":
        return this.encodeCard();
      case "POST /api/v1/hal/door-lock/erase":
        return this.ok({ erased: true });
      case "POST /api/v1/hal/card-dispenser/issue":
        return this.issueCard();
      case "POST /api/v1/hal/card-dispenser/recycle":
        return this.recycle("manual");
      case "POST /api/v1/hal/pos/terminal-pay":
        return this.aggregatePay();
      case "POST /api/v1/pms/room-assignment":
        return this.roomAssignment();
      case "POST /api/v1/pms/sync-offline":
        return this.replayOffline();
      default:
        return this.fail("BAD_REQUEST", 404);
    }
  }

  private issueStay(): ApiResult<{ roomNumber: string; lockCode: string }> {
    if (!this.reservation) return this.fail("BAD_REQUEST", 400);
    if (!this.identity.gateOpen) return this.fail("GATE_CLOSED", 403);
    const ready = this.prePaymentCheck();
    if (!ready.ok) return ready;

    const due = this.bill?.dueHkdCents ?? 0;
    const online = this.isOnline();
    if (due > 0 && !online) return this.fail("UNPAID_OFFLINE", 503);
    if (due > 0) {
      const paid = this.aggregatePay();
      if (!paid.ok) return paid;
    } else {
      this.lastPayment = {
        syssn: "PREPAID",
        outTradeNo: `skip_${this.reservation.bookingRef}`,
        amountHkdCents: 0,
        channel: "skipped-prepaid",
        respcd: "0000",
      };
    }

    if (online) {
      const assigned = this.roomAssignment();
      if (!assigned.ok) {
        this.sagaCompensate("room-assign");
        return assigned;
      }
    }

    const encoded = this.encodeCard();
    if (!encoded.ok) {
      this.sagaCompensate("encode");
      return encoded;
    }
    const issued = this.issueCard();
    if (!issued.ok) {
      this.sagaCompensate("issue");
      return issued;
    }

    const row = this.reservation;
    const nextStatus: CheckinStatus = online ? 2 : 1;
    this.patchReservation(row.bookingRef, {
      checkinStatus: nextStatus,
      localCheckinTimestamp: this.nowFn().toISOString(),
      paymentStatus: "PAID",
    });
    if (online) this.pmsCheckedIn.add(row.bookingRef);
    else {
      this.log(row.bookingRef, "OFFLINE_CHECKIN", `offline issue ${row.roomNumber}`);
    }
    this.reservation = this.reservations.get(this.resKey(row.bookingRef));
    this.lastCard = { roomNumber: row.roomNumber, lockCode: row.lockCode, recycled: false };
    this.bill = this.toBill(this.reservation!);
    return this.ok({ roomNumber: row.roomNumber, lockCode: row.lockCode });
  }

  private prePaymentCheck(): ApiResult<{ ready: true }> {
    const health = this.health();
    if (health.dispenser === "empty") return this.fail("CARD_EMPTY", 503);
    if (health.dispenser === "jammed" || health.dispenser === "offline") {
      this.log("-", "PRE_PAYMENT_BLOCK", "dispenser");
      return this.fail("HARDWARE_NOT_READY", 503);
    }
    if (health.lockEncoder !== "online") {
      this.log("-", "PRE_PAYMENT_BLOCK", "lock");
      return this.fail("HARDWARE_NOT_READY", 503);
    }
    return this.ok({ ready: true as const });
  }

  private beginReservation(q: string): ApiResult<LocalReservation> {
    const found = this.findReservation(q);
    if (!found.ok) return found;
    const row = found.data as LocalReservation;
    if (row.checkinStatus > 0) return this.fail("ALREADY_CHECKED_IN", 409);
    this.reservation = row;
    this.bill = this.toBill(row);
    this.identity = emptyIdentity();
    this.step = "camera";
    this.intent = "reservation-checkin";
    return this.ok(row);
  }

  private beginWalkIn(roomType: RoomType): ApiResult<LocalReservation> {
    if (!this.isOnline()) return this.fail("UNPAID_OFFLINE", 503);
    if (this.faults.pmsOffline) return this.fail("PMS_OFFLINE", 503);
    const vacant = this.terminal.roomMatrix.find(
      (room) => room.roomType === roomType && !this.roomTaken(room.roomNumber),
    );
    if (!vacant) return this.fail("NO_VACANCY", 409);
    const nights = 1;
    const bookingRef = `WI${this.seq++}${vacant.roomNumber}`;
    const row: LocalReservation = {
      bookingRef,
      pmsReservationId: `cbres_${bookingRef}`,
      guestName: "現場住客",
      guestNameEn: "Walk-in guest",
      phone: this.query || "00000000",
      idHint: "",
      roomNumber: vacant.roomNumber,
      lockCode: vacant.lockCode,
      bedId: vacant.bedId,
      roomType: vacant.roomType,
      checkInTime: this.nowFn().toISOString(),
      checkOutTime: new Date(this.nowFn().getTime() + 86400000).toISOString(),
      nights,
      amountHkdCents: nightlyRate(roomType) * nights,
      paymentStatus: "UNPAID",
      checkinStatus: 0,
      pmsRoomId: vacant.pmsRoomId,
      terminalId: this.terminal.terminalId,
    };
    this.reservations.set(this.resKey(bookingRef), row);
    this.reservation = row;
    this.bill = this.toBill(row);
    this.identity = emptyIdentity();
    this.step = "camera";
    this.intent = "walk-in";
    return this.ok(row);
  }

  private gateControl(open: boolean): ApiResult<{ gateOpen: boolean }> {
    if (open && !this.identity.stubId) {
      this.log(this.reservation?.bookingRef ?? "-", "GATE_CLOSED", "no stub");
      return this.fail("GATE_CLOSED", 403);
    }
    this.identity = { ...this.identity, gateOpen: open && Boolean(this.identity.stubId) };
    return this.ok({ gateOpen: this.identity.gateOpen });
  }

  private cameraCapture(): ApiResult<{ captured: true }> {
    if (this.faults.cameraOffline) return this.fail("HARDWARE_NOT_READY", 503);
    this.identity = { ...this.identity, captured: true };
    return this.ok({ captured: true as const });
  }

  private ocr(docKind: "hkid" | "passport"): ApiResult<IdentityState> {
    if (!this.identity.captured) return this.fail("IDENTITY_FAIL", 400);
    const row = this.reservation;
    const name = row?.guestName ?? "現場住客";
    const ocrId = docKind === "hkid" ? row?.idHint || "A000000(0)" : row?.idHint || "P0000000";
    this.identity = { ...this.identity, docKind, ocrName: name, ocrId };
    return this.ok(this.identity);
  }

  private faceMatch(): ApiResult<{ score: number }> {
    if (this.faults.faceMismatch) return this.fail("FACE_MISMATCH", 409);
    const score = 0.94;
    this.identity = { ...this.identity, faceScore: score };
    return this.ok({ score });
  }

  private stubArchive(): ApiResult<{ stubId: string }> {
    if (!this.identity.ocrName || !this.identity.faceScore) return this.fail("IDENTITY_FAIL", 400);
    const stubId = `stub_${this.seq++}`;
    this.identity = { ...this.identity, stubId };
    return this.ok({ stubId });
  }

  private aggregatePay(): ApiResult<PaymentRecord> {
    if (!this.reservation || !this.bill) return this.fail("BAD_REQUEST", 400);
    if (!this.isOnline() || this.faults.posOffline) return this.fail("POS_OFFLINE", 503);
    const ready = this.prePaymentCheck();
    if (!ready.ok) return ready;
    if (this.bill.dueHkdCents <= 0) {
      const skipped: PaymentRecord = {
        syssn: "PREPAID",
        outTradeNo: `skip_${this.reservation.bookingRef}`,
        amountHkdCents: 0,
        channel: "skipped-prepaid",
        respcd: "0000",
      };
      this.lastPayment = skipped;
      return this.ok(skipped);
    }
    const record: PaymentRecord = {
      syssn: `QF${this.nowFn().getTime()}${this.seq++}`,
      outTradeNo: `out_${this.reservation.bookingRef}_${this.seq}`,
      amountHkdCents: this.bill.dueHkdCents,
      channel: "pos",
      respcd: "0000",
    };
    this.lastPayment = record;
    this.patchReservation(this.reservation.bookingRef, { paymentStatus: "PAID" });
    this.reservation = this.reservations.get(this.resKey(this.reservation.bookingRef));
    this.bill = this.toBill(this.reservation!);
    return this.ok(record);
  }

  private sagaCompensate(reason: string): ApiResult<{ refunded: boolean }> {
    const row = this.reservation;
    const payment = this.lastPayment;
    this.recycle(reason);
    let refunded = false;
    if (payment && payment.channel === "pos" && payment.respcd === "0000") {
      refunded = true;
      this.lastPayment = { ...payment, channel: "refund", respcd: "0000" };
      if (row) this.patchReservation(row.bookingRef, { paymentStatus: "UNPAID" });
    }
    if (row) {
      this.patchReservation(row.bookingRef, { checkinStatus: 0, localCheckinTimestamp: undefined });
      this.pmsCheckedIn.delete(row.bookingRef);
      this.log(row.bookingRef, "SAGA_COMPENSATE", `${reason}; refunded=${refunded}`);
      this.reservation = this.reservations.get(this.resKey(row.bookingRef));
      this.bill = this.reservation ? this.toBill(this.reservation) : this.bill;
    }
    this.lastCard = this.lastCard ? { ...this.lastCard, recycled: true } : this.lastCard;
    this.identity = { ...this.identity, gateOpen: false };
    return this.ok({ refunded });
  }

  private encodeCard(): ApiResult<{ lockCode: string }> {
    if (!this.reservation) return this.fail("BAD_REQUEST", 400);
    if (!this.identity.gateOpen) return this.fail("GATE_CLOSED", 403);
    if (this.faults.lockOffline) return this.fail("HARDWARE_NOT_READY", 503);
    if (this.faults.encodeFailNext) {
      this.faults.encodeFailNext = false;
      return this.fail("ENCODE_FAIL", 503);
    }
    const room = this.terminal.roomMatrix.find((r) => r.roomNumber === this.reservation?.roomNumber);
    const payload = {
      lockCode: this.reservation.lockCode,
      sharedDoorLock: room?.sharedDoorLock,
      validFrom: this.reservation.checkInTime,
      validTo: this.reservation.checkOutTime,
    };
    return this.ok({
      lockCode: payload.lockCode,
      sharedDoorLock: payload.sharedDoorLock,
      validFrom: payload.validFrom,
      validTo: payload.validTo,
    });
  }

  private issueCard(): ApiResult<{ issued: true }> {
    if (this.faults.dispenserJamNext) {
      this.faults.dispenserJamNext = false;
      return this.fail("CARD_JAM", 503);
    }
    if (this.cardStock() <= 0) return this.fail("CARD_EMPTY", 503);
    this.stock.set(this.terminal.terminalId, this.cardStock() - 1);
    if (this.reservation) {
      this.lastCard = {
        roomNumber: this.reservation.roomNumber,
        lockCode: this.reservation.lockCode,
        recycled: false,
      };
    }
    return this.ok({ issued: true as const });
  }

  private recycle(reason: string): ApiResult<{ recycled: true }> {
    this.scrapBin += 1;
    this.log(this.reservation?.bookingRef ?? "-", "CARD_RECYCLE", reason);
    this.lastCard = this.lastCard
      ? { ...this.lastCard, recycled: true }
      : { roomNumber: this.reservation?.roomNumber ?? "", lockCode: this.reservation?.lockCode ?? "", recycled: true };
    return this.ok({ recycled: true as const });
  }

  private roomAssignment(): ApiResult<{ pmsRoomId: string }> {
    if (!this.reservation) return this.fail("BAD_REQUEST", 400);
    if (this.faults.pmsOffline) return this.fail("PMS_OFFLINE", 503);
    if (this.faults.cloudConflictRooms.includes(this.reservation.roomNumber)) {
      return this.fail("CONFLICT", 409);
    }
    return this.ok({ pmsRoomId: this.reservation.pmsRoomId, roomNumber: this.reservation.roomNumber });
  }

  private houseAccount(bookingRef: string): ApiResult<{ balanceHkdCents: number }> {
    const row = this.reservations.get(this.resKey(bookingRef));
    if (!row) return this.fail("NOT_FOUND", 404);
    const balance = row.paymentStatus === "PAID" ? 0 : row.amountHkdCents;
    return this.ok({
      bookingRef,
      balanceHkdCents: balance,
      currency: "HKD",
      roomNumber: row.roomNumber,
    });
  }

  private checkout(body: Record<string, unknown>): ApiResult<unknown> {
    if (body.lookup) {
      const found = this.findReservation(String(body.q ?? this.query));
      if (!found.ok) return found;
      const row = found.data as LocalReservation;
      this.reservation = row;
      this.bill = this.toBill(row);
      this.step = "checkoutConfirm";
      return this.ok(row);
    }
    if (!this.reservation) return this.fail("BAD_REQUEST", 400);
    if (!this.isOnline()) return this.fail("PMS_OFFLINE", 503);
    const folio = this.houseAccount(this.reservation.bookingRef);
    if (!folio.ok) return folio;
    const balance = (folio.data as { balanceHkdCents: number }).balanceHkdCents;
    if (balance > 0) return this.fail("BALANCE_OPEN", 409);
    this.patchReservation(this.reservation.bookingRef, { checkinStatus: 0 });
    this.pmsCheckedIn.delete(this.reservation.bookingRef);
    this.recycle("checkout");
    this.step = "success";
    this.lastCard = {
      roomNumber: this.reservation.roomNumber,
      lockCode: this.reservation.lockCode,
      recycled: true,
    };
    return this.ok({ bookingRef: this.reservation.bookingRef, status: "checked_out" });
  }

  private replayOffline(): ApiResult<{ synced: number; conflicts: number }> {
    if (!this.isOnline()) return this.fail("PMS_OFFLINE", 503);
    let synced = 0;
    let conflicts = 0;
    for (const row of this.reservations.values()) {
      if (row.terminalId !== this.terminal.terminalId) continue;
      if (row.checkinStatus !== 1) continue;
      if (this.faults.cloudConflictRooms.includes(row.roomNumber)) {
        this.log(row.bookingRef, "SYNC_CONFLICT", `cloud occupies ${row.roomNumber}`);
        conflicts += 1;
        continue;
      }
      this.patchReservation(row.bookingRef, { checkinStatus: 2 });
      this.pmsCheckedIn.add(row.bookingRef);
      this.log(row.bookingRef, "SYNC_SUCCESS", row.roomNumber);
      synced += 1;
    }
    return this.ok({ synced, conflicts });
  }

  private findReservation(q: string): ApiResult<LocalReservation> {
    const needle = q.trim().toUpperCase();
    if (!needle) return this.fail("NOT_FOUND", 404);
    for (const row of this.reservations.values()) {
      if (row.terminalId !== this.terminal.terminalId) continue;
      if (
        row.bookingRef.toUpperCase() === needle ||
        row.phone === needle ||
        row.pmsReservationId.toUpperCase() === needle ||
        row.roomNumber.toUpperCase() === needle
      ) {
        return this.ok(row);
      }
    }
    return this.fail("NOT_FOUND", 404);
  }

  private health(): HealthSnapshot {
    const stock = this.cardStock();
    let dispenser: HealthSnapshot["dispenser"] = "online";
    if (this.faults.dispenserEmpty || stock <= 0) dispenser = "empty";
    return {
      dispenser,
      lockEncoder: this.faults.lockOffline ? "offline" : "online",
      pos: this.faults.posOffline || !this.faults.online ? "offline" : "online",
      camera: this.faults.cameraOffline ? "offline" : "online",
      pms: this.faults.pmsOffline || !this.faults.online ? "offline" : "online",
      cardStock: stock,
      scrapBin: this.scrapBin,
      online: this.isOnline(),
    };
  }

  private isOnline(): boolean {
    return this.faults.online && !this.faults.pmsOffline;
  }

  private cardStock(): number {
    if (this.faults.dispenserEmpty) return 0;
    return this.stock.get(this.terminal.terminalId) ?? 0;
  }

  private roomTaken(roomNumber: string): boolean {
    for (const row of this.reservations.values()) {
      if (row.terminalId !== this.terminal.terminalId) continue;
      if (row.roomNumber === roomNumber && row.checkinStatus > 0) return true;
    }
    return this.faults.cloudConflictRooms.includes(roomNumber);
  }

  private toBill(row: LocalReservation): Bill {
    const due = row.paymentStatus === "PAID" ? 0 : row.amountHkdCents;
    return {
      roomNumber: row.roomNumber,
      roomType: row.roomType,
      nights: row.nights,
      amountHkdCents: row.amountHkdCents,
      alreadyPaid: row.paymentStatus === "PAID",
      dueHkdCents: due,
    };
  }

  private demoBookings(): LocalReservation[] {
    return [...this.reservations.values()].filter((row) => row.terminalId === this.terminal.terminalId);
  }

  private patchReservation(bookingRef: string, patch: Partial<LocalReservation>) {
    const key = this.resKey(bookingRef);
    const current = this.reservations.get(key);
    if (!current) return;
    const next = { ...current, ...patch };
    this.reservations.set(key, next);
    if (this.reservation?.bookingRef === bookingRef) this.reservation = next;
  }

  private resKey(bookingRef: string): string {
    return `${this.terminal.terminalId}:${bookingRef}`;
  }

  private log(bookingRef: string, eventType: SyncLog["eventType"], details: string) {
    this.logs.push({
      id: `log_${this.seq++}`,
      bookingRef,
      eventType,
      details,
      timestamp: this.nowFn().toISOString(),
    });
  }

  private ok<T>(data: T): ApiResult<T> {
    return { ok: true, status: 200, data };
  }

  private fail(code: ApiErr["code"], status: number): ApiErr {
    const text = errorText[code];
    return {
      ok: false,
      status,
      code,
      message: this.lang === "zh-Hant" ? text.zh : text.en,
      messageZh: text.zh,
      messageEn: text.en,
    };
  }

  private resetSession() {
    this.step = "welcome";
    this.intent = "idle";
    this.query = "";
    this.reservation = undefined;
    this.identity = emptyIdentity();
    this.bill = undefined;
    this.lastPayment = undefined;
    this.lastCard = undefined;
    this.error = undefined;
  }

  private reseedStock() {
    for (const t of terminals) {
      if (!this.stock.has(t.terminalId)) this.stock.set(t.terminalId, t.hardware.cardDispenser.stockCapacity);
    }
  }

  private ensureTerminalSeed(terminal: TerminalConfig) {
    const existing = [...this.reservations.values()].some((row) => row.terminalId === terminal.terminalId);
    if (existing) return;
    for (const row of seedReservations(terminal)) {
      this.reservations.set(`${terminal.terminalId}:${row.bookingRef}`, clone(row));
    }
  }

  private loadOrSeed() {
    if (this.persistEnabled && typeof localStorage !== "undefined") {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as PersistShape;
          this.reservations = new Map(parsed.reservations.map((row) => [`${row.terminalId}:${row.bookingRef}`, row]));
          this.logs = parsed.logs ?? [];
          this.scrapBin = parsed.scrapBin ?? 0;
          this.stock = new Map(Object.entries(parsed.stock ?? {}));
          this.seq = parsed.seq ?? 1;
          this.reseedStock();
          this.ensureTerminalSeed(this.terminal);
          return;
        }
      } catch {
        // fall through to seed
      }
    }
    for (const t of terminals) this.ensureTerminalSeed(t);
  }

  private save() {
    if (!this.persistEnabled || typeof localStorage === "undefined") return;
    const payload: PersistShape = {
      reservations: [...this.reservations.values()],
      logs: this.logs.slice(-80),
      scrapBin: this.scrapBin,
      stock: Object.fromEntries(this.stock),
      seq: this.seq,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  private emit() {
    this.cachedState = undefined;
    this.listeners.forEach((fn) => fn());
  }
}

export function describeStep(step: Step, lang: KioskLang): string {
  switch (step) {
    case "welcome":
    case "identify":
    case "camera":
    case "payment":
    case "processing":
    case "success":
    case "checkoutIdentify":
    case "checkoutConfirm":
    case "blocked":
    case "error":
      return lang === "zh-Hant" ? step : step;
    default:
      return exhaustive(step, "step");
  }
}
