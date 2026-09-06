"""
Mock SQLite cache + Cloudbeds replay for a kiosk IPC.

This is a companion to lib/kiosk/engine.ts (the source of truth).
It demonstrates the offline check-in / sync-conflict path on a laptop
without Windows HAL or a live Cloudbeds property.
"""

from __future__ import annotations

import sqlite3
from dataclasses import dataclass
from datetime import datetime

DB_FILE = "kiosk_local.db"


@dataclass
class NetworkManager:
    online: bool = True

    def set_online_status(self, status: bool) -> None:
        self.online = status
        label = "ONLINE" if status else "OFFLINE"
        print(f"\n[NETWORK] {label}")

    def is_online(self) -> bool:
        return self.online


class MockCloudbedsPMS:
    def __init__(self) -> None:
        self.cloud_occupied_rooms = ["802"]

    def checkin_guest(self, booking_ref: str, room_number: str) -> bool:
        if room_number in self.cloud_occupied_rooms:
            print(f"[Cloudbeds] CONFLICT room {room_number}")
            return False
        print(f"[Cloudbeds] checkin {booking_ref} -> {room_number}")
        return True


def init_db() -> None:
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS local_reservations (
            booking_ref TEXT PRIMARY KEY,
            guest_name TEXT NOT NULL,
            id_card_no TEXT,
            room_number TEXT NOT NULL,
            lock_code TEXT NOT NULL,
            check_in_time TEXT NOT NULL,
            check_out_time TEXT NOT NULL,
            payment_status TEXT NOT NULL,
            checkin_status INTEGER DEFAULT 0,
            local_checkin_timestamp TEXT
        )
        """
    )
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS local_sync_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            booking_ref TEXT NOT NULL,
            event_type TEXT NOT NULL,
            details TEXT,
            timestamp TEXT NOT NULL
        )
        """
    )
    cursor.execute("DELETE FROM local_reservations")
    cursor.execute("DELETE FROM local_sync_logs")
    cursor.executemany(
        """
        INSERT INTO local_reservations
        (booking_ref, guest_name, id_card_no, room_number, lock_code, check_in_time, check_out_time, payment_status, checkin_status, local_checkin_timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        [
            ("BK80102", "張小明", "A123456789", "801", "010801", "2026-09-05 14:00:00", "2026-09-07 12:00:00", "PAID", 0, None),
            ("BK80205", "陳美麗", "B987654321", "802", "010802", "2026-09-05 14:00:00", "2026-09-06 12:00:00", "PAID", 0, None),
            ("BK83099", "李大華", "C112233445", "830", "010830", "2026-09-05 15:00:00", "2026-09-08 12:00:00", "UNPAID", 0, None),
        ],
    )
    conn.commit()
    conn.close()
    print("[INIT] sqlite ready")


def run_offline_checkin(booking_ref: str, net_mgr: NetworkManager) -> None:
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT guest_name, room_number, lock_code, payment_status, checkin_status FROM local_reservations WHERE booking_ref = ?",
        (booking_ref,),
    )
    row = cursor.fetchone()
    if not row:
        print(f"[CHECK-IN] missing {booking_ref}")
        conn.close()
        return
    guest_name, room_number, lock_code, payment_status, checkin_status = row
    if checkin_status > 0:
        print("[CHECK-IN] already done")
        conn.close()
        return
    if not net_mgr.is_online():
        if payment_status == "UNPAID":
            print(f"[CHECK-IN] block unpaid {booking_ref} while offline")
            conn.close()
            return
        timestamp = datetime.now().isoformat()
        cursor.execute(
            "UPDATE local_reservations SET checkin_status = 1, local_checkin_timestamp = ? WHERE booking_ref = ?",
            (timestamp, booking_ref),
        )
        cursor.execute(
            "INSERT INTO local_sync_logs (booking_ref, event_type, details, timestamp) VALUES (?, 'OFFLINE_CHECKIN', ?, ?)",
            (booking_ref, f"{room_number}/{lock_code}", timestamp),
        )
        conn.commit()
        print(f"[SUCCESS] offline card {guest_name} {room_number}")
    else:
        timestamp = datetime.now().isoformat()
        cursor.execute(
            "UPDATE local_reservations SET checkin_status = 2, local_checkin_timestamp = ? WHERE booking_ref = ?",
            (timestamp, booking_ref),
        )
        conn.commit()
        print("[SUCCESS] online check-in")
    conn.close()


def run_automatic_sync(net_mgr: NetworkManager, pms: MockCloudbedsPMS) -> None:
    if not net_mgr.is_online():
        print("[SYNC] still offline")
        return
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT booking_ref, guest_name, room_number, local_checkin_timestamp FROM local_reservations WHERE checkin_status = 1"
    )
    pending = cursor.fetchall()
    for ref, name, room, local_time in pending:
        ok = pms.checkin_guest(ref, room)
        timestamp = datetime.now().isoformat()
        if ok:
            cursor.execute("UPDATE local_reservations SET checkin_status = 2 WHERE booking_ref = ?", (ref,))
            cursor.execute(
                "INSERT INTO local_sync_logs (booking_ref, event_type, details, timestamp) VALUES (?, 'SYNC_SUCCESS', ?, ?)",
                (ref, str(local_time), timestamp),
            )
        else:
            cursor.execute(
                "INSERT INTO local_sync_logs (booking_ref, event_type, details, timestamp) VALUES (?, 'SYNC_CONFLICT', ?, ?)",
                (ref, f"{name} holds {room}", timestamp),
            )
    conn.commit()
    conn.close()
    print("[SYNC] done")


if __name__ == "__main__":
    init_db()
    net = NetworkManager()
    pms = MockCloudbedsPMS()
    net.set_online_status(True)
    run_offline_checkin("BK80102", net)
    net.set_online_status(False)
    run_offline_checkin("BK80205", net)
    run_offline_checkin("BK83099", net)
    net.set_online_status(True)
    conn = sqlite3.connect(DB_FILE)
    conn.execute("UPDATE local_reservations SET checkin_status = 1 WHERE booking_ref = 'BK80102'")
    conn.commit()
    conn.close()
    run_automatic_sync(net, pms)
