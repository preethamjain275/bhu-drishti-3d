/**
 * BHOO-MITRA AI — Verification Service & Audit Engine
 *
 * ⚠️ SYNTHETIC DEMONSTRATION INTELLIGENCE — NOT AN AUTHORITATIVE GOVERNMENT DECISION ⚠️
 *
 * This module manages:
 * - Verification Queue & Case lifecycle
 * - Structured audit trails
 * - Human-in-the-loop decisions (APPROVE, MODIFY, REJECT, DEFER, REQUEST_MORE_EVIDENCE)
 * - Candidate modification tracking
 * - Strict immutability of original source datasets
 */

export type VerificationStatus =
  | "PENDING_REVIEW"
  | "IN_REVIEW"
  | "NEEDS_MORE_EVIDENCE"
  | "APPROVED"
  | "MODIFIED"
  | "REJECTED"
  | "DEFERRED";

export type SeverityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface ReviewerInfo {
  id: string;
  name: string;
  role: string;
  department: string;
  badgeNumber: string;
}

export interface VerificationHistoryEvent {
  id: string;
  timestamp: string;
  stage: string;
  description: string;
  actor: string;
  type: "SYSTEM" | "AI" | "HUMAN_REVIEWER" | "AUDIT";
}

export interface SourceAttributeValue {
  attributeName: string;
  municipalGis: string;
  propertyRegistry: string;
  droneSurvey: string;
  recommendedCandidate: string;
  isModified?: boolean | undefined;
  reviewerValue?: string | undefined;
  observationDate: {
    municipalGis: string;
    propertyRegistry: string;
    droneSurvey: string;
  };
  evidenceId: string;
}

export interface AuditEvent {
  id: string;
  verificationId: string;
  entityId: string;
  recommendationId: string;
  reviewerId: string;
  reviewerName: string;
  action:
    | "OPEN_CASE"
    | "MARK_IN_REVIEW"
    | "APPROVE_CANDIDATE"
    | "MODIFY_CANDIDATE"
    | "REJECT_RECOMMENDATION"
    | "DEFER_CASE"
    | "REQUEST_MORE_EVIDENCE";
  previousStatus: VerificationStatus;
  newStatus: VerificationStatus;
  timestamp: string;
  decisionNote: string;
  details?: Record<string, unknown>;
  immutableIntegrityHash: string;
}

export interface VerificationCase {
  id: string; // e.g. "VER-014"
  entityId: string; // e.g. "PARCEL-DEMO-014"
  propertyId: string; // e.g. "PROP-MUM-400088-2941"
  conflictId: string; // e.g. "CONF-014"
  recommendationId: string; // e.g. "REC-014"
  conflictType: string; // e.g. "BOUNDARY_MISMATCH"
  severity: SeverityLevel;
  aiRecommendationTitle: string;
  recommendedCandidateSource: string;
  confidence: number; // e.g. 91
  evidenceStrength: "HIGH" | "MEDIUM" | "LOW";
  evidenceIds: string[];
  sourceCount: number;
  sources: Array<{ id: string; name: string; quality: number; type: string }>;
  unresolvedCount: number;
  unresolvedItems: string[];
  createdDate: string;
  status: VerificationStatus;
  assignedReviewer: ReviewerInfo;
  decisionTimestamp?: string;
  decisionNote?: string;
  rejectionReason?: string;
  deferReason?: string;
  deferFollowUpDate?: string;
  requestedEvidenceTypes?: string[];
  modifiedAttributes?: Record<string, string>;
  modifiedGeometrySource?: string;
  originalSourceGeometryPreserved: boolean;
  history: VerificationHistoryEvent[];
  attributeMatrix: SourceAttributeValue[];
  coordinates: [number, number]; // [lng, lat]
}

// Current Authorized Demo Reviewer
export const CURRENT_REVIEWER: ReviewerInfo = {
  id: "REV-GOV-88219",
  name: "Dr. Rajeshwar Sharma, IAS (Retd.)",
  role: "Chief Land Records Arbitrator & Authorized Reviewer",
  department: "National Land Harmonization Directorate (BHOO-MITRA Taskforce)",
  badgeNumber: "IND-REV-2026-88219",
};

