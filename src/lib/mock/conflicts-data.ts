/**
 * BHOO-MITRA AI — Conflict Intelligence & Investigation Demo Data
 *
 * ⚠️  SYNTHETIC DEMONSTRATION DATA — NOT REAL GOVERNMENT RECORDS ⚠️
 *
 * This module provides the data layer for Prompt 6 — Conflict Intelligence & Investigation.
 * All identifiers, coordinates, attributes, and scores are fictitious demo values.
 */

import type { FeatureCollection, Polygon, Feature } from "geojson";

export type ConflictType = "GEOMETRY" | "ATTRIBUTE" | "TEMPORAL" | "TOPOLOGY";

export type ConflictSubtype =
  // Geometry
  | "Boundary mismatch"
  | "Shape mismatch"
  | "Area discrepancy"
  // Attribute
  | "Land-use mismatch"
  | "Area attribute mismatch"
  | "Property reference mismatch"
  // Temporal
  | "Outdated observation"
  | "Update-date inconsistency"
  | "Historical change"
  // Topology
  | "Overlap"
  | "Gap"
  | "Invalid relationship";

export type ConflictSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type ConflictStatus =
  | "OPEN"
  | "INVESTIGATING"
  | "PENDING_VERIFICATION"
  | "RESOLVED"
  | "DEFERRED";

export interface GeometryMetrics {
  sourceAName: string;
  sourceBName: string;
  sourceCName?: string;
  sourceAArea: number; // m²
  sourceBArea: number; // m²
  sourceCArea?: number; // m²
  differenceArea: number; // m²
  differencePercent: number; // %
  perimeterDifference: number; // m
  centroidDisplacement: number; // m
  overlapPercentage: number; // %
}

export interface AttributeRow {
  attribute: string;
  municipal: string;
  registry: string;
  survey: string;
  status: "MATCH" | "CONFLICT" | "VARIES";
}

export interface TemporalObservation {
  source: string;
  date: string;
  observation: string;
  confidence: number;
  status: "CURRENT" | "STALE" | "MODIFIED";
}

export interface TopologyDetails {
  entityA: string;
  entityB: string;
  relationship: "OVERLAPS" | "GAPS" | "INVALID_ADJACENCY";
  problem: string;
  affectedAreaM2: number;
  ruleViolated: string;
  severity: ConflictSeverity;
}

export interface PrioritySignals {
  geometryDiscrepancy: "Critical" | "High" | "Medium" | "Low" | "None";
  sourceDisagreement: "High" | "Medium" | "Low";
  confidence: "High" | "Medium" | "Low";
  temporalInconsistency: "High" | "Medium" | "Low" | "None";
  overallPriority: ConflictSeverity;
  reason: string;
}

export interface ConflictExplanation {
  whyFlagged: string;
  sourceSummary: string[];
  evidenceBackedNote: string;
  reviewRecommendation: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  stage: string;
  description: string;
  actor: string;
}

export interface ConflictCase {
  id: string;
  entityId: string;
  type: ConflictType;
  subtype: ConflictSubtype;
  severity: ConflictSeverity;
  status: ConflictStatus;
  sources: string[];
  description: string;
  confidence: number; // 0-100
  detectedAt: string;
  ward: string;
  coordinates: [number, number]; // [lng, lat]
  geometryMetrics?: GeometryMetrics;
  attributeMatrix?: AttributeRow[];
  temporalObservations?: TemporalObservation[];
  topologyDetails?: TopologyDetails;
  prioritySignals: PrioritySignals;
  explanation: ConflictExplanation;
  timelineEvents: TimelineEvent[];
  evidenceIds: string[];
}

// ---------------------------------------------------------------------------
// Rich Synthetic Conflict Cases (12 demo cases)
// ---------------------------------------------------------------------------

