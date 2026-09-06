import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { endpoints, openApiDocument } from "../lib/kiosk/catalog.ts";
import { applyMissionPass, bootMission, emptyScore, KIOSK_MISSION_IDS, parseNightshiftScore, requireMission } from "../lib/kiosk/missions.ts";
import { KioskRuntime } from "../lib/kiosk/engine.ts";
import { fleetSummary, lockCode, terminals } from "../lib/kiosk/terminals.ts";
import type { KioskErrorCode, Step } from "../lib/kiosk/types.ts";
import { exhaustive } from "../lib/kiosk/types.ts";

function runtime(terminalId = "KSK-HK-01") {
  return new KioskRuntime({ terminalId, persist: false, now: () => new Date("2026-09-05T10:00:00Z") });
}

function checkinPaid(k: KioskRuntime, booking = "BK80102") {
  k.startReservationCheckin();
  k.setQuery(booking);
  const found = k.lookup();
  assert.equal(found.ok, true, "lookup");
  const id = k.captureIdentity("hkid");
  assert.equal(id.ok, true, "identity");
  return k.confirmStay();
}

function testPmsPublicRoute() {
  const page = readFileSync(join(process.cwd(), "app/PMS/page.tsx"), "utf8");
  assert.match(page, /path: "\/PMS"/);
  assert.match(page, /KioskSim/);
  const hub = readFileSync(join(process.cwd(), "app/components/game/GameHub.tsx"), "utf8");
  assert.match(hub, /\/PMS/);
  assert.match(hub, /cardPms/);
  const tools = readFileSync(join(process.cwd(), "lib/site.ts"), "utf8");
  assert.match(tools, /href: "\/PMS"/);
  assert.match(tools, /ichina\.co\/PMS/);
  const out = join(process.cwd(), "out");
  if (!existsSync(out)) return;
  const candidates = [join(out, "PMS.html"), join(out, "PMS/index.html")];
  const built = candidates.find((file) => existsSync(file));
  assert.ok(built, "static export must include /PMS");
  const html = readFileSync(built, "utf8");
  assert.match(html, /kiosk-root|Hostel PMS|自助旅宿/i);
}

function testFleet() {
  const summary = fleetSummary();
  assert.equal(summary.length, 7);
  assert.equal(summary[0]?.terminalId, "KSK-HK-01");
  assert.equal(summary[0]?.rooms, 30);
  assert.equal(summary[6]?.terminalId, "KSK-HK-07");
  assert.equal(summary[6]?.rooms, 6);
  const rooms = [30, 24, 18, 16, 12, 8, 6];
  assert.deepEqual(
    summary.map((s) => s.rooms),
    rooms,
  );
  const hk01 = terminals[0];
  assert.equal(hk01?.roomMatrix[0]?.lockCode, lockCode(1, 8, 1));
  assert.equal(hk01?.roomMatrix[0]?.lockCode, "010801");
  assert.equal(hk01?.roomMatrix[1]?.lockCode, "010802");
  const hk07 = terminals[6];
  assert.ok(hk07?.roomMatrix.some((r) => r.bedId === "BED_A" && r.sharedDoorLock));
  assert.ok(hk07?.roomMatrix.some((r) => r.roomType === "PREMIUM_VILLA"));
}

function testOpenApi() {
  const doc = openApiDocument();
  assert.equal(doc.openapi, "3.0.3");
  const attributed = endpoints.filter((e) => e.source === "notebook-attributed");
  assert.ok(attributed.length >= 18);
  assert.ok(endpoints.some((e) => e.path === "/api/v1/pms/reservations" && e.source === "cloudbeds-kiosk-cert"));
  assert.ok(endpoints.some((e) => e.path === "/api/v1/pms/sync-offline" && e.source === "design-extension"));
  for (const ep of endpoints) {
    assert.ok(doc.paths[ep.path], ep.path);
  }
}

function testPrepaidOnline() {
  const k = runtime();
  const result = checkinPaid(k);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.data.roomNumber, "801");
  assert.equal(result.data.lockCode, "010801");
  const state = k.getState();
  assert.equal(state.step, "success");
  assert.equal(state.reservation?.checkinStatus, 2);
  assert.equal(state.lastPayment?.channel, "skipped-prepaid");
  assert.equal(state.health.cardStock, 79);
}

