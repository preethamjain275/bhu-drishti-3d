/**
 * BHOO-MITRA AI — Version History & Audit Trail API Service
 *
 * Provides strongly-typed models, synthetic compliance audit logs, version history,
 * version comparisons, provenance graph traversal, and append-only event recording.
 *
 * ⚠️ SYNTHETIC DEMONSTRATION DATA — Not real government audit records.
 */

export type AuditActionType =
  | "SOURCE_IMPORTED"
  | "SOURCE_UPDATED"
  | "SOURCE_MARKED_FOR_REVIEW"
  | "ENTITY_CREATED"
  | "ENTITY_MATCHED"
  | "MATCH_CONFIRMED"
  | "MATCH_MARKED_FOR_REVIEW"
  | "DUPLICATE_FLAGGED"
  | "MATCH_MARKED_UNRESOLVED"
  | "MATCHING_STARTED"
  | "MATCHING_COMPLETED"
  | "FIELD_MAPPING_SUGGESTED"
  | "HARMONIZATION_STARTED"
  | "HARMONIZATION_COMPLETED"
  | "CONFLICT_DETECTED"
  | "EVIDENCE_ATTACHED"
  | "RECOMMENDATION_GENERATED"
  | "RECOMMENDATION_MODIFIED"
  | "VERIFICATION_STARTED"
  | "VERIFICATION_APPROVED"
  | "VERIFICATION_MODIFIED"
  | "VERIFICATION_REJECTED"
  | "VERIFICATION_DEFERRED"
  | "MORE_EVIDENCE_REQUESTED"
  | "DATA_EXPORTED"
  | "USER_LOGIN"
  | "USER_ACTION"
  | "CORRECTIVE_EVENT_CREATED";

export type AuditModule =
  | "Sources"
  | "Harmonization"
  | "Entity Matching"
  | "Conflicts"
  | "Evidence"
  | "Recommendations"
  | "Verification"
  | "Analytics"
  | "System";

export type ActorRole =
  | "BHOO-MITRA AI"
  | "Senior Revenue Officer"
  | "GIS Specialist"
  | "Cadastral Surveyor"
  | "System Administrator"
  | "Field Verification Officer";

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: ActorRole;
  action: AuditActionType;
  module: AuditModule;
  entityId?: string;
  parcelId?: string;
  conflictId?: string;
  recommendationId?: string;
  verificationId?: string;
  sourceId?: string;
  previousState?: Record<string, unknown> | string | null;
  newState?: Record<string, unknown> | string | null;
  reason?: string;
  evidenceIds?: string[];
  metadata?: Record<string, unknown>;
  isCorrective?: boolean;
  correctsEventId?: string;
  readOnly?: boolean;
}

export interface EntityVersion {
  version: string; // e.g. "V01", "V02"
  versionNumber: number;
  title: string;
  createdTimestamp: string;
  actor: {
    name: string;
    role: ActorRole;
  };
  triggeringEventId: string;
  sourcesInvolved: string[];
  evidenceIds: string[];
  recommendationId?: string;
  verificationStatus: "UNVERIFIED" | "PENDING_REVIEW" | "MODIFIED" | "VERIFIED" | "REJECTED";
  geometry: {
    area: number; // m²
    perimeter: number; // m
    centroid: [number, number]; // [lng, lat]
    bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
    geometrySource: string;
  };
  attributes: {
    landUse: string;
    propertyStatus: string;
    category: string;
    ownerName: string;
    taxStatus: string;
    surveyNo: string;
  };
}

export interface VersionComparisonDiff {
  versionA: string;
  versionB: string;
  geometryDiff: {
    areaChange: number; // e.g. -45 m²
    areaDiffPercent: number;
    perimeterChange: number;
    centroidShiftMeters: number;
    geometrySourceA: string;
    geometrySourceB: string;
  };
  attributeDiffs: Array<{
    field: string;
    valueA: string;
    valueB: string;
    status: "ADDED" | "REMOVED" | "CHANGED" | "UNCHANGED";
  }>;
  evidenceDiffs: {
    added: string[];
    removed: string[];
    unchanged: string[];
  };
  statusDiff: {
    previousStatus: string;
    newStatus: string;
    changed: boolean;
  };
  reviewerDiff: {
    previousActor: string;
    newActor: string;
  };
}

