import type { HardwareConfig, LocalReservation, RoomType, RoomUnit, TerminalConfig } from "./types";

function pad(n: number, width = 2): string {
  return String(n).padStart(width, "0");
}

export function lockCode(building: number, floor: number, roomOnFloor: number): string {
  return `${pad(building)}${pad(floor)}${pad(roomOnFloor)}`;
}

function dispenser(ipHost: number, hopperSpring: "high" | "low", stockCapacity: number): HardwareConfig {
  return {
    cardDispenser: {
      model: "Creator-K750-B",
      comPort: "COM3",
      baudRate: 9600,
      timeoutMs: 5000,
      hopperSpring,
      stockCapacity,
    },
    doorLockEncoder: {
      dllName: "proRFL.dll",
      connectionType: "USB",
      encoderModel: hopperSpring === "low" ? "ProUSB-RF-Dorm" : "ProUSB-RF-01",
      lockBrand: hopperSpring === "low" ? "ProUSB-Dorm" : "ProUSB-RF",
    },
    paymentTerminal: {
      model: "QFPay-POS-T1",
      connection: "LAN",
      ipAddress: `192.168.1.${100 + ipHost}`,
      port: 8800,
    },
    camera: {
      model: "UVC-Binocular",
      liveness: true,
    },
  };
}

type Seed = {
  terminalId: string;
  location: string;
  propertyName: string;
  building: number;
  roomCount: number;
  startRoom: number;
  floor: number;
  hopperSpring: "high" | "low";
  stockCapacity: number;
  dorm?: boolean;
};

/**
 * Fleet room counts are a design default.
 * Source material only attested the range 30 … 6 across 7 machines,
 * not the five interior sizes. Replace after the property survey.
 */
const SEEDS: Seed[] = [
  {
    terminalId: "KSK-HK-01",
    location: "Main-Lobby-Left",
    propertyName: "Harbour Stack Hostel — Main",
    building: 1,
    roomCount: 30,
    startRoom: 801,
    floor: 8,
    hopperSpring: "high",
    stockCapacity: 80,
  },
  {
    terminalId: "KSK-HK-02",
    location: "Main-Lobby-Right",
    propertyName: "Harbour Stack Hostel — Main",
    building: 1,
    roomCount: 24,
    startRoom: 601,
    floor: 6,
    hopperSpring: "high",
    stockCapacity: 60,
  },
  {
    terminalId: "KSK-HK-03",
    location: "Annex-Lift-L1",
    propertyName: "Harbour Stack Annex",
    building: 2,
    roomCount: 18,
    startRoom: 401,
    floor: 4,
    hopperSpring: "high",
    stockCapacity: 45,
  },
  {
    terminalId: "KSK-HK-04",
    location: "Staff-Night-Desk",
    propertyName: "Mong Kok Capsule",
    building: 3,
    roomCount: 16,
    startRoom: 301,
    floor: 3,
    hopperSpring: "high",
    stockCapacity: 40,
  },
  {
    terminalId: "KSK-HK-05",
    location: "Side-Street-Entry",
    propertyName: "Yau Ma Tei Walk-up",
    building: 4,
    roomCount: 12,
    startRoom: 201,
    floor: 2,
    hopperSpring: "high",
    stockCapacity: 30,
  },
  {
    terminalId: "KSK-HK-06",
    location: "Rooftop-Pod-Hall",
    propertyName: "Jordan Pods",
    building: 5,
    roomCount: 8,
    startRoom: 101,
    floor: 1,
    hopperSpring: "low",
    stockCapacity: 24,
  },
  {
    terminalId: "KSK-HK-07",
    location: "Annex-Villa-Entrance",
    propertyName: "Sai Kung Annex Villa",
    building: 7,
    roomCount: 6,
    startRoom: 1,
    floor: 1,
    hopperSpring: "low",
    stockCapacity: 18,
    dorm: true,
  },
];

function roomTypeFor(index: number, roomNumber: string): RoomType {
  if (roomNumber.endsWith("30") || roomNumber.endsWith("00")) return "EXECUTIVE_SUITE";
  if (index % 7 === 0) return "TWIN";
  if (index % 11 === 0) return "POD";
  return "DELUXE_DOUBLE";
}

