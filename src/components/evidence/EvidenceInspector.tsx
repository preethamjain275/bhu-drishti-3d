/**
 * BHOO-MITRA AI — Evidence Inspector Component
 *
 * Detailed multi-tab inspection panel for selected evidence records:
 * - Evidence Summary & Structured Explainability
 * - Evidence Strength Meter (Contributing factors)
 * - Visual Provenance Chain with SHA-256 Checksums
 * - Quality Signals Breakdown
 * - Related Evidence Navigation
 * - Map Linkage
 */

import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  type ConflictEvidence,
  type EvidenceType,
} from "@/lib/mock/evidence-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  FileSearch,
  Fingerprint,
  GitBranch,
  GitCompare,
  Layers,
  MapPin,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

interface EvidenceInspectorProps {
  evidence: ConflictEvidence;
  onSelectRelatedEvidence: (id: string) => void;
  onShowOnMap?: (evidence: ConflictEvidence) => void;
  onClose?: () => void;
}

const EVIDENCE_TYPE_STYLE: Record<EvidenceType, string> = {
  SOURCE_RECORD: "bg-cyan/15 text-cyan border-cyan/40",
  GEOMETRY_OBSERVATION: "bg-saffron/15 text-saffron border-saffron/40",
  ATTRIBUTE_OBSERVATION: "bg-primary/15 text-primary border-primary/40",
  TEMPORAL_OBSERVATION: "bg-saffron/15 text-saffron border-saffron/40",
  SURVEY_OBSERVATION: "bg-emerald-400/15 text-emerald-400 border-emerald-400/40",
  SPATIAL_RELATIONSHIP: "bg-conflict/15 text-conflict border-conflict/40",
  QUALITY_SIGNAL: "bg-slate-400/15 text-slate-300 border-slate-400/40",
  VERIFICATION_RECORD: "bg-verified/15 text-verified border-verified/40",
};

