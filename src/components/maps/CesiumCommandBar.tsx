import React from "react";
import { ThreeDEntity, VisualMode } from "@/lib/maps/cesium/types";
import { Box, Camera, RefreshCw, Search, Shield, Sparkles } from "lucide-react";

interface CesiumCommandBarProps {
  selectedEntity: ThreeDEntity | null;
  visualMode: VisualMode;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onResetView: () => void;
  onCaptureScreenshot: () => void;
}

export function CesiumCommandBar({
  selectedEntity,
  visualMode,
  searchQuery,
  onSearchChange,
  onResetView,
  onCaptureScreenshot,
}: CesiumCommandBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border-b border-slate-800/90 backdrop-blur-xl px-4 py-2.5 text-slate-200">
      
      {/* Title & Badge */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
          <Box className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-sm text-white tracking-wide">3D INTELLIGENCE</h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
              SYNTHETIC 3D DEMO
            </span>
          </div>
          <p className="text-[10px] font-mono text-slate-400">CesiumJS Spatial Extrusion & Building Intelligence Engine</p>
        </div>
      </div>

      {/* Quick Search */}
      <div className="relative w-64">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search 3D Parcel / Building ID..."
          className="w-full rounded-lg border border-slate-700/80 bg-slate-950/80 pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-teal-500 focus:outline-none font-mono"
        />
      </div>

      {/* Metrics & Actions */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <div className="hidden lg:flex items-center gap-3 border-r border-slate-800 pr-4">
          <div>
            <span className="text-slate-500">Scene: </span>
            <span className="text-slate-200 font-bold">Urban Demo</span>
          </div>
          <div>
            <span className="text-slate-500">Mode: </span>
            <span className="text-teal-300 font-bold">{visualMode}</span>
          </div>
          <div>
            <span className="text-slate-500">Selected: </span>
            <span className="text-amber-300 font-bold">{selectedEntity ? selectedEntity.id : "None"}</span>
          </div>
        </div>

        <button
          onClick={onCaptureScreenshot}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 transition text-xs font-semibold"
        >
          <Camera className="h-3.5 w-3.5 text-teal-400" />
          Screenshot
        </button>

        <button
          onClick={onResetView}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 transition text-xs font-semibold"
        >
          <RefreshCw className="h-3.5 w-3.5 text-teal-400" />
          Reset View
        </button>
      </div>

    </div>
  );
}
