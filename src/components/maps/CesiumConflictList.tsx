import React, { useState } from "react";
import { ThreeDConflict, ThreeDConflictType, ThreeDConflictSeverity } from "@/lib/maps/cesium/types";
import { MOCK_3D_CONFLICTS } from "@/lib/mock/conflict3D";
import { ShieldAlert, Flame, Filter, ChevronRight, CheckCircle2 } from "lucide-react";

interface CesiumConflictListProps {
  selectedConflict: ThreeDConflict | null;
  onSelectConflict: (conflict: ThreeDConflict) => void;
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
}

export function CesiumConflictList({
  selectedConflict,
  onSelectConflict,
  showHeatmap,
  onToggleHeatmap,
}: CesiumConflictListProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");

  const filteredConflicts = MOCK_3D_CONFLICTS.filter((c) => {
    if (selectedType !== "ALL" && c.type !== selectedType) return false;
    if (selectedSeverity !== "ALL" && c.severity !== selectedSeverity) return false;
    return true;
  });

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold shadow-2xl backdrop-blur-xl hover:bg-slate-800 transition cursor-pointer"
      >
        <ShieldAlert className="h-4 w-4" />
        <span>3D Conflicts ({filteredConflicts.length})</span>
      </button>
    );
  }

  return (
    <div className="w-80 bg-slate-900/95 border border-slate-800 backdrop-blur-xl rounded-2xl p-4 shadow-2xl text-slate-100 space-y-3 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-purple-400">
          <ShieldAlert className="h-4 w-4" />
          3D CONFLICTS ({filteredConflicts.length})
        </div>

        <div className="flex items-center gap-1">
          {/* Heatmap Toggle */}
          <button
            onClick={onToggleHeatmap}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono font-bold transition ${
              showHeatmap
                ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Flame className="h-3 w-3" />
            {showHeatmap ? "HEATMAP ON" : "HEATMAP"}
          </button>

          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white text-xs"
            title="Minimize Panel"
          >
            −
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
        <div>
          <label className="text-slate-500 block mb-1">TYPE FILTER</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">ALL TYPES</option>
            <option value="GEOMETRY">GEOMETRY</option>
            <option value="ATTRIBUTE">ATTRIBUTE</option>
            <option value="TEMPORAL">TEMPORAL</option>
            <option value="TOPOLOGY">TOPOLOGY</option>
          </select>
        </div>

        <div>
          <label className="text-slate-500 block mb-1">SEVERITY</label>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">ALL SEVERITY</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Conflicts List */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {filteredConflicts.map((c) => {
          const isSelected = selectedConflict?.conflictId === c.conflictId;
          return (
            <div
              key={c.conflictId}
              onClick={() => onSelectConflict(c)}
              className={`p-2.5 rounded-xl border cursor-pointer font-mono transition ${
                isSelected
                  ? "bg-purple-950/60 border-purple-500 shadow-md shadow-purple-500/20"
                  : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-purple-300">{c.conflictId}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] ${
                    c.severity === "CRITICAL" || c.severity === "HIGH"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {c.severity}
                </span>
              </div>
              <div className="text-[11px] text-white font-sans font-medium line-clamp-1 mt-1">{c.title}</div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                <span>{c.entityId}</span>
                <span className="flex items-center text-teal-400 font-bold">
                  {c.type} <ChevronRight className="h-3 w-3 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
