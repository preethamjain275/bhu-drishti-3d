/**
 * BHOO-MITRA AI — Advanced Spatial Entity Matching API Service
 *
 * Provides strongly-typed models, candidate generation algorithms, spatial/attribute/temporal
 * similarity signals, evidence-grounded confidence scoring, duplicate detection, and batch demo execution.
 *
 * ⚠️ SYNTHETIC DEMONSTRATION DATA & MATCHING SIGNALS — Not real PostGIS or ML engine.
 */

import { recordAuditEvent } from "@/lib/api/audit";
import { fetchWithFallback } from "@/lib/api/client";

export type MatchStatus =
  | "MATCHED"
  | "PROBABLE MATCH"
  | "NEEDS REVIEW"
  | "UNRESOLVED"
  | "POSSIBLE DUPLICATE"
  | "NO MATCH";

export interface EntityObservation {
  id: string; // e.g. "OBS-MUN-014"
  sourceId: string; // "MUNI-GIS-WARD18"
  sourceName: string; // "Municipal GIS"
  sourceEntityId: string; // "PARCEL-014"
  candidateCanonicalId: string; // "CANONICAL-014"
  geometryType: string; // "Polygon"
  areaSqm: number;
  attributes: Record<string, string | number>;
  observationDate: string; // "2024-04-12"
  confidenceScore: number; // 94
  status: MatchStatus;
  locationLabel: string; // "Sector 9 Commercial Block A"
  bbox: [number, number, number, number];
}

export interface CanonicalEntity {
  id: string; // "CANONICAL-014"
  parcelId: string; // "PARCEL-DEMO-014"
  landUse: string; // "Residential - Mixed"
  status: string; // "Active"
  areaSqm: number;
  perimeterM: number;
  centroid: [number, number];
  bbox: [number, number, number, number];
  observationIds: string[];
}

export interface SpatialMatchMetrics {
  iouPercentage: number; // Intersection Over Union e.g. 94%
  centroidDistanceMeters: number; // e.g. 0.35m
  areaSimilarityPercentage: number; // e.g. 98.2%
  perimeterSimilarityPercentage: number; // e.g. 97.5%
  shapeSimilarityScore: number; // 0.96
  boundaryAgreementPercentage: number; // 95.8%
}

export interface AttributeMatchItem {
  attributeName: string;
  sourceValue: string;
  candidateValue: string;
  result: "MATCH" | "CLOSE" | "DIFFERENT" | "MISSING" | "UNKNOWN";
}

export interface TemporalMatchMetrics {
  observationDate: string;
  candidateDate: string;
  diffDays: number;
  consistencyLevel: "HIGH" | "MEDIUM" | "LOW";
}

export interface MatchSignalBreakdown {
  spatialOverlapWeight: number; // 40%
  spatialOverlapScore: number; // 96
  geometrySimilarityWeight: number; // 25%
  geometrySimilarityScore: number; // 95
  attributeSimilarityWeight: number; // 20%
  attributeSimilarityScore: number; // 92
  temporalConsistencyWeight: number; // 10%
  temporalConsistencyScore: number; // 95
  sourceContextWeight: number; // 5%
  sourceContextScore: number; // 90
  combinedConfidenceScore: number; // 94%
}

export interface MatchCandidate {
  candidateEntityId: string;
  parcelId: string;
  overallSignalScore: number;
  spatialScore: number;
  attributeScore: number;
  temporalScore: number;
  confidenceTier: "HIGH-CONFIDENCE CANDIDATE" | "NEEDS REVIEW" | "UNRESOLVED";
  metrics: SpatialMatchMetrics;
  attributeItems: AttributeMatchItem[];
  temporalMetrics: TemporalMatchMetrics;
  signals: MatchSignalBreakdown;
  supportingEvidenceIds: string[];
  relatedConflictIds: string[];
}

export interface DuplicateCandidate {
  id: string;
  observationIds: string[];
  canonicalEntityId: string;
  spatialOverlap: number;
  attributeSimilarity: number;
  temporalProximityDays: number;
  confidenceScore: number;
  description: string;
}

export interface UnresolvedCase {
  id: string;
  observationId: string;
  sourceName: string;
  candidateEntityId: string;
  confidenceScore: number;
  reason: string;
  missingEvidence: string;
}