export interface ProvenanceNode {
  id: string;
  type: "SOURCE" | "OBSERVATION" | "ENTITY" | "CONFLICT" | "EVIDENCE" | "RECOMMENDATION" | "HUMAN VERIFICATION" | "VERSION";
  title: string;
  subtitle?: string;
  status?: string;
  timestamp?: string;
  routePath?: string;
}

export interface AuditKpis {
  totalEvents: number;
  changesToday: number;
  verificationDecisions: number;
  recommendationsGenerated: number;
  sourceUpdates: number;
  activeCases: number;
}

// ---------------------------------------------------------------------------
// In-Memory Append-Only Store (Local state initialized with synthetic history)
// ---------------------------------------------------------------------------

const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "AUD-0152",
    timestamp: "2026-09-25T14:46:21Z",
    actorId: "USR-REV-09",
    actorName: "Rajesh Kumar",
    actorRole: "Senior Revenue Officer",
    action: "VERIFICATION_APPROVED",
    module: "Verification",
    entityId: "PARCEL-DEMO-014",
    parcelId: "P-10482",
    conflictId: "BOUNDARY-MISMATCH-014",
    recommendationId: "REC-014",
    verificationId: "VER-014",
    sourceId: "SURVEY-2025-SP2291",
    previousState: { status: "PENDING_REVIEW", boundary: "Municipal GIS Draft" },
    newState: { status: "VERIFIED_CANONICAL", boundary: "GNSS Adjusted Survey Boundary" },
    reason: "Approved candidate boundary based on high-precision GNSS ground control points and dual-witness field survey affidavit.",
    evidenceIds: ["EVID-027", "EVID-029"],
    metadata: { confidenceScore: 94.2, reviewDurationMin: 18, verificationChannel: "Official Dashboard" },
    readOnly: true,
  },
  {
    id: "AUD-0151",
    timestamp: "2026-09-25T14:12:05Z",
    actorId: "USR-REV-09",
    actorName: "Rajesh Kumar",
    actorRole: "Senior Revenue Officer",
    action: "VERIFICATION_STARTED",
    module: "Verification",
    entityId: "PARCEL-DEMO-014",
    parcelId: "P-10482",
    verificationId: "VER-014",
    recommendationId: "REC-014",
    previousState: "UNASSIGNED",
    newState: "IN_REVIEW",
    reason: "Initiated formal verification workflow for high-priority commercial land boundary dispute.",
    readOnly: true,
  },
  {
    id: "AUD-0150",
    timestamp: "2026-09-25T13:42:10Z",
    actorId: "SYS-AI-BHOO",
    actorName: "BHOO-MITRA AI",
    actorRole: "BHOO-MITRA AI",
    action: "RECOMMENDATION_GENERATED",
    module: "Recommendations",
    entityId: "PARCEL-DEMO-014",
    parcelId: "P-10482",
    conflictId: "BOUNDARY-MISMATCH-014",
    recommendationId: "REC-014",
    previousState: null,
    newState: { candidateArea: 2465, confidence: 94.2, actionSuggested: "ALIGN_TO_SURVEY_GNSS" },
    reason: "AI Model evaluated multi-source spatial intersection. Survey GNSS weight assigned 0.65 vs Municipal 0.20.",
    evidenceIds: ["EVID-027", "EVID-028"],
    metadata: { modelVersion: "BhuMitra-v2.4", computeTimeMs: 420 },
    readOnly: true,
  },
  {
    id: "AUD-0149",
    timestamp: "2026-09-25T13:37:44Z",
    actorId: "USR-GIS-04",
    actorName: "Priya Sharma",
    actorRole: "GIS Specialist",
    action: "EVIDENCE_ATTACHED",
    module: "Evidence",
    entityId: "PARCEL-DEMO-014",
    parcelId: "P-10482",
    conflictId: "BOUNDARY-MISMATCH-014",
    previousState: { attachedEvidenceCount: 1 },
    newState: { attachedEvidenceCount: 2, addedEvidenceId: "EVID-027" },
    reason: "Attached high-resolution Drone Orthomosaic ground control photo taken on 2025-11-12.",
    evidenceIds: ["EVID-027"],
    metadata: { sourceFormat: "GeoTIFF", gsdResolutionMeters: 0.05 },
    readOnly: true,
  },
  {
    id: "AUD-0148",
    timestamp: "2026-09-25T13:31:12Z",
    actorId: "SYS-AI-BHOO",
    actorName: "BHOO-MITRA AI",
    actorRole: "BHOO-MITRA AI",
    action: "CONFLICT_DETECTED",
    module: "Conflicts",
    entityId: "PARCEL-DEMO-014",
    parcelId: "P-10482",
    conflictId: "BOUNDARY-MISMATCH-014",
    previousState: "NO_CONFLICT",
    newState: { conflictType: "GEOMETRY_MISMATCH", maxAreaDevMeters: 80, severity: "HIGH" },
    reason: "Spatial discrepancy exceeding 3% threshold detected between Municipal GIS (2,430m²) and Property Registry (2,510m²).",
    evidenceIds: ["EVID-028"],
    metadata: { spatialOverlapPercentage: 91.8 },
    readOnly: true,
  },
  {
    id: "AUD-0147",
    timestamp: "2026-09-25T12:15:00Z",
    actorId: "SYS-AI-BHOO",
    actorName: "BHOO-MITRA AI",
    actorRole: "BHOO-MITRA AI",
    action: "ENTITY_MATCHED",
    module: "Harmonization",
    entityId: "PARCEL-DEMO-014",
    parcelId: "P-10482",
    sourceId: "REGISTRY-PROP-014",
    previousState: "UNMATCHED_OBSERVATION",
    newState: "CANONICAL_LINKED",
    reason: "Probabilistic entity resolution linked Registry Entry #REG-98102 to Canonical Entity PARCEL-DEMO-014 with 96.4% confidence.",
    metadata: { attributeSimScore: 0.98, spatialJaccardIndex: 0.92 },
    readOnly: true,
  },
  {
    id: "AUD-0146",
    timestamp: "2026-09-25T11:45:30Z",
    actorId: "USR-SURV-02",
    actorName: "Vikram Mehta",
    actorRole: "Cadastral Surveyor",
    action: "SOURCE_IMPORTED",
    module: "Sources",
    entityId: "PARCEL-DEMO-014",
    sourceId: "SURVEY-2025-SP2291",
    previousState: null,
    newState: { sourceName: "Field GNSS Boundary Survey SP-2291", pointsCount: 14 },
    reason: "Uploaded official Differential GNSS survey vector file following field re-measurement.",
    evidenceIds: ["EVID-029"],
    metadata: { coordinateSystem: "EPSG:3857 / UTM Zone 44N" },
    readOnly: true,
  },
  {
    id: "AUD-0145",
    timestamp: "2026-09-24T16:20:00Z",
    actorId: "USR-ADMIN-01",
    actorName: "Ananya Iyer",
    actorRole: "System Administrator",
    action: "SOURCE_UPDATED",
    module: "Sources",
    sourceId: "MUNI-GIS-WARD18",
    previousState: { status: "STALE_2024" },
    newState: { status: "ACTIVE_REFRESHED", layers: ["parcels", "roads", "zoning"] },
    reason: "Updated Municipal GIS sync layer pipeline from Ward 18 spatial server.",
    metadata: { totalParcelsIngested: 18240 },
    readOnly: true,
  },
  {
    id: "AUD-0144",
    timestamp: "2026-09-24T15:10:12Z",
    actorId: "SYS-AI-BHOO",
    actorName: "BHOO-MITRA AI",
    actorRole: "BHOO-MITRA AI",
    action: "ENTITY_CREATED",
    module: "Harmonization",
    entityId: "PARCEL-DEMO-014",
    parcelId: "P-10482",
    previousState: null,
    newState: { entityId: "PARCEL-DEMO-014", status: "DRAFT_HARMONIZED" },
    reason: "Canonical parcel entity index initialized during Ward 18 baseline harmonization run.",
    metadata: { initialSourceCount: 2 },
    readOnly: true,
  },
  {
    id: "AUD-0143",
    timestamp: "2026-09-24T10:00:00Z",
    actorId: "USR-ADMIN-01",
    actorName: "Ananya Iyer",
    actorRole: "System Administrator",
    action: "USER_LOGIN",
    module: "System",
    previousState: null,
    newState: "SESSION_ACTIVE",
    reason: "Administrator authenticated via hardware security key.",
    metadata: { ipAddress: "10.4.12.98", authMethod: "mfa_webauthn" },
    readOnly: true,
  },
];

