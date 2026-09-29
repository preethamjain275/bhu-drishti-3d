import React, { useState } from "react";
import { GitCompare, CheckCircle2, AlertTriangle, ArrowRight, Layers, Sliders, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EntityObservation, MatchCandidate } from "@/lib/api/entityMatching";

interface CandidateMatchingPanelProps {
  observation: EntityObservation;
  candidates: MatchCandidate[];
  selectedCandidateId: string;
  onSelectCandidate: (candidateId: string) => void;
}

export const CandidateMatchingPanel: React.FC<CandidateMatchingPanelProps> = ({
  observation,
  candidates,
  selectedCandidateId,
  onSelectCandidate,
}) => {
  const currentCandidate = candidates.find((c) => c.candidateEntityId === selectedCandidateId) ?? candidates[0]!;

  return (
    <div className="panel-surface rounded-xl border border-slate-800 bg-slate-950/70 p-5 space-y-5 shadow-lg backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-cyan-400" />
          <div>
            <h3 className="font-display font-semibold text-slate-100 text-base">
              CANDIDATE MATCHING & SIGNAL COMPARISON
            </h3>
            <p className="text-xs text-slate-400">
              Comparing {observation.id} ({observation.sourceName}) against candidate canonical entities.
            </p>
          </div>
        </div>

        <Badge variant="outline" className="border-cyan-500/40 bg-cyan-950/40 text-cyan-300 font-mono text-xs">
          Target Candidate: {currentCandidate.candidateEntityId}
        </Badge>
      </div>

      {/* Matching Signal Comparison Matrix */}
      <div className="space-y-2 font-mono text-xs">
        <div className="flex justify-between items-center text-slate-300">
          <span className="font-display font-semibold text-xs uppercase tracking-wider text-slate-200">
            MATCHING SIGNAL COMPARISON
          </span>
          <span className="text-[10px] text-slate-500">
            Overall Signal is a synthetic candidate-matching score, not an authoritative identity determination.
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase">
                <th className="p-3">Candidate Entity</th>
                <th className="p-3">Spatial Signal</th>
                <th className="p-3">Attribute Signal</th>
                <th className="p-3">Temporal Signal</th>
                <th className="p-3">Overall Signal</th>
                <th className="p-3">Confidence Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {candidates.map((cand) => {
                const isSelected = cand.candidateEntityId === selectedCandidateId;
                return (
                  <tr
                    key={cand.candidateEntityId}
                    onClick={() => onSelectCandidate(cand.candidateEntityId)}
                    className={`cursor-pointer transition-colors hover:bg-slate-900/80 ${
                      isSelected ? "bg-cyan-950/40 border-l-2 border-l-cyan-400 font-bold" : ""
                    }`}
                  >
                    <td className="p-3 text-cyan-300">{cand.candidateEntityId} ({cand.parcelId})</td>
                    <td className="p-3 font-bold text-slate-100">{cand.spatialScore}%</td>
                    <td className="p-3 font-bold text-slate-100">{cand.attributeScore}%</td>
                    <td className="p-3 font-bold text-slate-100">{cand.temporalScore}%</td>
                    <td className="p-3 font-bold text-purple-300 text-sm">{cand.overallSignalScore}%</td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={
                          cand.confidenceTier === "HIGH-CONFIDENCE CANDIDATE"
                            ? "border-emerald-500/40 text-emerald-300 text-[10px]"
                            : "border-amber-500/40 text-amber-300 text-[10px]"
                        }
                      >
                        {cand.confidenceTier}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spatial & Attribute Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        {/* Spatial Metrics */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <h4 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider">
            SPATIAL TOPOLOGY SIGNALS
          </h4>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px]">Intersection Over Union (IoU):</span>
              <div className="font-bold text-emerald-400 text-sm">{currentCandidate.metrics.iouPercentage}%</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px]">Centroid Distance:</span>
              <div className="font-bold text-cyan-300 text-sm">{currentCandidate.metrics.centroidDistanceMeters} meters</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px]">Area Similarity:</span>
              <div className="font-bold text-slate-100 text-sm">{currentCandidate.metrics.areaSimilarityPercentage}%</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px]">Shape Similarity Score:</span>
              <div className="font-bold text-purple-300 text-sm">{currentCandidate.metrics.shapeSimilarityScore}</div>
            </div>
          </div>
        </div>

        {/* Attribute Comparison */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <h4 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider">
            ATTRIBUTE MATCHING
          </h4>
          <div className="space-y-1.5 overflow-y-auto max-h-40 pr-1">
            {currentCandidate.attributeItems.map((item, idx) => (
              <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-cyan-400 font-bold">{item.attributeName}:</span>{" "}
                  <span className="text-slate-300">{item.sourceValue}</span> vs <span className="text-emerald-300">{item.candidateValue}</span>
                </div>
                <Badge variant="outline" className={item.result === "MATCH" ? "border-emerald-500/40 text-emerald-300 text-[9px]" : "border-amber-500/40 text-amber-300 text-[9px]"}>
                  {item.result}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
