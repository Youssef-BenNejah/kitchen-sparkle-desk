export interface ServerAlert {
  id: string;
  type: "critical" | "warning";
  message: string;
  time: string;
  videoUrl?: string;
  videoThumb?: string;
}

export interface TableStatus {
  id: number;
  x: number;
  y: number;
  status: "free" | "occupied" | "visited" | "waiting";
  waitMinutes?: number;
}

export interface SpeedPoint {
  time: string;
  value: number;
}

export interface Server {
  id: string;
  name: string;
  avatar: string;
  camera: string;
  arrivalTime: string;
  serviceDuration: string;
  score: number;
  speedScore: number;
  reactivityScore: number;
  coverageScore: number;
  standingScore: number;
  speed: number; // px/frame
  speedLabel: "Rapide" | "Normal" | "Lent";
  tablesVisited: number;
  totalTables: number;
  avgResponseTime: number; // minutes
  standingPercent: number;
  recognitionScore: number;
  lastZone: string;
  alerts: ServerAlert[];
  speedHistory: SpeedPoint[];
  activityBySlot: { slot: string; activity: number }[];
  position: { x: number; y: number };
  color: string;
}

export const tables: TableStatus[] = [
  { id: 1,  x: 12,  y: 15, status: "visited",  waitMinutes: 0  },
  { id: 2,  x: 12,  y: 38, status: "occupied",  waitMinutes: 3  },
  { id: 3,  x: 12,  y: 60, status: "free"                       },
  { id: 4,  x: 12,  y: 80, status: "waiting",   waitMinutes: 12 },
  { id: 5,  x: 38,  y: 15, status: "visited",   waitMinutes: 0  },
  { id: 6,  x: 38,  y: 38, status: "visited",   waitMinutes: 0  },
  { id: 7,  x: 38,  y: 60, status: "free"                       },
  { id: 8,  x: 38,  y: 80, status: "occupied",  waitMinutes: 6  },
  { id: 9,  x: 63,  y: 15, status: "free"                       },
  { id: 10, x: 63,  y: 38, status: "visited",   waitMinutes: 0  },
  { id: 11, x: 63,  y: 60, status: "occupied",  waitMinutes: 4  },
  { id: 12, x: 63,  y: 80, status: "free"                       },
  { id: 13, x: 85,  y: 25, status: "visited",   waitMinutes: 0  },
  { id: 14, x: 85,  y: 55, status: "waiting",   waitMinutes: 11 },
  { id: 15, x: 85,  y: 78, status: "free"                       },
];