export interface MatchDecision {
  observationId: string;
  candidateEntityId: string;
  decision: MatchStatus;
  notes?: string;
  reviewerId: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Synthetic Store
// ---------------------------------------------------------------------------

const DEMO_CANONICAL_ENTITIES: CanonicalEntity[] = [
  {
    id: "CANONICAL-014",
    parcelId: "PARCEL-DEMO-014",
    landUse: "Residential - Mixed",
    status: "Active",
    areaSqm: 2465.0,
    perimeterM: 200.5,
    centroid: [77.2024, 28.6012],
    bbox: [77.2018, 28.6006, 77.2031, 28.6019],
    observationIds: ["OBS-MUN-014", "OBS-REG-014", "OBS-SUR-014"],
  },
  {
    id: "CANONICAL-018",
    parcelId: "PARCEL-DEMO-018",
    landUse: "Commercial",
    status: "Active",
    areaSqm: 1840.0,
    perimeterM: 175.2,
    centroid: [77.2035, 28.6025],
    bbox: [77.2028, 28.6018, 77.2042, 28.6032],
    observationIds: ["OBS-MUN-018"],
  },
  {
    id: "CANONICAL-009",
    parcelId: "PARCEL-DEMO-009",
    landUse: "Institutional",
    status: "Pending",
    areaSqm: 4200.0,
    perimeterM: 260.0,
    centroid: [77.2050, 28.6040],
    bbox: [77.2040, 28.6030, 77.2060, 28.6050],
    observationIds: ["OBS-PLAN-009"],
  },
];

const DEMO_OBSERVATIONS: EntityObservation[] = [
  {
    id: "OBS-MUN-014",
    sourceId: "MUNI-GIS-WARD18",
    sourceName: "Municipal GIS",
    sourceEntityId: "PARCEL-014",
    candidateCanonicalId: "CANONICAL-014",
    geometryType: "Polygon",
    areaSqm: 2430.0,
    attributes: { land_use: "Residential", tax_status: "Paid", ward: "Ward 18" },
    observationDate: "2024-04-12",
    confidenceScore: 94,
    status: "MATCHED",
    locationLabel: "Sector 9 Commercial Block A",
    bbox: [77.2018, 28.6006, 77.2031, 28.6019],
  },
  {
    id: "OBS-REG-014",
    sourceId: "REGISTRY-PROP-014",
    sourceName: "Property Registry",
    sourceEntityId: "REG-98102",
    candidateCanonicalId: "CANONICAL-014",
    geometryType: "Polygon",
    areaSqm: 2510.0,
    attributes: { deed_no: "REG-98102", owner_category: "Private Individual", deed_area: 2510 },
    observationDate: "2025-11-04",
    confidenceScore: 92,
    status: "PROBABLE MATCH",
    locationLabel: "Sub-Registrar IX Title Deed Boundary",
    bbox: [77.2017, 28.6005, 77.2032, 28.6020],
  },
  {
    id: "OBS-SUR-014",
    sourceId: "SURVEY-2025-SP2291",
    sourceName: "Survey Dataset",
    sourceEntityId: "SP-2291-P14",
    candidateCanonicalId: "CANONICAL-014",
    geometryType: "Polygon",
    areaSqm: 2465.0,
    attributes: { control_point: "CP-01", precision: "0.02m", surveyor_lic: "LIC-882" },
    observationDate: "2025-11-12",
    confidenceScore: 98,
    status: "MATCHED",
    locationLabel: "Field GNSS Ground Control Cadastral Vector",
    bbox: [77.2018, 28.6006, 77.2031, 28.6019],
  },
  {
    id: "OBS-MUN-018",
    sourceId: "MUNI-GIS-WARD18",
    sourceName: "Municipal GIS",
    sourceEntityId: "PARCEL-018",
    candidateCanonicalId: "CANONICAL-018",
    geometryType: "Polygon",
    areaSqm: 1840.0,
    attributes: { land_use: "Commercial", tax_status: "Paid" },
    observationDate: "2024-04-12",
    confidenceScore: 78,
    status: "NEEDS REVIEW",
    locationLabel: "Sector 9 Commercial Block B",
    bbox: [77.2028, 28.6018, 77.2042, 28.6032],
  },
  {
    id: "OBS-PLAN-009",
    sourceId: "PLANNING-ZONE-2025",
    sourceName: "Planning Dataset",
    sourceEntityId: "ZONE-D-09",
    candidateCanonicalId: "CANONICAL-009",
    geometryType: "MultiPolygon",
    areaSqm: 4200.0,
    attributes: { zone_code: "C-2", far_limit: 3.5 },
    observationDate: "2025-06-18",
    confidenceScore: 54,
    status: "UNRESOLVED",
    locationLabel: "Zone D Master Plan Buffer",
    bbox: [77.2040, 28.6030, 77.2060, 28.6050],
  },
];

const DEMO_DUPLICATES: DuplicateCandidate[] = [
  {
    id: "DUP-101",
    observationIds: ["OBS-MUN-014", "OBS-REG-014", "OBS-SUR-014"],
    canonicalEntityId: "CANONICAL-014",
    spatialOverlap: 96.4,
    attributeSimilarity: 92.0,
    temporalProximityDays: 7,
    confidenceScore: 94.8,
    description: "High spatial overlap and matching parcel index between Municipal GIS and Sub-Registrar IX title deed.",
  },
  {
    id: "DUP-102",
    observationIds: ["OBS-MUN-018", "OBS-REG-018"],
    canonicalEntityId: "CANONICAL-018",
    spatialOverlap: 78.0,
    attributeSimilarity: 82.5,
    temporalProximityDays: 45,
    confidenceScore: 78.0,
    description: "Moderate spatial boundary alignment requiring human review due to front setback discrepancy.",
  },
];

const DEMO_UNRESOLVED: UnresolvedCase[] = [
  {
    id: "UNRES-01",
    observationId: "OBS-PLAN-009",
    sourceName: "Planning Dataset",
    candidateEntityId: "CANONICAL-009",
    confidenceScore: 54.0,
    reason: "Insufficient spatial topological agreement and missing ground survey evidence.",
    missingEvidence: "Field GNSS control survey point verification.",
  },
];

let observationsStore: EntityObservation[] = [...DEMO_OBSERVATIONS];
let canonicalStore: CanonicalEntity[] = [...DEMO_CANONICAL_ENTITIES];
let decisionsStore: MatchDecision[] = [];

// ---------------------------------------------------------------------------
// Service Layer Functions
// ---------------------------------------------------------------------------

export async function getMatchingKPIs(): Promise<{
  totalObservations: number;
  matchedEntities: number;
  highConfidenceMatches: number;
  mediumConfidenceMatches: number;
  unresolvedMatches: number;
  potentialDuplicates: number;
}> {
  return {
    totalObservations: 84,
    matchedEntities: 61,
    highConfidenceMatches: 48,
    mediumConfidenceMatches: 10,
    unresolvedMatches: 6,
    potentialDuplicates: 5,
  };
}

export async function getObservations(query?: string): Promise<EntityObservation[]> {
  const queryString = query ? `?query=${encodeURIComponent(query)}` : "";
  return fetchWithFallback(`/entities/observations${queryString}`, async () => {
    if (!query) return [...observationsStore];
    const q = query.toLowerCase();
    return observationsStore.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.sourceName.toLowerCase().includes(q) ||
        o.sourceEntityId.toLowerCase().includes(q) ||
        o.candidateCanonicalId.toLowerCase().includes(q) ||
        o.locationLabel.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q)
    );
  });
}