let auditEventsStore: AuditEvent[] = [...INITIAL_AUDIT_EVENTS];

// Synthetic Entity Versions for PARCEL-DEMO-014
const ENTITY_VERSIONS_DEMO: EntityVersion[] = [
  {
    version: "V01",
    versionNumber: 1,
    title: "Original Source Observations",
    createdTimestamp: "2026-09-24T15:10:12Z",
    actor: { name: "System Administrator", role: "System Administrator" },
    triggeringEventId: "AUD-0144",
    sourcesInvolved: ["Municipal GIS Ward 18", "Property Registry"],
    evidenceIds: [],
    verificationStatus: "UNVERIFIED",
    geometry: {
      area: 2430,
      perimeter: 198.4,
      centroid: [77.2024, 28.6012],
      bbox: [77.2018, 28.6006, 77.203, 28.6018],
      geometrySource: "Municipal GIS 2024 Digitized Sheet",
    },
    attributes: {
      landUse: "Residential - Mixed",
      propertyStatus: "Active Municipal Record",
      category: "Private Commercial/Res",
      ownerName: "Devi Sharan & Sons",
      taxStatus: "Paid FY 2024-25",
      surveyNo: "Khasra 482/1",
    },
  },
  {
    version: "V02",
    versionNumber: 2,
    title: "Source Harmonization & GNSS Addition",
    createdTimestamp: "2026-09-25T11:45:30Z",
    actor: { name: "Vikram Mehta", role: "Cadastral Surveyor" },
    triggeringEventId: "AUD-0146",
    sourcesInvolved: ["Municipal GIS Ward 18", "Property Registry", "Field Survey SP-2291"],
    evidenceIds: ["EVID-029"],
    verificationStatus: "PENDING_REVIEW",
    geometry: {
      area: 2510,
      perimeter: 204.2,
      centroid: [77.2025, 28.6013],
      bbox: [77.2019, 28.6007, 77.2031, 28.6019],
      geometrySource: "Property Registry Conveyance Map",
    },
    attributes: {
      landUse: "Commercial - Retail",
      propertyStatus: "Discrepancy Flagged",
      category: "Commercial",
      ownerName: "Devi Sharan & Sons (Holdings Pvt Ltd)",
      taxStatus: "Pending Assessment",
      surveyNo: "Khasra 482/1 & 482/2",
    },
  },
  {
    version: "V03",
    versionNumber: 3,
    title: "AI Candidate Recommendation",
    createdTimestamp: "2026-09-25T13:42:10Z",
    actor: { name: "BHOO-MITRA AI", role: "BHOO-MITRA AI" },
    triggeringEventId: "AUD-0150",
    sourcesInvolved: ["Municipal GIS Ward 18", "Property Registry", "Field Survey SP-2291", "Drone Orthomosaic"],
    evidenceIds: ["EVID-027", "EVID-028"],
    recommendationId: "REC-014",
    verificationStatus: "PENDING_REVIEW",
    geometry: {
      area: 2465,
      perimeter: 201.0,
      centroid: [77.20245, 28.60125],
      bbox: [77.20185, 28.60065, 77.20305, 28.60185],
      geometrySource: "BHOO-MITRA AI Harmonized Boundary Proposal",
    },
    attributes: {
      landUse: "Commercial - Retail",
      propertyStatus: "Harmonization Candidate",
      category: "Commercial",
      ownerName: "Devi Sharan & Sons (Holdings Pvt Ltd)",
      taxStatus: "Paid FY 2024-25",
      surveyNo: "Khasra 482/1",
    },
  },
  {
    version: "V04",
    versionNumber: 4,
    title: "Human Officer Refinement",
    createdTimestamp: "2026-09-25T14:12:05Z",
    actor: { name: "Rajesh Kumar", role: "Senior Revenue Officer" },
    triggeringEventId: "AUD-0151",
    sourcesInvolved: ["Municipal GIS Ward 18", "Property Registry", "Field Survey SP-2291", "Drone Orthomosaic"],
    evidenceIds: ["EVID-027", "EVID-028", "EVID-029"],
    recommendationId: "REC-014",
    verificationStatus: "MODIFIED",
    geometry: {
      area: 2465,
      perimeter: 201.2,
      centroid: [77.20246, 28.60125],
      bbox: [77.20185, 28.60065, 77.20306, 28.60185],
      geometrySource: "Officer Adjusted Field Boundary",
    },
    attributes: {
      landUse: "Commercial - Retail / Office",
      propertyStatus: "In Review - Verified Boundary",
      category: "Commercial",
      ownerName: "Devi Sharan & Sons (Holdings Pvt Ltd)",
      taxStatus: "Paid FY 2024-25",
      surveyNo: "Khasra 482/1",
    },
  },
  {
    version: "V05",
    versionNumber: 5,
    title: "Verified Canonical Land Record",
    createdTimestamp: "2026-09-25T14:46:21Z",
    actor: { name: "Rajesh Kumar", role: "Senior Revenue Officer" },
    triggeringEventId: "AUD-0152",
    sourcesInvolved: ["Municipal GIS Ward 18", "Property Registry", "Field Survey SP-2291", "Drone Orthomosaic"],
    evidenceIds: ["EVID-027", "EVID-028", "EVID-029"],
    recommendationId: "REC-014",
    verificationStatus: "VERIFIED",
    geometry: {
      area: 2465,
      perimeter: 201.2,
      centroid: [77.20246, 28.60125],
      bbox: [77.20185, 28.60065, 77.20306, 28.60185],
      geometrySource: "Verified Canonical Register",
    },
    attributes: {
      landUse: "Commercial - Retail / Office",
      propertyStatus: "Verified Canonical Record",
      category: "Commercial",
      ownerName: "Devi Sharan & Sons (Holdings Pvt Ltd)",
      taxStatus: "Paid FY 2024-25",
      surveyNo: "Khasra 482/1",
    },
  },
];

