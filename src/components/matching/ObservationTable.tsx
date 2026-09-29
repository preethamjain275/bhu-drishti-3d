import React, { useState } from "react";
import { Search, Database, ArrowRight, Eye, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EntityObservation, MatchStatus } from "@/lib/api/entityMatching";

interface ObservationTableProps {
  observations: EntityObservation[];
  selectedObsId: string | null;
  onSelectObservation: (obs: EntityObservation) => void;
}

export const ObservationTable: React.FC<ObservationTableProps> = ({
  observations,
  selectedObsId,
  onSelectObservation,
}) => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = observations.filter((o) => {
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.sourceName.toLowerCase().includes(q) ||
      o.sourceEntityId.toLowerCase().includes(q) ||
      o.candidateCanonicalId.toLowerCase().includes(q) ||
      o.locationLabel.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: MatchStatus) => {
    switch (status) {
      case "MATCHED":
        return <Badge variant="outline" className="border-emerald-500/40 bg-emerald-950/30 text-emerald-300 font-mono text-[10px]">● MATCHED</Badge>;
      case "PROBABLE MATCH":
        return <Badge variant="outline" className="border-cyan-500/40 bg-cyan-950/30 text-cyan-300 font-mono text-[10px]">● PROBABLE</Badge>;
      case "NEEDS REVIEW":
        return <Badge variant="outline" className="border-amber-500/40 bg-amber-950/30 text-amber-300 font-mono text-[10px]">● NEEDS REVIEW</Badge>;
      case "POSSIBLE DUPLICATE":
        return <Badge variant="outline" className="border-purple-500/40 bg-purple-950/30 text-purple-300 font-mono text-[10px]">● DUPLICATE</Badge>;
      case "UNRESOLVED":
        return <Badge variant="outline" className="border-rose-500/40 bg-rose-950/30 text-rose-300 font-mono text-[10px]">● UNRESOLVED</Badge>;
      default:
        return <Badge variant="outline" className="border-slate-700 bg-slate-900 text-slate-400 font-mono text-[10px]">NO MATCH</Badge>;
    }
  };

  return (
    <div className="panel-surface rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3 shadow-lg backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-cyan-400" />
          <h3 className="font-display font-semibold text-slate-100 text-sm">
            SOURCE OBSERVATIONS & CANDIDATE ENTITIES
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search ID, Source, Candidate..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 pl-8 border-slate-800 bg-slate-900/80 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
        {["ALL", "MATCHED", "PROBABLE MATCH", "NEEDS REVIEW", "UNRESOLVED", "POSSIBLE DUPLICATE"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={cn(
              "rounded-md px-2 py-1 border transition-colors whitespace-nowrap",
              statusFilter === st
                ? "border-cyan-500/60 bg-cyan-950/40 text-cyan-200 font-bold"
                : "border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200"
            )}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Observation Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono uppercase">
              <th className="p-3">Observation ID</th>
              <th className="p-3">Source</th>
              <th className="p-3">Source Entity ID</th>
              <th className="p-3">Candidate Canonical ID</th>
              <th className="p-3">Geom / Area</th>
              <th className="p-3">Date</th>
              <th className="p-3">Confidence</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            {filtered.map((obs) => {
              const isSelected = selectedObsId === obs.id;
              return (
                <tr
                  key={obs.id}
                  onClick={() => onSelectObservation(obs)}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-slate-900/80",
                    isSelected && "bg-cyan-950/30 border-l-2 border-l-cyan-400"
                  )}
                >
                  <td className="p-3 font-bold text-cyan-300">{obs.id}</td>
                  <td className="p-3 text-slate-200">{obs.sourceName}</td>
                  <td className="p-3 text-slate-400">{obs.sourceEntityId}</td>
                  <td className="p-3 font-bold text-emerald-300">{obs.candidateCanonicalId}</td>
                  <td className="p-3 text-slate-300">
                    {obs.geometryType} ({obs.areaSqm} m²)
                  </td>
                  <td className="p-3 text-slate-400">{obs.observationDate}</td>
                  <td className="p-3 font-bold text-purple-300">{obs.confidenceScore}%</td>
                  <td className="p-3">{getStatusBadge(obs.status)}</td>
                  <td className="p-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectObservation(obs);
                      }}
                      className="text-cyan-400 hover:text-cyan-200 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <Eye className="h-3.5 w-3.5" /> Investigate
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