export async function getCanonicalEntities(): Promise<CanonicalEntity[]> {
  return fetchWithFallback(`/entities`, async () => {
    return [...canonicalStore];
  });
}

export async function getCandidatesForObservation(obsId: string): Promise<MatchCandidate[]> {
  const obs = observationsStore.find((o) => o.id === obsId) ?? observationsStore[0]!;

  return [
    {
      candidateEntityId: "CANONICAL-014",
      parcelId: "PARCEL-DEMO-014",
      overallSignalScore: 94,
      spatialScore: 96,
      attributeScore: 92,
      temporalScore: 95,
      confidenceTier: "HIGH-CONFIDENCE CANDIDATE",
      metrics: {
        iouPercentage: 94.2,
        centroidDistanceMeters: 0.35,
        areaSimilarityPercentage: 98.2,
        perimeterSimilarityPercentage: 97.5,
        shapeSimilarityScore: 0.96,
        boundaryAgreementPercentage: 95.8,
      },
      attributeItems: [
        { attributeName: "Land Use", sourceValue: "Residential", candidateValue: "Residential - Mixed", result: "MATCH" },
        { attributeName: "Property Status", sourceValue: "Active", candidateValue: "Active", result: "MATCH" },
        { attributeName: "Calculated Area", sourceValue: `${obs.areaSqm} m²`, candidateValue: "2465.0 m²", result: "CLOSE" },
        { attributeName: "Owner Category", sourceValue: "Private Individual", candidateValue: "Private Individual", result: "MATCH" },
      ],
      temporalMetrics: {
        observationDate: obs.observationDate,
        candidateDate: "2025-11-12",
        diffDays: 7,
        consistencyLevel: "HIGH",
      },
      signals: {
        spatialOverlapWeight: 0.4,
        spatialOverlapScore: 96,
        geometrySimilarityWeight: 0.25,
        geometrySimilarityScore: 95,
        attributeSimilarityWeight: 0.2,
        attributeSimilarityScore: 92,
        temporalConsistencyWeight: 0.1,
        temporalConsistencyScore: 95,
        sourceContextWeight: 0.05,
        sourceContextScore: 90,
        combinedConfidenceScore: 94,
      },
      supportingEvidenceIds: ["EVID-GEOM-014", "EVID-DEED-98102"],
      relatedConflictIds: ["CF-1042"],
    },
    {
      candidateEntityId: "CANONICAL-018",
      parcelId: "PARCEL-DEMO-018",
      overallSignalScore: 42,
      spatialScore: 58,
      attributeScore: 44,
      temporalScore: 72,
      confidenceTier: "UNRESOLVED",
      metrics: {
        iouPercentage: 58.0,
        centroidDistanceMeters: 14.2,
        areaSimilarityPercentage: 75.0,
        perimeterSimilarityPercentage: 72.0,
        shapeSimilarityScore: 0.62,
        boundaryAgreementPercentage: 60.0,
      },
      attributeItems: [
        { attributeName: "Land Use", sourceValue: "Residential", candidateValue: "Commercial", result: "DIFFERENT" },
        { attributeName: "Calculated Area", sourceValue: `${obs.areaSqm} m²`, candidateValue: "1840.0 m²", result: "DIFFERENT" },
      ],
      temporalMetrics: {
        observationDate: obs.observationDate,
        candidateDate: "2024-04-12",
        diffDays: 140,
        consistencyLevel: "MEDIUM",
      },
      signals: {
        spatialOverlapWeight: 0.4,
        spatialOverlapScore: 58,
        geometrySimilarityWeight: 0.25,
        geometrySimilarityScore: 60,
        attributeSimilarityWeight: 0.2,
        attributeSimilarityScore: 44,
        temporalConsistencyWeight: 0.1,
        temporalConsistencyScore: 72,
        sourceContextWeight: 0.05,
        sourceContextScore: 60,
        combinedConfidenceScore: 42,
      },
      supportingEvidenceIds: ["EVID-MUNI-018"],
      relatedConflictIds: ["CF-1043"],
    },
    {
      candidateEntityId: "CANONICAL-009",
      parcelId: "PARCEL-DEMO-009",
      overallSignalScore: 21,
      spatialScore: 31,
      attributeScore: 28,
      temporalScore: 40,
      confidenceTier: "UNRESOLVED",
      metrics: {
        iouPercentage: 31.0,
        centroidDistanceMeters: 45.0,
        areaSimilarityPercentage: 50.0,
        perimeterSimilarityPercentage: 48.0,
        shapeSimilarityScore: 0.40,
        boundaryAgreementPercentage: 35.0,
      },
      attributeItems: [
        { attributeName: "Land Use", sourceValue: "Residential", candidateValue: "Institutional", result: "DIFFERENT" },
      ],
      temporalMetrics: {
        observationDate: obs.observationDate,
        candidateDate: "2025-06-18",
        diffDays: 240,
        consistencyLevel: "LOW",
      },
      signals: {
        spatialOverlapWeight: 0.4,
        spatialOverlapScore: 31,
        geometrySimilarityWeight: 0.25,
        geometrySimilarityScore: 35,
        attributeSimilarityWeight: 0.2,
        attributeSimilarityScore: 28,
        temporalConsistencyWeight: 0.1,
        temporalConsistencyScore: 40,
        sourceContextWeight: 0.05,
        sourceContextScore: 40,
        combinedConfidenceScore: 21,
      },
      supportingEvidenceIds: [],
      relatedConflictIds: [],
    },
  ];
}