export function EvidenceInspector({
  evidence,
  onSelectRelatedEvidence,
  onShowOnMap,
  onClose,
}: EvidenceInspectorProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "strength" | "provenance" | "quality"
  >("overview");

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-surface/90 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="border-b border-border/80 bg-slate-900/60 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-ivory">
                {evidence.id}
              </span>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                  EVIDENCE_TYPE_STYLE[evidence.evidenceType]
                )}
              >
                {evidence.evidenceType.replace("_", " ")}
              </span>
              <span className="rounded-full border border-verified/30 bg-verified/10 px-2 py-0.5 text-[10px] font-bold text-verified uppercase">
                {evidence.status.replace("_", " ")}
              </span>
            </div>
            <h3 className="mt-1 text-sm font-bold text-ivory">
              {evidence.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-cyan font-mono">{evidence.entityId}</span>
              <span>•</span>
              <span className="font-mono text-saffron">{evidence.conflictId}</span>
              <span>•</span>
              <span>{evidence.sourceName}</span>
            </div>
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

        {/* Confidence & Observation Date Bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Confidence:</span>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-16 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${evidence.confidence}%` }}
                />
              </div>
              <span className="font-mono font-bold text-ivory">
                {evidence.confidence}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
            <span>Observed: {evidence.observationDate}</span>
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

        <button
          onClick={() => setActiveTab("strength")}
          className={cn(
            "flex items-center gap-1.5 border-b-2 px-3 py-2.5 font-medium transition-colors",
            activeTab === "strength"
              ? "border-primary text-ivory font-bold"
              : "border-transparent text-muted-foreground hover:text-ivory"
          )}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Strength ({evidence.reliability.overallStrength}%)
        </button>

        <button
          onClick={() => setActiveTab("provenance")}
          className={cn(
            "flex items-center gap-1.5 border-b-2 px-3 py-2.5 font-medium transition-colors",
            activeTab === "provenance"
              ? "border-primary text-ivory font-bold"
              : "border-transparent text-muted-foreground hover:text-ivory"
          )}
        >
          <Fingerprint className="h-3.5 w-3.5 text-cyan" />
          Provenance
        </button>

        <button
          onClick={() => setActiveTab("quality")}
          className={cn(
            "flex items-center gap-1.5 border-b-2 px-3 py-2.5 font-medium transition-colors",
            activeTab === "quality"
              ? "border-primary text-ivory font-bold"
              : "border-transparent text-muted-foreground hover:text-ivory"
          )}
        >
          <Zap className="h-3.5 w-3.5 text-saffron" />
          Quality Signals
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* TAB: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Description */}
            <div className="rounded-lg border border-border/60 bg-slate-900/50 p-3.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Observation Detail
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-ivory">
                {evidence.description}
              </p>
            </div>

            {/* Why This Evidence Matters */}
            <div className="rounded-lg border border-cyan/40 bg-cyan/5 p-3.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan" />
                <h4 className="font-bold text-cyan">
                  WHY THIS EVIDENCE MATTERS
                </h4>
              </div>
              <p className="mt-2 text-foreground leading-relaxed">
                {evidence.whyMatters}
              </p>
              <p className="mt-2 text-[10px] text-muted-foreground italic">
                STRUCTURED DEMO EXPLANATION — Grounded in source metadata and spatial verification rules.
              </p>
            </div>

            {/* Geometry or Attribute Reference if available */}
            {evidence.geometryReference && (
              <div className="rounded-lg border border-border/60 bg-slate-900/50 p-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-ivory">
                    SPATIAL GEOMETRY REFERENCE
                  </h4>
                  {onShowOnMap && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onShowOnMap(evidence)}
                      className="h-6 text-[11px] border-cyan/40 bg-cyan/10 text-cyan hover:bg-cyan/20"
                    >
                      <MapPin className="mr-1 h-3 w-3" /> Show on Map
                    </Button>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded bg-slate-950/60 p-2">
                    <span className="text-[10px] text-muted-foreground">Area</span>
                    <p className="font-mono font-bold text-ivory">
                      {evidence.geometryReference.areaM2.toLocaleString()} m²
                    </p>
                  </div>
                  <div className="rounded bg-slate-950/60 p-2">
                    <span className="text-[10px] text-muted-foreground">Perimeter</span>
                    <p className="font-mono font-bold text-ivory">
                      {evidence.geometryReference.perimeterM} m
                    </p>
                  </div>
                  <div className="rounded bg-slate-950/60 p-2">
                    <span className="text-[10px] text-muted-foreground">Vertices</span>
                    <p className="font-mono font-bold text-ivory">
                      {evidence.geometryReference.vertexCount} pts
                    </p>
                  </div>
                </div>
              </div>
            )}

            {evidence.attributeReference && (
              <div className="rounded-lg border border-border/60 bg-slate-900/50 p-3">
                <h4 className="font-bold text-ivory mb-2">
                  ATTRIBUTE RECORD SNAPSHOT
                </h4>
                <div className="divide-y divide-border/40 rounded border border-border/40 bg-slate-950/60">
                  {Object.entries(evidence.attributeReference).map(([k, v]) => (
                    <div key={k} className="flex justify-between px-2.5 py-1.5 text-[11px]">
                      <span className="text-muted-foreground capitalize">
                        {k.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="font-mono font-bold text-ivory">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Evidence Links */}
            {evidence.relatedEvidenceIds.length > 0 && (
              <div className="rounded-lg border border-border/60 bg-slate-900/50 p-3">
                <h4 className="font-bold text-ivory mb-2">
                  CORROBORATING EVIDENCE
                </h4>
                <div className="space-y-1.5">
                  {evidence.relatedEvidenceIds.map((relId) => (
                    <button
                      key={relId}
                      onClick={() => onSelectRelatedEvidence(relId)}
                      className="w-full flex items-center justify-between rounded-lg border border-border/40 bg-slate-950/40 p-2 text-left hover:border-primary/60 hover:bg-slate-900 transition-colors"
                    >
                      <span className="font-mono text-cyan font-bold">{relId}</span>
                      <span className="text-[10px] text-muted-foreground">
                        Click to inspect →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: EVIDENCE STRENGTH */}
        {activeTab === "strength" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/5 p-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                OVERALL EVIDENCE STRENGTH
              </span>
              <p className="mt-1 font-mono text-3xl font-bold text-ivory">
                {evidence.reliability.overallStrength}%
              </p>
              <div className="mt-2 h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-400"
                  style={{ width: `${evidence.reliability.overallStrength}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">
                SYNTHETIC DEMO CALCULATION — Composite score derived from source authority, observation confidence, and cross-source corroboration.
              </p>
            </div>

            {/* Contributing Factors */}
            <div className="space-y-2.5 rounded-lg border border-border/60 bg-slate-900/50 p-3.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Contributing Reliability Factors
              </h4>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-ivory font-medium">Source Quality Profile</span>
                    <span className="font-mono text-cyan font-bold">
                      {evidence.reliability.sourceQuality}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800">
                    <div
                      className="h-full bg-cyan rounded-full"
                      style={{ width: `${evidence.reliability.sourceQuality}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-ivory font-medium">Observation Confidence</span>
                    <span className="font-mono text-saffron font-bold">
                      {evidence.reliability.observationConfidence}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800">
                    <div
                      className="h-full bg-saffron rounded-full"
                      style={{ width: `${evidence.reliability.observationConfidence}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-ivory font-medium">Temporal Freshness</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {evidence.reliability.temporalFreshness}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${evidence.reliability.temporalFreshness}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-ivory font-medium">Cross-Source Agreement</span>
                    <span className="font-mono text-primary font-bold">
                      {evidence.reliability.crossSourceAgreement}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${evidence.reliability.crossSourceAgreement}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PROVENANCE */}
        {activeTab === "provenance" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border/60 bg-slate-900/50 p-3.5">
              <h4 className="font-bold text-ivory mb-2">
                SYNTHETIC DEMO PROVENANCE CHAIN
              </h4>

              <div className="space-y-3 relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                <div className="relative">
                  <span className="absolute -left-4 top-1 h-2 w-2 rounded-full bg-cyan" />
                  <span className="text-[10px] text-muted-foreground uppercase">
                    1. Source Origin
                  </span>
                  <p className="font-bold text-ivory">{evidence.provenance.sourceName}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Type: {evidence.provenance.sourceType}
                  </p>
                </div>

                <div className="relative">
                  <span className="absolute -left-4 top-1 h-2 w-2 rounded-full bg-saffron" />
                  <span className="text-[10px] text-muted-foreground uppercase">
                    2. Ingested Asset File
                  </span>
                  <p className="font-mono text-xs font-bold text-saffron">
                    {evidence.provenance.assetName}
                  </p>
                  <p className="mt-0.5 text-[9px] font-mono text-slate-400 break-all">
                    {evidence.provenance.checksum}
                  </p>
                </div>

                <div className="relative">
                  <span className="absolute -left-4 top-1 h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-muted-foreground uppercase">
                    3. Observation ID
                  </span>
                  <p className="font-mono text-xs font-bold text-emerald-400">
                    {evidence.provenance.observationId}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Ingested: {evidence.provenance.ingestionDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Custody Chain Trail */}
            <div className="rounded-lg border border-border/60 bg-slate-900/50 p-3.5">
              <h4 className="font-bold text-ivory mb-2">
                IMMUTABLE CUSTODY LOG
              </h4>
              <div className="space-y-2">
                {evidence.provenance.custodyChain.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded border border-border/40 bg-slate-950/40 p-2 text-[11px]"
                  >
                    <div>
                      <p className="font-medium text-ivory">{step.stage}</p>
                      <p className="text-[10px] font-mono text-cyan">
                        Agent: {step.agent}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {step.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: QUALITY SIGNALS */}
        {activeTab === "quality" && (
          <div className="space-y-3">
            {evidence.qualitySignals.map((sig, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border/60 bg-slate-900/50 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ivory">{sig.name}</span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-bold",
                      sig.rating === "HIGH"
                        ? "bg-verified/15 text-verified"
                        : sig.rating === "MEDIUM"
                        ? "bg-saffron/15 text-saffron"
                        : "bg-conflict/15 text-conflict"
                    )}
                  >
                    {sig.rating} ({sig.score}%)
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground text-xs">
                  {sig.details}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Navigation Actions */}
      <div className="border-t border-border/80 bg-slate-900/80 p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link
            to="/conflicts"
            search={{ select: evidence.conflictId } as any}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-slate-800 px-3 py-1.5 text-xs font-medium text-ivory hover:bg-slate-700 transition-colors"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-conflict" />
            View Conflict
          </Link>
          <Link
            to="/harmonization"
            search={{ entity: evidence.entityId } as any}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-slate-800 px-3 py-1.5 text-xs font-medium text-ivory hover:bg-slate-700 transition-colors"
          >
            <GitCompare className="h-3.5 w-3.5 text-cyan" />
            Compare Sources
          </Link>
        </div>

        <Link
          to="/verification"
          search={{ conflict: evidence.conflictId } as any}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-ivory shadow hover:bg-primary/90 transition-colors"
        >
          <FileCheck className="h-3.5 w-3.5" />
          Proceed to Verification
        </Link>
      </div>
    </div>
  );
}