function testUnpaidOfflineBlocked() {
  const k = runtime();
  k.setFaults({ online: false });
  k.startReservationCheckin();
  k.setQuery("BK83099");
  assert.equal(k.lookup().ok, true);
  assert.equal(k.captureIdentity("hkid").ok, true);
  const stay = k.confirmStay();
  assert.equal(stay.ok, false);
  if (stay.ok) return;
  assert.equal(stay.code, "UNPAID_OFFLINE");
  assert.equal(k.getState().step, "blocked");
  assert.equal(k.getState().reservation?.checkinStatus, 0);
}

function testPrepaidOfflineThenSync() {
  const k = runtime();
  k.setFaults({ online: false });
  const stay = checkinPaid(k, "BK80205");
  assert.equal(stay.ok, true);
  assert.equal(k.getState().reservation?.checkinStatus, 1);
  assert.ok(k.getState().logs.some((l) => l.eventType === "OFFLINE_CHECKIN"));
  k.setFaults({ online: true });
  const sync = k.syncOffline();
  assert.equal(sync.ok, true);
  if (!sync.ok) return;
  assert.equal(sync.data.synced, 1);
  assert.equal(sync.data.conflicts, 0);
  assert.equal(k.getState().reservation?.checkinStatus, 2);
}

function testSyncConflict() {
  const k = runtime();
  k.setFaults({ online: false });
  assert.equal(checkinPaid(k, "BK80205").ok, true);
  k.setFaults({ online: true, cloudConflictRooms: ["802"] });
  const sync = k.syncOffline();
  assert.equal(sync.ok, true);
  if (!sync.ok) return;
  assert.equal(sync.data.conflicts, 1);
  assert.equal(k.getState().reservation?.checkinStatus, 1);
  assert.ok(k.getState().logs.some((l) => l.eventType === "SYNC_CONFLICT"));
}

function testPrePaymentInterlock() {
  const k = runtime();
  k.setFaults({ lockOffline: true });
  k.startReservationCheckin();
  k.setQuery("BK80102");
  k.lookup();
  k.captureIdentity("hkid");
  const stay = k.confirmStay();
  assert.equal(stay.ok, false);
  if (stay.ok) return;
  assert.equal(stay.code, "HARDWARE_NOT_READY");
  assert.equal(k.getState().reservation?.checkinStatus, 0);
  const stock = k.invoke("GET", "/api/v1/security/card-stock", {});
  assert.equal(stock.ok, true);
}

function testEmptyHopper() {
  const k = runtime();
  k.setFaults({ dispenserEmpty: true });
  k.startReservationCheckin();
  k.setQuery("BK80102");
  k.lookup();
  k.captureIdentity("hkid");
  const stay = k.confirmStay();
  assert.equal(stay.ok, false);
  if (stay.ok) return;
  assert.equal(stay.code, "CARD_EMPTY");
}

function testEncodeFailSaga() {
  const k = runtime();
  k.setFaults({ encodeFailNext: true });
  k.startReservationCheckin();
  k.setQuery("BK83099");
  k.lookup();
  k.captureIdentity("passport");
  const stay = k.confirmStay();
  assert.equal(stay.ok, false);
  if (stay.ok) return;
  assert.equal(stay.code, "ENCODE_FAIL");
  const state = k.getState();
  assert.equal(state.lastPayment?.channel, "refund");
  assert.equal(state.reservation?.paymentStatus, "UNPAID");
  assert.equal(state.reservation?.checkinStatus, 0);
  assert.ok(state.lastCard?.recycled);
  assert.ok(state.logs.some((l) => l.eventType === "SAGA_COMPENSATE"));
  assert.ok(state.health.scrapBin >= 1);
}

function testJamSaga() {
  const k = runtime();
  k.setFaults({ dispenserJamNext: true });
  k.startReservationCheckin();
  k.setQuery("BK83099");
  k.lookup();
  k.captureIdentity("hkid");
  const stay = k.confirmStay();
  assert.equal(stay.ok, false);
  if (stay.ok) return;
  assert.equal(stay.code, "CARD_JAM");
  assert.equal(k.getState().lastPayment?.channel, "refund");
}

