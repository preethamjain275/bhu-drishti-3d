/**
 * BHOO-MITRA AI — Evidence Intelligence Service Layer
 *
 * ⚠️  SYNTHETIC DEMONSTRATION SERVICE — NOT REAL GOVERNMENT RECORDS ⚠️
 *
 * Provides query, filtering, graph extraction, and provenance resolution for evidence records.
 */

import {
  type ConflictEvidence,
  type EvidenceType,
  type ProvenanceChain,
  type SourceReliabilityProfile,
  type QualitySignal,
  type EvidenceGraphData,
  SYNTHETIC_EVIDENCE,
  SOURCE_QUALITY_PROFILES,
  buildEvidenceGraph,
} from "@/lib/mock/evidence-data";

/**
 * Fetch all evidence records with optional filtering.
 */
export function getEvidence(filters?: {
  sourceId?: string | "ALL" | undefined;
  evidenceType?: EvidenceType | "ALL" | undefined;
  conflictId?: string | "ALL" | undefined;
  entityId?: string | undefined;
  minConfidence?: number | undefined;
  query?: string | undefined;
}): ConflictEvidence[] {
  let list = [...SYNTHETIC_EVIDENCE];

  if (!filters) return list;

  if (filters.sourceId && filters.sourceId !== "ALL") {
    list = list.filter((e) => e.sourceId === filters.sourceId);
  }

  if (filters.evidenceType && filters.evidenceType !== "ALL") {
    list = list.filter((e) => e.evidenceType === filters.evidenceType);
  }

  if (filters.conflictId && filters.conflictId !== "ALL") {
    list = list.filter((e) => e.conflictId === filters.conflictId);
  }

  if (filters.entityId) {
    list = list.filter((e) => e.entityId === filters.entityId);
  }

  if (filters.minConfidence !== undefined) {
    list = list.filter((e) => e.confidence >= (filters.minConfidence ?? 0));
  }

  if (filters.query) {
    const q = filters.query.toLowerCase().trim();
    list = list.filter(
      (e) =>
        e.id.toLowerCase().includes(q) ||
        e.conflictId.toLowerCase().includes(q) ||
        e.entityId.toLowerCase().includes(q) ||
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.sourceName.toLowerCase().includes(q)
    );
  }

  return list;
}

/**
 * Retrieve an evidence record by ID.
 */
export function getEvidenceById(id: string): ConflictEvidence | undefined {
  return SYNTHETIC_EVIDENCE.find((e) => e.id === id);
}

/**
 * Retrieve all evidence records supporting a specific conflict.
 */
export function getEvidenceByConflict(conflictId: string): ConflictEvidence[] {
  return SYNTHETIC_EVIDENCE.filter((e) => e.conflictId === conflictId);
}

/**
 * Retrieve all evidence records for a specific parcel entity.
 */
export function getEvidenceByEntity(entityId: string): ConflictEvidence[] {
  return SYNTHETIC_EVIDENCE.filter((e) => e.entityId === entityId);
}

/**
 * Retrieve full provenance chain for an evidence record.
 */
export function getProvenance(evidenceId: string): ProvenanceChain | undefined {
  const ev = getEvidenceById(evidenceId);
  return ev?.provenance;
}

/**
 * Retrieve all source quality / reliability profiles.
 */
export function getSourceQualityProfiles(): SourceReliabilityProfile[] {
  return SOURCE_QUALITY_PROFILES;
}

/**
 * Retrieve quality signals for an evidence record.
 */
export function getQualitySignals(evidenceId: string): QualitySignal[] {
  const ev = getEvidenceById(evidenceId);
  return ev?.qualitySignals || [];
}

/**
 * Build interactive evidence graph for a given conflict or system-wide.
 */
export function getEvidenceGraph(conflictId?: string): EvidenceGraphData {
  return buildEvidenceGraph(conflictId);
}
