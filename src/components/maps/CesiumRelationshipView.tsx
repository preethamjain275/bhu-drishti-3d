import React from "react";
import { ThreeDParcel, ThreeDBuilding } from "@/lib/maps/cesium/types";
import { GitFork, Building2, MapPin, Database, ArrowRight } from "lucide-react";

interface CesiumRelationshipViewProps {
  parcel: ThreeDParcel | null;
  buildings: ThreeDBuilding[];
  onSelectBuilding: (bldg: ThreeDBuilding) => void;
  onClose?: () => void;
}

export function CesiumRelationshipView({ parcel, buildings, onSelectBuilding, onClose }: CesiumRelationshipViewProps) {
  if (!parcel) return null;

  return (
    <div className="bg-slate-900/95 border border-slate-800 backdrop-blur-xl rounded-2xl p-4 shadow-2xl text-slate-100 text-xs w-72 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <GitFork className="h-4 w-4 text-teal-400" />
          <h3 className="font-mono text-xs font-bold uppercase text-slate-100">3D Relationship Tree</h3>
        </div>
      </div>

      {/* Hierarchy Tree */}
      <div className="font-mono space-y-2 text-[11px]">
        
        {/* Root Node: Parcel */}
        <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 flex items-center gap-2 font-bold">
          <MapPin className="h-4 w-4" />
          <span>PARCEL: {parcel.id} ({parcel.metrics.area} m²)</span>
        </div>

        {/* Level 1 Branch: Sources */}
        <div className="pl-4 space-y-1 border-l-2 border-slate-800">
          <div className="text-slate-500 font-bold flex items-center gap-1">
            <Database className="h-3 w-3 text-indigo-400" />
            CONTRIBUTING SOURCES ({parcel.sourceRepresentations?.length || 1})
          </div>
          {parcel.sourceRepresentations ? (
            parcel.sourceRepresentations.map((src) => (
              <div key={src.sourceId} className="pl-3 py-0.5 text-[10px] text-slate-400 flex items-center justify-between">
                <span>└─ {src.sourceName}</span>
                <span className="text-teal-300 font-bold">{Math.round(src.confidence * 100)}%</span>
              </div>
            ))
          ) : (
            <div className="pl-3 py-0.5 text-[10px] text-slate-400">└─ {parcel.sourceName}</div>
          )}
        </div>

        {/* Level 1 Branch: Buildings */}
        <div className="pl-4 space-y-1 border-l-2 border-slate-800">
          <div className="text-slate-500 font-bold flex items-center gap-1">
            <Building2 className="h-3 w-3 text-amber-400" />
            ASSOCIATED BUILDINGS ({buildings.length})
          </div>
          {buildings.map((b) => (
            <button
              key={b.id}
              onClick={() => onSelectBuilding(b)}
              className="w-full text-left pl-3 py-1 text-[10px] rounded hover:bg-slate-800 text-slate-300 hover:text-teal-300 transition flex items-center justify-between group"
            >
              <span>└─ {b.id} ({b.usage})</span>
              <span className="text-slate-400 group-hover:text-teal-300 font-bold flex items-center gap-1">
                {b.metrics.height}m <ArrowRight className="h-2.5 w-2.5" />
              </span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
