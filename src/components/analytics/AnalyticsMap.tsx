import React, { useState } from "react";
import { MapEngine } from "@/components/maps/MapEngine";
import { ShieldAlert, Flame, MapPin, Layers, ExternalLink } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function AnalyticsMap() {
  const navigate = useNavigate();
  const [mapMode, setMapMode] = useState<"POINTS" | "DENSITY" | "SEVERITY" | "TYPE">("SEVERITY");
  const [selectedSpot, setSelectedSpot] = useState<{ id: string; parcel: string; type: string; severity: string } | null>({
    id: "CNF-3D-001",
    parcel: "PARCEL-DEMO-014",
    type: "GEOMETRY",
    severity: "HIGH",
  });

  const conflictSpots = [
    { id: "CNF-3D-001", parcel: "PARCEL-DEMO-014", type: "GEOMETRY", severity: "HIGH", area: "Bengaluru East" },
    { id: "CNF-3D-002", parcel: "PARCEL-DEMO-019", type: "ATTRIBUTE", severity: "CRITICAL", area: "Bengaluru Central" },
    { id: "CNF-3D-003", parcel: "PARCEL-DEMO-017", type: "TEMPORAL", severity: "MEDIUM", area: "Bengaluru South" },
    { id: "CNF-3D-004", parcel: "PARCEL-DEMO-014", type: "TOPOLOGY", severity: "HIGH", area: "Bengaluru East" },
  ];

  return (
    <div className="relative w-full h-[360px] rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden font-sans shadow-xl">
      
      {/* 2D Map Engine Canvas */}
      <MapEngine className="w-full h-full" />

      {/* Mode Controls Overlay */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 font-mono text-xs backdrop-blur-md">
        <span className="text-[10px] text-slate-400 font-bold px-2 uppercase">Analytics Map:</span>
        {(["POINTS", "DENSITY", "SEVERITY", "TYPE"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setMapMode(mode)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
              mapMode === mode
                ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Selected Conflict Spot Card */}
      {selectedSpot && (
        <div className="absolute bottom-3 left-3 z-10 p-3 rounded-xl bg-slate-900/95 border border-slate-800 backdrop-blur-md font-mono text-xs space-y-1 shadow-xl max-w-xs">
          <div className="flex items-center justify-between text-teal-400 font-bold">
            <span className="flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5" />
              {selectedSpot.id}
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {selectedSpot.severity}
            </span>
          </div>
          <div className="text-slate-200 text-[11px]">Affected: {selectedSpot.parcel}</div>
          <div className="text-slate-400 text-[10px]">Type: {selectedSpot.type}</div>
          <button
            onClick={() => navigate({ to: "/conflicts", search: { conflict: selectedSpot.id } })}
            className="w-full mt-2 py-1 rounded bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[10px] flex items-center justify-center gap-1 transition"
          >
            OPEN IN CONFLICT EXPLORER <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Legend Badge */}
      <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-400 backdrop-blur-md">
        Spatial Mode: <span className="text-teal-400 font-bold">{mapMode}</span>
      </div>

    </div>
  );
}
