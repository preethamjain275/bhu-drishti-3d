/**
 * BHOO-MITRA AI — 3D Urban Digital Twin & BIM Floor/Room Types
 * Strongly typed domain interfaces for 3D parcels, extruded buildings, floors, rooms and spatial relationships.
 */

export type VisualMode =
  | "Standard"
  | "Height"
  | "Land Use"
  | "Source"
  | "Confidence"
  | "Conflict"
  | "Conflict Ready";

export type ThreeDEntity = ThreeDParcel | ThreeDBuilding;

export type LandUseCategory =
  | "Residential"
  | "Commercial"
  | "Mixed Use"
  | "Institutional"
  | "Vacant"
  | "Public";

export type PropertyStatus =
  | "Clear"
  | "Disputed"
  | "Encroached"
  | "Under Review"
  | "Verified";

export interface LayerVisibilityState {
  wardBoundary?: boolean;
  revenueParcels?: boolean;
  municipalParcels?: boolean;
  surveyImagery?: boolean;
  spatialDifferences?: boolean;
  buildings3d?: boolean;
  buildingInteriors?: boolean;
  roadNetwork?: boolean;
  terrain?: boolean;
  satelliteImagery?: boolean;
  // Legacy aliases
  parcels?: boolean;
  buildings?: boolean;
  parcelBoundaries?: boolean;
  roads?: boolean;
  referenceFeatures?: boolean;
  conflictOverlay?: boolean;
  evidenceOverlay?: boolean;
  showLabels?: boolean;
}

export interface RoomInfo {
  id: string; // e.g., "4A", "4B"
  name: string; // e.g., "Room 4B"
  type: string; // e.g., "Office Space", "Meeting Room", "Restroom"
  area: number; // m² e.g., 280
  status: "Active" | "Occupied" | "Vacant" | "Maintenance";
  colorHex?: string;
}

export interface FloorInfo {
  floorNumber: number; // e.g., 5, 4, 3, 2, 1, 0
  label: string; // e.g., "5F", "4F", "3F", "2F", "1F", "G"
  usage: string; // e.g., "Office Space", "Meeting Rooms", "Reception + Offices", "Parking / Utilities"
  area: number; // m² e.g., 1050
  heightOffset: number; // meters e.g., 14.8
  rooms: RoomInfo[];
}

export interface ThreeDGeometryMetrics {
  area: number; // m²
  perimeter: number; // meters
  buildingCount: number;
  builtUpArea: number; // m² (sum of building footprints)
  coverageRatio: number; // ratio (0.0 to 1.0)
}

export interface ThreeDBuildingMetrics {
  footprintArea: number; // m²
  height: number; // meters e.g., 18.5
  floorCount: number; // e.g., 5
  estimatedVolume: number; // m³
  totalBuiltUpArea?: number; // m² e.g., 4850
}

export interface ThreeDSourceRepresentation {
  sourceId: string;
  sourceName: string;
  confidence: number;
  representedArea: number;
  colorHex: string;
}

export interface ThreeDParcel {
  type: "Parcel";
  id: string;
  parcelId: string;
  canonicalEntityId: string;
  landUse: LandUseCategory;
  propertyStatus: PropertyStatus;
  status: PropertyStatus; // Alias for propertyStatus
  metrics: ThreeDGeometryMetrics;
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
  sourceId: string;
  sourceName: string;
  observationDate: string;
  confidence: number;
  conflictStatus: "NONE" | "BOUNDARY_OVERLAP" | "ENCROACHMENT" | "MULTIPLE_CLAIMS";
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED" | "UNDER_REVIEW";
  buildingsList: string[]; // Associated ThreeDBuilding IDs
  sourceRepresentations?: ThreeDSourceRepresentation[] | undefined;
}

