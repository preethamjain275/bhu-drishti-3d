/**
 * BHOO-MITRA AI — Harmonization Recommendation & Explainable AI Service
 *
 * ⚠️  SYNTHETIC DEMONSTRATION INTELLIGENCE — NOT AN AUTHORITATIVE GOVERNMENT DECISION ⚠️
 *
 * This module provides deterministic, evidence-grounded recommendations,
 * explainable reasoning chains, alternative candidate generators, and a constrained AI assistant.
 */

import { type SourceId } from "@/lib/mock/comparison-data";

// ---------------------------------------------------------------------------
// Types & Domain Models
// ---------------------------------------------------------------------------

export type RecommendationStatus =
  | "DRAFT"
  | "PENDING_VERIFICATION"
  | "ACCEPTED"
  | "MODIFIED"
  | "REJECTED"
  | "DEFERRED";

export type AgreementStatus =
  | "AGREES"
  | "DIFFERS"
  | "MISSING"
  | "LOW_CONFIDENCE"
  | "NOT_AVAILABLE";

export interface RecommendationContext {
  entityId: string;
  conflictId: string;
  conflictType: string;
  sources: Array<{ id: SourceId; name: string; qualityScore: number }>;
  evidenceIds: string[];
  observationDates: string[];
  entityMatchConfidence: number;
}

export interface ReasoningStep {
  stepNumber: number;
  title: string;
  summary: string;
  inputEvidence: string[];
  relevantSource: string;
  observation: string;
  metricSignal: string;
  result: string;
  effectOnConfidence: string;
}

export interface RecommendationCandidate {
  id: string;
  title: string;
  representationSource: string;
  sourceId: SourceId;
  description: string;
  confidence: number; // 0-100
  status: RecommendationStatus;
  supportingEvidenceIds: string[];
  unresolvedItems: string;
  advantages: string[];
  conflicts: string[];
  proposedAreaM2: number;
  proposedPerimeterM: number;
}

export interface RecommendationConfidenceBreakdown {
  overall: number; // 0-100
  geometryAgreement: number; // weight 35%
  sourceReliability: number; // weight 25%
  temporalConsistency: number; // weight 20%
  evidenceQuality: number; // weight 20%
  level: "HIGH" | "MEDIUM" | "LOW" | "UNRESOLVED";
}

export interface SourceAgreementRow {
  aspect: string;
  municipal: { value: string; status: AgreementStatus; evidenceId?: string };
  registry: { value: string; status: AgreementStatus; evidenceId?: string };
  survey: { value: string; status: AgreementStatus; evidenceId?: string };
}

export interface RecommendationActionRecord {
  id: string;
  actionType: "ACCEPT" | "MODIFY" | "REJECT" | "DEFER";
  user: string;
  timestamp: string;
  entityId: string;
  recommendationId: string;
  evidenceIds: string[];
  previousStatus: RecommendationStatus;
  newStatus: RecommendationStatus;
  notes?: string;
}

export interface RecommendationHistoryEvent {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
}

export interface AssistantQA {
  id: string;
  question: string;
  answer: string;
  supportingEvidence: string[];
  category: "REASONING" | "SOURCES" | "GEOMETRY" | "UNRESOLVED" | "CONFIDENCE";
}

// ---------------------------------------------------------------------------
// Synthetic Recommendation Contexts (for DEMO entities)
// ---------------------------------------------------------------------------

export const ENTITY_RECOMMENDATIONS: Record<
  string,
  {
    context: RecommendationContext;
    primaryCandidate: RecommendationCandidate;
    alternatives: RecommendationCandidate[];
    confidenceBreakdown: RecommendationConfidenceBreakdown;
    reasoningChain: ReasoningStep[];
    agreementMatrix: SourceAgreementRow[];
    assistantQAs: AssistantQA[];
  }
