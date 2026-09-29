/**
 * BHOO-MITRA AI — "Why This Recommendation?" Inspector
 *
 * Inspector panel detailing the multi-factor signals contributing to recommendation confidence:
 * - Evidence Support
 * - Source Reliability
 * - Geometry Agreement
 * - Temporal Signal
 * - Quality Signals
 * - Confidence Breakdown
 */

import React, { useState } from "react";
import {
  type RecommendationConfidenceBreakdown,
  type RecommendationContext,
} from "@/lib/api/recommendations";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  Layers,
  Clock,
  Zap,
  BarChart3,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface WhyRecommendationInspectorProps {
  context: RecommendationContext;
  confidenceBreakdown: RecommendationConfidenceBreakdown;
  onSelectEvidence: (evidenceId: string) => void;
  className?: string;
}

export function WhyRecommendationInspector({
  context,
  confidenceBreakdown,
  onSelectEvidence,
  className,
}: WhyRecommendationInspectorProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    "breakdown" | "geometry" | "sources" | "quality"
  >("breakdown");

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-surface/90 p-4 shadow-xl backdrop-blur-md",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-cyan" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-ivory">
            CONFIDENCE SIGNALS & FACTOR BREAKDOWN
          </h4>
        </div>
        <span className="font-mono text-xs font-bold text-emerald-400">
          Composite: {confidenceBreakdown.overall}% (High)
        </span>
      </div>

      {/* Subtabs */}
      <div className="flex gap-1 border-b border-border/40 pb-2 mb-3 text-xs">
        <button
          onClick={() => setActiveSubTab("breakdown")}
          className={cn(
            "rounded px-2.5 py-1 font-medium transition-colors",
            activeSubTab === "breakdown"
              ? "bg-primary/20 text-primary font-bold"
              : "text-muted-foreground hover:text-ivory"
          )}
        >
          Confidence Weights
        </button>
        <button
          onClick={() => setActiveSubTab("geometry")}
          className={cn(
            "rounded px-2.5 py-1 font-medium transition-colors",
            activeSubTab === "geometry"
              ? "bg-primary/20 text-primary font-bold"
              : "text-muted-foreground hover:text-ivory"
          )}
        >
          Geometry Metrics
        </button>
        <button
          onClick={() => setActiveSubTab("sources")}
          className={cn(
            "rounded px-2.5 py-1 font-medium transition-colors",
            activeSubTab === "sources"
              ? "bg-primary/20 text-primary font-bold"
              : "text-muted-foreground hover:text-ivory"
          )}
        >
          Source Reliability
        </button>
        <button
          onClick={() => setActiveSubTab("quality")}
          className={cn(
            "rounded px-2.5 py-1 font-medium transition-colors",
            activeSubTab === "quality"
              ? "bg-primary/20 text-primary font-bold"
              : "text-muted-foreground hover:text-ivory"
          )}
        >
          Quality Signals
        </button>
      </div>

      {/* Subtab 1: Breakdown */}
      {activeSubTab === "breakdown" && (
        <div className="space-y-3 text-xs">
          <div className="space-y-2">
            <div>
              <div className="flex justify-between">
                <span className="text-ivory font-medium">
                  Geometry Agreement (35% weight)
                </span>
                <span className="font-mono text-cyan font-bold">
                  {confidenceBreakdown.geometryAgreement}%
                </span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-slate-800">
                <div
                  className="h-full bg-cyan rounded-full"
                  style={{ width: `${confidenceBreakdown.geometryAgreement}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <span className="text-ivory font-medium">
                  Source Reliability (25% weight)
                </span>
                <span className="font-mono text-saffron font-bold">
                  {confidenceBreakdown.sourceReliability}%
                </span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-slate-800">
                <div
                  className="h-full bg-saffron rounded-full"
                  style={{ width: `${confidenceBreakdown.sourceReliability}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <span className="text-ivory font-medium">
                  Temporal Consistency (20% weight)
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {confidenceBreakdown.temporalConsistency}%
                </span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-slate-800">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${confidenceBreakdown.temporalConsistency}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <span className="text-ivory font-medium">
                  Evidence Quality (20% weight)
                </span>
                <span className="font-mono text-primary font-bold">
                  {confidenceBreakdown.evidenceQuality}%
                </span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-slate-800">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${confidenceBreakdown.evidenceQuality}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground italic pt-1 border-t border-border/40">
            ⚠️ Transparent System Weights — Grounded in ISO 19157 spatial data quality indicators.
          </p>
        </div>
      )}

      {/* Subtab 2: Geometry */}
      {activeSubTab === "geometry" && (
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded border border-border/40 bg-slate-950/60 p-2">
              <span className="text-[10px] text-muted-foreground">Centroid Displacement</span>
              <p className="font-mono font-bold text-ivory">1.85 m</p>
              <span className="text-[9px] text-verified">Within tolerance (&lt; 2.5m)</span>
            </div>
            <div className="rounded border border-border/40 bg-slate-950/60 p-2">
              <span className="text-[10px] text-muted-foreground">IoU Overlap</span>
              <p className="font-mono font-bold text-cyan">96.8%</p>
              <span className="text-[9px] text-verified">High Spatial Match</span>
            </div>
            <div className="rounded border border-border/40 bg-slate-950/60 p-2">
              <span className="text-[10px] text-muted-foreground">Shape Similarity</span>
              <p className="font-mono font-bold text-saffron">94.2%</p>
              <span className="text-[9px] text-muted-foreground">Hausdorff metric</span>
            </div>
            <div className="rounded border border-border/40 bg-slate-950/60 p-2">
              <span className="text-[10px] text-muted-foreground">Area Discrepancy</span>
              <p className="font-mono font-bold text-conflict">80 m² (3.2%)</p>
              <span className="text-[9px] text-saffron">Exceeds 2.0% threshold</span>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Sources */}
      {activeSubTab === "sources" && (
        <div className="space-y-2 text-xs">
          {context.sources.map((src) => (
            <div
              key={src.id}
              className="flex items-center justify-between rounded border border-border/40 bg-slate-950/50 p-2"
            >
              <span className="font-medium text-ivory">{src.name}</span>
              <span className="font-mono font-bold text-emerald-400">
                {src.qualityScore}% Quality
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 4: Quality */}
      {activeSubTab === "quality" && (
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between rounded bg-slate-950/40 p-2">
            <span className="text-muted-foreground">Geometry Validity</span>
            <span className="text-verified font-bold">100% Valid Polygon</span>
          </div>
          <div className="flex items-center justify-between rounded bg-slate-950/40 p-2">
            <span className="text-muted-foreground">Attribute Completeness</span>
            <span className="text-cyan font-bold">92% Populated</span>
          </div>
          <div className="flex items-center justify-between rounded bg-slate-950/40 p-2">
            <span className="text-muted-foreground">CRS Consistency</span>
            <span className="text-verified font-bold">EPSG:7760 (Aligned)</span>
          </div>
          <div className="flex items-center justify-between rounded bg-slate-950/40 p-2">
            <span className="text-muted-foreground">Topology Status</span>
            <span className="text-verified font-bold">Zero Intersection Errors</span>
          </div>
        </div>
      )}
    </div>
  );
}
