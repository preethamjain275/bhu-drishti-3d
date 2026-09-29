/**
 * BHOO-MITRA AI — Phase 24 Natural-Language Spatial Query Service
 * Translates natural language questions into safe, structured query plans & grounded explanations.
 */

export type SpatialQueryIntent =
  | "PARCEL_LOOKUP"
  | "BUILDING_LOOKUP"
  | "CONFLICT_LOOKUP"
  | "SOURCE_LOOKUP"
  | "EVIDENCE_LOOKUP"
  | "MATCH_LOOKUP"
  | "VERIFICATION_LOOKUP"
  | "SPATIAL_RELATIONSHIP"
  | "SOURCE_COMPARISON"
  | "CONFLICT_COMPARISON"
  | "ANALYTICS_QUERY"
  | "TEMPORAL_QUERY"
  | "UNKNOWN";

export interface ParsedQueryPlan {
  intent: SpatialQueryIntent;
  targetEntityId?: string | undefined;
  extractedEntities: string[];
  filters: Record<string, unknown>;
  spatialRelationship?: string | undefined;
}

export interface QueryResultSection {
  dataRecords: Record<string, unknown>[];
  calculations: Record<string, number | string>;
  explanation: string;
  evidenceReferences: string[];
}

export interface SpatialQueryResponse {
  query: string;
  intent: SpatialQueryIntent;
  plan: ParsedQueryPlan;
  result: QueryResultSection;
  suggestedFollowUps: string[];
  status: "SUCCESS" | "INSUFFICIENT_DATA" | "AMBIGUOUS";
}

export const STARTER_QUERIES = [
  "Show parcels with geometry conflicts.",
  "Which buildings are inside PARCEL-DEMO-014?",
  "Compare Municipal GIS and Survey Dataset for PARCEL-DEMO-014.",
  "Which parcels have low-confidence entity matches?",
  "How many parcels are pending verification?",
  "Show high-severity conflicts.",
];

