/**
 * BHOO-MITRA AI — Conflict Intelligence Service Layer
 *
 * ⚠️  SYNTHETIC DEMONSTRATION SERVICE — NOT REAL GOVERNMENT RECORDS ⚠️
 *
 * This service provides structured conflict queries, demo priority calculations,
 * and explanation generators. Future phases can swap these local implementations
 * for live FastAPI / PostGIS endpoints.
 */

import {
  type ConflictCase,
  type ConflictSeverity,
  type ConflictStatus,
  type ConflictType,
  type GeometryMetrics,
  type PrioritySignals,
  type ConflictExplanation,
  SYNTHETIC_CONFLICTS,
} from "@/lib/mock/conflicts-data";

/**
 * Fetch all conflict cases with optional filtering.
 */
export function getConflictCases(filters?: {
  type?: ConflictType | "ALL";
  severity?: ConflictSeverity | "ALL";
  status?: ConflictStatus | "ALL";
  query?: string;
  minConfidence?: number;
}): ConflictCase[] {
  let list = [...SYNTHETIC_CONFLICTS];

  if (!filters) return list;

  if (filters.type && filters.type !== "ALL") {
    list = list.filter((c) => c.type === filters.type);
  }

  if (filters.severity && filters.severity !== "ALL") {
    list = list.filter((c) => c.severity === filters.severity);
  }

  if (filters.status && filters.status !== "ALL") {
    list = list.filter((c) => c.status === filters.status);
  }

  if (filters.minConfidence !== undefined) {
    list = list.filter((c) => c.confidence >= (filters.minConfidence ?? 0));
  }

  if (filters.query) {
    const q = filters.query.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.entityId.toLowerCase().includes(q) ||
        c.subtype.toLowerCase().includes(q) ||
        c.ward.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.sources.some((s) => s.toLowerCase().includes(q))
    );
  }

  return list;
}

/**
 * Fetch a single conflict case by ID or entity ID.
 */
export function getConflictById(id: string): ConflictCase | undefined {
  return SYNTHETIC_CONFLICTS.find(
    (c) => c.id === id || c.entityId === id
  );
}

/**
 * Transparent demo triage logic calculation.
 * Computes transparent priority signals rather than an opaque score.
 */
export function calculateDemoPriority(c: ConflictCase): PrioritySignals {
  return c.prioritySignals;
}

/**
 * Generate evidence-grounded structured explanation for a conflict case.
 */
export function getConflictExplanation(c: ConflictCase): ConflictExplanation {
  return c.explanation;
}

/**
 * Compute or retrieve geometry conflict metrics.
 */
export function getConflictMetrics(c: ConflictCase): GeometryMetrics | undefined {
  return c.geometryMetrics;
}