function testGateClosed() {
  const k = runtime();
  k.startReservationCheckin();
  k.setQuery("BK80102");
  k.lookup();
  const encode = k.invoke("POST", "/api/v1/hal/door-lock/encode", {});
  assert.equal(encode.ok, false);
  if (encode.ok) return;
  assert.equal(encode.code, "GATE_CLOSED");
}

function testFaceMismatch() {
  const k = runtime();
  k.setFaults({ faceMismatch: true });
  k.startReservationCheckin();
  k.setQuery("BK80102");
  k.lookup();
  const id = k.captureIdentity("hkid");
  assert.equal(id.ok, false);
  if (id.ok) return;
  assert.equal(id.code, "FACE_MISMATCH");
}

function testWalkInRequiresNetwork() {
  const k = runtime();
  k.setFaults({ online: false });
  k.startWalkIn();
  k.setQuery("DELUXE_DOUBLE");
  const walk = k.lookup();
  assert.equal(walk.ok, false);
  if (walk.ok) return;
  assert.equal(walk.code, "UNPAID_OFFLINE");
}

function testWalkInOnline() {
  const k = runtime();
  k.startWalkIn();
  k.setQuery("DELUXE_DOUBLE");
  assert.equal(k.lookup().ok, true);
  assert.equal(k.captureIdentity("passport").ok, true);
  const stay = k.confirmStay();
  assert.equal(stay.ok, true);
  assert.equal(k.getState().lastPayment?.channel, "pos");
  assert.equal(k.getState().reservation?.checkinStatus, 2);
}

function testCheckoutOpenBalance() {
  const k = runtime();
  k.startCheckout();
  k.setQuery("BK83099");
  const found = k.lookup();
  assert.equal(found.ok, true);
  const out = k.confirmCheckout();
  assert.equal(out.ok, false);
  if (out.ok) return;
  assert.equal(out.code, "BALANCE_OPEN");
}

function testCheckoutClear() {
  const k = runtime();
  assert.equal(checkinPaid(k, "BK80102").ok, true);
  k.startCheckout();
  k.setQuery("BK80102");
  assert.equal(k.lookup().ok, true);
  const out = k.confirmCheckout();
  assert.equal(out.ok, true);
  assert.equal(k.getState().lastCard?.recycled, true);
}

function testDormTerminal() {
  const k = runtime("KSK-HK-07");
  k.startReservationCheckin();
  k.setQuery("BK7V101");
  assert.equal(k.lookup().ok, true);
  assert.equal(k.getState().reservation?.roomNumber, "V101");
  assert.equal(k.captureIdentity("hkid").ok, true);
  assert.equal(k.confirmStay().ok, true);
  const encoded = k.invoke("GET", "/api/v1/hal/system/health", {});
  assert.equal(encoded.ok, true);
  assert.equal(k.getState().terminal.hardware.cardDispenser.hopperSpring, "low");
}

function testAlreadyCheckedIn() {
  const k = runtime();
  assert.equal(checkinPaid(k).ok, true);
  k.startReservationCheckin();
  k.setQuery("BK80102");
  const again = k.lookup();
  assert.equal(again.ok, false);
  if (again.ok) return;
  assert.equal(again.code, "ALREADY_CHECKED_IN");
}

