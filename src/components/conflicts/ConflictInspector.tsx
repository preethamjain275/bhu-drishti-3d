/**
 * BHOO-MITRA AI — Conflict Inspector Component
 *
 * Detailed multi-tab investigation workbench for selected conflict cases:
 * - Overview & Explainable Triage
 * - Visual Geometry Conflict Metrics
 * - Attribute Discrepancy Matrix
 * - Temporal Observation Timeline
 * - Topology Relationship Analysis
 * - Audit Trail & Next Actions
 */

import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  type ConflictCase,
  type ConflictStatus,
} from "@/lib/mock/conflicts-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  FileSearch,
  GitCompare,
  Layers,
  Maximize2,
  Network,
  Scale,
  ShieldAlert,
  Sparkles,
  Table,
  Zap,
} from "lucide-react";

interface ConflictInspectorProps {
  conflict: ConflictCase;
  onStatusChange: (newStatus: ConflictStatus) => void;
  onClose?: () => void;
}

const SEVERITY_BADGE_STYLE: Record<string, string> = {
  CRITICAL: "bg-conflict/15 text-conflict border-conflict/40",
  HIGH: "bg-saffron/15 text-saffron border-saffron/40",
  MEDIUM: "bg-cyan/15 text-cyan border-cyan/40",
  LOW: "bg-slate-500/15 text-slate-400 border-slate-500/40",
};

