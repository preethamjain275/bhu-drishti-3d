/**
 * BHOO-MITRA AI — Multi-Source Comparison Demo Data
 *
 * ⚠️  SYNTHETIC DEMONSTRATION DATA — NOT REAL GOVERNMENT RECORDS ⚠️
 *
 * This module provides the data layer for Prompt 5 — Multi-Source Parcel Comparison.
 * All identifiers, coordinates, attributes, and scores are fictitious demo values.
 */

import type { FeatureCollection, Polygon, Feature } from "geojson";

// ---------------------------------------------------------------------------
// Domain Types — future-ready abstractions
// ---------------------------------------------------------------------------

export type SourceId = "municipal" | "registry" | "survey";
export type ComparisonMode = "side-by-side" | "overlay" | "difference";
export type ConflictSeverity = "MATCH" | "CONFLICT" | "VARIES";

export interface SourceObservation {
  id: SourceId;
  label: string;
  shortLabel: string;
  sourceType: string;
  organization: string;
  lastUpdated: string;
  confidence: number; // 0-100
  status: "ACTIVE" | "ARCHIVED" | "PENDING";
  color: string;
  dashArray?: number[];
  reliability: SourceReliability;
}

export interface SourceReliability {
  overall: number; // 0-100
  geometryQuality: number;
  attributeCompleteness: number;
  temporalFreshness: number;
  historicalConsistency: number;
}

export interface GeometryComparison {
  sourceId: SourceId;
  area: number; // m²
  perimeter: number; // m
  centroid: [number, number]; // [lon, lat]
  vertexCount: number;
  boundingBox: [number, number, number, number]; // minLon, minLat, maxLon, maxLat
  geometryType: string;
}

export interface AttributeComparisonRow {
  attribute: string;
  municipal: string;
  registry: string;
  survey: string;
  status: ConflictSeverity;
}

export interface TemporalEvent {
  date: string;
  sourceId: SourceId;
  sourceLabel: string;
  change: string;
  confidence: number;
}

export interface ConflictSummary {
  totalConflicts: number;
  geometry: { severity: "HIGH" | "MEDIUM" | "LOW"; description: string } | null;
  attribute: { severity: "HIGH" | "MEDIUM" | "LOW"; description: string } | null;
  temporal: { severity: "HIGH" | "MEDIUM" | "LOW"; description: string } | null;
}

export interface EntityMatchConfidence {
  overall: number;
  spatial: number;
  attribute: number;
  temporal: number;
}

export interface CanonicalParcel {
  id: string;
  label: string;
  entityType: string;
  currentStatus: "Conflict Detected" | "Verified" | "Pending Review";
  matchConfidence: number;
  sourceCount: number;
  conflictCount: number;
  lastObserved: string;
  observations: SourceId[];
}

// ---------------------------------------------------------------------------
// Source Observation Definitions
// ---------------------------------------------------------------------------

export const SOURCE_OBSERVATIONS: Record<SourceId, SourceObservation> = {
  municipal: {
    id: "municipal",
    label: "Municipal GIS",
    shortLabel: "MUNI",
    sourceType: "Urban GIS",
    organization: "Urban Development Authority (Demo)",
    lastUpdated: "2026-07-14",
    confidence: 94,
    status: "ACTIVE",
    color: "#00e5ff",
    reliability: {
      overall: 92,
      geometryQuality: 88,
      attributeCompleteness: 95,
      temporalFreshness: 91,
      historicalConsistency: 94,
    },
  },
  registry: {
    id: "registry",
    label: "Property Registry",
    shortLabel: "REG",
    sourceType: "Property Records",
    organization: "District Property Registry (Demo)",
    lastUpdated: "2026-06-21",
    confidence: 91,
    status: "ACTIVE",
    color: "#a78bfa",
    dashArray: [2, 2],
    reliability: {
      overall: 88,
      geometryQuality: 84,
      attributeCompleteness: 90,
      temporalFreshness: 85,
      historicalConsistency: 93,
    },
  },
  survey: {
    id: "survey",
    label: "Survey Dataset",
    shortLabel: "SURV",
    sourceType: "Survey Dataset",
    organization: "Survey of India — Zone 4 (Demo)",
    lastUpdated: "2026-08-02",
    confidence: 97,
    status: "ACTIVE",
    color: "#fbbf24",
    dashArray: [4, 4],
    reliability: {
      overall: 95,
      geometryQuality: 97,
      attributeCompleteness: 91,
      temporalFreshness: 96,
      historicalConsistency: 96,
    },
  },
};