// ---------------------------------------------------------------------------
// API Service Functions
// ---------------------------------------------------------------------------

export async function getAuditEvents(filters?: {
  query?: string;
  module?: string;
  actorRole?: string;
  actionType?: string;
  timeRange?: string; // "today" | "7d" | "30d" | "all"
}): Promise<AuditEvent[]> {
  let result = [...auditEventsStore];

  if (!filters) return result;

  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (e) =>
        e.id.toLowerCase().includes(q) ||
        (e.entityId && e.entityId.toLowerCase().includes(q)) ||
        (e.parcelId && e.parcelId.toLowerCase().includes(q)) ||
        (e.conflictId && e.conflictId.toLowerCase().includes(q)) ||
        (e.recommendationId && e.recommendationId.toLowerCase().includes(q)) ||
        (e.verificationId && e.verificationId.toLowerCase().includes(q)) ||
        (e.sourceId && e.sourceId.toLowerCase().includes(q)) ||
        e.actorName.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q) ||
        (e.reason && e.reason.toLowerCase().includes(q))
    );
  }

  if (filters.module && filters.module !== "ALL") {
    result = result.filter((e) => e.module === filters.module);
  }

  if (filters.actorRole && filters.actorRole !== "ALL") {
    result = result.filter((e) => e.actorRole === filters.actorRole);
  }

  if (filters.actionType && filters.actionType !== "ALL") {
    result = result.filter((e) => e.action === filters.actionType);
  }

  if (filters.timeRange && filters.timeRange !== "all") {
    const now = new Date("2026-09-25T21:30:00Z").getTime();
    const millis =
      filters.timeRange === "today"
        ? 24 * 60 * 60 * 1000
        : filters.timeRange === "7d"
        ? 7 * 24 * 60 * 60 * 1000
        : 30 * 24 * 60 * 60 * 1000;

    result = result.filter((e) => {
      const t = new Date(e.timestamp).getTime();
      return now - t <= millis;
    });
  }

  return result.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export async function getAuditEvent(eventId: string): Promise<AuditEvent | null> {
  const found = auditEventsStore.find((e) => e.id === eventId);
  return found ? { ...found } : null;
}

