/**
 * BHOO-MITRA AI — 3D Urban Digital Twin & Dynamic City Dataset
 * Realistic dynamic dataset of 3D buildings, parcels, variable floor plans, rooms, and multi-source cadastral records.
 */

import {
  ThreeDParcel,
  ThreeDBuilding,
  ThreeDSourceRepresentation,
  FloorInfo,
  RoomInfo,
  LandUseCategory,
  PropertyStatus,
} from "@/lib/maps/cesium/types";

/**
 * Generates dynamic floor and room data for any building based on floor count and usage.
 */
export function generateBuildingFloors(floorCount: number, usage: string): FloorInfo[] {
  const result: FloorInfo[] = [];

  const usageRoomTemplates: Record<string, { types: string[]; names: string[] }> = {
    Commercial: {
      types: ["Executive Suite", "Office Space", "Meeting Room", "Conference Hall", "Restroom", "Pantry"],
      names: ["Office Suite", "Open Workspace", "Boardroom", "Client Lounge", "Services", "Staff Hub"],
    },
    Institutional: {
      types: ["Administrative Office", "Archive Room", "Public Service Counter", "Meeting Hall", "Server Room"],
      names: ["Records Registry", "Citizen Service Wing", "Committee Chamber", "Directorate", "Data Center"],
    },
    Residential: {
      types: ["Apartment Unit", "Master Suite", "Balcony Lounge", "Fitness Studio", "Utility Area"],
      names: ["Flat A", "Flat B", "Penthouse Deck", "Clubhouse", "Storage"],
    },
    Mixed: {
      types: ["Retail Store", "Office Space", "Dining Area", "Wellness Center", "Utilities"],
      names: ["Retail Outlet", "Corporate Suite", "Food Court", "Gym", "Power Station"],
    },
  };

  const template = usageRoomTemplates[usage] || usageRoomTemplates["Commercial"]!;

  for (let f = floorCount; f >= 1; f--) {
    const isTop = f === floorCount;
    const floorLabel = `${f}F`;
    const floorArea = Math.round(750 + ((f * 137) % 400));

    const roomCount = 3 + (f % 3);
    const rooms: RoomInfo[] = [];
    const baseRoomArea = Math.round(floorArea / roomCount);

    for (let r = 0; r < roomCount; r++) {
      const charCode = String.fromCharCode(65 + r);
      const roomId = `${f}${charCode}`;
      const type = isTop && r === 0 ? "Executive Boardroom" : template.types[r % template.types.length]!;
      const name = `${template.names[r % template.names.length]} ${roomId}`;
      const area = Math.round(baseRoomArea * (0.8 + (r * 0.15)));

      rooms.push({
        id: roomId,
        name,
        type,
        area,
        status: r === 0 ? "Active" : r % 2 === 0 ? "Occupied" : "Vacant",
      });
    }

    result.push({
      floorNumber: f,
      label: floorLabel,
      usage: isTop ? "Executive & Boardroom" : f === 1 ? "Reception & Public Lobby" : `${usage} Suites`,
      area: floorArea,
      heightOffset: (f - 1) * 3.5,
      rooms,
    });
  }

  // Ground Floor
  result.push({
    floorNumber: 0,
    label: "G",
    usage: "Parking & Building Infrastructure",
    area: Math.round(result[result.length - 1]?.area || 850),
    heightOffset: 0,
    rooms: [
      { id: "G-A", name: "EV Parking & Valet", type: "Vehicle Parking", area: 450, status: "Active" },
      { id: "G-B", name: "HVAC & Electrical Substation", type: "Building Utility", area: 220, status: "Active" },
      { id: "G-C", name: "Loading Dock & Freight", type: "Logistics", area: 180, status: "Occupied" },
    ],
  });

  return result;
}

export const MOCK_BUILDING_FLOORS = generateBuildingFloors(5, "Commercial");

