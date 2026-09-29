/**
 * BHOO-MITRA AI — Source Reliability Panel
 *
 * Visual profile of data source authorities & quality metrics:
 * - Municipal GIS
 * - Property Registry
 * - Drone Survey
 */

import React from "react";
import { type SourceReliabilityProfile } from "@/lib/mock/evidence-data";
import { cn } from "@/lib/utils";
import { ShieldCheck, Database, Layers, Sparkles } from "lucide-react";

interface SourceReliabilityPanelProps {
  profiles: SourceReliabilityProfile[];
  selectedSourceId: string | null;
  onSelectSource: (sourceId: string) => void;
  className?: string;
}

export function SourceReliabilityPanel({
  profiles,
  selectedSourceId,
  onSelectSource,
  className,
}: SourceReliabilityPanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-surface/90 p-4 shadow-xl backdrop-blur-md",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5 mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-ivory">
            DEMO SOURCE QUALITY PROFILES
          </h4>
        </div>
        <span className="text-[10px] text-muted-foreground italic">
          Synthetic Authority Weights
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {profiles.map((prof) => {
          const isSelected = prof.id === selectedSourceId;

          return (
            <div
              key={prof.id}
              onClick={() => onSelectSource(prof.id)}
              className={cn(
                "rounded-lg border p-3 text-xs transition-all cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                  : "border-border/40 bg-slate-950/40 hover:border-border hover:bg-slate-900/60"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: prof.badgeColor }}
                  />
                  <span className="font-bold text-ivory">{prof.shortName}</span>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {prof.overallQuality}% Quality
                </span>
              </div>

              <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                {prof.description}
              </p>

              {/* Quality Bars */}
              <div className="mt-3 space-y-1.5 border-t border-border/40 pt-2">
                <div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Geometry Fidelity</span>
                    <span className="font-mono text-cyan font-semibold">
                      {prof.geometryQuality}%
                    </span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-slate-800">
                    <div
                      className="h-full bg-cyan rounded-full"
                      style={{ width: `${prof.geometryQuality}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Attribute Completeness</span>
                    <span className="font-mono text-saffron font-semibold">
                      {prof.attributeCompleteness}%
                    </span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-slate-800">
                    <div
                      className="h-full bg-saffron rounded-full"
                      style={{ width: `${prof.attributeCompleteness}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Temporal Freshness</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {prof.temporalFreshness}%
                    </span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-slate-800">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${prof.temporalFreshness}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-2.5 flex justify-between text-[10px] text-muted-foreground">
                <span>Active Evidence:</span>
                <span className="font-mono text-ivory font-bold">
                  {prof.activeEvidenceCount} records
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
