import React from "react";
import { Plus, Minus, Home, Compass, Eye, Sun, Moon, Layers, Box } from "lucide-react";

interface CesiumControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onTopView: () => void;
  onPerspectiveView: () => void;
  onToggleLighting: () => void;
  isNightMode: boolean;
  activeMode: string;
  onChangeMode: (mode: any) => void;
}

export function CesiumControls({
  onZoomIn,
  onZoomOut,
  onResetView,
  onTopView,
  onPerspectiveView,
  onToggleLighting,
  isNightMode,
  activeMode,
  onChangeMode,
}: CesiumControlsProps) {
  return (
    <div className="flex flex-col gap-2 bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl p-1.5 rounded-xl shadow-2xl text-slate-200">
      <button
        onClick={onZoomIn}
        title="Zoom In (+)"
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-teal-300 transition"
      >
        <Plus className="h-4 w-4" />
      </button>

      <button
        onClick={onZoomOut}
        title="Zoom Out (-)"
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-teal-300 transition"
      >
        <Minus className="h-4 w-4" />
      </button>

      <div className="h-px bg-slate-800 my-0.5" />

      <button
        onClick={onResetView}
        title="Reset Camera (Home)"
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-teal-300 transition"
      >
        <Home className="h-4 w-4" />
      </button>

      <button
        onClick={onTopView}
        title="Top View (2.5D Ortho)"
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-teal-300 transition"
      >
        <Eye className="h-4 w-4" />
      </button>

      <button
        onClick={onPerspectiveView}
        title="Perspective 3D Orbit View"
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-teal-300 transition"
      >
        <Compass className="h-4 w-4" />
      </button>

      <div className="h-px bg-slate-800 my-0.5" />

      <button
        onClick={onToggleLighting}
        title={isNightMode ? "Switch to Day Lighting" : "Switch to Night Lighting"}
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition"
      >
        {isNightMode ? <Moon className="h-4 w-4 text-indigo-400" /> : <Sun className="h-4 w-4 text-amber-400" />}
      </button>
    </div>
  );
}