// Comprehensive dynamic dictionary of all city buildings
export interface DynamicCityBuilding {
  id: string;
  buildingId: string;
  parcelId: string;
  type: string;
  height: number;
  floors: number;
  builtUpArea: number;
  color: string;
  status: string;
  floorData: FloorInfo[];
  centroid: { x: number; y: number };
  svgPoints: string;
}

export const CITY_BUILDINGS_CATALOG: Record<string, DynamicCityBuilding> = {
  "B-10482": {
    id: "B-10482",
    buildingId: "B-10482",
    parcelId: "P-10482",
    type: "Commercial",
    height: 18.5,
    floors: 5,
    builtUpArea: 4850,
    color: "#00ffff",
    status: "Matched (3 sources)",
    floorData: generateBuildingFloors(5, "Commercial"),
    centroid: { x: 495, y: 440 },
    svgPoints: "450,440 500,410 545,440 495,470",
  },
  "B-10483": {
    id: "B-10483",
    buildingId: "B-10483",
    parcelId: "P-10483",
    type: "Commercial",
    height: 24.0,
    floors: 7,
    builtUpArea: 6300,
    color: "#f59e0b",
    status: "Minor Discrepancy (2m²)",
    floorData: generateBuildingFloors(7, "Commercial"),
    centroid: { x: 585, y: 370 },
    svgPoints: "560,355 605,330 640,350 595,375",
  },
  "B-10481": {
    id: "B-10481",
    buildingId: "B-10481",
    parcelId: "P-10481",
    type: "Institutional",
    height: 12.0,
    floors: 3,
    builtUpArea: 2400,
    color: "#c084fc",
    status: "Verified Clear",
    floorData: generateBuildingFloors(3, "Institutional"),
    centroid: { x: 405, y: 380 },
    svgPoints: "380,360 420,338 450,355 410,377",
  },
  "B-10484": {
    id: "B-10484",
    buildingId: "B-10484",
    parcelId: "P-10484",
    type: "Residential",
    height: 9.5,
    floors: 2,
    builtUpArea: 1800,
    color: "#34d399",
    status: "Matched (2 sources)",
    floorData: generateBuildingFloors(2, "Residential"),
    centroid: { x: 675, y: 445 },
    svgPoints: "650,425 690,400 725,425 685,450",
  },
  "B-10485": {
    id: "B-10485",
    buildingId: "B-10485",
    parcelId: "P-10485",
    type: "Commercial",
    height: 32.0,
    floors: 9,
    builtUpArea: 8640,
    color: "#38bdf8",
    status: "Geometry Conflict (90m²)",
    floorData: generateBuildingFloors(9, "Commercial"),
    centroid: { x: 260, y: 310 },
    svgPoints: "220,280 280,250 330,270 270,300",
  },
  "B-10486": {
    id: "B-10486",
    buildingId: "B-10486",
    parcelId: "P-10486",
    type: "Institutional",
    height: 14.5,
    floors: 4,
    builtUpArea: 3200,
    color: "#a78bfa",
    status: "Verified Clear",
    floorData: generateBuildingFloors(4, "Institutional"),
    centroid: { x: 380, y: 260 },
    svgPoints: "340,230 400,200 450,220 390,250",
  },
  "B-10487": {
    id: "B-10487",
    buildingId: "B-10487",
    parcelId: "P-10487",
    type: "Residential",
    height: 28.0,
    floors: 8,
    builtUpArea: 7200,
    color: "#fb923c",
    status: "Harmonized",
    floorData: generateBuildingFloors(8, "Residential"),
    centroid: { x: 800, y: 280 },
    svgPoints: "760,250 820,220 870,240 810,270",
  },
  "B-10488": {
    id: "B-10488",
    buildingId: "B-10488",
    parcelId: "P-10488",
    type: "Commercial",
    height: 16.0,
    floors: 4,
    builtUpArea: 3800,
    color: "#2dd4bf",
    status: "Matched (3 sources)",
    floorData: generateBuildingFloors(4, "Commercial"),
    centroid: { x: 770, y: 440 },
    svgPoints: "720,410 790,370 850,400 780,440",
  },
  "B-10489": {
    id: "B-10489",
    buildingId: "B-10489",
    parcelId: "P-10489",
    type: "Mixed",
    height: 11.0,
    floors: 3,
    builtUpArea: 2200,
    color: "#f43f5e",
    status: "Boundary Overlap",
    floorData: generateBuildingFloors(3, "Mixed"),
    centroid: { x: 230, y: 440 },
    svgPoints: "180,410 240,380 290,400 230,430",
  },
};

