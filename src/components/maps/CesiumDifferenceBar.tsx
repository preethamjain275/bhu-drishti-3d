import React from "react";
import { SourceCompareMode } from "@/lib/maps/cesium/types";
import { Eye, Layers, Compass, Sliders, RotateCcw } from "lucide-react";

interface CesiumDifferenceBarProps {
  compareMode: SourceCompareMode;
  onChangeCompareMode: (mode: SourceCompareMode) => void;
  sourceAOpacity: number;
  sourceBOpacity: number;
  onChangeSourceAOpacity: (val: number) => void;
  onChangeSourceBOpacity: (val: number) => void;
  onCameraPreset: (preset: "focus" | "top" | "oblique" | "compare") => void;
  onReset: () => void;
}

export function CesiumDifferenceBar({
  compareMode,
  onChangeCompareMode,
  sourceAOpacity,
  sourceBOpacity,
  onChangeSourceAOpacity,
  onChangeSourceBOpacity,
  onCameraPreset,
  onReset,
}: CesiumDifferenceBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-slate-900/95 border-b border-purple-500/30 backdrop-blur-md text-xs font-mono text-slate-100 shadow-xl">
      
      {/* 1. Source Comparison Mode Selectors */}
      <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
        <span className="text-[10px] text-purple-400 font-bold px-2 uppercase tracking-wider">Compare Mode:</span>
        
        {(["SOURCE_A", "SOURCE_B", "BOTH", "DIFFERENCE", "EVIDENCE"] as SourceCompareMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onChangeCompareMode(mode)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
              compareMode === mode
                ? "bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            {mode.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* 2. Source Representation Opacity Controls */}
      <div className="flex items-center gap-4 bg-slate-950/70 px-3 py-1 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="h-3.5 w-3.5 text-teal-400" />
          <span className="text-[10px] text-teal-300">Src A Opacity:</span>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={sourceAOpacity}
            onChange={(e) => onChangeSourceAOpacity(parseFloat(e.target.value))}
            className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
          <span className="text-[10px] text-slate-400 w-7">{Math.round(sourceAOpacity * 100)}%</span>
        </div>

        <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
          <span className="text-[10px] text-purple-300">Src B Opacity:</span>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={sourceBOpacity}
            onChange={(e) => onChangeSourceBOpacity(parseFloat(e.target.value))}
            className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
          <span className="text-[10px] text-slate-400 w-7">{Math.round(sourceBOpacity * 100)}%</span>
        </div>
      </div>

      {/* 3. Camera Angle & Reset Presets */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onCameraPreset("compare")}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-teal-300 hover:bg-slate-700 text-[11px] transition"
        >
          <Compass className="h-3.5 w-3.5 text-teal-400" />
          Compare Angle
        </button>

        <button
          onClick={() => onCameraPreset("top")}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-[11px] transition"
        >
          <Layers className="h-3.5 w-3.5 text-purple-400" />
          Top View
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white text-[11px] transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

    </div>
  );
}
