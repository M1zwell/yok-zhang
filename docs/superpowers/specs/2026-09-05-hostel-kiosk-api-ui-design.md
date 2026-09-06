# Hostel kiosk API + UI design

Date: 2026-09-05  
Status: implemented on this garden as `/PMS` (browser HAL mock). `/kiosk` redirects there.  
Languages: 中文 / English

## Objective / 目标

Design the **self-service hostel kiosk** API and touch UI, grounded in:

1. What could be verified from the NotebookLM / 3-source conversation (the local folder was not on this machine).
2. Public vendor contracts: Cloudbeds API v1.2 kiosk certification, QFPay self-service POS + refund.
3. Explicit **design extensions** where the sources were silent (offline cache, 7-terminal interior room counts).

本机无法打开 `/Users/jubit_nb0/Desktop/hostel PMS`。GitHub `M1zwell` 下也没有 hostel PMS 仓库。因此本规格把「源文件声称的接口」与「厂商公开文档」和「为落地补的设计」分开标注，避免把聊天幻觉写成既成事实。

## Source inventory / 源文件盘点

| Claim | Verdict |
| --- | --- |
| Local path `~/Desktop/hostel PMS` | **Not present** in this cloud workspace; `/Users` does not exist here |
| GitHub copy | **Not found** on public `M1zwell` repos |
| Google Drive | MCP server **needsAuth** — not used |
| 3 NotebookLM sources (2026-09-06) | Recovered only as the user-pasted API list + UI steps |
| Offline SQLite / edge cache | **Not in those sources** (prior chat admitted this) |
| Exact 7-machine room counts besides 30 and 6 | **Not in those sources** |
| Creator K750-B serial protocol | **Not in sources**; public catalogs more often list CRT-730-B / CRT-591. HAL is model-pluggable |
| `proRFL.dll` C exports | **Not in sources**; Cloudbeds marketplace lists a **proUSB** lock integration that talks HTTPS to Cloudbeds, which is a *different* path from local DLL encode |

### Notebook-attributed kiosk facade (kept)

Six modules, guest-facing on the IPC:

- HAL: card issue, lock encode, POS pay, camera capture, health
- Security: pre-payment check, card stock
- Workflow: walk-in, reservation check-in, gate-control, checkout
- Identity: OCR, face-match, stub-archive
- Payment: aggregate-pay, saga-compensate
- PMS: house-account, room-assignment, upsell-rates

### Added because Cloudbeds kiosk certification requires it

- `GET /api/v1/pms/reservations` → `getReservations` / `thirdPartyIdentifier`
- Guest document upload mapping → `putGuest` + `postGuestDocument`
- Checkout only if folio is clear → `getReservationInvoiceInformation`

### Design extensions (labeled in OpenAPI)

- `POST /api/v1/pms/sync-offline`
- `GET /api/v1/terminals`
- Door-lock erase before recycle
- Fleet JSON for 7 machines (30 / 24 / 18 / 16 / 12 / 8 / 6) — **interior sizes are defaults pending property survey**

## Approaches considered / 方案

**A. Windows IPC hosts REST; React kiosk is a WebView.**  
Closest to production. Needs `proRFL.dll`, Creator COM, QFPay ECR on the real PC.

**B. Static garden simulator: one TypeScript engine, no Node server.**  
Chosen for this repo (`output: "export"`). The same engine is the contract tests + the `/PMS` UI. Production later swaps mock HAL adapters for Win32.

**C. Full Cloudbeds + QFPay live sandbox in this garden.**  
Rejected: this site has no backend, no secrets, and must not mint merchant keys.

Recommendation: **B now, A later.** The OpenAPI document is the seam.

## Architecture / 架构

```text
[Guest touch UI]  React /PMS
        |  invoke(method, path, body)
[KioskRuntime]    lib/kiosk/engine.ts
        |-- HAL mock (K750-B, proRFL.dll, UVC)
        |-- Security interlock
        |-- Identity gate (fail-closed)
        |-- QFPay POS + /trade/v1/refund saga
        |-- Cloudbeds v1.2 map (assign / putReservation / folio)
        |-- Local reservation table (offline status 0/1/2)
[Fleet JSON]      7 terminals, lock_code = BB FF RR
```

### Interlock / 互锁

1. `pre-payment-check` — hopper not empty, lock encoder USB up. Fail → **no POS**.
2. Identity stub archived → `gate-control` opens. Fail → **no encode**.
3. Encode **then** issue. Encode/jam fail → recycle to scrap + QFPay refund (`syssn`) + release room.
4. Offline: prepaid may encode from cache; unpaid / walk-in blocked.
5. WAN return: replay `checkin_status=1`; Cloudbeds occupancy conflict → `SYNC_CONFLICT`, do not clobber PMS.

### QFPay (public docs)

Unattended kiosk: POS API (card / Octopus) and optional MPM QR. Confirm via async notification **and** transaction enquiry before dispensing. Refund: `POST /trade/v1/refund` with original `syssn`. Same-day card refunds void.

### Cloudbeds v1.2 (public docs)

Kiosk certification: confirmed reservations only; `putReservation checked_in`; assign via `postRoomAssign` if needed; housekeeping status; checkout requires zero invoice balance; guest documents via `putGuest` / `postGuestDocument`.

## UI / 界面

Kiosk-first (not garden chrome): 繁體 / EN, 56px+ targets, on-screen keyboard, scan-frame pulse, folio card, giant room number, HAL footer.

Steps: welcome → identify → camera → payment → processing → success. Checkout is a short sibling. Blocked/error send unpaid-offline and hardware faults to the desk.

Demo operator strip (not production): terminal switch, WAN, jam, encode fail, empty hopper, lock DLL, room 802 conflict, sync.

## Verification / 如何验收

- `npm run verify:kiosk` — fleet counts, OpenAPI coverage, prepaid, unpaid-offline, saga refund, gate-closed, dorm terminal KSK-HK-07, sync conflict.
- `python3 scripts/kiosk_sync_mock.py` — SQLite companion (not the source of truth).
- Open `/PMS` and walk BK80102 (prepaid) and BK83099 with encode-fail (refund).

## Production host notes / 工控机落地（未在本仓库实现 DLL）

The Windows host should expose the same `/api/v1/*` facade. Bind:

- Creator hopper IR → `card-stock`
- `proRFL.dll` write after the belt seats the card on the RF station
- QFPay ECR HTTPS
- Cloudbeds OAuth `write:reservation write:room write:guest write:payment`

Do not encode before `gate-control`. Do not charge before `pre-payment-check`.