export interface DynamicCityParcel {
  id: string;
  parcelId: string;
  associatedBuildingId: string;
  area: number;
  landUse: string;
  status: string;
  color: string;
  sources: {
    revenue: { area: number; date: string; confidence: number };
    municipal: { area: number; date: string; confidence: number };
    survey: { area: number; date: string; confidence: number };
  };
  conflictType?: string;
  maxDifference?: number;
  polygonPoints: string;
  centroid: { x: number; y: number };
}

export const CITY_PARCELS_CATALOG: Record<string, DynamicCityParcel> = {
  "P-10482": {
    id: "P-10482",
    parcelId: "P-10482",
    associatedBuildingId: "B-10482",
    area: 1200,
    landUse: "Commercial",
    status: "Matched (3 sources)",
    color: "#00ffff",
    sources: {
      revenue: { area: 1200, date: "2024-06-12", confidence: 0.91 },
      municipal: { area: 1175, date: "2025-01-20", confidence: 0.96 },
      survey: { area: 1190, date: "2026-03-15", confidence: 0.98 },
    },
    conflictType: "Geometry + Area Discrepancy",
    maxDifference: 25,
    polygonPoints: "410,440 500,380 585,435 495,500",
    centroid: { x: 497, y: 438 },
  },
  "P-10483": {
    id: "P-10483",
    parcelId: "P-10483",
    associatedBuildingId: "B-10483",
    area: 1850,
    landUse: "Commercial",
    status: "Minor Discrepancy",
    color: "#f59e0b",
    sources: {
      revenue: { area: 1850, date: "2023-11-20", confidence: 0.95 },
      municipal: { area: 1850, date: "2024-08-14", confidence: 0.97 },
      survey: { area: 1848, date: "2026-02-10", confidence: 0.99 },
    },
    conflictType: "Marginal Survey Tolerance",
    maxDifference: 2,
    polygonPoints: "500,375 590,320 670,365 580,420",
    centroid: { x: 585, y: 370 },
  },
  "P-10481": {
    id: "P-10481",
    parcelId: "P-10481",
    associatedBuildingId: "B-10481",
    area: 2400,
    landUse: "Institutional",
    status: "Verified Clear",
    color: "#c084fc",
    sources: {
      revenue: { area: 2400, date: "2024-05-02", confidence: 0.96 },
      municipal: { area: 2400, date: "2024-12-01", confidence: 0.98 },
      survey: { area: 2400, date: "2026-01-18", confidence: 0.99 },
    },
    polygonPoints: "320,380 410,325 490,375 400,430",
    centroid: { x: 405, y: 378 },
  },
  "P-10484": {
    id: "P-10484",
    parcelId: "P-10484",
    associatedBuildingId: "B-10484",
    area: 1600,
    landUse: "Residential",
    status: "Matched (2 sources)",
    color: "#34d399",
    sources: {
      revenue: { area: 1600, date: "2024-02-18", confidence: 0.93 },
      municipal: { area: 1600, date: "2025-03-01", confidence: 0.95 },
      survey: { area: 1595, date: "2026-02-28", confidence: 0.97 },
    },
    conflictType: "Sub-meter Boundary Alignment",
    maxDifference: 5,
    polygonPoints: "590,440 680,385 765,440 675,500",
    centroid: { x: 677, y: 441 },
  },
  "P-10485": {
    id: "P-10485",
    parcelId: "P-10485",
    associatedBuildingId: "B-10485",
    area: 3200,
    landUse: "Commercial",
    status: "Encroachment Review",
    color: "#38bdf8",
    sources: {
      revenue: { area: 3200, date: "2024-01-10", confidence: 0.72 },
      municipal: { area: 3110, date: "2024-11-19", confidence: 0.88 },
      survey: { area: 3180, date: "2026-03-01", confidence: 0.94 },
    },
    conflictType: "Setback Encroachment",
    maxDifference: 90,
    polygonPoints: "160,320 250,265 330,315 240,370",
    centroid: { x: 245, y: 318 },
  },
  "P-10488": {
    id: "P-10488",
    parcelId: "P-10488",
    associatedBuildingId: "B-10488",
    area: 2100,
    landUse: "Commercial",
    status: "Matched (3 sources)",
    color: "#2dd4bf",
    sources: {
      revenue: { area: 2100, date: "2024-04-12", confidence: 0.92 },
      municipal: { area: 2080, date: "2025-01-05", confidence: 0.95 },
      survey: { area: 2095, date: "2026-03-10", confidence: 0.98 },
    },
    conflictType: "Area Discrepancy",
    maxDifference: 20,
    polygonPoints: "680,450 760,400 840,445 760,500",
    centroid: { x: 760, y: 448 },
  },
};