// Initial Synthetic Verification Cases
let MOCK_VERIFICATION_QUEUE: VerificationCase[] = [
  {
    id: "VER-014",
    entityId: "PARCEL-DEMO-014",
    propertyId: "PROP-MUM-400088-2941",
    conflictId: "CONF-014",
    recommendationId: "REC-014",
    conflictType: "BOUNDARY_MISMATCH",
    severity: "HIGH",
    aiRecommendationTitle: "Survey Dataset Boundary (Survey Cadastral 2026)",
    recommendedCandidateSource: "Drone Survey High-Res 2026",
    confidence: 91,
    evidenceStrength: "HIGH",
    evidenceIds: ["EVID-014-A", "EVID-014-B", "EVID-014-C", "EVID-014-D"],
    sourceCount: 3,
    sources: [
      { id: "SURVEY_2026", name: "Survey Cadastral 2026 (Drone)", quality: 96, type: "UAV Lidar/Orthophoto" },
      { id: "MUNICIPAL_GIS", name: "Municipal GIS Department", quality: 84, type: "Spatial Vector Cadastre" },
      { id: "PROPERTY_REGISTRY", name: "Revenue Registration Dept", quality: 78, type: "Deed Registry Index" },
    ],
    unresolvedCount: 1,
    unresolvedItems: ["Legacy Deed Register shows deed entry of 1,240 m² vs surveyed 1,215 m² (-2.01% encroachment sliver)."],
    createdDate: "2026-03-24 09:31:00",
    status: "PENDING_REVIEW",
    assignedReviewer: CURRENT_REVIEWER,
    originalSourceGeometryPreserved: true,
    coordinates: [72.8777, 19.0760],
    history: [
      { id: "H-01", timestamp: "2026-03-24 09:31:00", stage: "Case Initialized", description: "Verification case generated from Conflict Engine CONF-014", actor: "Conflict Intelligence System", type: "SYSTEM" },
      { id: "H-02", timestamp: "2026-03-24 09:35:12", stage: "AI Recommendation", description: "Harmonization reasoning computed. Confidence: 91% (High)", actor: "Explainable AI Engine", type: "AI" },
      { id: "H-03", timestamp: "2026-03-24 09:37:00", stage: "Assigned for Human Verification", description: "Assigned to Authorized Reviewer Dr. Rajeshwar Sharma", actor: "Queue Dispatcher", type: "SYSTEM" },
    ],
    attributeMatrix: [
      {
        attributeName: "Boundary Geometry",
        municipalGis: "Polygon (8 vertices, 1998 survey)",
        propertyRegistry: "Metes & bounds deed record",
        droneSurvey: "High-precision RTK Polygon (24 vertices, 2026)",
        recommendedCandidate: "High-precision RTK Polygon (24 vertices, 2026)",
        observationDate: { municipalGis: "2018-04-12", propertyRegistry: "2012-09-18", droneSurvey: "2026-02-14" },
        evidenceId: "EVID-014-A",
      },
      {
        attributeName: "Calculated Area",
        municipalGis: "1,228.4 m²",
        propertyRegistry: "1,240.0 m² (stated in deed)",
        droneSurvey: "1,215.2 m² (RTK measured)",
        recommendedCandidate: "1,215.2 m²",
        observationDate: { municipalGis: "2018-04-12", propertyRegistry: "2012-09-18", droneSurvey: "2026-02-14" },
        evidenceId: "EVID-014-B",
      },
      {
        attributeName: "Land Use Classification",
        municipalGis: "Commercial / Office Complex",
        propertyRegistry: "Commercial Commercial Mixed",
        droneSurvey: "Commercial Ground + 4 Floors",
        recommendedCandidate: "Commercial / Office Complex",
        observationDate: { municipalGis: "2023-01-10", propertyRegistry: "2012-09-18", droneSurvey: "2026-02-14" },
        evidenceId: "EVID-014-C",
      },
      {
        attributeName: "Tenure / Title Status",
        municipalGis: "Freehold Municipal Holding",
        propertyRegistry: "Registered Conveyance Deed #8829/B",
        droneSurvey: "Occupied & Verified on-site",
        recommendedCandidate: "Registered Conveyance Deed #8829/B",
        observationDate: { municipalGis: "2022-11-05", propertyRegistry: "2012-09-18", droneSurvey: "2026-02-14" },
        evidenceId: "EVID-014-D",
      },
    ],
  },
  {
    id: "VER-015",
    entityId: "PARCEL-DEMO-015",
    propertyId: "PROP-BLR-560001-1042",
    conflictId: "CONF-015",
    recommendationId: "REC-015",
    conflictType: "OVERLAPPING_CLAIM",
    severity: "CRITICAL",
    aiRecommendationTitle: "Municipal Survey with Revenue Deed Boundary Overlay",
    recommendedCandidateSource: "Joint Survey Cadastral",
    confidence: 68,
    evidenceStrength: "MEDIUM",
    evidenceIds: ["EVID-015-A", "EVID-015-B"],
    sourceCount: 3,
    sources: [
      { id: "MUNICIPAL_GIS", name: "BBMP Municipal GIS", quality: 86, type: "Cadastre" },
      { id: "PROPERTY_REGISTRY", name: "Kaveri Deed Registry", quality: 80, type: "Deeds" },
      { id: "SURVEY_2026", name: "Survey of Karnataka 2025", quality: 92, type: "Total Station" },
    ],
    unresolvedCount: 2,
    unresolvedItems: ["Severe 14.8 m² physical overlap on Western setback boundary", "Requires field officer on-site inspection"],
    createdDate: "2026-03-24 08:15:00",
    status: "IN_REVIEW",
    assignedReviewer: CURRENT_REVIEWER,
    originalSourceGeometryPreserved: true,
    coordinates: [77.5946, 12.9716],
    history: [
      { id: "H-15-1", timestamp: "2026-03-24 08:15:00", stage: "Case Initialized", description: "Critical overlap detected during cross-dataset alignment", actor: "Conflict Engine", type: "SYSTEM" },
      { id: "H-15-2", timestamp: "2026-03-24 09:00:00", stage: "Marked In Review", description: "Reviewer started spatial inspection", actor: "Dr. Rajeshwar Sharma", type: "HUMAN_REVIEWER" },
    ],
    attributeMatrix: [
      {
        attributeName: "Boundary Geometry",
        municipalGis: "Polygon (6 vertices)",
        propertyRegistry: "Schedule A & B Deed Boundary",
        droneSurvey: "Survey 2025 Total Station Boundary",
        recommendedCandidate: "Survey 2025 Total Station Boundary",
        observationDate: { municipalGis: "2021-08-11", propertyRegistry: "2015-04-19", droneSurvey: "2025-11-20" },
        evidenceId: "EVID-015-A",
      },
      {
        attributeName: "Calculated Area",
        municipalGis: "840.0 m²",
        propertyRegistry: "854.8 m²",
        droneSurvey: "840.5 m²",
        recommendedCandidate: "840.5 m²",
        observationDate: { municipalGis: "2021-08-11", propertyRegistry: "2015-04-19", droneSurvey: "2025-11-20" },
        evidenceId: "EVID-015-B",
      },
    ],
  },
  {
    id: "VER-016",
    entityId: "PARCEL-DEMO-016",
    propertyId: "PROP-DEL-110001-9031",
    conflictId: "CONF-016",
    recommendationId: "REC-016",
    conflictType: "ATTRIBUTE_DISCREPANCY",
    severity: "MEDIUM",
    aiRecommendationTitle: "Harmonized Land-Use & Address Index",
    recommendedCandidateSource: "DDA Master Plan & Municipal Tax Registry",
    confidence: 88,
    evidenceStrength: "HIGH",
    evidenceIds: ["EVID-016-A", "EVID-016-B", "EVID-016-C"],
    sourceCount: 2,
    sources: [
      { id: "MUNICIPAL_GIS", name: "MCD GIS Portal", quality: 82, type: "Urban GIS" },
      { id: "PROPERTY_REGISTRY", name: "Delhi Revenue Dept", quality: 89, type: "Revenue Records" },
    ],
    unresolvedCount: 0,
    unresolvedItems: [],
    createdDate: "2026-03-23 16:40:00",
    status: "APPROVED",
    assignedReviewer: CURRENT_REVIEWER,
    decisionTimestamp: "2026-03-24 10:14:00",
    decisionNote: "Approved harmonization candidate. Historical deed records verify the unified commercial title.",
    originalSourceGeometryPreserved: true,
    coordinates: [77.2090, 28.6139],
    history: [
      { id: "H-16-1", timestamp: "2026-03-23 16:40:00", stage: "Case Initialized", description: "Created case", actor: "System", type: "SYSTEM" },
      { id: "H-16-2", timestamp: "2026-03-24 10:14:00", stage: "Approved", description: "Authorized reviewer approved candidate without geometry modification", actor: "Dr. Rajeshwar Sharma", type: "HUMAN_REVIEWER" },
    ],
    attributeMatrix: [
      {
        attributeName: "Primary Land Use",
        municipalGis: "Mixed Commercial",
        propertyRegistry: "Commercial Showroom",
        droneSurvey: "Not Surveyed",
        recommendedCandidate: "Mixed Commercial",
        observationDate: { municipalGis: "2023-05-19", propertyRegistry: "2020-02-11", droneSurvey: "N/A" },
        evidenceId: "EVID-016-A",
      },
    ],
  },
  {
    id: "VER-017",
    entityId: "PARCEL-DEMO-017",
    propertyId: "PROP-HYD-500081-4412",
    conflictId: "CONF-017",
    recommendationId: "REC-017",
    conflictType: "HISTORICAL_DRIFT",
    severity: "LOW",
    aiRecommendationTitle: "Updated Road Widening Setback Cadastre",
    recommendedCandidateSource: "GHMC Town Planning 2026",
    confidence: 94,
    evidenceStrength: "HIGH",
    evidenceIds: ["EVID-017-A"],
    sourceCount: 3,
    sources: [
      { id: "MUNICIPAL_GIS", name: "GHMC Master Plan GIS", quality: 90, type: "Urban Spatial" },
      { id: "PROPERTY_REGISTRY", name: "Dharani Portal", quality: 88, type: "Integrated Land Records" },
      { id: "SURVEY_2026", name: "Drone Master Survey 2026", quality: 97, type: "Drone Photogrammetry" },
    ],
    unresolvedCount: 0,
    unresolvedItems: [],
    createdDate: "2026-03-24 11:20:00",
    status: "PENDING_REVIEW",
    assignedReviewer: CURRENT_REVIEWER,
    originalSourceGeometryPreserved: true,
    coordinates: [78.3826, 17.4435],
    history: [
      { id: "H-17-1", timestamp: "2026-03-24 11:20:00", stage: "Case Initialized", description: "Road widening acquisition recorded", actor: "Conflict Engine", type: "SYSTEM" },
    ],
    attributeMatrix: [
      {
        attributeName: "Road Setback Dedication",
        municipalGis: "4.5m Widening Required",
        propertyRegistry: "Original 1994 Boundary",
        droneSurvey: "Physical setback constructed & paved",
        recommendedCandidate: "4.5m Setback Dedication Incorporated",
        observationDate: { municipalGis: "2025-09-12", propertyRegistry: "1994-03-01", droneSurvey: "2026-01-10" },
        evidenceId: "EVID-017-A",
      },
    ],
  },
  {
    id: "VER-018",
    entityId: "PARCEL-DEMO-018",
    propertyId: "PROP-CHE-600001-7102",
    conflictId: "CONF-018",
    recommendationId: "REC-018",
    conflictType: "BOUNDARY_MISMATCH",
    severity: "HIGH",
    aiRecommendationTitle: "Revenue Survey 2024 Base",
    recommendedCandidateSource: "Survey of Tamil Nadu",
    confidence: 45,
    evidenceStrength: "LOW",
    evidenceIds: ["EVID-018-A"],
    sourceCount: 2,
    sources: [
      { id: "MUNICIPAL_GIS", name: "GCC Spatial Cell", quality: 72, type: "Municipal GIS" },
      { id: "PROPERTY_REGISTRY", name: "TN Reginet Deeds", quality: 65, type: "Registry" },
    ],
    unresolvedCount: 3,
    unresolvedItems: ["Low confidence detection (<50%)", "Missing high-res ortho imagery", "Deed description ambiguous"],
    createdDate: "2026-03-24 07:45:00",
    status: "NEEDS_MORE_EVIDENCE",
    assignedReviewer: CURRENT_REVIEWER,
    originalSourceGeometryPreserved: true,
    coordinates: [80.2707, 13.0827],
    history: [
      { id: "H-18-1", timestamp: "2026-03-24 07:45:00", stage: "Case Initialized", description: "Low confidence anomaly flagged", actor: "AI Engine", type: "AI" },
      { id: "H-18-2", timestamp: "2026-03-24 08:30:00", stage: "Returned for Evidence", description: "Missing survey ground-control points", actor: "Dr. Rajeshwar Sharma", type: "HUMAN_REVIEWER" },
    ],
    attributeMatrix: [
      {
        attributeName: "Corner Markers",
        municipalGis: "Unverified approximation",
        propertyRegistry: "Natural boundary (canal / tree)",
        droneSurvey: "Not Available",
        recommendedCandidate: "Requires DGPS Field Survey",
        observationDate: { municipalGis: "2016-04-10", propertyRegistry: "2008-01-20", droneSurvey: "N/A" },
        evidenceId: "EVID-018-A",
      },
    ],
  },
];