export const SYNTHETIC_CONFLICTS: ConflictCase[] = [
  {
    id: "CONFLICT-DEMO-001",
    entityId: "PARCEL-DEMO-014",
    type: "GEOMETRY",
    subtype: "Boundary mismatch",
    severity: "HIGH",
    status: "OPEN",
    sources: ["Municipal GIS", "Property Registry", "Survey"],
    description: "Boundary mismatch detected between source observations. Northern perimeter extends 3.8m past municipal cadastral boundary.",
    confidence: 96,
    detectedAt: "2026-09-22 09:30 IST",
    ward: "Ward 14 — Central Zone",
    coordinates: [77.2018, 28.6012],
    geometryMetrics: {
      sourceAName: "Municipal GIS",
      sourceBName: "Property Registry",
      sourceCName: "Survey (Drone 2025)",
      sourceAArea: 2430,
      sourceBArea: 2510,
      sourceCArea: 2465,
      differenceArea: 80,
      differencePercent: 3.29,
      perimeterDifference: 4.8,
      centroidDisplacement: 1.85,
      overlapPercentage: 96.8,
    },
    attributeMatrix: [
      { attribute: "Land Use", municipal: "Commercial", registry: "Commercial", survey: "Commercial", status: "MATCH" },
      { attribute: "Reported Area", municipal: "2,430 m²", registry: "2,510 m²", survey: "2,465 m²", status: "CONFLICT" },
      { attribute: "Survey Reference", municipal: "SRV-2024-014", registry: "REG-9912", survey: "SRV-2024-014", status: "MATCH" },
      { attribute: "Owner Reference", municipal: "DL-IND-082", registry: "DL-IND-082", survey: "Verified Occupant", status: "MATCH" },
      { attribute: "Tax Assessment", municipal: "Current / Paid", registry: "Current", survey: "N/A", status: "MATCH" },
    ],
    temporalObservations: [
      { source: "Municipal GIS", date: "2024-06-12", observation: "Baseline cadastral boundary digitized from revenue sheets.", confidence: 84, status: "STALE" },
      { source: "Property Registry", date: "2025-01-18", observation: "Conveyance deed plan attached with modified northern setback.", confidence: 89, status: "CURRENT" },
      { source: "Drone Survey", date: "2025-11-04", observation: "High-resolution orthomosaic boundary showing physical perimeter wall.", confidence: 96, status: "CURRENT" },
    ],
    prioritySignals: {
      geometryDiscrepancy: "High",
      sourceDisagreement: "Medium",
      confidence: "High",
      temporalInconsistency: "Medium",
      overallPriority: "HIGH",
      reason: "Significant perimeter shift on commercial property with high multi-source confidence.",
    },
    explanation: {
      whyFlagged: "Three source observations represent the same entity with differing boundary geometry. Municipal GIS reports 2,430 m², Property Registry reports 2,510 m², and Survey reports 2,465 m².",
      sourceSummary: [
        "Municipal GIS digitized layer lags behind latest 2025 conveyance deed.",
        "Physical boundary wall aligns with 2,465 m² drone capture.",
        "Disputed 45 m² sliver along northern access corridor.",
      ],
      evidenceBackedNote: "Orthophoto (EVID-GEO-001) confirms compound wall at survey coordinates. Registry document deed plan (EVID-DOC-004) includes adjacent setback variance.",
      reviewRecommendation: "Recommend adopting Survey boundary (2,465 m²) as verified baseline and flag Municipal GIS for alignment update.",
    },
    timelineEvents: [
      { id: "EVT-01", timestamp: "2026-09-22 09:30", stage: "Detected", description: "Automated spatial harmonization flagged IoU deviation < 0.98.", actor: "BHOO-MITRA Spatial Engine" },
      { id: "EVT-02", timestamp: "2026-09-22 09:31", stage: "Compared", description: "Multi-source comparison generated for Municipal, Registry, and Drone Survey.", actor: "Harmonization Pipeline" },
      { id: "EVT-03", timestamp: "2026-09-22 09:32", stage: "Conflict Classified", description: "Classified as GEOMETRY → Boundary mismatch (Severity: HIGH, Confidence: 96%).", actor: "Classification Service" },
      { id: "EVT-04", timestamp: "2026-09-22 10:15", stage: "Investigation Opened", description: "Case queued for priority resolution in Ward 14.", actor: "System Dispatcher" },
    ],
    evidenceIds: ["EVID-GEO-001", "EVID-DOC-004", "EVID-ORTHO-019"],
  },
  {
    id: "CONFLICT-DEMO-002",
    entityId: "PARCEL-DEMO-002",
    type: "TOPOLOGY",
    subtype: "Overlap",
    severity: "CRITICAL",
    status: "INVESTIGATING",
    sources: ["Land Registry", "Municipal GIS"],
    description: "Spatial overlap of 118 m² detected between adjacent registered properties. Violates topological non-overlapping parcel rule.",
    confidence: 98,
    detectedAt: "2026-09-21 14:10 IST",
    ward: "Ward 12 — Commercial Hub",
    coordinates: [77.202, 28.6005],
    geometryMetrics: {
      sourceAName: "PARCEL-DEMO-002",
      sourceBName: "PARCEL-DEMO-003",
      sourceAArea: 1400,
      sourceBArea: 1100,
      differenceArea: 118,
      differencePercent: 8.43,
      perimeterDifference: 12.4,
      centroidDisplacement: 2.1,
      overlapPercentage: 8.4,
    },
    topologyDetails: {
      entityA: "PARCEL-DEMO-002",
      entityB: "PARCEL-DEMO-003",
      relationship: "OVERLAPS",
      problem: "Two registered titles claim identical 118 m² building footprint on eastern boundary.",
      affectedAreaM2: 118,
      ruleViolated: "ISO 19152 LADM / Rule T-01: No overlapping cadastral parcels permitted in singular tenure.",
      severity: "CRITICAL",
    },
    attributeMatrix: [
      { attribute: "Land Use", municipal: "Commercial", registry: "Commercial", survey: "Mixed Commercial", status: "MATCH" },
      { attribute: "Assigned Area", municipal: "1,400 m²", registry: "1,518 m²", survey: "1,400 m²", status: "CONFLICT" },
      { attribute: "Registration Date", municipal: "2022-04-10", registry: "2024-08-15", survey: "N/A", status: "CONFLICT" },
    ],
    prioritySignals: {
      geometryDiscrepancy: "Critical",
      sourceDisagreement: "High",
      confidence: "High",
      temporalInconsistency: "Medium",
      overallPriority: "CRITICAL",
      reason: "Active double-title encroachment risk with 118 m² shared spatial envelope.",
    },
    explanation: {
      whyFlagged: "Topology validation detected an invalid intersection polygon between PARCEL-DEMO-002 and PARCEL-DEMO-003.",
      sourceSummary: [
        "Registry deed in 2024 included eastern side passage already allocated in 2022 to Parcel 003.",
        "Municipal tax roll assesses both owners for the shared 118 m² footprint.",
      ],
      evidenceBackedNote: "Cadastral map sheet 12B shows original demarcation without eastern extension.",
      reviewRecommendation: "Escalate to Senior Revenue Officer for joint deed review and title boundary rectification.",
    },
    timelineEvents: [
      { id: "EVT-11", timestamp: "2026-09-21 14:10", stage: "Detected", description: "Topological intersection rule T-01 violated.", actor: "Topology Validator" },
      { id: "EVT-12", timestamp: "2026-09-21 14:15", stage: "Investigation Opened", description: "Assigned to Ward 12 fast-track resolution queue.", actor: "Auto Triage" },
    ],
    evidenceIds: ["EVID-TOP-002", "EVID-DEED-112"],
  },
  {
    id: "CONFLICT-DEMO-003",
    entityId: "PARCEL-DEMO-005",
    type: "ATTRIBUTE",
    subtype: "Land-use mismatch",
    severity: "HIGH",
    status: "OPEN",
    sources: ["Municipal GIS", "Revenue Records"],
    description: "Revenue records classify parcel as Agricultural / Green Zone, whereas Municipal GIS and latest survey indicate Industrial use.",
    confidence: 92,
    detectedAt: "2026-09-23 11:20 IST",
    ward: "Ward 15 — Industrial Corridor",
    coordinates: [77.2022, 28.602],
    attributeMatrix: [
      { attribute: "Land Use Category", municipal: "Industrial (Light)", registry: "Agricultural", survey: "Industrial Facility", status: "CONFLICT" },
      { attribute: "Zone Code", municipal: "IND-2", registry: "AGR-1", survey: "IND-2", status: "CONFLICT" },
      { attribute: "Permitted FAR", municipal: "1.75", registry: "0.20", survey: "N/A", status: "CONFLICT" },
      { attribute: "Recorded Area", municipal: "2,500 m²", registry: "2,500 m²", survey: "2,498 m²", status: "MATCH" },
    ],
    prioritySignals: {
      geometryDiscrepancy: "None",
      sourceDisagreement: "High",
      confidence: "High",
      temporalInconsistency: "High",
      overallPriority: "HIGH",
      reason: "High revenue impact — potential unpermitted land-use conversion or missing revenue mutation.",
    },
    explanation: {
      whyFlagged: "Master plan zoning and municipal tax assessments show active light manufacturing, but state revenue ledger was never updated from agricultural status.",
      sourceSummary: [
        "Revenue records list parcel as Agricultural Class II.",
        "Municipal factory license #ML-2023-909 issued in 2023.",
        "Satellite imagery confirms 1,800 m² industrial warehouse built in 2021.",
      ],
      evidenceBackedNote: "Satellite multispectral index (NDVI < 0.12, Built-up Index > 0.85) proves non-agricultural use.",
      reviewRecommendation: "Require revenue conversion certificate (CLU) verification and update revenue registry.",
    },
    timelineEvents: [
      { id: "EVT-21", timestamp: "2026-09-23 11:20", stage: "Detected", description: "Cross-attribute divergence detected.", actor: "Schema Normalizer" },
    ],
    evidenceIds: ["EVID-SAT-088", "EVID-LIC-441"],
  },
  {
    id: "CONFLICT-DEMO-004",
    entityId: "PARCEL-DEMO-001",
    type: "GEOMETRY",
    subtype: "Area discrepancy",
    severity: "MEDIUM",
    status: "OPEN",
    sources: ["Municipal GIS", "Property Registry"],
    description: "Calculated polygon area is 1,200 m², but registered title deed claims 1,280 m² (80 m² / 6.7% discrepancy).",
    confidence: 88,
    detectedAt: "2026-09-20 16:45 IST",
    ward: "Ward 11 — North Sector",
    coordinates: [77.2005, 28.6005],
    geometryMetrics: {
      sourceAName: "Municipal GIS",
      sourceBName: "Property Registry",
      sourceAArea: 1200,
      sourceBArea: 1280,
      differenceArea: 80,
      differencePercent: 6.67,
      perimeterDifference: 3.2,
      centroidDisplacement: 0.8,
      overlapPercentage: 93.7,
    },
    attributeMatrix: [
      { attribute: "Deed Area", municipal: "1,200 m²", registry: "1,280 m²", survey: "1,202 m²", status: "CONFLICT" },
      { attribute: "Land Use", municipal: "Residential", registry: "Residential", survey: "Residential", status: "MATCH" },
    ],
    prioritySignals: {
      geometryDiscrepancy: "Medium",
      sourceDisagreement: "Medium",
      confidence: "High",
      temporalInconsistency: "Low",
      overallPriority: "MEDIUM",
      reason: "Area exceeds 5% tolerance threshold on standard residential parcel.",
    },
    explanation: {
      whyFlagged: "Digital GIS boundary computes to 1,200 m² whereas legal document registers 1,280 m².",
      sourceSummary: ["Deed area likely included road widening reservation ceded in 2018."],
      evidenceBackedNote: "Road widening gazette notification GZ-2018-04 accounts for exactly 80 m² strip.",
      reviewRecommendation: "Update registry deed entry with road widening cession annexure.",
    },
    timelineEvents: [
      { id: "EVT-31", timestamp: "2026-09-20 16:45", stage: "Detected", description: "Area tolerance exceeded 5%.", actor: "Area Validator" },
    ],
    evidenceIds: ["EVID-GAZ-018"],
  },
  {
    id: "CONFLICT-DEMO-005",
    entityId: "PARCEL-DEMO-008",
    type: "TEMPORAL",
    subtype: "Outdated observation",
    severity: "MEDIUM",
    status: "INVESTIGATING",
    sources: ["Municipal GIS (2019)", "Drone Survey (2026)"],
    description: "Municipal GIS representation has not been refreshed since 2019. New 2026 drone survey shows parcel subdivided into two residential plots.",
    confidence: 94,
    detectedAt: "2026-09-24 08:15 IST",
    ward: "Ward 16 — Suburban Extension",
    coordinates: [77.2035, 28.6025],
    temporalObservations: [
      { source: "Municipal GIS", date: "2019-03-10", observation: "Single undivided plot of 2,100 m².", confidence: 70, status: "STALE" },
      { source: "Subdivision Deed", date: "2023-11-20", observation: "Plot split into 8A (1,050 m²) and 8B (1,050 m²).", confidence: 92, status: "CURRENT" },
      { source: "Drone Survey", date: "2026-08-02", observation: "Two distinct residential structures with dividing boundary wall.", confidence: 96, status: "CURRENT" },
    ],
    prioritySignals: {
      geometryDiscrepancy: "Medium",
      sourceDisagreement: "Medium",
      confidence: "High",
      temporalInconsistency: "High",
      overallPriority: "MEDIUM",
      reason: "7-year staleness in base municipal records missing legal subdivision.",
    },
    explanation: {
      whyFlagged: "Temporal gap of 7 years between municipal records and recent aerial survey.",
      sourceSummary: ["Physical reality and subdivision deed reflect two parcels; municipal records retain single entity."],
      evidenceBackedNote: "Drone orthomosaic clearly demarcates center partition wall and two power meter connections.",
      reviewRecommendation: "Split municipal GIS record into sub-parcels 8A and 8B with distinct municipal IDs.",
    },
    timelineEvents: [
      { id: "EVT-41", timestamp: "2026-09-24 08:15", stage: "Detected", description: "Temporal staleness threshold (> 3 years) triggered.", actor: "Lineage Monitor" },
    ],
    evidenceIds: ["EVID-SUB-2023", "EVID-DRONE-88"],
  },
  {
    id: "CONFLICT-DEMO-006",
    entityId: "PARCEL-DEMO-019",
    type: "TOPOLOGY",
    subtype: "Gap",
    severity: "LOW",
    status: "OPEN",
    sources: ["Municipal GIS", "Survey"],
    description: "Unassigned spatial gap (sliver of 24 m²) detected between PARCEL-DEMO-019 and public utility corridor.",
    confidence: 82,
    detectedAt: "2026-09-19 13:00 IST",
    ward: "Ward 14 — Central Zone",
    coordinates: [77.201, 28.6018],
    topologyDetails: {
      entityA: "PARCEL-DEMO-019",
      entityB: "PUBLIC-CORRIDOR-04",
      relationship: "GAPS",
      problem: "24 m² unassigned sliver between property boundary and road reservation line.",
      affectedAreaM2: 24,
      ruleViolated: "Cadastral Completeness / Rule T-04: No unallocated gaps permitted in urban fabric.",
      severity: "LOW",
    },
    prioritySignals: {
      geometryDiscrepancy: "Low",
      sourceDisagreement: "Low",
      confidence: "Medium",
      temporalInconsistency: "None",
      overallPriority: "LOW",
      reason: "Minor sliver gap under 30 m² without conflicting title claims.",
    },
    explanation: {
      whyFlagged: "Digitization gap between private parcel boundary and public utility corridor.",
      sourceSummary: ["Likely digitizing artifact from manual vectorization."],
      evidenceBackedNote: "Field survey confirms road easement extends up to property boundary.",
      reviewRecommendation: "Snap parcel boundary to utility corridor edge using automated tolerance snapping (0.5m).",
    },
    timelineEvents: [
      { id: "EVT-51", timestamp: "2026-09-19 13:00", stage: "Detected", description: "Topology gap flagged by clean-up pass.", actor: "Topology Validator" },
    ],
    evidenceIds: ["EVID-SNAP-019"],
  },
  {
    id: "CONFLICT-DEMO-007",
    entityId: "PARCEL-DEMO-022",
    type: "GEOMETRY",
    subtype: "Shape mismatch",
    severity: "HIGH",
    status: "INVESTIGATING",
    sources: ["Registry Cadastre", "Drone Survey"],
    description: "Significant shape mismatch. Registry cadastre records rectangular parcel (4 vertices), while survey identifies an L-shaped parcel with 6 vertices.",
    confidence: 95,
    detectedAt: "2026-09-22 17:10 IST",
    ward: "Ward 13 — East Gate",
    coordinates: [77.2028, 28.6015],
    geometryMetrics: {
      sourceAName: "Registry Cadastre",
      sourceBName: "Drone Survey",
      sourceAArea: 1850,
      sourceBArea: 1842,
      differenceArea: 190,
      differencePercent: 10.3,
      perimeterDifference: 18.5,
      centroidDisplacement: 3.4,
      overlapPercentage: 89.7,
    },
    prioritySignals: {
      geometryDiscrepancy: "High",
      sourceDisagreement: "High",
      confidence: "High",
      temporalInconsistency: "Medium",
      overallPriority: "HIGH",
      reason: "Shape irregularity with 10% non-overlapping area despite similar total area.",
    },
    explanation: {
      whyFlagged: "Vertex count and boundary geometry differ fundamentally between cadastral map and actual survey.",
      sourceSummary: ["Corner cutout acquired in 2021 for transformer installation was never reflected in registry map."],
      evidenceBackedNote: "Utility deed confirms 95 m² transfer to Electricity Board in 2021.",
      reviewRecommendation: "Update registry vector geometry to 6-vertex polygon reflecting utility easement cutout.",
    },
    timelineEvents: [
      { id: "EVT-61", timestamp: "2026-09-22 17:10", stage: "Detected", description: "Vertex topological divergence detected.", actor: "Geometry Comparator" },
    ],
    evidenceIds: ["EVID-ELEC-2021", "EVID-DRONE-022"],
  },
  {
    id: "CONFLICT-DEMO-008",
    entityId: "PARCEL-DEMO-031",
    type: "ATTRIBUTE",
    subtype: "Property reference mismatch",
    severity: "MEDIUM",
    status: "OPEN",
    sources: ["Municipal GIS", "Property Registry", "Survey"],
    description: "Discrepancy in official survey numbers and holding IDs across departments.",
    confidence: 86,
    detectedAt: "2026-09-23 15:30 IST",
    ward: "Ward 12 — Commercial Hub",
    coordinates: [77.2016, 28.6008],
    attributeMatrix: [
      { attribute: "Survey Number", municipal: "112/3A", registry: "112/3B", survey: "112/3A", status: "CONFLICT" },
      { attribute: "Holding ID", municipal: "HID-9901", registry: "HID-9901-REV", survey: "HID-9901", status: "VARIES" },
      { attribute: "Property Class", municipal: "Commercial", registry: "Commercial", survey: "Commercial", status: "MATCH" },
    ],
    prioritySignals: {
      geometryDiscrepancy: "Low",
      sourceDisagreement: "Medium",
      confidence: "High",
      temporalInconsistency: "Low",
      overallPriority: "MEDIUM",
      reason: "Survey number typo creates cross-department indexing failure.",
    },
    explanation: {
      whyFlagged: "Registry lists Survey Number as 112/3B while Municipal and physical survey records cite 112/3A.",
      sourceSummary: ["Typographical error in 2020 registry digitization ledger."],
      evidenceBackedNote: "Original physical deed volume 442 page 88 clearly reads 112/3A.",
      reviewRecommendation: "Issue registry corrigendum correcting 112/3B to 112/3A.",
    },
    timelineEvents: [
      { id: "EVT-71", timestamp: "2026-09-23 15:30", stage: "Detected", description: "Attribute identifier mismatch flagged.", actor: "Entity Matcher" },
    ],
    evidenceIds: ["EVID-DEED-VOL442"],
  },
  {
    id: "CONFLICT-DEMO-009",
    entityId: "PARCEL-DEMO-045",
    type: "TEMPORAL",
    subtype: "Update-date inconsistency",
    severity: "LOW",
    status: "RESOLVED",
    sources: ["State Revenue", "Municipal GIS"],
    description: "Municipal tax ledger reflects 2026 property tax assessment while revenue ledger timestamp is 2018.",
    confidence: 79,
    detectedAt: "2026-09-18 10:00 IST",
    ward: "Ward 11 — North Sector",
    coordinates: [77.2008, 28.6015],
    temporalObservations: [
      { source: "State Revenue", date: "2018-05-12", observation: "Original registration on record.", confidence: 80, status: "STALE" },
      { source: "Municipal GIS", date: "2026-01-10", observation: "Annual property tax assessment updated.", confidence: 95, status: "CURRENT" },
    ],
    prioritySignals: {
      geometryDiscrepancy: "None",
      sourceDisagreement: "Low",
      confidence: "Medium",
      temporalInconsistency: "Medium",
      overallPriority: "LOW",
      reason: "Administrative sync lag without boundary or ownership disputes.",
    },
    explanation: {
      whyFlagged: "Routine administrative lag between local municipal records and state revenue ledger.",
      sourceSummary: ["No spatial or ownership disagreement."],
      evidenceBackedNote: "Municipal tax clearance certificate verified.",
      reviewRecommendation: "Synchronize state revenue timestamp with municipal annual ledger.",
    },
    timelineEvents: [
      { id: "EVT-81", timestamp: "2026-09-18 10:00", stage: "Detected", description: "Temporal sync lag detected.", actor: "Audit Pipeline" },
      { id: "EVT-82", timestamp: "2026-09-24 16:00", stage: "Resolved", description: "Automated ledger sync approved.", actor: "Verification Officer" },
    ],
    evidenceIds: ["EVID-TAX-2026"],
  },
  {
    id: "CONFLICT-DEMO-010",
    entityId: "PARCEL-DEMO-050",
    type: "GEOMETRY",
    subtype: "Boundary mismatch",
    severity: "CRITICAL",
    status: "OPEN",
    sources: ["Municipal GIS", "Survey (LIDAR)"],
    description: "Major boundary shift of 5.2 meters on southern boundary bordering municipal drain corridor. Critical flood risk zone.",
    confidence: 97,
    detectedAt: "2026-09-24 14:20 IST",
    ward: "Ward 15 — Industrial Corridor",
    coordinates: [77.2032, 28.6019],
    geometryMetrics: {
      sourceAName: "Municipal GIS",
      sourceBName: "LIDAR Survey",
      sourceAArea: 3200,
      sourceBArea: 3420,
      differenceArea: 220,
      differencePercent: 6.87,
      perimeterDifference: 14.2,
      centroidDisplacement: 3.1,
      overlapPercentage: 93.1,
    },
    prioritySignals: {
      geometryDiscrepancy: "Critical",
      sourceDisagreement: "High",
      confidence: "High",
      temporalInconsistency: "Medium",
      overallPriority: "CRITICAL",
      reason: "Encroachment on flood buffer / public stormwater drain corridor.",
    },
    explanation: {
      whyFlagged: "High-precision airborne LIDAR survey reveals 220 m² perimeter fence built inside designated 6m stormwater drainage buffer.",
      sourceSummary: ["Municipal GIS shows 6m statutory buffer; on-ground compound wall encroaches 5.2m."],
      evidenceBackedNote: "LIDAR point cloud (EVID-LIDAR-050) shows 2.4m masonry wall constructed over drainage reserve.",
      reviewRecommendation: "Immediate physical inspection and enforcement of stormwater buffer boundary.",
    },
    timelineEvents: [
      { id: "EVT-91", timestamp: "2026-09-24 14:20", stage: "Detected", description: "Critical environmental buffer encroachment detected.", actor: "LIDAR Analyzer" },
      { id: "EVT-92", timestamp: "2026-09-24 14:22", stage: "Investigation Opened", description: "Flagged with CRITICAL severity for municipal engineering review.", actor: "Triage Engine" },
    ],
    evidenceIds: ["EVID-LIDAR-050", "EVID-ENV-DRAIN"],
  },
  {
    id: "CONFLICT-DEMO-011",
    entityId: "PARCEL-DEMO-058",
    type: "ATTRIBUTE",
    subtype: "Area attribute mismatch",
    severity: "LOW",
    status: "DEFERRED",
    sources: ["Municipal Records", "Tax Roll"],
    description: "Minor area recording variance (1,150 m² vs 1,152 m²) within 0.2% measurement tolerance.",
    confidence: 65,
    detectedAt: "2026-09-15 09:10 IST",
    ward: "Ward 13 — East Gate",
    coordinates: [77.2025, 28.6009],
    attributeMatrix: [
      { attribute: "Recorded Area", municipal: "1,150 m²", registry: "1,152 m²", survey: "1,150.8 m²", status: "VARIES" },
    ],
    prioritySignals: {
      geometryDiscrepancy: "Low",
      sourceDisagreement: "Low",
      confidence: "Low",
      temporalInconsistency: "None",
      overallPriority: "LOW",
      reason: "Difference is within standard rounding tolerance of 0.5%.",
    },
    explanation: {
      whyFlagged: "Minor 2 m² variance between tax roll square yards conversion and metric GIS polygon.",
      sourceSummary: ["Conversion rounding discrepancy (1,375 sq yd = 1,149.67 m² rounded up to 1,150 or 1,152)."],
      evidenceBackedNote: "Unit conversion audit confirms mathematical artifact.",
      reviewRecommendation: "Standardize metric conversion factor across all municipal database views.",
    },
    timelineEvents: [
      { id: "EVT-101", timestamp: "2026-09-15 09:10", stage: "Detected", description: "Minor area difference flagged.", actor: "Schema Normalizer" },
      { id: "EVT-102", timestamp: "2026-09-16 11:00", stage: "Deferred", description: "Deferred as within rounding tolerance.", actor: "Triage Rules" },
    ],
    evidenceIds: ["EVID-CONV-01"],
  },
  {
    id: "CONFLICT-DEMO-012",
    entityId: "PARCEL-DEMO-064",
    type: "TEMPORAL",
    subtype: "Historical change",
    severity: "MEDIUM",
    status: "PENDING_VERIFICATION",
    sources: ["Satellite (2020)", "Satellite (2025)", "Survey (2026)"],
    description: "Historical boundary change confirmed following 2023 municipal road widening. Awaiting formal cadastral gazette verification.",
    confidence: 91,
    detectedAt: "2026-09-22 18:00 IST",
    ward: "Ward 14 — Central Zone",
    coordinates: [77.2014, 28.6016],
    temporalObservations: [
      { source: "Satellite 2020", date: "2020-04-15", observation: "Original 1,600 m² footprint before road widening.", confidence: 85, status: "STALE" },
      { source: "Road Project", date: "2023-09-10", observation: "Acquisition of 120 m² front strip for road widening.", confidence: 95, status: "MODIFIED" },
      { source: "Drone 2026", date: "2026-07-18", observation: "Rebuilt commercial frontage at 1,480 m².", confidence: 97, status: "CURRENT" },
    ],
    prioritySignals: {
      geometryDiscrepancy: "Medium",
      sourceDisagreement: "Medium",
      confidence: "High",
      temporalInconsistency: "High",
      overallPriority: "MEDIUM",
      reason: "Legitimate physical change requires formal cadastral record update.",
    },
    explanation: {
      whyFlagged: "Parcel area reduced from 1,600 m² to 1,480 m² due to public road acquisition.",
      sourceSummary: ["Owner was compensated in 2023; spatial layers are now ready for final unified verification."],
      evidenceBackedNote: "Compensation award order #RO-2023-887 on file.",
      reviewRecommendation: "Approve 1,480 m² boundary in Verification module and retire 1,600 m² historical polygon.",
    },
    timelineEvents: [
      { id: "EVT-111", timestamp: "2026-09-22 18:00", stage: "Detected", description: "Historical temporal divergence detected.", actor: "Change Detector" },
      { id: "EVT-112", timestamp: "2026-09-23 10:00", stage: "Queued for Verification", description: "Award order attached. Ready for final review.", actor: "Investigator" },
    ],
    evidenceIds: ["EVID-ROAD-2023", "EVID-COMP-887"],
  },
];

