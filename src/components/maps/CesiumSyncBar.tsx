import React from "react";
import { ActiveViewMode, SplitRatio } from "@/lib/map/mapTypes";
import { Monitor, Columns, Play, Pause, RefreshCw, Sparkles, Layers } from "lucide-react";

interface CesiumSyncBarProps {
  activeView: ActiveViewMode;
  onChangeActiveView: (view: ActiveViewMode) => void;
  splitRatio: SplitRatio;
  onChangeSplitRatio: (ratio: SplitRatio) => void;
  syncEnabled: boolean;
  onToggleSync: () => void;
  onRunDemo: () => void;
  isDemoRunning?: boolean;
}

export function CesiumSyncBar({
  activeView,
  onChangeActiveView,
  splitRatio,
  onChangeSplitRatio,
  syncEnabled,
  onToggleSync,
  onRunDemo,
  isDemoRunning = false,
}: CesiumSyncBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md text-xs font-mono text-slate-200">
      
      {/* View Switcher: 2D | SPLIT | 3D */}
      <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => onChangeActiveView("2D")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
            activeView === "2D"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <Monitor className="h-3.5 w-3.5" />
          2D Map
        </button>

        <button
          onClick={() => onChangeActiveView("SPLIT")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
            activeView === "SPLIT"
              ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <Columns className="h-3.5 w-3.5" />
          SPLIT VIEW
        </button>

        <button
          onClick={() => onChangeActiveView("3D")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
            activeView === "3D"
              ? "bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          3D Scene
        </button>
      </div>

      {/* Split Ratio Selector (Visible only in SPLIT mode) */}
      {activeView === "SPLIT" && (
        <div className="flex items-center gap-1 bg-slate-950/70 px-2 py-1 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider mr-1">Split Ratio:</span>
          {(["50/50", "60/40", "40/60"] as SplitRatio[]).map((ratio) => (
            <button
              key={ratio}
              onClick={() => onChangeSplitRatio(ratio)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                splitRatio === ratio
                  ? "bg-slate-800 text-teal-300 border border-teal-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      )}

      {/* Right Controls: Sync Pause/Resume + Run 2D<->3D Demo */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSync}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition ${
            syncEnabled
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20"
              : "bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${syncEnabled ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
          {syncEnabled ? "SYNC ACTIVE" : "SYNC PAUSED"}
          {syncEnabled ? <Pause className="h-3 w-3 ml-1" /> : <Play className="h-3 w-3 ml-1" />}
        </button>

        <button
          onClick={onRunDemo}
          disabled={isDemoRunning}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition ${
            isDemoRunning
              ? "bg-purple-600/50 text-purple-200 cursor-not-allowed"
              : "bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 hover:from-teal-400 hover:to-cyan-400 shadow-md shadow-cyan-500/20"
          }`}
        >
          {isDemoRunning ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {isDemoRunning ? "RUNNING DEMO..." : "RUN 2D ↔ 3D DEMO"}
        </button>
      </div>

    </div>
  );
}