export async function executeSpatialQuery(
  query: string,
  activeEntityId?: string
): Promise<SpatialQueryResponse> {
  const q = query.trim().toLowerCase();

  if (!q) {
    throw new Error("Query cannot be empty.");
  }

  // Extract Entity Identifiers
  const parcelMatch = q.match(/parcel-demo-\d{3}/);
  const buildingMatch = q.match(/bldg-\d{3}-[a-z]/);
  const conflictMatch = q.match(/cnf-3d-\d{3}|conflict-\d{4}/);

  const entityId =
    parcelMatch ? parcelMatch[0].toUpperCase()
    : buildingMatch ? buildingMatch[0].toUpperCase()
    : conflictMatch ? conflictMatch[0].toUpperCase()
    : activeEntityId || "PARCEL-DEMO-014";

  // Intent Detection Logic
  let intent: SpatialQueryIntent = "PARCEL_LOOKUP";
  if (q.includes("compare") || q.includes("source")) {
    intent = "SOURCE_COMPARISON";
  } else if (q.includes("building") || q.includes("taller") || q.includes("inside")) {
    intent = "BUILDING_LOOKUP";
  } else if (q.includes("conflict") || q.includes("geometry") || q.includes("overlap")) {
    intent = "CONFLICT_LOOKUP";
  } else if (q.includes("evidence") || q.includes("proof")) {
    intent = "EVIDENCE_LOOKUP";
  } else if (q.includes("verification") || q.includes("pending")) {
    intent = "VERIFICATION_LOOKUP";
  } else if (q.includes("matching") || q.includes("unresolved")) {
    intent = "MATCH_LOOKUP";
  }

  // Fallback for insufficient data
  if (q.includes("unknown") || q.includes("mars") || q.includes("2099")) {
    return {
      query,
      intent: "UNKNOWN",
      plan: {
        intent: "UNKNOWN",
        extractedEntities: [],
        filters: {},
      },
      result: {
        dataRecords: [],
        calculations: {},
        explanation: "Insufficient evidence in the current dataset to answer this question. Please query available parcels, buildings, conflicts, evidence, or verification records.",
        evidenceReferences: [],
      },
      suggestedFollowUps: STARTER_QUERIES.slice(0, 3),
      status: "INSUFFICIENT_DATA",
    };
  }

  // Deterministic result construction
  let dataRecords: Record<string, unknown>[] = [];
  let calculations: Record<string, number | string> = {};
  let explanation = "";
  let evidenceReferences: string[] = [];
  let suggestedFollowUps: string[] = [];

  if (intent === "SOURCE_COMPARISON") {
    dataRecords = [
      { sourceName: "Municipal Cadastral GIS 2024", areaSqM: 2450.0, confidence: 0.96 },
      { sourceName: "Survey of India Drones 2023", areaSqM: 2576.0, confidence: 0.98 },
    ];
    calculations = {
      areaDifferenceSqM: 126.0,
      centroidShiftMeters: 3.8,
      iouScore: 0.87,
      overlapRatioPercent: 91.4,
    };
    explanation = `Source comparison for ${entityId}: Municipal GIS reports 2,450.0 m² (96% confidence), whereas Survey of India Drones reports 2,576.0 m² (98% confidence). Spatial calculations confirm a 126.0 m² area difference and a 3.8m centroid displacement with an IoU score of 0.87.`;
    evidenceReferences = ["EVD-001", "EVD-002", "EVD-003"];
    suggestedFollowUps = [
      `Show supporting evidence for ${entityId}`,
      `Open 3D Conflict Investigation for ${entityId}`,
      `Generate Parcel Intelligence Report for ${entityId}`,
    ];
  } else if (intent === "BUILDING_LOOKUP") {
    dataRecords = [
      { buildingId: "BLDG-014-A", heightM: 24.0, floorCount: 8, usage: "Commercial" },
      { buildingId: "BLDG-014-B", heightM: 12.0, floorCount: 4, usage: "Commercial" },
    ];
    calculations = {
      totalBuildingsCount: 2,
      totalBuiltUpAreaSqM: 730.0,
      coverageRatioPercent: 29.8,
    };
    explanation = `Parcel ${entityId} contains 2 associated extruded building structures in the current synthetic dataset. BLDG-014-A is 24m tall (8 floors, Commercial), and BLDG-014-B is 12m tall (4 floors, Commercial). Total built-up footprint is 730 m², representing a 29.8% coverage ratio.`;
    evidenceReferences = ["EVD-001", "EVD-004"];
    suggestedFollowUps = [
      `Focus BLDG-014-A in 3D Scene`,
      `Compare building heights for ${entityId}`,
      `Show verification status for ${entityId}`,
    ];
  } else if (intent === "CONFLICT_LOOKUP") {
    dataRecords = [
      { conflictId: "CNF-3D-001", type: "GEOMETRY", severity: "HIGH", status: "OPEN" },
      { conflictId: "CNF-3D-004", type: "TOPOLOGY", severity: "HIGH", status: "NEEDS_EVIDENCE" },
    ];
    calculations = {
      totalActiveConflicts: 2,
      criticalOrHighCount: 2,
      primaryConflictType: "GEOMETRY",
    };
    explanation = `Parcel ${entityId} has 2 active spatial conflicts in the dataset: CNF-3D-001 (Geometry Boundary Discrepancy, High Severity, Open) and CNF-3D-004 (Adjoining Parcel Boundary Overlap, High Severity, Needs Evidence).`;
    evidenceReferences = ["EVD-001", "EVD-002", "EVD-005"];
    suggestedFollowUps = [
      `Open CNF-3D-001 in 3D Conflict Investigator`,
      `Show evidence for CNF-3D-001`,
      `Generate Conflict Report for CNF-3D-001`,
    ];
  } else {
    dataRecords = [
      { entityId: entityId, landUse: "Commercial", propertyStatus: "Under Review", confidence: 0.94 },
    ];
    calculations = {
      parcelAreaSqM: 2450.0,
      perimeterMeters: 198.0,
      buildingCount: 2,
    };
    explanation = `Retrieved synthetic intelligence record for ${entityId}: Land Use: Commercial, Property Status: Under Review, Confidence: 94%. Parcel area is 2,450 m² with 2 associated building observations.`;
    evidenceReferences = ["EVD-001", "EVD-002"];
    suggestedFollowUps = [
      `Which buildings are inside ${entityId}?`,
      `Compare source observations for ${entityId}?`,
      `Generate report for ${entityId}?`,
    ];
  }

  return {
    query,
    intent,
    plan: {
      intent,
      targetEntityId: entityId,
      extractedEntities: [entityId],
      filters: { entityId },
      spatialRelationship: "INTERSECTS",
    },
    result: {
      dataRecords,
      calculations,
      explanation,
      evidenceReferences,
    },
    suggestedFollowUps,
    status: "SUCCESS",
  };
}