export interface ThreeDBuilding {
  type: "Building";
  id: string;
  buildingId: string;
  parcelId: string;
  canonicalEntityId: string;
  metrics: ThreeDBuildingMetrics;
  usage: LandUseCategory;
  status: PropertyStatus;
  sourceId: string;
  sourceName: string;
  observationDate: string;
  confidence: number;
  conflictStatus: "NONE" | "HEIGHT_VIOLATION" | "UNAUTHORIZED_FOOTPRINT";
  floors?: FloorInfo[];
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

export interface ParcelBuildingRelationship {
  parcelId: string;
  parcelArea: number;
  buildingCount: number;
  totalBuiltUpArea: number;
  coverageRatioPercent: number;
  buildings: ThreeDBuilding[];
}

export interface BuildingFilterState {
  minHeight: number;
  maxHeight: number;
  minFloors: number;
  maxFloors: number;
  selectedUsages: Set<LandUseCategory>;
  minConfidence: number;
}

export interface ParcelFilterState {
  selectedLandUses: Set<LandUseCategory>;
  selectedStatuses: Set<PropertyStatus>;
  minConfidence: number;
  onlyConflicts: boolean;
}

/* Phase 21 — 3D Conflict Investigation System Types */

export type ThreeDConflictType = "GEOMETRY" | "ATTRIBUTE" | "TEMPORAL" | "TOPOLOGY";
export type ThreeDConflictSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type ThreeDConflictStatus = "OPEN" | "INVESTIGATING" | "NEEDS_EVIDENCE" | "READY_FOR_VERIFICATION" | "RESOLVED" | "DEFERRED";
export type SourceCompareMode = "SOURCE_A" | "SOURCE_B" | "BOTH" | "DIFFERENCE" | "EVIDENCE";
export type InvestigationStage = "IDENTIFY" | "COMPARE" | "MEASURE" | "EVIDENCE" | "RECOMMEND" | "VERIFY";

export interface ThreeDConflictGeometryDifference {
  areaDifference: number; // m²
  perimeterDifference: number; // meters
  centroidShift: number; // meters
  overlapRatio: number; // 0.0 - 1.0
  intersectionArea: number; // m²
  unionArea: number; // m²
  iou: number; // Intersection over Union (0.0 - 1.0)
}

export interface ThreeDAttributeDifference {
  field: string;
  sourceAValue: string;
  sourceBValue: string;
  discrepancyType: "MISMATCH" | "DISPUTED" | "OUTDATED";
}

export interface ThreeDTemporalObservation {
  sourceId: string;
  sourceName: string;
  observationDate: string;
  confidence: number;
  description: string;
}

export interface ThreeDConflict {
  conflictId: string;
  entityId: string;
  parcelId: string;
  buildingId?: string | undefined;
  type: ThreeDConflictType;
  severity: ThreeDConflictSeverity;
  status: ThreeDConflictStatus;
  title: string;
  description: string;
  sourceA: {
    sourceId: string;
    sourceName: string;
    confidence: number;
    area?: number;
    geometry?: { type: "Polygon"; coordinates: number[][][] };
  };
  sourceB: {
    sourceId: string;
    sourceName: string;
    confidence: number;
    area?: number;
    geometry?: { type: "Polygon"; coordinates: number[][][] };
  };
  confidence: number;
  createdAt: string;
  geometryDifference?: ThreeDConflictGeometryDifference | undefined;
  attributeDifferences?: ThreeDAttributeDifference[] | undefined;
  temporalObservations?: ThreeDTemporalObservation[] | undefined;
  topologyInfo?: { relationship: string; issue: string; overlapArea: number } | undefined;
  evidenceIds: string[];
  recommendationId?: string | undefined;
  verificationStatus: "PENDING" | "VERIFIED" | "UNDER_REVIEW";
  currentStage: InvestigationStage;
}

export interface InvestigationSnapshot {
  snapshotId: string;
  timestamp: string;
  conflictId: string;
  entityId: string;
  compareMode: SourceCompareMode;
  visualMode: VisualMode;
  metrics: Record<string, number | string>;
  notes: string;
}