> = {
  "PARCEL-DEMO-014": {
    context: {
      entityId: "PARCEL-DEMO-014",
      conflictId: "CONFLICT-DEMO-001",
      conflictType: "GEOMETRY (Boundary Mismatch)",
      sources: [
        { id: "municipal", name: "Municipal GIS", qualityScore: 88 },
        { id: "registry", name: "Property Registry", qualityScore: 90 },
        { id: "survey", name: "Drone Survey", qualityScore: 94 },
      ],
      evidenceIds: ["EVIDENCE-DEMO-001", "EVIDENCE-DEMO-002", "EVIDENCE-DEMO-003"],
      observationDates: ["2024-06-12", "2025-01-18", "2025-11-04"],
      entityMatchConfidence: 96,
    },
    primaryCandidate: {
      id: "REC-DEMO-014-A",
      title: "Candidate A: High-Precision Survey Boundary",
      representationSource: "Survey Dataset Boundary (Drone Photogrammetry 2025)",
      sourceId: "survey",
      description:
        "Adopt the latest high-confidence survey observation as the candidate unified geometry while preserving original municipal and registry geometries for audit provenance.",
      confidence: 91,
      status: "PENDING_VERIFICATION",
      supportingEvidenceIds: ["EVIDENCE-DEMO-001", "EVIDENCE-DEMO-002", "EVIDENCE-DEMO-003"],
      unresolvedItems:
        "Registry deed plan has not been independently resurveyed with GNSS control points; northern corridor setback variance requires municipal notification.",
      advantages: [
        "RTK-GNSS positioning provides sub-3cm spatial accuracy on-ground.",
        "Matches physical masonry compound wall verified on high-res orthomosaic.",
        "Eliminates 3.8m boundary encroachment into municipal road corridor.",
      ],
      conflicts: [
        "Reports 2,465 m² vs 2,510 m² claimed in Property Registry conveyance deed (45 m² variance).",
      ],
      proposedAreaM2: 2465,
      proposedPerimeterM: 203.2,
    },
    alternatives: [
      {
        id: "REC-DEMO-014-B",
        title: "Candidate B: Municipal Cadastral Boundary",
        representationSource: "Municipal GIS Master Plan Layer",
        sourceId: "municipal",
        description:
          "Maintain the historical 2,430 m² municipal vector baseline pending formal conveyance rectification.",
        confidence: 78,
        status: "DRAFT",
        supportingEvidenceIds: ["EVIDENCE-DEMO-001"],
        unresolvedItems:
          "Municipal GIS polygon dates to June 2024 and does not incorporate the 2025 conveyance deed acquisition.",
        advantages: [
          "Direct continuity with current municipal property tax assessment roll.",
          "Zero risk of municipal easement dispute.",
        ],
        conflicts: [
          "Ignores physical compound wall constructed in late 2025.",
          "Disagrees with registered deed area by 80 m².",
        ],
        proposedAreaM2: 2430,
        proposedPerimeterM: 198.4,
      },
      {
        id: "REC-DEMO-014-C",
        title: "Candidate C: Deed Schedule Representation",
        representationSource: "Property Registry Conveyance Plan",
        sourceId: "registry",
        description:
          "Enforce legal deed claim of 2,510 m² subject to physical corridor boundary pegging.",
        confidence: 64,
        status: "DRAFT",
        supportingEvidenceIds: ["EVIDENCE-DEMO-002"],
        unresolvedItems:
          "Deed annexure lacks georeferenced coordinates and overlaps 45 m² into planned municipal access strip.",
        advantages: [
          "Strict adherence to registered legal deed documentation.",
          "Eliminates potential title defect claims by property owner.",
        ],
        conflicts: [
          "Violates physical ground survey by 45 m².",
          "Creates boundary overhang beyond existing perimeter fence.",
        ],
        proposedAreaM2: 2510,
        proposedPerimeterM: 208.0,
      },
    ],
    confidenceBreakdown: {
      overall: 91,
      geometryAgreement: 88, // 35% weight
      sourceReliability: 94, // 25% weight
      temporalConsistency: 92, // 20% weight
      evidenceQuality: 90, // 20% weight
      level: "HIGH",
    },
    reasoningChain: [
      {
        stepNumber: 1,
        title: "Identify Conflicting Observations",
        summary: "Multi-source comparison flagged spatial boundary disagreement exceeding 3.0m threshold.",
        inputEvidence: ["EVIDENCE-DEMO-001", "EVIDENCE-DEMO-002", "EVIDENCE-DEMO-003"],
        relevantSource: "Municipal GIS ↔ Registry ↔ Survey",
        observation: "Municipal GIS reports 2,430 m², Registry reports 2,510 m², Drone Survey reports 2,465 m².",
        metricSignal: "IoU Overlap = 0.94 (< 0.98 threshold); Area variance = 80 m².",
        result: "Boundary mismatch classified as HIGH priority conflict.",
        effectOnConfidence: "+15% (Definitive Conflict Identification)",
      },
      {
        stepNumber: 2,
        title: "Compare Geometry Similarity",
        summary: "Vector overlay analysis evaluated perimeter shape, vertex positions, and centroid displacement.",
        inputEvidence: ["EVIDENCE-DEMO-001", "EVIDENCE-DEMO-003"],
        relevantSource: "Spatial Comparison Engine",
        observation: "Centroid displacement is only 1.85m; shape similarity index is 96.8%.",
        metricSignal: "Perimeter offset = 4.8m; 6 vertices verified in survey vs 4 in municipal GIS.",
        result: "Proves all 3 records reference the identical physical real estate entity.",
        effectOnConfidence: "+20% (Confirmed Entity Identity)",
      },
      {
        stepNumber: 3,
        title: "Evaluate Source Reliability",
        summary: "Assessed authority and technical quality scores of contributing data providers.",
        inputEvidence: ["EVIDENCE-DEMO-001", "EVIDENCE-DEMO-002", "EVIDENCE-DEMO-003"],
        relevantSource: "Source Quality Service",
        observation: "Drone Survey scored 94% overall quality with 97% geometric fidelity. Municipal GIS scored 88%.",
        metricSignal: "Survey RTK-GNSS has sub-3cm spatial RMS error.",
        result: "Weights survey geometry highest for spatial boundary representation.",
        effectOnConfidence: "+25% (High Authority Survey Match)",
      },
      {
        stepNumber: 4,
        title: "Evaluate Temporal Recency",
        summary: "Sequenced historical progression from 2024 baseline to late 2025 aerial survey.",
        inputEvidence: ["EVIDENCE-DEMO-001", "EVIDENCE-DEMO-002", "EVIDENCE-DEMO-003"],
        relevantSource: "Temporal Lineage Service",
        observation: "Drone survey was captured in November 2025, after 2024 municipal layer and Jan 2025 deed.",
        metricSignal: "Observation fresh within 10 months; captures current built compound wall.",
        result: "Confirms physical boundary wall was erected after deed conveyance.",
        effectOnConfidence: "+15% (Temporal Freshness Corroboration)",
      },
      {
        stepNumber: 5,
        title: "Check Topology & Quality Signals",
        summary: "Validated topological adjacency with neighboring parcels and public access corridor.",
        inputEvidence: ["EVIDENCE-DEMO-003"],
        relevantSource: "Topology Validator",
        observation: "Survey boundary cleanly abuts southern and western plots without gap or overlap.",
        metricSignal: "Zero topological slivers or duplicate nodes.",
        result: "Topologically valid for unified cadastral fabric insertion.",
        effectOnConfidence: "+10% (Clean Topology Check)",
      },
      {
        stepNumber: 6,
        title: "Compare Supporting Evidence",
        summary: "Cross-correlated orthophoto imagery against registered deed annexure.",
        inputEvidence: ["EVIDENCE-DEMO-002", "EVIDENCE-DEMO-003"],
        relevantSource: "Evidence Graph",
        observation: "Orthophoto confirms compound wall coordinates align exactly with 2,465 m² survey vector.",
        metricSignal: "3 independent corroborating evidence records.",
        result: "High confidence that ground physical truth matches candidate boundary.",
        effectOnConfidence: "+10% (Triangulated Ground Truth)",
      },
      {
        stepNumber: 7,
        title: "Calculate Recommendation Confidence",
        summary: "Synthesized multi-factor composite score across geometry, authority, and time.",
        inputEvidence: ["ALL"],
        relevantSource: "Harmonization Algorithm",
        observation: "Composite score = 91% (Geometry: 88, Authority: 94, Time: 92, Evidence: 90).",
        metricSignal: "Score exceeds 90% threshold for automated high-confidence suggestion.",
        result: "Classified as High-Confidence AI Recommendation.",
        effectOnConfidence: "Final Score: 91%",
      },
      {
        stepNumber: 8,
        title: "Produce Candidate Harmonization Recommendation",
        summary: "Generated candidate harmonization record ready for human verification dispatch.",
        inputEvidence: ["EVIDENCE-DEMO-001", "EVIDENCE-DEMO-002", "EVIDENCE-DEMO-003"],
        relevantSource: "Recommendation Engine",
        observation: "Recommended Candidate: Survey Dataset Boundary (2,465 m²).",
        metricSignal: "Flags Registry deed for administrative corrigendum.",
        result: "Dispatched to /verification with attached reasoning dossier.",
        effectOnConfidence: "Action Ready: Human Verification Required",
      },
    ],
    agreementMatrix: [
      {
        aspect: "Spatial Boundary",
        municipal: { value: "2,430 m² (4 vertices)", status: "DIFFERS", evidenceId: "EVIDENCE-DEMO-001" },
        registry: { value: "2,510 m² (Schematic)", status: "DIFFERS", evidenceId: "EVIDENCE-DEMO-002" },
        survey: { value: "2,465 m² (6 vertices / RTK)", status: "AGREES", evidenceId: "EVIDENCE-DEMO-003" },
      },
      {
        aspect: "Reported Area",
        municipal: { value: "2,430 m²", status: "DIFFERS", evidenceId: "EVIDENCE-DEMO-001" },
        registry: { value: "2,510 m²", status: "DIFFERS", evidenceId: "EVIDENCE-DEMO-002" },
        survey: { value: "2,465 m²", status: "AGREES", evidenceId: "EVIDENCE-DEMO-003" },
      },
      {
        aspect: "Land Use",
        municipal: { value: "Commercial (C-2)", status: "AGREES" },
        registry: { value: "Commercial", status: "AGREES" },
        survey: { value: "Commercial Complex", status: "AGREES" },
      },
      {
        aspect: "Owner Reference",
        municipal: { value: "DL-IND-082", status: "AGREES" },
        registry: { value: "DL-IND-082", status: "AGREES" },
        survey: { value: "Verified Occupant", status: "AGREES" },
      },
      {
        aspect: "Observation Date",
        municipal: { value: "2024-06-12", status: "LOW_CONFIDENCE" },
        registry: { value: "2025-01-18", status: "AGREES" },
        survey: { value: "2025-11-04 (Latest)", status: "AGREES" },
      },
      {
        aspect: "Data Quality Score",
        municipal: { value: "88% Quality", status: "AGREES" },
        registry: { value: "90% Quality", status: "AGREES" },
        survey: { value: "94% Quality (Highest)", status: "AGREES" },
      },
    ],
    assistantQAs: [
      {
        id: "QA-01",
        question: "Why is the survey geometry recommended?",
        answer:
          "The survey geometry is recommended because it is the most recent observation (November 2025), boasts the highest spatial accuracy (RTK-GNSS sub-3cm RMS error), and physically corroborates the masonry compound wall visible on the high-resolution orthomosaic.",
        supportingEvidence: ["EVIDENCE-DEMO-003"],
        category: "REASONING",
      },
      {
        id: "QA-02",
        question: "Which sources disagree?",
        answer:
          "All three sources disagree on the exact parcel area and northern boundary offset: Municipal GIS records 2,430 m², Property Registry records 2,510 m², and the Drone Survey records 2,465 m². However, all sources agree that the property is Commercial and assigned to Owner DL-IND-082.",
        supportingEvidence: ["EVIDENCE-DEMO-001", "EVIDENCE-DEMO-002", "EVIDENCE-DEMO-003"],
        category: "SOURCES",
      },
      {
        id: "QA-03",
        question: "What evidence supports this recommendation?",
        answer:
          "This recommendation is grounded in 3 specific evidence records: EVIDENCE-DEMO-001 (Municipal Cadastral Vector), EVIDENCE-DEMO-002 (Registered Conveyance Deed REG-9912), and EVIDENCE-DEMO-003 (Drone Orthomosaic Survey Vector).",
        supportingEvidence: ["EVIDENCE-DEMO-001", "EVIDENCE-DEMO-002", "EVIDENCE-DEMO-003"],
        category: "REASONING",
      },
      {
        id: "QA-04",
        question: "What remains unresolved?",
        answer:
          "The 45 m² area variance between the registered deed (2,510 m²) and the physical compound survey (2,465 m²) remains unresolved. The registry deed plan needs an administrative corrigendum noting the northern setback buffer.",
        supportingEvidence: ["EVIDENCE-DEMO-002"],
        category: "UNRESOLVED",
      },
      {
        id: "QA-05",
        question: "Why is confidence below 100%?",
        answer:
          "Confidence is calculated at 91% (not 100%) because the Property Registry deed plan has not been independently resurveyed with GNSS control points, and a 45 m² discrepancy exists between deed schedule text and ground reality.",
        supportingEvidence: ["EVIDENCE-DEMO-002"],
        category: "CONFIDENCE",
      },
      {
        id: "QA-06",
        question: "Which observation is the most recent?",
        answer:
          "The Drone Survey observation from 2025-11-04 is the most recent data capture in the case, succeeding the Property Registry deed (2025-01-18) and Municipal GIS layer (2024-06-12).",
        supportingEvidence: ["EVIDENCE-DEMO-003"],
        category: "SOURCES",
      },
      {
        id: "QA-07",
        question: "Show me the geometry conflict.",
        answer:
          "The geometry conflict occurs along the northern perimeter where the Property Registry deed plan extends 3.8 meters further north than the Municipal GIS boundary line, creating an 80 m² difference zone.",
        supportingEvidence: ["EVIDENCE-DEMO-001", "EVIDENCE-DEMO-003"],
        category: "GEOMETRY",
      },
    ],
  },
};