export async function getPotentialDuplicates(): Promise<DuplicateCandidate[]> {
  return [...DEMO_DUPLICATES];
}

export async function getUnresolvedMatches(): Promise<UnresolvedCase[]> {
  return [...DEMO_UNRESOLVED];
}

export async function submitMatchDecision(params: {
  observationId: string;
  candidateEntityId: string;
  decision: MatchStatus;
  notes?: string;
  reviewerId?: string;
}): Promise<EntityObservation> {
  const reviewer = params.reviewerId ?? "USR-OFFICER-01";
  const dec: MatchDecision = {
    observationId: params.observationId,
    candidateEntityId: params.candidateEntityId,
    decision: params.decision,
    reviewerId: reviewer,
    timestamp: new Date().toISOString(),
  };
  if (params.notes) dec.notes = params.notes;

  decisionsStore.push(dec);

  // Update local observation state
  observationsStore = observationsStore.map((o) =>
    o.id === params.observationId
      ? { ...o, status: params.decision, confidenceScore: params.decision === "MATCHED" ? 96 : o.confidenceScore }
      : o
  );

  // Record audit event
  await recordAuditEvent({
    actorId: reviewer,
    actorName: "Rajesh Kumar",
    actorRole: "Senior Revenue Officer",
    action:
      params.decision === "MATCHED"
        ? "MATCH_CONFIRMED"
        : params.decision === "NEEDS REVIEW"
        ? "MATCH_MARKED_FOR_REVIEW"
        : params.decision === "POSSIBLE DUPLICATE"
        ? "DUPLICATE_FLAGGED"
        : "MATCH_MARKED_UNRESOLVED",
    module: "Entity Matching",
    entityId: params.candidateEntityId,
    reason: `Submitted match decision '${params.decision}' for observation ${params.observationId}. ${params.notes ?? ""}`,
    metadata: { candidateId: params.candidateEntityId, observationId: params.observationId },
  });

  return observationsStore.find((o) => o.id === params.observationId)!;
}

