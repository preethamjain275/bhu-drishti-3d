import React from "react";
import { HelpCircle, AlertTriangle, ArrowRight, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { UnresolvedCase } from "@/lib/api/entityMatching";

interface UnresolvedMatchesPanelProps {
  unresolvedCases: UnresolvedCase[];
  onInvestigateCase: (c: UnresolvedCase) => void;
}

export const UnresolvedMatchesPanel: React.FC<UnresolvedMatchesPanelProps> = ({
  unresolvedCases,
  onInvestigateCase,
}) => {
  return (
    <div className="panel-surface rounded-xl border border-slate-800 bg-slate-950/70 p-5 space-y-4 shadow-lg backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-rose-400" />
          <div>
            <h3 className="font-display font-semibold text-slate-100 text-base">UNRESOLVED MATCHES & HUMAN REVIEW QUEUE</h3>
            <p className="text-xs text-slate-400">Low confidence candidate matches requiring manual evidence verification.</p>
          </div>
        </div>
        <Badge variant="outline" className="border-rose-500/40 bg-rose-950/40 text-rose-300 font-mono text-xs">
          {unresolvedCases.length} Cases Requiring Review
        </Badge>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {unresolvedCases.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-rose-500/30 bg-slate-900/60 p-4 space-y-3 hover:border-rose-500/60 transition-colors"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-300 text-sm">{item.id}</span>
                <span className="text-slate-400 font-mono">({item.observationId} · {item.sourceName})</span>
              </div>
              <Badge variant="outline" className="border-rose-500/40 text-rose-300 text-[10px]">
                CONFIDENCE: {item.confidenceScore}% (UNRESOLVED)
              </Badge>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-rose-400 font-semibold text-[11px] flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> REASON UNRESOLVED:
              </span>
              <p className="text-slate-300 leading-relaxed text-xs">{item.reason}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                Missing Evidence: <strong className="text-amber-300">{item.missingEvidence}</strong>
              </span>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onInvestigateCase(item)}
                className="border-rose-500/40 text-rose-300 hover:bg-rose-950/30 text-xs font-semibold"
              >
                OPEN CASE INSPECTOR
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
