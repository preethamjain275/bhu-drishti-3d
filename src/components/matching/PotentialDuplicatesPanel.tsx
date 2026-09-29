import React from "react";
import { Copy, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DuplicateCandidate } from "@/lib/api/entityMatching";

interface PotentialDuplicatesPanelProps {
  duplicates: DuplicateCandidate[];
  onInvestigateDuplicate: (dup: DuplicateCandidate) => void;
}

export const PotentialDuplicatesPanel: React.FC<PotentialDuplicatesPanelProps> = ({
  duplicates,
  onInvestigateDuplicate,
}) => {
  return (
    <div className="panel-surface rounded-xl border border-slate-800 bg-slate-950/70 p-5 space-y-4 shadow-lg backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Copy className="h-5 w-5 text-purple-400" />
          <div>
            <h3 className="font-display font-semibold text-slate-100 text-base">POTENTIAL DUPLICATE DETECTION</h3>
            <p className="text-xs text-slate-400">Records from multiple sources likely representing identical real-world land parcels.</p>
          </div>
        </div>
        <Badge variant="outline" className="border-purple-500/40 bg-purple-950/40 text-purple-300 font-mono text-xs">
          {duplicates.length} Duplicate Clusters Flagged
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        {duplicates.map((dup) => (
          <div
            key={dup.id}
            className="rounded-xl border border-purple-500/30 bg-slate-900/60 p-4 space-y-3 hover:border-purple-500/60 transition-colors"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-bold text-purple-300 text-sm">{dup.id}</span>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-[10px]">
                CONFIDENCE: {dup.confidenceScore}%
              </Badge>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed">{dup.description}</p>

            <div className="grid grid-cols-2 gap-2 text-slate-400">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500">Spatial Overlap:</span>
                <div className="font-bold text-emerald-300 text-xs mt-0.5">{dup.spatialOverlap}%</div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500">Attribute Match:</span>
                <div className="font-bold text-cyan-300 text-xs mt-0.5">{dup.attributeSimilarity}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex gap-1 text-[10px]">
                {dup.observationIds.map((obs) => (
                  <span key={obs} className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
                    {obs}
                  </span>
                ))}
              </div>

              <Button
                size="sm"
                onClick={() => onInvestigateDuplicate(dup)}
                className="bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold text-xs shadow-md"
              >
                INVESTIGATE DUPLICATE
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
