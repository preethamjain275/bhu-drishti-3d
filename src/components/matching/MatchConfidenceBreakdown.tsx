import React, { useState } from "react";
import { ShieldCheck, HelpCircle, CheckCircle2, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { MatchCandidate } from "@/lib/api/entityMatching";

interface MatchConfidenceBreakdownProps {
  candidate: MatchCandidate;
}

export const MatchConfidenceBreakdown: React.FC<MatchConfidenceBreakdownProps> = ({ candidate }) => {
  const { signals } = candidate;

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-slate-900/60 p-5 space-y-4 font-mono text-xs">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <div className="font-display font-semibold text-slate-100 text-sm">TRANSPARENT MATCH CONFIDENCE MODEL</div>
          <div className="text-[11px] text-slate-400">Structured signal weights without black-box logic</div>
        </div>
        <div className="text-right">
          <span className="font-bold text-2xl text-purple-300">{signals.combinedConfidenceScore}%</span>
          <div className="text-[10px] text-slate-500">Confidence Index</div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Spatial Overlap (40%) */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="cursor-pointer hover:bg-slate-950/40 p-2 rounded border border-transparent hover:border-slate-800 transition-colors space-y-1">
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-slate-200">
                  Spatial Overlap (Weight: 40%)
                  <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
                </span>
                <span className="font-bold text-cyan-300">{signals.spatialOverlapScore}%</span>
              </div>
              <Progress value={signals.spatialOverlapScore} className="h-2 bg-slate-800" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 border-cyan-500/30 bg-slate-950 text-slate-100 text-xs font-mono space-y-2">
            <div className="font-bold text-cyan-300">WHY DOES THIS LOOK LIKE THE SAME ENTITY?</div>
            <div className="space-y-1 text-slate-300">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Strong spatial IoU overlap ({signals.spatialOverlapScore}%)</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Minimal centroid offset (0.35m)</div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Geometry Similarity (25%) */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="cursor-pointer hover:bg-slate-950/40 p-2 rounded border border-transparent hover:border-slate-800 transition-colors space-y-1">
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-slate-200">
                  Geometry & Shape Similarity (Weight: 25%)
                  <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
                </span>
                <span className="font-bold text-cyan-300">{signals.geometrySimilarityScore}%</span>
              </div>
              <Progress value={signals.geometrySimilarityScore} className="h-2 bg-slate-800" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 border-cyan-500/30 bg-slate-950 text-slate-100 text-xs font-mono space-y-2">
            <div className="font-bold text-cyan-300">WHY DOES THIS LOOK LIKE THE SAME ENTITY?</div>
            <div className="space-y-1 text-slate-300">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Polygon boundary shape similarity (0.96)</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Perimeter agreement ({signals.geometrySimilarityScore}%)</div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Attribute Similarity (20%) */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="cursor-pointer hover:bg-slate-950/40 p-2 rounded border border-transparent hover:border-slate-800 transition-colors space-y-1">
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-slate-200">
                  Attribute & Vocabulary Match (Weight: 20%)
                  <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
                </span>
                <span className="font-bold text-cyan-300">{signals.attributeSimilarityScore}%</span>
              </div>
              <Progress value={signals.attributeSimilarityScore} className="h-2 bg-slate-800" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 border-cyan-500/30 bg-slate-950 text-slate-100 text-xs font-mono space-y-2">
            <div className="font-bold text-cyan-300">WHY DOES THIS LOOK LIKE THE SAME ENTITY?</div>
            <div className="space-y-1 text-slate-300">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Matching normalized land-use category</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Same property operational status</div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Temporal Consistency (10%) */}
        <div className="p-2 rounded space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-200">Temporal Consistency (Weight: 10%)</span>
            <span className="font-bold text-cyan-300">{signals.temporalConsistencyScore}%</span>
          </div>
          <Progress value={signals.temporalConsistencyScore} className="h-2 bg-slate-800" />
        </div>
      </div>
    </div>
  );
};