function privateMatrix(seed: Seed): RoomUnit[] {
  const rooms: RoomUnit[] = [];
  for (let i = 0; i < seed.roomCount; i += 1) {
    const num = seed.startRoom + i;
    const roomNumber = String(num);
    const roomOnFloor = num % 100;
    rooms.push({
      pmsRoomId: `cb_${seed.terminalId}_${roomNumber}`,
      roomNumber,
      roomType: roomTypeFor(i, roomNumber),
      lockCode: lockCode(seed.building, seed.floor, roomOnFloor),
      floor: seed.floor,
    });
  }
  return rooms;
}

function villaDormMatrix(seed: Seed): RoomUnit[] {
  const door201 = lockCode(seed.building, 2, 1);
  const door202 = lockCode(seed.building, 2, 2);
  return [
    {
      pmsRoomId: `cb_${seed.terminalId}_V101`,
      roomNumber: "V101",
      roomType: "PREMIUM_VILLA",
      lockCode: lockCode(seed.building, 1, 1),
      floor: 1,
    },
    {
      pmsRoomId: `cb_${seed.terminalId}_V102`,
      roomNumber: "V102",
      roomType: "PREMIUM_VILLA",
      lockCode: lockCode(seed.building, 1, 2),
      floor: 1,
    },
    {
      pmsRoomId: `cb_${seed.terminalId}_D201A`,
      roomNumber: "D201-A",
      roomType: "DORM_BED",
      lockCode: lockCode(seed.building, 2, 11),
      sharedDoorLock: door201,
      bedId: "BED_A",
      floor: 2,
    },
    {
      pmsRoomId: `cb_${seed.terminalId}_D201B`,
      roomNumber: "D201-B",
      roomType: "DORM_BED",
      lockCode: lockCode(seed.building, 2, 12),
      sharedDoorLock: door201,
      bedId: "BED_B",
      floor: 2,
    },
    {
      pmsRoomId: `cb_${seed.terminalId}_D202A`,
      roomNumber: "D202-A",
      roomType: "DORM_BED",
      lockCode: lockCode(seed.building, 2, 21),
      sharedDoorLock: door202,
      bedId: "BED_A",
      floor: 2,
    },
    {
      pmsRoomId: `cb_${seed.terminalId}_D202B`,
      roomNumber: "D202-B",
      roomType: "DORM_BED",
      lockCode: lockCode(seed.building, 2, 22),
      sharedDoorLock: door202,
      bedId: "BED_B",
      floor: 2,
    },
  ];
}

function buildTerminal(seed: Seed): TerminalConfig {
  const roomMatrix = seed.dorm ? villaDormMatrix(seed) : privateMatrix(seed);
  return {
    terminalId: seed.terminalId,
    location: seed.location,
    propertyName: seed.propertyName,
    building: seed.building,
    roomCount: roomMatrix.length,
    hardware: dispenser(seed.building, seed.hopperSpring, seed.stockCapacity),
    roomMatrix,
  };
}

export const terminals: TerminalConfig[] = SEEDS.map(buildTerminal);

export const defaultTerminalId = "KSK-HK-01";

export function terminalById(id: string): TerminalConfig | undefined {
  return terminals.find((t) => t.terminalId === id);
}

export function requireTerminal(id: string): TerminalConfig {
  const found = terminalById(id);
  if (!found) throw new Error(`unknown terminal ${id}`);
  return found;
}

const RATE_CENTS: Record<RoomType, number> = {
  DELUXE_DOUBLE: 85000,
  TWIN: 72000,
  EXECUTIVE_SUITE: 168000,
  PREMIUM_VILLA: 220000,
  DORM_BED: 28000,
  POD: 36000,
};

export function nightlyRate(type: RoomType): number {
  return RATE_CENTS[type];
}

type GuestSeed = {
  bookingRef: string;
  guestName: string;
  guestNameEn: string;
  phone: string;
  idHint: string;
  roomIndex: number;
  paid: boolean;
  nights: number;
};

