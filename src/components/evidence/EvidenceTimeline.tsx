/**
 * BHOO-MITRA AI — Evidence Timeline Component
 *
 * Chronological visualization of multi-source observations:
 * Shows the evolution of records from historical deeds to recent drone surveys.
 */

import React from "react";
import { type ConflictEvidence } from "@/lib/mock/evidence-data";
import { cn } from "@/lib/utils";
import { Clock, Eye, Sparkles } from "lucide-react";

interface EvidenceTimelineProps {
  evidenceList: ConflictEvidence[];
  selectedEvidenceId: string | null;
  onSelectEvidence: (id: string) => void;
  className?: string;
}

export function EvidenceTimeline({
  evidenceList,
  selectedEvidenceId,
  onSelectEvidence,
  className,
}: EvidenceTimelineProps) {
  // Sort evidence by observation date (earliest to latest)
  const sortedEvidence = [...evidenceList].sort((a, b) =>
    a.observationDate.localeCompare(b.observationDate)
  );

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-surface/90 p-4 shadow-xl backdrop-blur-md",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-saffron" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-ivory">
            CHRONOLOGICAL OBSERVATION TIMELINE
          </h4>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          {sortedEvidence.length} observations ({sortedEvidence[0]?.observationDate.slice(0, 4)} — 2026)
        </span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80">
        {sortedEvidence.map((ev) => {
          const isSelected = ev.id === selectedEvidenceId;

          const badgeColor =
            ev.sourceId === "municipal"
              ? "border-cyan/50 text-cyan bg-cyan/10"
              : ev.sourceId === "registry"
              ? "border-saffron/50 text-saffron bg-saffron/10"
              : "border-emerald-400/50 text-emerald-400 bg-emerald-400/10";

          return (
            <div
              key={ev.id}
              onClick={() => onSelectEvidence(ev.id)}
              className={cn(
                "relative group rounded-lg border p-3 text-xs transition-all cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                  : "border-border/40 bg-slate-950/40 hover:border-border hover:bg-slate-900/60"
              )}
            >
              {/* Timeline Dot */}
              <span
                className={cn(
                  "absolute -left-6 top-3.5 h-3 w-3 rounded-full border-2 border-slate-950 transition-transform",
                  isSelected
                    ? "bg-primary scale-125 ring-2 ring-primary/40"
                    : ev.sourceId === "municipal"
                    ? "bg-cyan"
                    : ev.sourceId === "registry"
                    ? "bg-saffron"
                    : "bg-emerald-400"
                )}
              />

              <div className="flex flex-wrap items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-ivory">
                    {ev.observationDate}
                  </span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.2 text-[10px] font-semibold border",
                      badgeColor
                    )}
                  >
                    {ev.sourceName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {ev.confidence}% conf
                  </span>
                  <span className="font-mono text-cyan text-[10px]">
                    {ev.id.replace("EVIDENCE-DEMO-", "EVID-")}
                  </span>
                </div>
              </div>

              <p className="mt-1 font-medium text-foreground">{ev.title}</p>
              <p className="mt-0.5 text-muted-foreground line-clamp-2">
                {ev.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