export async function runMatchingDemo(params?: {
  onProgress?: (step: string, percent: number) => void;
}): Promise<EntityObservation[]> {
  const steps = [
    { step: "SOURCE OBSERVATIONS LOADED", percent: 15 },
    { step: "CANDIDATE GENERATION", percent: 35 },
    { step: "SPATIAL TOPOLOGY COMPARISON", percent: 55 },
    { step: "ATTRIBUTE & VOCABULARY MATCH", percent: 75 },
    { step: "TEMPORAL TIMELINE CHECK", percent: 90 },
    { step: "CONFIDENCE CLASSIFICATION COMPLETED", percent: 100 },
  ];

  await recordAuditEvent({
    actorId: "USR-OFFICER-01",
    actorName: "Rajesh Kumar",
    actorRole: "Senior Revenue Officer",
    action: "MATCHING_STARTED",
    module: "Entity Matching",
    reason: "Initiated automated batch spatial entity resolution pipeline for Ward 18 parcels.",
    metadata: { totalObservations: observationsStore.length },
  });

  for (const s of steps) {
    params?.onProgress?.(s.step, s.percent);
    await new Promise((r) => setTimeout(r, 450));
  }

  await recordAuditEvent({
    actorId: "USR-OFFICER-01",
    actorName: "Rajesh Kumar",
    actorRole: "Senior Revenue Officer",
    action: "MATCHING_COMPLETED",
    module: "Entity Matching",
    reason: "Batch matching demo completed. Classified 61 high-confidence matches and 6 unresolved review cases.",
    metadata: { matchedCount: 61, unresolvedCount: 6 },
  });

  return [...observationsStore];
}