// ---------------------------------------------------------------------------
// Demo Entity — PARCEL-DEMO-014
// ---------------------------------------------------------------------------

export const DEMO_PARCEL: CanonicalParcel = {
  id: "PARCEL-DEMO-014",
  label: "PARCEL-DEMO-014",
  entityType: "Urban Parcel",
  currentStatus: "Conflict Detected",
  matchConfidence: 97,
  sourceCount: 3,
  conflictCount: 2,
  lastObserved: "2026-08-02",
  observations: ["municipal", "registry", "survey"],
};

export const ENTITY_MATCH_CONFIDENCE: EntityMatchConfidence = {
  overall: 97,
  spatial: 96,
  attribute: 98,
  temporal: 91,
};

// ---------------------------------------------------------------------------
// Geometry Comparison Data (SYNTHETIC DEMO VALUES)
// ---------------------------------------------------------------------------

export const GEOMETRY_COMPARISONS: Record<SourceId, GeometryComparison> = {
  municipal: {
    sourceId: "municipal",
    area: 2430,
    perimeter: 201.4,
    centroid: [77.2018, 28.6018],
    vertexCount: 6,
    boundingBox: [77.2012, 28.601, 77.2024, 28.6026],
    geometryType: "Polygon",
  },
  registry: {
    sourceId: "registry",
    area: 2510,
    perimeter: 205.8,
    centroid: [77.2019, 28.6019],
    vertexCount: 4,
    boundingBox: [77.2011, 28.6009, 77.2025, 28.6027],
    geometryType: "Polygon",
  },
  survey: {
    sourceId: "survey",
    area: 2465,
    perimeter: 203.2,
    centroid: [77.2018, 28.6018],
    vertexCount: 8,
    boundingBox: [77.2012, 28.6010, 77.2024, 28.6026],
    geometryType: "Polygon",
  },
};

// ---------------------------------------------------------------------------
// Attribute Comparison Table (SYNTHETIC DEMO VALUES)
// ---------------------------------------------------------------------------

export const ATTRIBUTE_COMPARISONS: AttributeComparisonRow[] = [
  { attribute: "Land Use", municipal: "Residential", registry: "Residential", survey: "Mixed Residential", status: "CONFLICT" },
  { attribute: "Area (m²)", municipal: "2,430", registry: "2,510", survey: "2,465", status: "CONFLICT" },
  { attribute: "Survey Reference", municipal: "SRV-014", registry: "SRV-014", survey: "SRV-014", status: "MATCH" },
  { attribute: "Owner Reference", municipal: "—", registry: "OWN-2891", survey: "—", status: "VARIES" },
  { attribute: "Ward / Zone", municipal: "Ward 12 — Zone C", registry: "Ward 12", survey: "Zone C", status: "VARIES" },
  { attribute: "Plot Number", municipal: "PLT-14892", registry: "PLT-14892", survey: "PLT-14892", status: "MATCH" },
  { attribute: "Building Floors", municipal: "G+2", registry: "G+2", survey: "G+2", status: "MATCH" },
  { attribute: "Last Update", municipal: "2026-07-14", registry: "2026-06-21", survey: "2026-08-02", status: "VARIES" },
];

// ---------------------------------------------------------------------------
// Temporal Timeline (SYNTHETIC DEMO VALUES)
// ---------------------------------------------------------------------------