export async function getEntityVersions(entityId: string = "PARCEL-DEMO-014"): Promise<EntityVersion[]> {
  return [...ENTITY_VERSIONS_DEMO];
}

export async function getVersion(versionId: string): Promise<EntityVersion | null> {
  const v = ENTITY_VERSIONS_DEMO.find((x) => x.version.toLowerCase() === versionId.toLowerCase());
  return v ? { ...v } : null;
}

export async function compareVersions(
  verA: string = "V01",
  verB: string = "V05"
): Promise<VersionComparisonDiff> {
  const a = (await getVersion(verA)) ?? ENTITY_VERSIONS_DEMO[0]!;
  const b = (await getVersion(verB)) ?? ENTITY_VERSIONS_DEMO[ENTITY_VERSIONS_DEMO.length - 1]!;

  const areaChange = b.geometry.area - a.geometry.area;
  const areaDiffPercent = Number(((areaChange / a.geometry.area) * 100).toFixed(2));
  const perimeterChange = Number((b.geometry.perimeter - a.geometry.perimeter).toFixed(1));

  // Centroid shift distance approximation in meters
  const dLng = (b.geometry.centroid[0] - a.geometry.centroid[0]) * 111320 * Math.cos((28.6012 * Math.PI) / 180);
  const dLat = (b.geometry.centroid[1] - a.geometry.centroid[1]) * 110574;
  const centroidShiftMeters = Number(Math.sqrt(dLng * dLng + dLat * dLat).toFixed(2));

  const attributeKeys: Array<keyof EntityVersion["attributes"]> = [
    "landUse",
    "propertyStatus",
    "category",
    "ownerName",
    "taxStatus",
    "surveyNo",
  ];

  const attributeDiffs = attributeKeys.map((key) => {
    const valA = a.attributes[key];
    const valB = b.attributes[key];
    const changed = valA !== valB;
    return {
      field: key,
      valueA: valA,
      valueB: valB,
      status: changed ? ("CHANGED" as const) : ("UNCHANGED" as const),
    };
  });

  const setA = new Set(a.evidenceIds);
  const setB = new Set(b.evidenceIds);

  const added = [...setB].filter((x) => !setA.has(x));
  const removed = [...setA].filter((x) => !setB.has(x));
  const unchanged = [...setA].filter((x) => setB.has(x));

  return {
    versionA: a.version,
    versionB: b.version,
    geometryDiff: {
      areaChange,
      areaDiffPercent,
      perimeterChange,
      centroidShiftMeters,
      geometrySourceA: a.geometry.geometrySource,
      geometrySourceB: b.geometry.geometrySource,
    },
    attributeDiffs,
    evidenceDiffs: { added, removed, unchanged },
    statusDiff: {
      previousStatus: a.verificationStatus,
      newStatus: b.verificationStatus,
      changed: a.verificationStatus !== b.verificationStatus,
    },
    reviewerDiff: {
      previousActor: `${a.actor.name} (${a.actor.role})`,
      newActor: `${b.actor.name} (${b.actor.role})`,
    },
  };
}