// Helper to generate GeoJSON representation of all conflicts for MapLibre
export function generateConflictsGeoJSON(conflicts: ConflictCase[]): FeatureCollection {
  const features: Feature[] = conflicts.map((c) => ({
    type: "Feature",
    id: c.id,
    geometry: {
      type: "Point",
      coordinates: c.coordinates,
    },
    properties: {
      id: c.id,
      entityId: c.entityId,
      type: c.type,
      subtype: c.subtype,
      severity: c.severity,
      status: c.status,
      confidence: c.confidence,
      ward: c.ward,
      description: c.description,
      sources: c.sources.join(", "),
    },
  }));

  return {
    type: "FeatureCollection",
    features,
  };
}

// Generate Conflict Polygons (Reference, Observed, Difference) for a given conflict
export function generateConflictPolygons(c: ConflictCase): FeatureCollection<Polygon> {
  const [lng, lat] = c.coordinates;
  const s = 0.0006; // size offset

  // Reference geometry (cyan / municipal)
  const refCoords = [
    [
      [lng - s, lat - s],
      [lng + s, lat - s],
      [lng + s, lat + s],
      [lng - s, lat + s],
      [lng - s, lat - s],
    ],
  ];

  // Observed geometry with offset / shift (saffron / survey or registry)
  const shiftX = c.type === "GEOMETRY" ? 0.00025 : 0.0001;
  const shiftY = c.type === "GEOMETRY" ? 0.0002 : 0.00008;
  const obsCoords = [
    [
      [lng - s + shiftX, lat - s + shiftY],
      [lng + s + shiftX * 1.5, lat - s + shiftY],
      [lng + s + shiftX * 1.2, lat + s + shiftY * 1.8],
      [lng - s + shiftX * 0.8, lat + s + shiftY * 1.5],
      [lng - s + shiftX, lat - s + shiftY],
    ],
  ];

  // Difference / Conflict zone (red polygon along the top edge)
  const diffCoords = [
    [
      [lng - s, lat + s * 0.7],
      [lng + s + shiftX * 1.2, lat + s * 0.7],
      [lng + s + shiftX * 1.2, lat + s + shiftY * 1.8],
      [lng - s + shiftX * 0.8, lat + s + shiftY * 1.5],
      [lng - s, lat + s * 0.7],
    ],
  ];

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: "reference-geom",
        geometry: { type: "Polygon", coordinates: refCoords },
        properties: { role: "reference", label: "Reference Geometry (Municipal)", color: "#06b6d4" },
      },
      {
        type: "Feature",
        id: "observed-geom",
        geometry: { type: "Polygon", coordinates: obsCoords },
        properties: { role: "observed", label: "Observed Geometry (Survey / Registry)", color: "#f59e0b" },
      },
      {
        type: "Feature",
        id: "difference-geom",
        geometry: { type: "Polygon", coordinates: diffCoords },
        properties: { role: "difference", label: "Conflict / Difference Area", color: "#ef4444" },
      },
    ],
  };
}
