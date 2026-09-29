import React from "react";
import { BuildingFilterState, LandUseCategory } from "@/lib/maps/cesium/types";
import { Filter, Building2 } from "lucide-react";

interface CesiumBuildingFilterProps {
  filter: BuildingFilterState;
  onChangeFilter: (f: BuildingFilterState) => void;
}

const LAND_USES: LandUseCategory[] = [
  "Residential",
  "Commercial",
  "Mixed Use",
  "Institutional",
  "Vacant",
  "Public",
];

export function CesiumBuildingFilter({ filter, onChangeFilter }: CesiumBuildingFilterProps) {
  const toggleUsage = (use: LandUseCategory) => {
    const nextSet = new Set(filter.selectedUsages);
    if (nextSet.has(use)) {
      nextSet.delete(use);
    } else {
      nextSet.add(use);
    }
    onChangeFilter({ ...filter, selectedUsages: nextSet });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl rounded-xl p-3 shadow-2xl text-slate-200 text-xs w-64 space-y-3">
      <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-teal-400 uppercase border-b border-slate-800 pb-2">
        <Building2 className="h-3.5 w-3.5" />
        3D Building Filter
      </div>

      {/* Height Slider */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>Max Height:</span>
          <span className="font-bold text-slate-200">{filter.maxHeight} m</span>
        </div>
        <input
          type="range"
          min="5"
          max="50"
          value={filter.maxHeight}
          onChange={(e) => onChangeFilter({ ...filter, maxHeight: parseInt(e.target.value) })}
          className="w-full accent-teal-400 cursor-pointer h-1 rounded bg-slate-950"
        />
      </div>

      {/* Floors Slider */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>Max Floors:</span>
          <span className="font-bold text-slate-200">{filter.maxFloors} Floors</span>
        </div>
        <input
          type="range"
          min="1"
          max="20"
          value={filter.maxFloors}
          onChange={(e) => onChangeFilter({ ...filter, maxFloors: parseInt(e.target.value) })}
          className="w-full accent-teal-400 cursor-pointer h-1 rounded bg-slate-950"
        />
      </div>

      {/* Usage Checkboxes */}
      <div className="space-y-1">
        <span className="block text-[10px] font-mono text-slate-400">Usage Categories:</span>
        <div className="grid grid-cols-2 gap-1">
          {LAND_USES.map((u) => {
            const isChecked = filter.selectedUsages.has(u);
            return (
              <label key={u} className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleUsage(u)}
                  className="accent-teal-500 rounded"
                />
                <span>{u}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