// Initial Synthetic Action History
export const INITIAL_RECOMMENDATION_HISTORY: RecommendationHistoryEvent[] = [
  { id: "HIST-01", timestamp: "09:30:12", event: "Conflict detected between Municipal GIS and Registry", actor: "Harmonization Pipeline" },
  { id: "HIST-02", timestamp: "09:30:18", event: "Evidence records EVID-001, EVID-002, EVID-003 attached", actor: "Evidence Ingestion Engine" },
  { id: "HIST-03", timestamp: "09:30:24", event: "Confidence calculated: 91% (High Confidence)", actor: "AI Reasoning Engine" },
  { id: "HIST-04", timestamp: "09:30:30", event: "Candidate A (Survey Boundary) generated as primary recommendation", actor: "BHOO-MITRA AI" },
];

// ---------------------------------------------------------------------------
// Service Functions
// ---------------------------------------------------------------------------

export function getRecommendationContext(entityId: string): RecommendationContext | undefined {
  return ENTITY_RECOMMENDATIONS[entityId]?.context || ENTITY_RECOMMENDATIONS["PARCEL-DEMO-014"]?.context;
}

export function getRecommendationData(entityId: string) {
  return ENTITY_RECOMMENDATIONS[entityId] || ENTITY_RECOMMENDATIONS["PARCEL-DEMO-014"];
}