export const MOCK_3D_PARCELS: ThreeDParcel[] = Object.values(CITY_PARCELS_CATALOG).map((cp) => ({
  type: "Parcel",
  id: cp.id,
  parcelId: cp.parcelId,
  canonicalEntityId: `ENT-CAN-${cp.parcelId}`,
  landUse: cp.landUse as any,
  propertyStatus: cp.status.includes("Conflict") ? "Disputed" : "Clear",
  status: cp.status as any,
  metrics: { area: cp.area, perimeter: Math.round(Math.sqrt(cp.area) * 4), buildingCount: 1, builtUpArea: cp.area * 0.8, coverageRatio: 0.4 },
  geometry: {
    type: "Polygon",
    coordinates: [[[77.5912, 12.9715], [77.5925, 12.9715], [77.5925, 12.9728], [77.5912, 12.9728], [77.5912, 12.9715]]]
  },
  sourceId: "SRC-BBMP-01",
  sourceName: "Municipal Cadastral GIS 2024",
  observationDate: "2024-06-12",
  confidence: 0.94,
  conflictStatus: cp.conflictType ? "BOUNDARY_OVERLAP" : "NONE",
  verificationStatus: "UNDER_REVIEW",
  buildingsList: [cp.associatedBuildingId],
}));

export const MOCK_3D_BUILDINGS: ThreeDBuilding[] = Object.values(CITY_BUILDINGS_CATALOG).map((cb) => ({
  type: "Building",
  id: cb.id,
  buildingId: cb.buildingId,
  parcelId: cb.parcelId,
  canonicalEntityId: `ENT-CAN-${cb.buildingId}`,
  metrics: {
    footprintArea: Math.round(cb.builtUpArea / cb.floors),
    height: cb.height,
    floorCount: cb.floors,
    estimatedVolume: cb.builtUpArea * 3.5,
    totalBuiltUpArea: cb.builtUpArea,
  },
  usage: (cb.type === "Institutional" || cb.type === "Commercial" || cb.type === "Residential" ? cb.type : "Commercial") as LandUseCategory,
  status: (cb.status.includes("Conflict") || cb.status.includes("Overlap") ? "Disputed" : "Clear") as PropertyStatus,
  sourceId: "SRC-BBMP-01",
  sourceName: "Municipal Building Survey",
  observationDate: "2024-03-15",
  confidence: 0.95,
  conflictStatus: "NONE",
  floors: cb.floorData,
  geometry: {
    type: "Polygon",
    coordinates: [[[77.5914, 12.9717], [77.5920, 12.9717], [77.5920, 12.9723], [77.5914, 12.9723], [77.5914, 12.9717]]]
  }
}));
