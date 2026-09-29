import React from "react";
import { Sliders, Box } from "lucide-react";

interface CesiumHeightScaleControlProps {
  heightScale: number;
  onChangeHeightScale: (scale: number) => void;
}

export function CesiumHeightScaleControl({ heightScale, onChangeHeightScale }: CesiumHeightScaleControlProps) {
  return (
    <div className="bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl rounded-xl p-3 shadow-2xl text-slate-200 text-xs w-56 space-y-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-teal-400 uppercase">
          <Box className="h-3.5 w-3.5" />
          Building Height Scale
        </span>
        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
          VISUAL SCALE: {heightScale}×
        </span>
      </div>

      <input
        type="range"
        min="0.5"
        max="3.0"
        step="0.1"
        value={heightScale}
        onChange={(e) => onChangeHeightScale(parseFloat(e.target.value))}
        className="w-full accent-teal-400 cursor-pointer h-1.5 rounded bg-slate-950"
      />

      <div className="flex justify-between text-[9px] font-mono text-slate-500">
        <span>0.5×</span>
        <span>1.0× (Real)</span>
        <span>2.0×</span>
        <span>3.0×</span>
      </div>
    </div>
  );
}