/**
 * Record a new append-only Audit Event.
 * Guaranteed never to overwrite existing historical events.
 */
export async function recordAuditEvent(payload: Omit<AuditEvent, "id" | "timestamp" | "readOnly">): Promise<AuditEvent> {
  const nextNum = auditEventsStore.length + 144;
  const newEvent: AuditEvent = {
    id: `AUD-0${nextNum}`,
    timestamp: new Date().toISOString(),
    readOnly: true,
    ...payload,
  };
  // Append-only push
  auditEventsStore.unshift(newEvent);
  return newEvent;
}

/**
 * Create a Corrective Audit Event referencing a historical event.
 */
export async function createCorrectiveEvent(params: {
  targetEventId: string;
  reason: string;
  correctiveAction: string;
  reviewerNote?: string;
  actorName?: string;
  actorRole?: ActorRole;
}): Promise<AuditEvent> {
  const original = auditEventsStore.find((e) => e.id === params.targetEventId);

  const eventPayload: Omit<AuditEvent, "id" | "readOnly" | "timestamp"> = {
    actorId: "USR-CURRENT-OFFICER",
    actorName: params.actorName ?? "Rajesh Kumar",
    actorRole: params.actorRole ?? "Senior Revenue Officer",
    action: "CORRECTIVE_EVENT_CREATED",
    module: original ? original.module : "System",
    entityId: original?.entityId ?? "PARCEL-DEMO-014",
    parcelId: original?.parcelId ?? "P-10482",
    previousState: original ? { eventId: original.id, action: original.action, status: "SUPERSEDED_NOTE" } : null,
    newState: {
      correctiveAction: params.correctiveAction,
      reviewerNote: params.reviewerNote ?? "Official amendment record issued.",
    },
    reason: `Corrective event issued for ${params.targetEventId}: ${params.reason}`,
    isCorrective: true,
    correctsEventId: params.targetEventId,
  };

  if (original?.conflictId) eventPayload.conflictId = original.conflictId;
  if (original?.recommendationId) eventPayload.recommendationId = original.recommendationId;
  if (original?.verificationId) eventPayload.verificationId = original.verificationId;
  if (original?.sourceId) eventPayload.sourceId = original.sourceId;

  return recordAuditEvent(eventPayload);
}

