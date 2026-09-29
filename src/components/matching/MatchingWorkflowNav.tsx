import React from "react";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

export type MatchingStep =
  | "SOURCE OBSERVATIONS"
  | "CANDIDATE GENERATION"
  | "SPATIAL COMPARISON"
  | "ATTRIBUTE COMPARISON"
  | "TEMPORAL CHECK"
  | "MATCH CONFIDENCE"
  | "MATCH / REVIEW / UNRESOLVED";

interface MatchingWorkflowNavProps {
  currentStep: MatchingStep;
  onSelectStep: (step: MatchingStep) => void;
}

const STEPS: MatchingStep[] = [
  "SOURCE OBSERVATIONS",
  "CANDIDATE GENERATION",
  "SPATIAL COMPARISON",
  "ATTRIBUTE COMPARISON",
  "TEMPORAL CHECK",
  "MATCH CONFIDENCE",
  "MATCH / REVIEW / UNRESOLVED",
];

export const MatchingWorkflowNav: React.FC<MatchingWorkflowNavProps> = ({
  currentStep,
  onSelectStep,
}) => {
  const currentIndex = STEPS.indexOf(currentStep);

  return (
    <div className="panel-surface rounded-xl border border-cyan-500/30 bg-slate-950/80 p-3 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between overflow-x-auto gap-2 text-xs font-mono">
        {STEPS.map((stg, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <React.Fragment key={stg}>
              <button
                onClick={() => onSelectStep(stg)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap ${
                  isCurrent
                    ? "border-cyan-500 bg-cyan-950/80 text-cyan-200 font-bold shadow-md ring-1 ring-cyan-500/40"
                    : isPassed
                    ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300 font-medium"
                    : "border-slate-800 bg-slate-900/40 text-slate-500 hover:text-slate-300"
                }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Circle className="h-3.5 w-3.5 text-cyan-400 fill-cyan-400/40 animate-pulse shrink-0" />
                ) : (
                  <span className="text-[10px] text-slate-600 font-bold min-w-[14px]">{idx + 1}</span>
                )}
                <span>{stg}</span>
              </button>

              {idx < STEPS.length - 1 && (
                <ArrowRight className="h-3 w-3 text-slate-700 shrink-0 hidden sm:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
