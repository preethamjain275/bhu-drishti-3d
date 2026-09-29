/**
 * BHOO-MITRA AI — Urban Land Intelligence Platform
 * TypeScript type definitions for geospatial domain entities.
 *
 * These types define the data model for the platform.
 * All IDs in demo data follow the pattern: PREFIX-DEMO-NNN
 */

// ---------------------------------------------------------------------------
// Coordinate Reference Systems
// ---------------------------------------------------------------------------

export type CRSCode = `EPSG:${number}` | "Unknown" | "Custom";

export interface CoordinateSystem {
  code: CRSCode;
  name: string;
  unit: "degree" | "metre" | "foot";
  isGeographic: boolean;
}

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

export type GeometryType =
  | "Point"
  | "MultiPoint"
  | "LineString"
  | "MultiLineString"
  | "Polygon"
  | "MultiPolygon"
  | "GeometryCollection"
  | "Raster";

export interface BoundingBox {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

// ---------------------------------------------------------------------------
// Data Source
// ---------------------------------------------------------------------------

export type SourceAuthority = "Official" | "High" | "Medium" | "Supporting" | "Unknown";
export type SourceStatus =
  | "connected"
  | "processing"
  | "ready"
  | "crs-review"
  | "error"
  | "queued";

export interface DataSource {
  /** Unique identifier. Demo pattern: SOURCE-CAD-001 */
  id: string;
  name: string;
  organization: string;
  category:
    | "Cadastral"
    | "Municipal GIS"
    | "Survey"
    | "Imagery"
    | "Revenue"
    | "Administrative"
    | "Other";
  format: string;
  crs: CRSCode | null;
  geometryType: GeometryType;
  recordCount: number | null;
  captureYear: number;
  authority: SourceAuthority;
  qualityScore: number; // 0–100
  spatialAccuracy: string;
  metadataCompleteness: "Complete" | "Partial" | "Minimal" | "Unknown";
  status: SourceStatus;
  processingProgress: number; // 0–100
  uploadedAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
  boundingBox: BoundingBox | null;
  tags: string[];
}

// ---------------------------------------------------------------------------
// Source Asset (individual file/layer within a DataSource)
// ---------------------------------------------------------------------------

export interface SourceAsset {
  /** Demo pattern: ASSET-DEMO-001 */
  id: string;
  sourceId: string;
  name: string;
  layerName: string;
  format: string;
  fileSizeBytes: number;
  recordCount: number;
  geometryType: GeometryType;
  crs: CRSCode | null;
  uploadedAt: string;
}

// ---------------------------------------------------------------------------
// Canonical Entity (harmonized spatial entity)
// ---------------------------------------------------------------------------

export type EntityType = "Parcel" | "Building" | "Road" | "UtilityNetwork" | "AdministrativeBoundary" | "Other";
export type EntityStatus = "Draft" | "Candidate" | "UnderReview" | "Verified" | "Deprecated";

export interface CanonicalEntity {
  /** Demo pattern: PARCEL-DEMO-001 */
  id: string;
  type: EntityType;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  verifiedAt: string | null;
  verifiedBy: string | null;
  observationIds: string[];
  attributes: Record<string, string | number | boolean | null>;
  boundingBox: BoundingBox | null;
  areaSquareMetres: number | null;
  administrativeUnit: string | null;
  confidenceScore: number; // 0–1
}

// ---------------------------------------------------------------------------
// Entity Observation (source-specific record of an entity)
// ---------------------------------------------------------------------------

export interface EntityObservation {
  /** Demo pattern: OBS-DEMO-001 */
  id: string;
  canonicalEntityId: string;
  sourceId: string;
  captureDate: string;
  attributes: Record<string, string | number | boolean | null>;
  geometryWkt: string | null;
  areaSquareMetres: number | null;
  positionAccuracyMetres: number | null;
  notes: string;
}

// ---------------------------------------------------------------------------
// Conflict
// ---------------------------------------------------------------------------

export type ConflictType =
  | "BoundaryDifference"
  | "Overlap"
  | "Gap"
  | "PositionalDifference"
  | "AttributeConflict"
  | "LandUseConflict"
  | "EntityMatchingAmbiguity"
  | "TemporalDifference"
  | "CRSMismatch"
  | "TopologyError";

export type ConflictSeverity = "Critical" | "High" | "Medium" | "Low";
export type ConflictStatus =
  | "Open"
  | "Investigating"
  | "AwaitingEvidence"
  | "ReadyForReview"
  | "Resolved"
  | "Dismissed";

export interface ConflictCase {
  /** Demo pattern: CONFLICT-DEMO-001 */
  id: string;
  type: ConflictType;
  severity: ConflictSeverity;
  status: ConflictStatus;
  entityId: string | null;
  sourceIds: string[];
  detectedAt: string;
  updatedAt: string;
  assignedTo: string | null;
  detectionConfidence: number; // 0–1
  spatialMeasure: string;
  administrativeUnit: string;
  reasoning: string[];
  attributeDifferences: AttributeDifference[];
  evidenceIds: string[];
  notes: string[];
}

export interface AttributeDifference {
  field: string;
  sourceAValue: string | null;
  sourceBValue: string | null;
}

// ---------------------------------------------------------------------------
// Conflict Evidence
// ---------------------------------------------------------------------------

export type EvidenceType =
  | "ScannedDocument"
  | "MutationEntry"
  | "SurveySketch"
  | "SatelliteImagery"
  | "DroneCapture"
  | "FieldPhoto"
  | "LegalOrder"
  | "CitizenReport"
  | "SystemLog";

export type EvidenceStrength = "Strong" | "Moderate" | "Weak" | "Unverified";

export interface ConflictEvidence {
  /** Demo pattern: EVIDENCE-DEMO-001 */
  id: string;
  conflictId: string;
  type: EvidenceType;
  title: string;
  description: string;
  fileUrl: string | null;
  capturedAt: string;
  uploadedAt: string;
  uploadedBy: string;
  strength: EvidenceStrength;
  tags: string[];
  metadata: Record<string, string>;
}

// ---------------------------------------------------------------------------
// AI Recommendation
// ---------------------------------------------------------------------------

export type RecommendationType =
  | "AcceptSourceA"
  | "AcceptSourceB"
  | "Merge"
  | "Split"
  | "RequestFieldSurvey"
  | "RequestLegalReview"
  | "Dismiss";

export interface Recommendation {
  /** Demo pattern: REC-DEMO-001 */
  id: string;
  conflictId: string;
  type: RecommendationType;
  rationale: string;
  confidence: number; // 0–1
  generatedAt: string;
  generatedBy: "RuleEngine" | "AIAssisted";
  isAccepted: boolean | null;
  acceptedBy: string | null;
  acceptedAt: string | null;
}

// ---------------------------------------------------------------------------
// Verification
// ---------------------------------------------------------------------------

export type VerificationDecision = "Accepted" | "Rejected" | "ReturnedForEvidence";

export interface VerificationRecord {
  /** Demo pattern: VER-DEMO-001 */
  id: string;
  entityId: string;
  conflictIds: string[];
  decision: VerificationDecision;
  decidedBy: string;
  decidedAt: string;
  reason: string;
  notes: string;
  candidateVersion: number;
  checklistCompleted: string[];
  acceptedDifferences: AcceptedDifference[];
  auditEventIds: string[];
}

export interface AcceptedDifference {
  field: string;
  conflictId: string;
  status: "Resolved" | "AcceptedAsDifference" | "Unresolved" | "NotApplicable";
  reason: string;
}

// ---------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------

export type AuditEventType =
  | "SourceRegistered"
  | "SourceProcessingStarted"
  | "SourceProcessingCompleted"
  | "ConflictDetected"
  | "ConflictStatusChanged"
  | "EvidenceAttached"
  | "CandidateCreated"
  | "CandidateModified"
  | "VerificationStarted"
  | "CandidateAccepted"
  | "CandidateRejected"
  | "CandidateReturnedForEvidence"
  | "RecordVerified"
  | "NoteAdded"
  | "SystemEvent";

export interface AuditEvent {
  /** Demo pattern: AUDIT-DEMO-001 */
  id: string;
  type: AuditEventType;
  entityId: string | null;
  conflictId: string | null;
  sourceId: string | null;
  performedBy: string;
  performedAt: string;
  version: number;
  detail: string;
  metadata: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Quality Signal
// ---------------------------------------------------------------------------

export type QualityDimension =
  | "Completeness"
  | "PositionalAccuracy"
  | "AttributeAccuracy"
  | "TemporalCurrency"
  | "LogicalConsistency"
  | "Lineage";

export interface QualitySignal {
  /** Demo pattern: QUALITY-DEMO-001 */
  id: string;
  sourceId: string;
  dimension: QualityDimension;
  score: number; // 0–100
  assessedAt: string;
  method: "Automated" | "Manual" | "Hybrid";
  detail: string;
  threshold: number;
  passes: boolean;
}