export function askEvidenceGroundedAssistant(entityId: string, questionText: string): { answer: string; supportingEvidence: string[] } {
  const data = getRecommendationData(entityId);
  const qClean = questionText.toLowerCase().trim();

  if (!data) {
    return {
      answer: "I do not have enough verified evidence to answer this question. Please refer to field records.",
      supportingEvidence: [],
    };
  }

  // Search in structured QAs
  const match = data.assistantQAs.find(
    (qa) =>
      qa.question.toLowerCase().includes(qClean) ||
      qClean.includes(qa.question.toLowerCase()) ||
      (qClean.includes("survey") && qa.id === "QA-01") ||
      (qClean.includes("disagree") && qa.id === "QA-02") ||
      (qClean.includes("evidence") && qa.id === "QA-03") ||
      (qClean.includes("unresolved") && qa.id === "QA-04") ||
      (qClean.includes("confidence") && qa.id === "QA-05") ||
      (qClean.includes("recent") && qa.id === "QA-06") ||
      (qClean.includes("geometry") && qa.id === "QA-07")
  );

  if (match) {
    return {
      answer: match.answer,
      supportingEvidence: match.supportingEvidence,
    };
  }

  return {
    answer: "Insufficient evidence in the current case to answer this question. The AI assistant strictly answers from verifiable synthetic evidence on file.",
    supportingEvidence: [],
  };
}
