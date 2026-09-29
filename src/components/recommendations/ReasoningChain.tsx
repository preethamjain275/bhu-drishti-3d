/**
 * BHOO-MITRA AI — Explainable Reasoning Chain
 *
 * Interactive 8-step auditable reasoning chain:
 * 1. Identify conflicting observations
 * 2. Compare geometry similarity
 * 3. Evaluate source reliability
 * 4. Evaluate temporal recency
 * 5. Check topology/quality signals
 * 6. Compare supporting evidence
 * 7. Calculate recommendation confidence
 * 8. Produce candidate harmonization recommendation
 */

import React, { useState } from "react";
import { type ReasoningStep } from "@/lib/api/recommendations";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  Scale,
  Sparkles,
  Zap,
} from "lucide-react";

interface ReasoningChainProps {
  steps: ReasoningStep[];
  onSelectEvidence: (evidenceId: string) => void;
  className?: string;
}

export function ReasoningChain({
  steps,
  onSelectEvidence,
  className,
}: ReasoningChainProps) {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([1, 7, 8]);

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((prev) =>
      prev.includes(stepNumber)
        ? prev.filter((s) => s !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  const expandAll = () => setExpandedSteps(steps.map((s) => s.stepNumber));
  const collapseAll = () => setExpandedSteps([]);

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-surface/90 p-4 shadow-xl backdrop-blur-md",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between border-b border-border/60 pb-3 mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-saffron" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-ivory">
            WHY THIS RECOMMENDATION? — REASONING CHAIN
          </h4>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={expandAll}
            className="text-[11px] text-primary hover:underline"
          >
            Expand All
          </button>
          <span className="text-muted-foreground">•</span>
          <button
            onClick={collapseAll}
            className="text-[11px] text-muted-foreground hover:text-ivory"
          >
            Collapse
          </button>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-2.5">
        {steps.map((step) => {
          const isExpanded = expandedSteps.includes(step.stepNumber);

          return (
            <div
              key={step.stepNumber}
              className={cn(
                "rounded-lg border transition-all duration-200 overflow-hidden",
                isExpanded
                  ? "border-primary/50 bg-slate-900/90 shadow-md"
                  : "border-border/40 bg-slate-950/40 hover:border-border"
              )}
            >
              {/* Step Header */}
              <button
                onClick={() => toggleStep(step.stepNumber)}
                className="w-full flex items-center justify-between p-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 font-mono text-xs font-bold text-primary ring-1 ring-primary/40">
                    0{step.stepNumber}
                  </span>
                  <div>
                    <h5 className="font-bold text-ivory text-xs">
                      {step.title}
                    </h5>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {step.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="rounded bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                    {step.effectOnConfidence}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Step Expandable Body */}
              {isExpanded && (
                <div className="border-t border-border/40 bg-slate-950/50 p-3.5 space-y-2.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="rounded border border-border/40 bg-slate-900/60 p-2">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                        Observation & Evidence
                      </span>
                      <p className="mt-0.5 text-ivory">{step.observation}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {step.inputEvidence.map((ev) => (
                          <button
                            key={ev}
                            onClick={() => onSelectEvidence(ev)}
                            className="inline-flex items-center gap-0.5 font-mono text-[9px] text-cyan hover:underline"
                          >
                            <span>{ev.replace("EVIDENCE-DEMO-", "EVID-")}</span>
                            <ExternalLink className="h-2 w-2" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded border border-border/40 bg-slate-900/60 p-2">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                        Metric / Signal Evaluated
                      </span>
                      <p className="mt-0.5 font-mono text-saffron">
                        {step.metricSignal}
                      </p>
                      <span className="mt-1 block text-[10px] text-muted-foreground font-mono">
                        Source: {step.relevantSource}
                      </span>
                    </div>
                  </div>

                  <div className="rounded border border-verified/30 bg-verified/5 px-2.5 py-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-verified">
                      Finding: {step.result}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">
                      {step.effectOnConfidence}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
