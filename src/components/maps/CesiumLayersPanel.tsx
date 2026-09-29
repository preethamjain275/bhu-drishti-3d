import React, { useState } from "react";
import {
  Layers,
  MapPin,
  Building,
  Home,
  Compass,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Eye,
  Globe,
  Waypoints,
  SlidersHorizontal,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { LayerVisibilityState } from "@/lib/maps/cesium/types";
import { cn } from "@/lib/utils";

interface CesiumLayersPanelProps {
  layers: LayerVisibilityState;
  onToggleLayer: (key: keyof LayerVisibilityState) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetNorth?: () => void;
  is3D?: boolean;
  onToggle3D?: () => void;
}

export function CesiumLayersPanel({
  layers,
  onToggleLayer,
  onZoomIn,
  onZoomOut,
  onResetNorth,
  is3D = true,
  onToggle3D,
}: CesiumLayersPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-teal-500/40 text-teal-300 font-mono text-xs font-bold shadow-2xl backdrop-blur-xl hover:bg-slate-800 transition cursor-pointer"
      >
        <Layers className="h-4 w-4" />
        <span>Layers Panel</span>
      </button>
    );
  }

  return (
    <div className="w-72 bg-slate-950/95 border border-slate-800/90 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl text-slate-100 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto font-sans animate-in fade-in select-none">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 font-display text-sm font-bold text-slate-100">
          <Layers className="h-4 w-4 text-teal-400" />
          <span>Layers</span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white text-xs transition"
          title="Minimize"
        >
          <Minimize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 1. Administrative */}
      <div className="space-y-2">
        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
          ADMINISTRATIVE
        </div>
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:bg-slate-900 transition">
          <div className="flex items-start gap-2.5">
            <span className="h-3 w-3 rounded bg-white/20 border border-white/60 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Ward boundary</div>
              <div className="text-[9px] text-slate-500">Municipal GIS (sample)</div>
            </div>
          </div>
          <Switch
            checked={Boolean(layers.wardBoundary)}
            onCheckedChange={() => onToggleLayer("wardBoundary")}
            className="data-[state=checked]:bg-teal-500"
          />
        </div>
      </div>

      {/* 2. Land */}
      <div className="space-y-2">
        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
          LAND
        </div>
        
        {/* Revenue Parcels */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:bg-slate-900 transition">
          <div className="flex items-start gap-2.5">
            <span className="h-3 w-3 rounded bg-cyan-400 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Revenue parcels</div>
              <div className="text-[9px] text-slate-500">Revenue Department (sample)</div>
            </div>
          </div>
          <Switch
            checked={Boolean(layers.revenueParcels)}
            onCheckedChange={() => onToggleLayer("revenueParcels")}
            className="data-[state=checked]:bg-cyan-500"
          />
        </div>

        {/* Municipal Parcels */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:bg-slate-900 transition">
          <div className="flex items-start gap-2.5">
            <span className="h-3 w-3 rounded bg-emerald-400 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Municipal parcels</div>
              <div className="text-[9px] text-slate-500">Municipal GIS (sample)</div>
            </div>
          </div>
          <Switch
            checked={Boolean(layers.municipalParcels)}
            onCheckedChange={() => onToggleLayer("municipalParcels")}
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>

        {/* Survey / Imagery */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:bg-slate-900 transition">
          <div className="flex items-start gap-2.5">
            <span className="h-3 w-3 rounded bg-purple-400 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Survey / Imagery</div>
              <div className="text-[9px] text-slate-500">Survey Department (sample)</div>
            </div>
          </div>
          <Switch
            checked={Boolean(layers.surveyImagery)}
            onCheckedChange={() => onToggleLayer("surveyImagery")}
            className="data-[state=checked]:bg-purple-500"
          />
        </div>
      </div>

      {/* 3. Buildings */}
      <div className="space-y-2">
        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
          BUILDINGS
        </div>

        {/* 3D Buildings */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:bg-slate-900 transition">
          <div className="flex items-start gap-2.5">
            <Building className="h-3.5 w-3.5 text-cyan-400 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-200">3D Buildings</div>
              <div className="text-[9px] text-slate-500">Building footprints & heights</div>
            </div>
          </div>
          <Switch
            checked={Boolean(layers.buildings3d)}
            onCheckedChange={() => onToggleLayer("buildings3d")}
            className="data-[state=checked]:bg-cyan-500"
          />
        </div>

        {/* Building Interiors */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:bg-slate-900 transition">
          <div className="flex items-start gap-2.5">
            <Home className="h-3.5 w-3.5 text-indigo-400 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Building interiors</div>
              <div className="text-[9px] text-slate-500">Rooms & spaces</div>
            </div>
          </div>
          <Switch
            checked={Boolean(layers.buildingInteriors)}
            onCheckedChange={() => onToggleLayer("buildingInteriors")}
            className="data-[state=checked]:bg-indigo-500"
          />
        </div>

        {/* Road Network */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:bg-slate-900 transition">
          <div className="flex items-start gap-2.5">
            <Waypoints className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Road network</div>
              <div className="text-[9px] text-slate-500">OpenStreetMap (sample)</div>
            </div>
          </div>
          <Switch
            checked={Boolean(layers.roadNetwork)}
            onCheckedChange={() => onToggleLayer("roadNetwork")}
            className="data-[state=checked]:bg-slate-500"
          />
        </div>
      </div>

      {/* 4. Additional */}
      <div className="space-y-2">
        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
          ADDITIONAL
        </div>

        {/* Terrain */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:bg-slate-900 transition">
          <div className="flex items-start gap-2.5">
            <Globe className="h-3.5 w-3.5 text-emerald-400 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Terrain</div>
              <div className="text-[9px] text-slate-500">Cesium Terrain</div>
            </div>
          </div>
          <Switch
            checked={Boolean(layers.terrain)}
            onCheckedChange={() => onToggleLayer("terrain")}
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>

        {/* Satellite Imagery */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:bg-slate-900 transition">
          <div className="flex items-start gap-2.5">
            <Eye className="h-3.5 w-3.5 text-purple-400 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Satellite imagery</div>
              <div className="text-[9px] text-slate-500">Base imagery</div>
            </div>
          </div>
          <Switch
            checked={Boolean(layers.satelliteImagery)}
            onCheckedChange={() => onToggleLayer("satelliteImagery")}
            className="data-[state=checked]:bg-purple-500"
          />
        </div>
      </div>

      {/* Mini-Map Radar Compass Widget */}
      <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
        <div className="relative h-28 w-full rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0ea5e920_0,transparent_70%)]" />
          
          {/* Compass Rose */}
          <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-400 flex items-center gap-1">
            <Compass className="h-3.5 w-3.5 animate-spin-slow" />
            <span>N 12.9716° E 77.5946°</span>
          </div>

          {/* Mini 3D Wireframe Icon */}
          <div className="h-12 w-12 rounded-lg border border-cyan-400/50 bg-cyan-500/10 flex items-center justify-center text-cyan-300 transform rotate-12 shadow-[0_0_15px_#0ea5e950]">
            <Building className="h-6 w-6" />
          </div>

          {/* Controls on Mini Map */}
          <div className="absolute right-2 bottom-2 flex flex-col gap-1">
            <button
              onClick={onZoomIn}
              className="h-6 w-6 rounded bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 text-xs"
            >
              <Plus className="h-3 w-3" />
            </button>
            <button
              onClick={onZoomOut}
              className="h-6 w-6 rounded bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 text-xs"
            >
              <Minus className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Camera: 120 m alt</span>
          <button
            onClick={onToggle3D}
            className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold hover:bg-teal-500/30"
          >
            {is3D ? "3D Active" : "2D"}
          </button>
        </div>
      </div>

    </div>
  );
}