export const TEMPORAL_EVENTS: TemporalEvent[] = [
  { date: "2025-03-10", sourceId: "registry", sourceLabel: "Property Registry", change: "Initial registration recorded", confidence: 88 },
  { date: "2025-07-22", sourceId: "municipal", sourceLabel: "Municipal GIS", change: "Parcel digitized from orthomap", confidence: 84 },
  { date: "2026-06-21", sourceId: "registry", sourceLabel: "Property Registry", change: "Area attribute updated (boundary revision)", confidence: 91 },
  { date: "2026-07-14", sourceId: "municipal", sourceLabel: "Municipal GIS", change: "Land use re-classified (Residential)", confidence: 94 },
  { date: "2026-08-02", sourceId: "survey", sourceLabel: "Survey Dataset", change: "GNSS field survey — highest accuracy capture", confidence: 97 },
];

// ---------------------------------------------------------------------------
// Conflict Summary (SYNTHETIC DEMO VALUES)
// ---------------------------------------------------------------------------

export const CONFLICT_SUMMARY: ConflictSummary = {
  totalConflicts: 2,
  geometry: {
    severity: "MEDIUM",
    description: "Boundary mismatch — 80 m² area discrepancy between Municipal and Registry",
  },
  attribute: {
    severity: "HIGH",
    description: "Land-use classification differs — Residential vs Mixed Residential",
  },
  temporal: {
    severity: "LOW",
    description: "Source capture dates span 17 months (2025-03 → 2026-08)",
  },
};

// ---------------------------------------------------------------------------
// GeoJSON Geometries for PARCEL-DEMO-014
// Each source has slightly different coordinates to show boundary disagreement
// ---------------------------------------------------------------------------

// Base parcel centered near New Delhi — demo coordinates
const BASE_CENTER: [number, number] = [77.2018, 28.6018];

function makePolygon(
  center: [number, number],
  dxHalf: number,
  dyHalf: number,
  offsets: { dx: number; dy: number } = { dx: 0, dy: 0 }
): number[][][] {
  const [cx, cy] = center;
  const ox = offsets.dx;
  const oy = offsets.dy;
  return [[
    [cx - dxHalf + ox, cy - dyHalf + oy],
    [cx + dxHalf + ox, cy - dyHalf + oy],
    [cx + dxHalf + ox, cy + dyHalf + oy],
    [cx - dxHalf + ox, cy + dyHalf + oy],
    [cx - dxHalf + ox, cy - dyHalf + oy],
  ]];
}

// Municipal: base shape
const MUNICIPAL_COORDS = makePolygon(BASE_CENTER, 0.00060, 0.00045);

// Registry: slightly larger (represents larger area claim)
const REGISTRY_COORDS = makePolygon(BASE_CENTER, 0.00063, 0.00047, { dx: 0.00005, dy: 0.00005 });

// Survey: most accurate, slightly different vertices
const SURVEY_COORDS = [[
  [BASE_CENTER[0] - 0.00058, BASE_CENTER[1] - 0.00043],
  [BASE_CENTER[0] + 0.00061, BASE_CENTER[1] - 0.00044],
  [BASE_CENTER[0] + 0.00062, BASE_CENTER[1] + 0.00046],
  [BASE_CENTER[0] - 0.00001, BASE_CENTER[1] + 0.00047],
  [BASE_CENTER[0] - 0.00059, BASE_CENTER[1] + 0.00044],
  [BASE_CENTER[0] - 0.00060, BASE_CENTER[1] - 0.00001],
  [BASE_CENTER[0] - 0.00058, BASE_CENTER[1] - 0.00043],
]];

export interface ParcelFeatureProperties {
  id: string;
  source: SourceId;
  sourceLabel: string;
  area: number;
  landUse: string;
  confidence: number;
  status: "MATCHED" | "CONFLICT" | "VERIFIED";
  updatedAt: string;
  surveyRef: string;
}