export const servers: Server[] = [
  {
    id: "srv-1",
    name: "x",
    avatar: "X",
    camera: "CAM-02",
    arrivalTime: "19:00",
    serviceDuration: "1h 42m",
    score: 87,
    speedScore: 91,
    reactivityScore: 85,
    coverageScore: 88,
    standingScore: 80,
    speed: 3.2,
    speedLabel: "Rapide",
    tablesVisited: 11,
    totalTables: 15,
    avgResponseTime: 1.8,
    standingPercent: 93,
    recognitionScore: 98,
    lastZone: "Zone B - Centre",
    alerts: [],
    position: { x: 42, y: 35 },
    color: "#F59E0B",
    speedHistory: [
      { time: "19:00", value: 72 }, { time: "19:15", value: 80 },
      { time: "19:30", value: 85 }, { time: "19:45", value: 88 },
      { time: "20:00", value: 91 }, { time: "20:15", value: 87 },
      { time: "20:30", value: 85 }, { time: "20:45", value: 87 },
    ],
    activityBySlot: [
      { slot: "19:00", activity: 72 }, { slot: "19:15", activity: 81 },
      { slot: "19:30", activity: 88 }, { slot: "19:45", activity: 90 },
      { slot: "20:00", activity: 94 }, { slot: "20:15", activity: 87 },
      { slot: "20:30", activity: 85 }, { slot: "20:45", activity: 87 },
    ],
  },
  {
    id: "srv-2",
    name: "y",
    avatar: "Y",
    camera: "CAM-04",
    arrivalTime: "19:00",
    serviceDuration: "1h 42m",
    score: 61,
    speedScore: 58,
    reactivityScore: 65,
    coverageScore: 60,
    standingScore: 72,
    speed: 1.9,
    speedLabel: "Normal",
    tablesVisited: 7,
    totalTables: 15,
    avgResponseTime: 4.2,
    standingPercent: 81,
    recognitionScore: 94,
    lastZone: "Zone A - Entrée",
    alerts: [
      { id: "a1", type: "warning", message: "Réactivité faible : 4.2 min en moyenne", time: "20:38", videoUrl: "#incident-a1", videoThumb: "CAM-04 · 20:38" },
      { id: "a2", type: "warning", message: "Couverture faible : 47% des tables", time: "20:25", videoUrl: "#incident-a2", videoThumb: "CAM-04 · 20:25" },
    ],
    position: { x: 18, y: 62 },
    color: "#60A5FA",
    speedHistory: [
      { time: "19:00", value: 55 }, { time: "19:15", value: 60 },
      { time: "19:30", value: 65 }, { time: "19:45", value: 62 },
      { time: "20:00", value: 58 }, { time: "20:15", value: 61 },
      { time: "20:30", value: 59 }, { time: "20:45", value: 61 },
    ],
    activityBySlot: [
      { slot: "19:00", activity: 55 }, { slot: "19:15", activity: 62 },
      { slot: "19:30", activity: 68 }, { slot: "19:45", activity: 64 },
      { slot: "20:00", activity: 60 }, { slot: "20:15", activity: 63 },
      { slot: "20:30", activity: 61 }, { slot: "20:45", activity: 63 },
    ],
  },
  {
    id: "srv-3",
    name: "z",
    avatar: "Z",
    camera: "CAM-01",
    arrivalTime: "19:15",
    serviceDuration: "1h 27m",
    score: 28,
    speedScore: 22,
    reactivityScore: 30,
    coverageScore: 35,
    standingScore: 45,
    speed: 0.6,
    speedLabel: "Lent",
    tablesVisited: 3,
    totalTables: 15,
    avgResponseTime: 8.5,
    standingPercent: 62,
    recognitionScore: 91,
    lastZone: "Zone D - Bar",
    alerts: [
      { id: "a3", type: "critical", message: "Inactivité détectée : 3min 12s sans mouvement", time: "20:41", videoUrl: "#incident-a3", videoThumb: "CAM-01 · 20:41" },
      { id: "a4", type: "critical", message: "Table 4 non servie depuis 12 minutes", time: "20:30", videoUrl: "#incident-a4", videoThumb: "CAM-01 · 20:30" },
      { id: "a5", type: "warning",  message: "Score d'efficacité < 40 depuis 35 min", time: "20:07", videoUrl: "#incident-a5", videoThumb: "CAM-01 · 20:07" },
    ],
    position: { x: 80, y: 78 },
    color: "#F87171",
    speedHistory: [
      { time: "19:15", value: 35 }, { time: "19:30", value: 40 },
      { time: "19:45", value: 32 }, { time: "20:00", value: 28 },
      { time: "20:15", value: 25 }, { time: "20:30", value: 22 },
      { time: "20:45", value: 28 },
    ],
    activityBySlot: [
      { slot: "19:15", activity: 38 }, { slot: "19:30", activity: 42 },
      { slot: "19:45", activity: 35 }, { slot: "20:00", activity: 30 },
      { slot: "20:15", activity: 27 }, { slot: "20:30", activity: 24 },
      { slot: "20:45", activity: 28 },
    ],
  },
];

export const globalStats = {
  activeServers: 3,
  totalClients: 31,
  tablesOccupied: 7,
  totalTables: 15,
  avgWaitTime: 2.8,
  serviceStart: "19:00",
  currentTime: "20:42",
};