// Audit trail storage (in-memory persistent during session)
let AUDIT_LOGS: AuditEvent[] = [
  {
    id: "AUD-2026-09121",
    verificationId: "VER-016",
    entityId: "PARCEL-DEMO-016",
    recommendationId: "REC-016",
    reviewerId: CURRENT_REVIEWER.id,
    reviewerName: CURRENT_REVIEWER.name,
    action: "APPROVE_CANDIDATE",
    previousStatus: "IN_REVIEW",
    newStatus: "APPROVED",
    timestamp: "2026-03-24 10:14:00",
    decisionNote: "Approved harmonization candidate. Historical deed records verify the unified commercial title.",
    immutableIntegrityHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
];

// Listeners for reactive updates
type QueueListener = (cases: VerificationCase[]) => void;
type AuditListener = (audits: AuditEvent[]) => void;
const queueListeners: Set<QueueListener> = new Set();
const auditListeners: Set<AuditListener> = new Set();

function notifyQueue() {
  queueListeners.forEach((fn) => fn([...MOCK_VERIFICATION_QUEUE]));
}

function notifyAudit() {
  auditListeners.forEach((fn) => fn([...AUDIT_LOGS]));
}

// ---------------------------------------------------------------------------
// Service Functions
// ---------------------------------------------------------------------------

export function getVerificationQueue(): VerificationCase[] {
  return [...MOCK_VERIFICATION_QUEUE];
}

export function getVerificationCase(verificationId: string): VerificationCase | undefined {
  return MOCK_VERIFICATION_QUEUE.find((c) => c.id === verificationId);
}

export function subscribeVerificationQueue(listener: QueueListener): () => void {
  queueListeners.add(listener);
  listener([...MOCK_VERIFICATION_QUEUE]);
  return () => queueListeners.delete(listener);
}

export function subscribeAuditLogs(listener: AuditListener): () => void {
  auditListeners.add(listener);
  listener([...AUDIT_LOGS]);
  return () => auditListeners.delete(listener);
}

export function getAuditHistory(verificationId?: string): AuditEvent[] {
  if (verificationId) {
    return AUDIT_LOGS.filter((a) => a.verificationId === verificationId);
  }
  return [...AUDIT_LOGS];
}

export function markInReview(verificationId: string, reviewer: ReviewerInfo = CURRENT_REVIEWER): VerificationCase | undefined {
  const c = MOCK_VERIFICATION_QUEUE.find((x) => x.id === verificationId);
  if (!c) return undefined;

  const prev = c.status;
  c.status = "IN_REVIEW";
  c.assignedReviewer = reviewer;

  const event: VerificationHistoryEvent = {
    id: `H-${Date.now()}`,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    stage: "Review Initiated",
    description: `Case opened and placed in active review by ${reviewer.name}`,
    actor: reviewer.name,
    type: "HUMAN_REVIEWER",
  };
  c.history.push(event);

  const audit: AuditEvent = {
    id: `AUD-${Date.now()}`,
    verificationId: c.id,
    entityId: c.entityId,
    recommendationId: c.recommendationId,
    reviewerId: reviewer.id,
    reviewerName: reviewer.name,
    action: "MARK_IN_REVIEW",
    previousStatus: prev,
    newStatus: "IN_REVIEW",
    timestamp: event.timestamp,
    decisionNote: "Started active review session.",
    immutableIntegrityHash: generateHash(`MARK_IN_REVIEW-${c.id}-${Date.now()}`),
  };
  AUDIT_LOGS.unshift(audit);

  notifyQueue();
  notifyAudit();
  return { ...c };
}

export function approveRecommendation(
  verificationId: string,
  decisionNote: string,
  reviewer: ReviewerInfo = CURRENT_REVIEWER
): VerificationCase | undefined {
  const c = MOCK_VERIFICATION_QUEUE.find((x) => x.id === verificationId);
  if (!c) return undefined;

  const prev = c.status;
  const now = new Date().toISOString().replace("T", " ").substring(0, 19);
  c.status = "APPROVED";
  c.decisionTimestamp = now;
  c.decisionNote = decisionNote;
  c.assignedReviewer = reviewer;

  c.history.push({
    id: `H-${Date.now()}`,
    timestamp: now,
    stage: "Human Decision: APPROVED",
    description: `Authorized reviewer approved harmonization candidate: ${c.aiRecommendationTitle}. Note: "${decisionNote}"`,
    actor: reviewer.name,
    type: "HUMAN_REVIEWER",
  });

  const audit: AuditEvent = {
    id: `AUD-${Date.now()}`,
    verificationId: c.id,
    entityId: c.entityId,
    recommendationId: c.recommendationId,
    reviewerId: reviewer.id,
    reviewerName: reviewer.name,
    action: "APPROVE_CANDIDATE",
    previousStatus: prev,
    newStatus: "APPROVED",
    timestamp: now,
    decisionNote,
    details: {
      approvedCandidate: c.aiRecommendationTitle,
      confidence: c.confidence,
      supportingEvidenceIds: c.evidenceIds,
    },
    immutableIntegrityHash: generateHash(`APPROVE-${c.id}-${now}-${decisionNote}`),
  };
  AUDIT_LOGS.unshift(audit);

  notifyQueue();
  notifyAudit();
  return { ...c };
}

export function modifyCandidate(
  verificationId: string,
  modifiedAttributes: Record<string, string>,
  modifiedGeometrySource: string,
  decisionNote: string,
  reviewer: ReviewerInfo = CURRENT_REVIEWER
): VerificationCase | undefined {
  const c = MOCK_VERIFICATION_QUEUE.find((x) => x.id === verificationId);
  if (!c) return undefined;

  const prev = c.status;
  const now = new Date().toISOString().replace("T", " ").substring(0, 19);
  c.status = "MODIFIED";
  c.decisionTimestamp = now;
  c.decisionNote = decisionNote;
  c.modifiedAttributes = modifiedAttributes;
  c.modifiedGeometrySource = modifiedGeometrySource;
  c.assignedReviewer = reviewer;

  // Update attribute matrix view with reviewer values
  c.attributeMatrix = c.attributeMatrix.map((attr) => {
    if (modifiedAttributes[attr.attributeName]) {
      return {
        ...attr,
        isModified: true,
        reviewerValue: modifiedAttributes[attr.attributeName],
      };
    }
    return attr;
  });

  c.history.push({
    id: `H-${Date.now()}`,
    timestamp: now,
    stage: "Human Decision: MODIFIED",
    description: `Authorized reviewer modified candidate values. Note: "${decisionNote}"`,
    actor: reviewer.name,
    type: "HUMAN_REVIEWER",
  });

  const audit: AuditEvent = {
    id: `AUD-${Date.now()}`,
    verificationId: c.id,
    entityId: c.entityId,
    recommendationId: c.recommendationId,
    reviewerId: reviewer.id,
    reviewerName: reviewer.name,
    action: "MODIFY_CANDIDATE",
    previousStatus: prev,
    newStatus: "MODIFIED",
    timestamp: now,
    decisionNote,
    details: {
      modifiedAttributes,
      modifiedGeometrySource,
    },
    immutableIntegrityHash: generateHash(`MODIFY-${c.id}-${now}-${JSON.stringify(modifiedAttributes)}`),
  };
  AUDIT_LOGS.unshift(audit);

  notifyQueue();
  notifyAudit();
  return { ...c };
}

export function rejectRecommendation(
  verificationId: string,
  rejectionReason: string,
  decisionNote: string,
  reviewer: ReviewerInfo = CURRENT_REVIEWER
): VerificationCase | undefined {
  const c = MOCK_VERIFICATION_QUEUE.find((x) => x.id === verificationId);
  if (!c) return undefined;

  const prev = c.status;
  const now = new Date().toISOString().replace("T", " ").substring(0, 19);
  c.status = "REJECTED";
  c.rejectionReason = rejectionReason;
  c.decisionTimestamp = now;
  c.decisionNote = decisionNote;
  c.assignedReviewer = reviewer;

  c.history.push({
    id: `H-${Date.now()}`,
    timestamp: now,
    stage: "Human Decision: REJECTED",
    description: `Candidate rejected by reviewer. Reason: [${rejectionReason}]. Note: "${decisionNote}"`,
    actor: reviewer.name,
    type: "HUMAN_REVIEWER",
  });

  const audit: AuditEvent = {
    id: `AUD-${Date.now()}`,
    verificationId: c.id,
    entityId: c.entityId,
    recommendationId: c.recommendationId,
    reviewerId: reviewer.id,
    reviewerName: reviewer.name,
    action: "REJECT_RECOMMENDATION",
    previousStatus: prev,
    newStatus: "REJECTED",
    timestamp: now,
    decisionNote: `[${rejectionReason}] ${decisionNote}`,
    details: { rejectionReason },
    immutableIntegrityHash: generateHash(`REJECT-${c.id}-${now}-${rejectionReason}`),
  };
  AUDIT_LOGS.unshift(audit);

  notifyQueue();
  notifyAudit();
  return { ...c };
}

export function deferCase(
  verificationId: string,
  deferReason: string,
  followUpDate: string,
  decisionNote: string,
  reviewer: ReviewerInfo = CURRENT_REVIEWER
): VerificationCase | undefined {
  const c = MOCK_VERIFICATION_QUEUE.find((x) => x.id === verificationId);
  if (!c) return undefined;

  const prev = c.status;
  const now = new Date().toISOString().replace("T", " ").substring(0, 19);
  c.status = "DEFERRED";
  c.deferReason = deferReason;
  c.deferFollowUpDate = followUpDate;
  c.decisionTimestamp = now;
  c.decisionNote = decisionNote;
  c.assignedReviewer = reviewer;

  c.history.push({
    id: `H-${Date.now()}`,
    timestamp: now,
    stage: "Human Decision: DEFERRED",
    description: `Case deferred until ${followUpDate || "further notice"}. Reason: [${deferReason}]. Note: "${decisionNote}"`,
    actor: reviewer.name,
    type: "HUMAN_REVIEWER",
  });

  const audit: AuditEvent = {
    id: `AUD-${Date.now()}`,
    verificationId: c.id,
    entityId: c.entityId,
    recommendationId: c.recommendationId,
    reviewerId: reviewer.id,
    reviewerName: reviewer.name,
    action: "DEFER_CASE",
    previousStatus: prev,
    newStatus: "DEFERRED",
    timestamp: now,
    decisionNote: `[${deferReason}] ${decisionNote}`,
    details: { deferReason, followUpDate },
    immutableIntegrityHash: generateHash(`DEFER-${c.id}-${now}-${deferReason}`),
  };
  AUDIT_LOGS.unshift(audit);

  notifyQueue();
  notifyAudit();
  return { ...c };
}

export function requestMoreEvidence(
  verificationId: string,
  evidenceTypes: string[],
  decisionNote: string,
  reviewer: ReviewerInfo = CURRENT_REVIEWER
): VerificationCase | undefined {
  const c = MOCK_VERIFICATION_QUEUE.find((x) => x.id === verificationId);
  if (!c) return undefined;

  const prev = c.status;
  const now = new Date().toISOString().replace("T", " ").substring(0, 19);
  c.status = "NEEDS_MORE_EVIDENCE";
  c.requestedEvidenceTypes = evidenceTypes;
  c.decisionTimestamp = now;
  c.decisionNote = decisionNote;
  c.assignedReviewer = reviewer;

  c.history.push({
    id: `H-${Date.now()}`,
    timestamp: now,
    stage: "Human Decision: REQUEST MORE EVIDENCE",
    description: `Returned for additional evidence: [${evidenceTypes.join(", ")}]. Requirements: "${decisionNote}"`,
    actor: reviewer.name,
    type: "HUMAN_REVIEWER",
  });

  const audit: AuditEvent = {
    id: `AUD-${Date.now()}`,
    verificationId: c.id,
    entityId: c.entityId,
    recommendationId: c.recommendationId,
    reviewerId: reviewer.id,
    reviewerName: reviewer.name,
    action: "REQUEST_MORE_EVIDENCE",
    previousStatus: prev,
    newStatus: "NEEDS_MORE_EVIDENCE",
    timestamp: now,
    decisionNote,
    details: { requestedEvidenceTypes: evidenceTypes },
    immutableIntegrityHash: generateHash(`EVIDENCE_REQ-${c.id}-${now}-${evidenceTypes.join(",")}`),
  };
  AUDIT_LOGS.unshift(audit);

  notifyQueue();
  notifyAudit();
  return { ...c };
}

// Simple deterministic synthetic hash generator for audit integrity proof
function generateHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `sha256:verified_${hex}a9f4c8996fb92427ae41e4649b934ca495991b7852b855`.substring(0, 64);
}