function makeParcelFeature(
  sourceId: SourceId,
  coords: number[][][],
  area: number,
  landUse: string,
  updatedAt: string,
  status: "MATCHED" | "CONFLICT" | "VERIFIED"
): Feature<Polygon, ParcelFeatureProperties> {
  return {
    type: "Feature",
    geometry: { type: "Polygon", coordinates: coords },
    properties: {
      id: "PARCEL-DEMO-014",
      source: sourceId,
      sourceLabel: SOURCE_OBSERVATIONS[sourceId].label,
      area,
      landUse,
      confidence: SOURCE_OBSERVATIONS[sourceId].confidence,
      status,
      updatedAt,
      surveyRef: "SRV-014",
    },
  };
}

export const PARCEL_014_MUNICIPAL = makeParcelFeature("municipal", MUNICIPAL_COORDS, 2430, "Residential", "2026-07-14", "MATCHED");
export const PARCEL_014_REGISTRY = makeParcelFeature("registry", REGISTRY_COORDS, 2510, "Residential", "2026-06-21", "CONFLICT");
export const PARCEL_014_SURVEY = makeParcelFeature("survey", SURVEY_COORDS, 2465, "Mixed Residential", "2026-08-02", "CONFLICT");

export const PARCEL_014_GEOJSON: Record<SourceId, FeatureCollection<Polygon, ParcelFeatureProperties>> = {
  municipal: { type: "FeatureCollection", features: [PARCEL_014_MUNICIPAL] },
  registry: { type: "FeatureCollection", features: [PARCEL_014_REGISTRY] },
  survey: { type: "FeatureCollection", features: [PARCEL_014_SURVEY] },
};

// Conflict zone polygon (area where sources disagree most — demo visual)
export const CONFLICT_ZONE_GEOJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [BASE_CENTER[0] + 0.00050, BASE_CENTER[1] - 0.00045],
          [BASE_CENTER[0] + 0.00063, BASE_CENTER[1] - 0.00047],
          [BASE_CENTER[0] + 0.00063, BASE_CENTER[1] + 0.00047],
          [BASE_CENTER[0] + 0.00050, BASE_CENTER[1] + 0.00046],
          [BASE_CENTER[0] + 0.00050, BASE_CENTER[1] - 0.00045],
        ]],
      },
      properties: { type: "conflict-zone", label: "Boundary disagreement zone", severity: "MEDIUM" },
    },
  ],
};

// ---------------------------------------------------------------------------
// Searchable entities (for the search widget)
// ---------------------------------------------------------------------------

export interface SearchableEntity {
  id: string;
  parcelId: string;
  surveyRef: string;
  entityId: string;
  label: string;
  type: string;
  isDemo: boolean;
}

export const SEARCHABLE_ENTITIES: SearchableEntity[] = [
  { id: "PARCEL-DEMO-014", parcelId: "PARCEL-DEMO-014", surveyRef: "SRV-014", entityId: "ENT-014", label: "PARCEL-DEMO-014 — Urban Parcel (Demo)", type: "Urban Parcel", isDemo: true },
  { id: "PARCEL-DEMO-001", parcelId: "PARCEL-DEMO-001", surveyRef: "SRV-001", entityId: "ENT-001", label: "PARCEL-DEMO-001 — Residential Parcel", type: "Residential Parcel", isDemo: true },
  { id: "PARCEL-DEMO-007", parcelId: "PARCEL-DEMO-007", surveyRef: "SRV-007", entityId: "ENT-007", label: "PARCEL-DEMO-007 — Commercial Plot", type: "Commercial Plot", isDemo: true },
  { id: "PARCEL-DEMO-011", parcelId: "PARCEL-DEMO-011", surveyRef: "SRV-011", entityId: "ENT-011", label: "PARCEL-DEMO-011 — Public Zone Parcel", type: "Public Zone", isDemo: true },
];

// Center for flyTo on demo load
export const DEMO_MAP_CENTER: [number, number] = BASE_CENTER;
export const DEMO_MAP_ZOOM = 18;