/**
 * Get full Provenance Chain nodes for PARCEL-DEMO-014.
 */
export async function getAuditProvenance(entityId: string = "PARCEL-DEMO-014"): Promise<ProvenanceNode[]> {
  return [
    {
      id: "MUNI-GIS-WARD18",
      type: "SOURCE",
      title: "Municipal GIS Ward 18",
      subtitle: "Digitized Revenue Layer 2024",
      status: "ACTIVE",
      timestamp: "2024-04-12",
      routePath: "/data-sources",
    },
    {
      id: "OBS-MUNI-482",
      type: "OBSERVATION",
      title: "Municipal Observation 2,430 m²",
      subtitle: "Residential / Mixed Zone",
      status: "INGESTED",
      timestamp: "2026-09-24T15:10:12Z",
      routePath: "/records",
    },
    {
      id: "PARCEL-DEMO-014",
      type: "ENTITY",
      title: "Canonical Parcel PARCEL-DEMO-014",
      subtitle: "P-10482 · Khasra 482/1",
      status: "CANONICAL",
      timestamp: "2026-09-24T15:10:12Z",
      routePath: "/entity-matching",
    },
    {
      id: "BOUNDARY-MISMATCH-014",
      type: "CONFLICT",
      title: "Boundary Area Mismatch 80 m²",
      subtitle: "Severity: HIGH",
      status: "OPEN_DISCREPANCY",
      timestamp: "2026-09-25T13:31:12Z",
      routePath: "/conflicts",
    },
    {
      id: "EVID-027",
      type: "EVIDENCE",
      title: "Drone Orthomosaic & Field Photogrammetry",
      subtitle: "0.05m GSD Photo Evidence",
      status: "VERIFIED_EVIDENCE",
      timestamp: "2026-09-25T13:37:44Z",
      routePath: "/evidence",
    },
    {
      id: "REC-014",
      type: "RECOMMENDATION",
      title: "AI Candidate Proposal 2,465 m²",
      subtitle: "94.2% AI Confidence Score",
      status: "SUGGESTED",
      timestamp: "2026-09-25T13:42:10Z",
      routePath: "/harmonization",
    },
    {
      id: "VER-014",
      type: "HUMAN VERIFICATION",
      title: "Human Officer Sign-Off VER-014",
      subtitle: "Reviewer: Rajesh Kumar",
      status: "APPROVED",
      timestamp: "2026-09-25T14:46:21Z",
      routePath: "/verification",
    },
    {
      id: "VER-STATE-V05",
      type: "VERSION",
      title: "Verified Canonical Register Version 05",
      subtitle: "Immutable Provenance Sealed",
      status: "FINAL_V05",
      timestamp: "2026-09-25T14:46:21Z",
      routePath: "/audit",
    },
  ];
}

export async function getAuditKpis(): Promise<AuditKpis> {
  const events = await getAuditEvents();
  const today = "2026-09-25";

  return {
    totalEvents: events.length,
    changesToday: events.filter((e) => e.timestamp.startsWith(today)).length,
    verificationDecisions: events.filter((e) => e.action.startsWith("VERIFICATION_")).length,
    recommendationsGenerated: events.filter((e) => e.action.includes("RECOMMENDATION_")).length,
    sourceUpdates: events.filter((e) => e.action.startsWith("SOURCE_")).length,
    activeCases: 7,
  };
}