const GUESTS: Record<string, GuestSeed[]> = {
  "KSK-HK-01": [
    {
      bookingRef: "BK80102",
      guestName: "張小明",
      guestNameEn: "Cheung Siu Ming",
      phone: "51230102",
      idHint: "A123456(7)",
      roomIndex: 0,
      paid: true,
      nights: 2,
    },
    {
      bookingRef: "BK80205",
      guestName: "陳美麗",
      guestNameEn: "Chan Mei Lai",
      phone: "61230205",
      idHint: "B987654(3)",
      roomIndex: 1,
      paid: true,
      nights: 1,
    },
    {
      bookingRef: "BK83099",
      guestName: "李大華",
      guestNameEn: "Lee Tai Wah",
      phone: "91233099",
      idHint: "C112233(4)",
      roomIndex: 29,
      paid: false,
      nights: 3,
    },
  ],
  "KSK-HK-07": [
    {
      bookingRef: "BK7V101",
      guestName: "黃雅文",
      guestNameEn: "Wong Nga Man",
      phone: "55571001",
      idHint: "K778899(1)",
      roomIndex: 0,
      paid: true,
      nights: 2,
    },
    {
      bookingRef: "BK7D201",
      guestName: "森本悠",
      guestNameEn: "Morimoto Yu",
      phone: "55571002",
      idHint: "TR1234567",
      roomIndex: 2,
      paid: false,
      nights: 1,
    },
  ],
};

function isoDay(offset: number, hour: number): string {
  const d = new Date(Date.UTC(2026, 8, 5 + offset, hour, 0, 0));
  return d.toISOString().replace("T", " ").slice(0, 19);
}

function reservationFrom(terminal: TerminalConfig, guest: GuestSeed): LocalReservation {
  const room = terminal.roomMatrix[guest.roomIndex] ?? terminal.roomMatrix[0];
  const amount = nightlyRate(room.roomType) * guest.nights;
  return {
    bookingRef: guest.bookingRef,
    pmsReservationId: `cbres_${guest.bookingRef}`,
    guestName: guest.guestName,
    guestNameEn: guest.guestNameEn,
    phone: guest.phone,
    idHint: guest.idHint,
    roomNumber: room.roomNumber,
    lockCode: room.lockCode,
    bedId: room.bedId,
    roomType: room.roomType,
    checkInTime: isoDay(0, 6),
    checkOutTime: isoDay(guest.nights, 4),
    nights: guest.nights,
    amountHkdCents: amount,
    paymentStatus: guest.paid ? "PAID" : "UNPAID",
    checkinStatus: 0,
    pmsRoomId: room.pmsRoomId,
    terminalId: terminal.terminalId,
  };
}

export function seedReservations(terminal: TerminalConfig): LocalReservation[] {
  const listed = GUESTS[terminal.terminalId];
  if (listed) return listed.map((g) => reservationFrom(terminal, g));
  const first = terminal.roomMatrix[0];
  const last = terminal.roomMatrix[terminal.roomMatrix.length - 1];
  const paid: GuestSeed = {
    bookingRef: `BK${terminal.building}${first.roomNumber}`,
    guestName: "測試住客",
    guestNameEn: "Test Guest",
    phone: `5${pad(terminal.building, 3)}0001`,
    idHint: "T000001(1)",
    roomIndex: 0,
    paid: true,
    nights: 1,
  };
  const unpaid: GuestSeed = {
    bookingRef: `BK${terminal.building}${last.roomNumber}`,
    guestName: "未付住客",
    guestNameEn: "Unpaid Guest",
    phone: `9${pad(terminal.building, 3)}0002`,
    idHint: "U000002(2)",
    roomIndex: terminal.roomMatrix.length - 1,
    paid: false,
    nights: 1,
  };
  return [reservationFrom(terminal, paid), reservationFrom(terminal, unpaid)];
}

export function fleetSummary(): { terminalId: string; rooms: number; location: string }[] {
  return terminals.map((t) => ({
    terminalId: t.terminalId,
    rooms: t.roomCount,
    location: t.location,
  }));
}