const STATUS_BADGE_STYLE: Record<ConflictStatus, string> = {
  OPEN: "bg-conflict/10 text-conflict border-conflict/30",
  INVESTIGATING: "bg-primary/15 text-primary border-primary/40",
  PENDING_VERIFICATION: "bg-saffron/15 text-saffron border-saffron/40",
  RESOLVED: "bg-verified/15 text-verified border-verified/40",
  DEFERRED: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

export function ConflictInspector({
  conflict,
  onStatusChange,
  onClose,
}: ConflictInspectorProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "geometry" | "attributes" | "temporal" | "topology" | "audit"
  >("overview");

  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-surface/90 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="border-b border-border/80 bg-slate-900/60 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-ivory">
                {conflict.id}
              </span>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                  SEVERITY_BADGE_STYLE[conflict.severity]
                )}
              >
                {conflict.severity} PRIORITY
              </span>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase",
                  STATUS_BADGE_STYLE[conflict.status]
                )}
              >
                {conflict.status.replace("_", " ")}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono text-cyan">{conflict.entityId}</span>
              <span>•</span>
              <span className="text-ivory font-medium">{conflict.subtype}</span>
              <span>•</span>
              <span>{conflict.ward}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Status Change Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-border/60 bg-slate-800 hover:bg-slate-700"
                onClick={() => setStatusMenuOpen(!statusMenuOpen)}
              >
                Status: {conflict.status.replace("_", " ")}
              </Button>
              {statusMenuOpen && (
                <div className="absolute right-0 top-8 z-30 w-44 rounded-lg border border-border bg-slate-900 p-1 shadow-xl">
                  {(
                    [
                      "OPEN",
                      "INVESTIGATING",
                      "PENDING_VERIFICATION",
                      "RESOLVED",
                      "DEFERRED",
                    ] as ConflictStatus[]
                  ).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onStatusChange(st);
                        setStatusMenuOpen(false);
                      }}
                      className={cn(
                        "w-full rounded px-2.5 py-1.5 text-left text-xs font-medium transition-colors hover:bg-slate-800",
                        conflict.status === st
                          ? "bg-primary/20 text-primary font-bold"
                          : "text-foreground"
                      )}
                    >
                      {st.replace("_", " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-ivory"
                onClick={onClose}
              >
                ✕
              </Button>
            )}
          </div>
        </div>

        {/* Confidence & Sources Bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Confidence:</span>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-20 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${conflict.confidence}%` }}
                />
              </div>
              <span className="font-mono font-bold text-ivory">
                {conflict.confidence}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span>Sources:</span>
            <span className="text-ivory font-medium">
              {conflict.sources.join(" ↔ ")}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border/80 bg-slate-950/40 px-2 text-xs">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "flex items-center gap-1.5 border-b-2 px-3 py-2.5 font-medium transition-colors",
            activeTab === "overview"
              ? "border-primary text-ivory font-bold"
              : "border-transparent text-muted-foreground hover:text-ivory"
          )}
        >
          <Sparkles className="h-3.5 w-3.5 text-saffron" />
          Overview
        </button>

        {conflict.geometryMetrics && (
          <button
            onClick={() => setActiveTab("geometry")}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3 py-2.5 font-medium transition-colors",
              activeTab === "geometry"
                ? "border-primary text-ivory font-bold"
                : "border-transparent text-muted-foreground hover:text-ivory"
            )}
          >
            <Layers className="h-3.5 w-3.5 text-cyan" />
            Geometry Metrics
          </button>
        )}

        {conflict.attributeMatrix && (
          <button
            onClick={() => setActiveTab("attributes")}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3 py-2.5 font-medium transition-colors",
              activeTab === "attributes"
                ? "border-primary text-ivory font-bold"
                : "border-transparent text-muted-foreground hover:text-ivory"
            )}
          >
            <Table className="h-3.5 w-3.5 text-primary" />
            Attributes
          </button>
        )}

        {conflict.temporalObservations && (
          <button
            onClick={() => setActiveTab("temporal")}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3 py-2.5 font-medium transition-colors",
              activeTab === "temporal"
                ? "border-primary text-ivory font-bold"
                : "border-transparent text-muted-foreground hover:text-ivory"
            )}
          >
            <Clock className="h-3.5 w-3.5 text-saffron" />
            Temporal Timeline
          </button>
        )}

        {conflict.topologyDetails && (
          <button
            onClick={() => setActiveTab("topology")}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3 py-2.5 font-medium transition-colors",
              activeTab === "topology"
                ? "border-primary text-ivory font-bold"
                : "border-transparent text-muted-foreground hover:text-ivory"
            )}
          >
            <Network className="h-3.5 w-3.5 text-conflict" />
            Topology
          </button>
        )}

        <button
          onClick={() => setActiveTab("audit")}
          className={cn(
            "flex items-center gap-1.5 border-b-2 px-3 py-2.5 font-medium transition-colors",
            activeTab === "audit"
              ? "border-primary text-ivory font-bold"
              : "border-transparent text-muted-foreground hover:text-ivory"
          )}
        >
          <Scale className="h-3.5 w-3.5 text-slate-400" />
          Event Trail
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* TAB: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Description Card */}
            <div className="rounded-lg border border-border/60 bg-slate-900/50 p-3.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Discrepancy Summary
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-ivory">
                {conflict.description}
              </p>
            </div>

            {/* Why Flagged (Structured Synthetic Explanation) */}
            <div className="rounded-lg border border-saffron/30 bg-saffron/5 p-3.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-saffron" />
                <h4 className="font-bold text-saffron">
                  WHY WAS THIS FLAGGED?
                </h4>
              </div>
              <p className="mt-2 text-foreground leading-relaxed">
                {conflict.explanation.whyFlagged}
              </p>
              <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
                {conflict.explanation.sourceSummary.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Evidence-Backed Explanation Note */}
            <div className="rounded-lg border border-cyan/30 bg-cyan/5 p-3.5">
              <div className="flex items-center gap-2">
                <FileSearch className="h-4 w-4 text-cyan" />
                <h4 className="font-bold text-cyan">
                  EVIDENCE-GROUNDED FINDING
                </h4>
              </div>
              <p className="mt-2 text-foreground leading-relaxed">
                {conflict.explanation.evidenceBackedNote}
              </p>
              <p className="mt-2 text-xs font-semibold text-verified">
                Recommendation: {conflict.explanation.reviewRecommendation}
              </p>
            </div>

            {/* Transparent Demo Triage Breakdown */}
            <div className="rounded-lg border border-border/60 bg-slate-900/50 p-3.5">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  DEMO TRIAGE SIGNALS
                </h4>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  Explainable Logic
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded border border-border/40 bg-slate-950/40 p-2">
                  <span className="text-[10px] text-muted-foreground">
                    Geometry Drift
                  </span>
                  <p className="mt-0.5 font-bold text-ivory">
                    {conflict.prioritySignals.geometryDiscrepancy}
                  </p>
                </div>
                <div className="rounded border border-border/40 bg-slate-950/40 p-2">
                  <span className="text-[10px] text-muted-foreground">
                    Source Disagreement
                  </span>
                  <p className="mt-0.5 font-bold text-saffron">
                    {conflict.prioritySignals.sourceDisagreement}
                  </p>
                </div>
                <div className="rounded border border-border/40 bg-slate-950/40 p-2">
                  <span className="text-[10px] text-muted-foreground">
                    Detection Confidence
                  </span>
                  <p className="mt-0.5 font-bold text-cyan">
                    {conflict.prioritySignals.confidence}
                  </p>
                </div>
                <div className="rounded border border-border/40 bg-slate-950/40 p-2">
                  <span className="text-[10px] text-muted-foreground">
                    Temporal Drift
                  </span>
                  <p className="mt-0.5 font-bold text-ivory">
                    {conflict.prioritySignals.temporalInconsistency}
                  </p>
                </div>
              </div>
              <p className="mt-2.5 text-[11px] text-muted-foreground italic">
                Triage Conclusion: {conflict.prioritySignals.reason}
              </p>
            </div>
          </div>
        )}

        {/* TAB: GEOMETRY METRICS */}
        {activeTab === "geometry" && conflict.geometryMetrics && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border/60 bg-slate-900/50 p-3.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-ivory">
                  REFERENCE VS OBSERVED GEOMETRY
                </h4>
                <span className="rounded bg-saffron/10 px-2 py-0.5 text-[10px] text-saffron font-bold">
                  Δ {conflict.geometryMetrics.differencePercent}% Deviation
                </span>
              </div>

              {/* Area comparison cards */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border border-cyan/40 bg-cyan/5 p-2.5">
                  <span className="text-[10px] text-cyan font-semibold">
                    {conflict.geometryMetrics.sourceAName}
                  </span>
                  <p className="mt-1 font-mono text-base font-bold text-ivory">
                    {conflict.geometryMetrics.sourceAArea.toLocaleString()} m²
                  </p>
                </div>
                <div className="rounded-lg border border-saffron/40 bg-saffron/5 p-2.5">
                  <span className="text-[10px] text-saffron font-semibold">
                    {conflict.geometryMetrics.sourceBName}
                  </span>
                  <p className="mt-1 font-mono text-base font-bold text-ivory">
                    {conflict.geometryMetrics.sourceBArea.toLocaleString()} m²
                  </p>
                </div>
                <div className="rounded-lg border border-conflict/40 bg-conflict/5 p-2.5">
                  <span className="text-[10px] text-conflict font-semibold">
                    Conflict Area
                  </span>
                  <p className="mt-1 font-mono text-base font-bold text-conflict">
                    {conflict.geometryMetrics.differenceArea} m²
                  </p>
                </div>
              </div>

              {/* Detailed Metrics Table */}
              <div className="mt-4 overflow-hidden rounded-lg border border-border/50 bg-slate-950/50">
                <table className="w-full text-left">
                  <thead className="border-b border-border/60 bg-slate-900/80 text-[10px] font-bold uppercase text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2">Metric</th>
                      <th className="px-3 py-2">Measured Value</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="px-3 py-2 font-medium text-ivory">
                        Perimeter Discrepancy
                      </td>
                      <td className="px-3 py-2 font-mono text-muted-foreground">
                        {conflict.geometryMetrics.perimeterDifference} m
                      </td>
                      <td className="px-3 py-2">
                        <span className="rounded bg-saffron/10 px-1.5 py-0.5 text-[10px] text-saffron">
                          Shift Detected
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-medium text-ivory">
                        Centroid Displacement
                      </td>
                      <td className="px-3 py-2 font-mono text-muted-foreground">
                        {conflict.geometryMetrics.centroidDisplacement} m
                      </td>
                      <td className="px-3 py-2">
                        <span className="rounded bg-cyan/10 px-1.5 py-0.5 text-[10px] text-cyan">
                          Minor Offset
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-medium text-ivory">
                        Spatial Overlap (IoU)
                      </td>
                      <td className="px-3 py-2 font-mono text-muted-foreground">
                        {conflict.geometryMetrics.overlapPercentage}%
                      </td>
                      <td className="px-3 py-2">
                        <span className="rounded bg-verified/10 px-1.5 py-0.5 text-[10px] text-verified">
                          High Overlap
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3 text-[10px] text-muted-foreground italic">
                ⚠️ Synthetic GIS Demonstration — Computed after spatial reprojection to EPSG:7760.
              </p>
            </div>
          </div>
        )}

        {/* TAB: ATTRIBUTES */}
        {activeTab === "attributes" && conflict.attributeMatrix && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-border/60 bg-slate-900/50">
              <table className="w-full text-left">
                <thead className="border-b border-border/80 bg-slate-900 text-[10px] font-bold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2.5">Attribute</th>
                    <th className="px-3 py-2.5 text-cyan">Municipal GIS</th>
                    <th className="px-3 py-2.5 text-saffron">Registry</th>
                    <th className="px-3 py-2.5 text-emerald-400">Survey</th>
                    <th className="px-3 py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {conflict.attributeMatrix.map((row, idx) => (
                    <tr
                      key={idx}
                      className={cn(
                        row.status === "CONFLICT"
                          ? "bg-conflict/5"
                          : "hover:bg-slate-800/30"
                      )}
                    >
                      <td className="px-3 py-2.5 font-medium text-ivory">
                        {row.attribute}
                      </td>
                      <td
                        className={cn(
                          "px-3 py-2.5 font-mono",
                          row.status === "CONFLICT" && "text-conflict font-bold"
                        )}
                      >
                        {row.municipal}
                      </td>
                      <td
                        className={cn(
                          "px-3 py-2.5 font-mono",
                          row.status === "CONFLICT" && "text-saffron font-bold"
                        )}
                      >
                        {row.registry}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-muted-foreground">
                        {row.survey}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[10px] font-bold",
                            row.status === "CONFLICT"
                              ? "bg-conflict/20 text-conflict border border-conflict/40"
                              : row.status === "MATCH"
                              ? "bg-verified/15 text-verified border border-verified/30"
                              : "bg-slate-700 text-muted-foreground"
                          )}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: TEMPORAL */}
        {activeTab === "temporal" && conflict.temporalObservations && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border/60 bg-slate-900/50 p-3.5">
              <h4 className="font-bold text-ivory mb-3">
                OBSERVATION TIMELINE & STALENESS
              </h4>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {conflict.temporalObservations.map((obs, idx) => (
                  <div key={idx} className="relative group">
                    <span
                      className={cn(
                        "absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-slate-900",
                        obs.status === "STALE"
                          ? "bg-saffron"
                          : obs.status === "MODIFIED"
                          ? "bg-cyan"
                          : "bg-verified"
                      )}
                    />
                    <div className="rounded-lg border border-border/40 bg-slate-950/50 p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-ivory">
                          {obs.source}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-muted-foreground text-[10px]">
                            {obs.date}
                          </span>
                          <span
                            className={cn(
                              "rounded px-1 py-0.2 text-[9px] font-bold",
                              obs.status === "STALE"
                                ? "bg-saffron/20 text-saffron"
                                : "bg-verified/20 text-verified"
                            )}
                          >
                            {obs.status}
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 text-muted-foreground text-xs">
                        {obs.observation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: TOPOLOGY */}
        {activeTab === "topology" && conflict.topologyDetails && (
          <div className="space-y-4">
            <div className="rounded-lg border border-conflict/40 bg-conflict/5 p-3.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-conflict" />
                <h4 className="font-bold text-conflict">
                  TOPOLOGY VIOLATION: {conflict.topologyDetails.relationship}
                </h4>
              </div>

              <div className="mt-3 flex items-center justify-center gap-3 py-2">
                <div className="rounded-lg border border-cyan/50 bg-cyan/10 px-3 py-2 text-center">
                  <span className="text-[10px] text-muted-foreground">Entity A</span>
                  <p className="font-mono font-bold text-cyan">
                    {conflict.topologyDetails.entityA}
                  </p>
                </div>
                <span className="font-bold text-conflict">⚡ {conflict.topologyDetails.relationship} ⚡</span>
                <div className="rounded-lg border border-saffron/50 bg-saffron/10 px-3 py-2 text-center">
                  <span className="text-[10px] text-muted-foreground">Entity B</span>
                  <p className="font-mono font-bold text-saffron">
                    {conflict.topologyDetails.entityB}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-2 rounded-lg border border-border/50 bg-slate-900/80 p-3">
                <p className="text-ivory font-medium">
                  {conflict.topologyDetails.problem}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  <strong className="text-ivory">Affected Area:</strong>{" "}
                  {conflict.topologyDetails.affectedAreaM2} m²
                </p>
                <p className="text-[11px] text-muted-foreground">
                  <strong className="text-ivory">Cadastral Rule:</strong>{" "}
                  {conflict.topologyDetails.ruleViolated}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: AUDIT EVENT TRAIL */}
        {activeTab === "audit" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border/60 bg-slate-900/50 p-3.5">
              <h4 className="font-bold text-ivory mb-3">
                EVENT AUDIT TIMELINE
              </h4>
              <div className="space-y-2.5">
                {conflict.timelineEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-start gap-3 rounded-lg border border-border/40 bg-slate-950/40 p-2.5"
                  >
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-ivory">{evt.stage}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {evt.timestamp}
                        </span>
                      </div>
                      <p className="mt-0.5 text-muted-foreground">
                        {evt.description}
                      </p>
                      <span className="mt-1 inline-block text-[10px] font-mono text-cyan">
                        Actor: {evt.actor}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Investigation Actions */}
      <div className="border-t border-border/80 bg-slate-900/80 p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link
            to="/harmonization"
            search={{ entity: conflict.entityId } as any}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-slate-800 px-3 py-1.5 text-xs font-medium text-ivory hover:bg-slate-700 transition-colors"
          >
            <GitCompare className="h-3.5 w-3.5 text-cyan" />
            Compare Sources
          </Link>
          <Link
            to="/evidence"
            search={{ conflict: conflict.id } as any}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-slate-800 px-3 py-1.5 text-xs font-medium text-ivory hover:bg-slate-700 transition-colors"
          >
            <FileSearch className="h-3.5 w-3.5 text-saffron" />
            View Evidence
          </Link>
        </div>

        <Link
          to="/verification"
          search={{ conflict: conflict.id } as any}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-ivory shadow hover:bg-primary/90 transition-colors"
        >
          <FileCheck className="h-3.5 w-3.5" />
          Prepare Verification
        </Link>
      </div>
    </div>
  );
}