function testNightshiftMissions() {
  for (const id of KIOSK_MISSION_IDS) {
    switch (id) {
      case "prepaid":
      case "typhoon":
      case "jam":
      case "annex":
      case "free":
        break;
      default:
        exhaustive(id, "kiosk-mission");
    }
  }

  const prepaid = bootMission("prepaid");
  assert.equal(checkinPaid(prepaid.runtime).ok, true);
  const prepaidVerdict = prepaid.mission.judge(prepaid.runtime.getState());
  assert.equal(prepaidVerdict.open, false);
  assert.equal(prepaidVerdict.pass, true);

  const typhoon = bootMission("typhoon");
  typhoon.runtime.startReservationCheckin();
  typhoon.runtime.setQuery("BK83099");
  assert.equal(typhoon.runtime.lookup().ok, true);
  assert.equal(typhoon.runtime.captureIdentity("hkid").ok, true);
  assert.equal(typhoon.runtime.confirmStay().ok, false);
  const typhoonVerdict = typhoon.mission.judge(typhoon.runtime.getState());
  assert.equal(typhoonVerdict.pass, true);
  assert.equal(typhoon.runtime.getState().error?.code, "UNPAID_OFFLINE");

  const typhoonWrong = bootMission("typhoon");
  assert.equal(checkinPaid(typhoonWrong.runtime).ok, true);
  const typhoonFail = typhoonWrong.mission.judge(typhoonWrong.runtime.getState());
  assert.equal(typhoonFail.pass, false);
  assert.equal(typhoonFail.open, false);

  const jam = bootMission("jam");
  jam.runtime.startReservationCheckin();
  jam.runtime.setQuery("BK83099");
  jam.runtime.lookup();
  jam.runtime.captureIdentity("passport");
  assert.equal(jam.runtime.confirmStay().ok, false);
  const jamVerdict = jam.mission.judge(jam.runtime.getState());
  assert.equal(jamVerdict.pass, true);
  assert.equal(jam.runtime.getState().lastPayment?.channel, "refund");

  const annex = bootMission("annex");
  assert.equal(annex.runtime.getState().terminal.terminalId, "KSK-HK-07");
  annex.runtime.startReservationCheckin();
  annex.runtime.setQuery("BK7V101");
  assert.equal(annex.runtime.lookup().ok, true);
  assert.equal(annex.runtime.captureIdentity("hkid").ok, true);
  assert.equal(annex.runtime.confirmStay().ok, true);
  const annexVerdict = annex.mission.judge(annex.runtime.getState());
  assert.equal(annexVerdict.pass, true);
  assert.equal(annex.runtime.getState().lastCard?.roomNumber, "V101");

  const free = bootMission("free");
  assert.equal(checkinPaid(free.runtime).ok, true);
  assert.equal(free.mission.judge(free.runtime.getState()).open, true);

  const first = applyMissionPass(emptyScore(), requireMission("prepaid"));
  assert.equal(first.gained, 150);
  const second = applyMissionPass(first.score, requireMission("prepaid"));
  assert.equal(second.gained, 100);
  assert.equal(applyMissionPass(emptyScore(), requireMission("free")).gained, 0);
  assert.equal(parseNightshiftScore("nope").xp, 0);
  assert.equal(parseNightshiftScore(null).clears.prepaid, undefined);
}

function testExhaustiveStepHelper() {
  const steps: Step[] = [
    "welcome",
    "identify",
    "camera",
    "payment",
    "processing",
    "success",
    "checkoutIdentify",
    "checkoutConfirm",
    "blocked",
    "error",
  ];
  for (const step of steps) {
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
        break;
      default:
        exhaustive(step, "verify-step");
    }
  }
}

function testErrorCodesBound() {
  const codes: KioskErrorCode[] = [
    "NOT_FOUND",
    "ALREADY_CHECKED_IN",
    "HARDWARE_NOT_READY",
    "CARD_EMPTY",
    "CARD_JAM",
    "ENCODE_FAIL",
    "POS_OFFLINE",
    "PMS_OFFLINE",
    "PAYMENT_FAILED",
    "UNPAID_OFFLINE",
    "GATE_CLOSED",
    "IDENTITY_FAIL",
    "FACE_MISMATCH",
    "BALANCE_OPEN",
    "NO_VACANCY",
    "BAD_REQUEST",
    "CONFLICT",
  ];
  const k = runtime();
  k.setLang("en");
  k.startReservationCheckin();
  k.setQuery("NOPE");
  const miss = k.lookup();
  assert.equal(miss.ok, false);
  if (miss.ok) return;
  assert.equal(miss.messageEn, "No booking matches that search");
  assert.ok(codes.includes(miss.code));
}

function main() {
  testPmsPublicRoute();
  testFleet();
  testOpenApi();
  testPrepaidOnline();
  testUnpaidOfflineBlocked();
  testPrepaidOfflineThenSync();
  testSyncConflict();
  testPrePaymentInterlock();
  testEmptyHopper();
  testEncodeFailSaga();
  testJamSaga();
  testGateClosed();
  testFaceMismatch();
  testWalkInRequiresNetwork();
  testWalkInOnline();
  testCheckoutOpenBalance();
  testCheckoutClear();
  testDormTerminal();
  testAlreadyCheckedIn();
  testNightshiftMissions();
  testExhaustiveStepHelper();
  testErrorCodesBound();
  console.log("verify-kiosk: ok");
}

main();
