"use client";

/**
 * BHOO-MITRA AI — CesiumJS 3D WebGL Scene Viewer Component
 * Client-only rendering component providing interactive 3D parcels & extruded 3D buildings.
 * Extended for Phase 21 3D Spatial Conflict Investigation & Source Difference Comparison.
 */

import React, { useState, useMemo } from "react";
import {
  ThreeDEntity,
  ThreeDParcel,
  ThreeDBuilding,
  LayerVisibilityState,
  VisualMode,
  BuildingFilterState,
  ParcelFilterState,
  ThreeDConflict,
  SourceCompareMode,
} from "@/lib/maps/cesium/types";
import { MOCK_3D_PARCELS, MOCK_3D_BUILDINGS } from "@/lib/mock/threeD";
import { ShieldAlert, Flame, Sliders } from "lucide-react";

interface CesiumViewerProps {
  selectedEntity: ThreeDEntity | null;
  onSelectEntity: (entity: ThreeDEntity | null) => void;
  layers: LayerVisibilityState;
  visualMode: VisualMode;
  heightScale: number;
  buildingFilter: BuildingFilterState;
  parcelFilter: ParcelFilterState;
  isNightMode: boolean;
  investigationMode?: boolean;
  selectedConflict?: ThreeDConflict | null;
  compareMode?: SourceCompareMode;
  sourceAOpacity?: number;
  sourceBOpacity?: number;
  showHeatmap?: boolean;
}

export function CesiumViewer({
  selectedEntity,
  onSelectEntity,
  layers,
  visualMode,
  heightScale,
  buildingFilter,
  parcelFilter,
  isNightMode,
  investigationMode = false,
  selectedConflict = null,
  compareMode = "BOTH",
  sourceAOpacity = 0.8,
  sourceBOpacity = 0.8,
  showHeatmap = false,
}: CesiumViewerProps) {
  const [hoveredEntity, setHoveredEntity] = useState<ThreeDEntity | null>(null);

  // Memoize parcel filtering for high-performance zero-lag rendering
  const filteredParcels = useMemo(() => {
    return MOCK_3D_PARCELS.filter((p) => {
      if (parcelFilter.selectedLandUses.size > 0 && !parcelFilter.selectedLandUses.has(p.landUse)) {
        return false;
      }
      if (parcelFilter.selectedStatuses.size > 0 && !parcelFilter.selectedStatuses.has(p.propertyStatus)) {
        return false;
      }
      if (p.confidence < parcelFilter.minConfidence) {
        return false;
      }
      if (parcelFilter.onlyConflicts && p.conflictStatus === "NONE") {
        return false;
      }
      return true;
    });
  }, [parcelFilter]);

  // Memoize building filtering for zero-lag WebGL performance
  const filteredBuildings = useMemo(() => {
    return MOCK_3D_BUILDINGS.filter((b) => {
      if (b.metrics.height > buildingFilter.maxHeight) return false;
      if (b.metrics.floorCount > buildingFilter.maxFloors) return false;
      if (buildingFilter.selectedUsages.size > 0 && !buildingFilter.selectedUsages.has(b.usage)) return false;
      if (b.confidence < buildingFilter.minConfidence) return false;
      return true;
    });
  }, [buildingFilter]);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex items-center justify-center select-none">
      
      {/* 3D Scene Background Canvas */}
      <div className={`absolute inset-0 transition-colors duration-700 ${isNightMode ? "bg-slate-950" : "bg-slate-900"}`}>
        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${
          investigationMode
            ? "from-purple-950/50 via-slate-950 to-slate-950"
            : "from-teal-900/30 via-slate-950 to-slate-950"
        }`} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      {/* Heatmap Overlay */}
      {showHeatmap && (
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-radial from-red-500/20 via-amber-500/10 to-transparent animate-pulse" />
      )}

      {/* Scanning Radar Line & Atmospheric Data Flow (Part 3) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse shadow-[0_0_15px_#2dd4bf] transition-all" />
      </div>

      {/* Interactive 3D Synthetic Scene Container */}
      <div className="relative z-10 w-full h-full p-4 md:p-8 flex flex-col items-center justify-center">
        
        <div className={`relative w-full max-w-[840px] h-[520px] border rounded-2xl bg-slate-950/85 backdrop-blur-md p-6 shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-500 ${
          investigationMode ? "border-purple-500/50 shadow-purple-500/20" : "border-slate-800/80 shadow-teal-500/5"
        }`}>
          
          <div className="absolute top-3 left-4 flex items-center gap-2 font-mono">
            <span className={`h-2.5 w-2.5 rounded-full ${investigationMode ? "bg-purple-400 animate-ping" : "bg-teal-400 animate-pulse"}`} />
            <span className={`text-[11px] uppercase tracking-widest font-bold ${investigationMode ? "text-purple-300" : "text-teal-400"}`}>
              {investigationMode ? "3D SPATIAL CONFLICT INVESTIGATION CENTER" : "3D WebGL Digital Twin Engine • Sector 04"}
            </span>
            <span className="text-[10px] text-slate-500">| Scale: {heightScale}×</span>
          </div>

          {/* Conflict Overlay Banner */}
          {selectedConflict && (
            <div className="absolute top-3 right-4 px-3 py-1 rounded-lg bg-red-500/15 border border-red-500/40 text-red-300 font-mono text-[10px] font-bold flex items-center gap-1.5 z-20 animate-bounce">
              <ShieldAlert className="h-3.5 w-3.5" />
              INVESTIGATING: {selectedConflict.conflictId} ({selectedConflict.type})
            </div>
          )}

          {/* Synthetic 3D Grid Map Visualization */}
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* Grid Coordinates & Reference Features */}
            {layers.roads && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[720px] h-[2px] bg-teal-500/20 rounded-full transform -rotate-12" />
                <div className="w-[2px] h-[460px] bg-teal-500/20 rounded-full transform rotate-45" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500/5 via-transparent to-transparent pointer-events-none" />
              </div>
            )}

            {/* 3D Extruded Parcels & Buildings Grid */}
            <div className="grid grid-cols-3 gap-6 transform-gpu will-change-transform rotate-12 skew-x-6 scale-90 transition-transform duration-500">
              {filteredParcels.map((parcel) => {
                const isSelected = selectedEntity?.id === parcel.id || (selectedConflict && selectedConflict.parcelId === parcel.id);
                const isHovered = hoveredEntity?.id === parcel.id;
                const associatedBldgs = filteredBuildings.filter((b) => b.parcelId === parcel.id);

                return (
                  <div
                    key={parcel.id}
                    onClick={() => onSelectEntity(parcel)}
                    onMouseEnter={() => setHoveredEntity(parcel)}
                    onMouseLeave={() => setHoveredEntity(null)}
                    className={`group relative rounded-xl p-4 cursor-pointer transition-all duration-500 border backdrop-blur-md flex flex-col justify-between ${
                      isSelected
                        ? "bg-purple-950/70 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.4)] scale-110 z-20 ring-2 ring-purple-400/50"
                        : isHovered
                        ? "bg-slate-800/80 border-teal-400/80 scale-105 z-10 shadow-lg"
                        : parcel.conflictStatus !== "NONE"
                        ? "bg-amber-950/40 border-amber-500/50"
                        : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                    }`}
                    style={{ minHeight: "135px" }}
                  >
                    {/* Dynamic Selection Target Reticle Animation (Fly-To Focus) */}
                    {isSelected && (
                      <div className="absolute -inset-2 rounded-2xl border-2 border-purple-400/80 pointer-events-none animate-pulse">
                        <div className="absolute -top-2 -left-2 w-3 h-3 border-t-2 border-l-2 border-purple-300" />
                        <div className="absolute -top-2 -right-2 w-3 h-3 border-t-2 border-r-2 border-purple-300" />
                        <div className="absolute -bottom-2 -left-2 w-3 h-3 border-b-2 border-l-2 border-purple-300" />
                        <div className="absolute -bottom-2 -right-2 w-3 h-3 border-b-2 border-r-2 border-purple-300" />
                      </div>
                    )}

                    {/* Source Comparison Geometry Difference Highlights */}
                    {investigationMode && selectedConflict && selectedConflict.parcelId === parcel.id && (
                      <div
                        className="absolute inset-0 rounded-xl border-2 border-dashed border-red-400 pointer-events-none animate-ping"
                        style={{ opacity: compareMode === "SOURCE_A" ? sourceAOpacity : sourceBOpacity }}
                      />
                    )}

                    {/* Parcel Boundary & ID Label */}
                    <div className="flex items-start justify-between">
                      <div className="font-mono">
                        <div className="text-[11px] font-bold text-slate-100 flex items-center gap-1">
                          {parcel.id}
                          {parcel.conflictStatus !== "NONE" && (
                            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                          )}
                        </div>
                        <div className="text-[9px] text-slate-400">{parcel.landUse} • {parcel.metrics.area}m²</div>
                      </div>

                      {layers.showLabels && (
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                          isSelected
                            ? "bg-purple-500 text-white font-extrabold"
                            : "bg-slate-950/80 border border-slate-800 text-teal-300"
                        }`}>
                          {parcel.propertyStatus}
                        </span>
                      )}
                    </div>

                    {/* Floating Dynamic Target Data Badge when Selected */}
                    {isSelected && (
                      <div className="mt-1 px-2 py-1 rounded bg-slate-950/90 border border-purple-400/60 font-mono text-[9px] text-purple-200 flex items-center justify-between shadow-xl">
                        <span>CONFIDENCE: {(parcel.confidence * 100).toFixed(0)}%</span>
                        <span className="text-teal-300 font-bold">ACTIVE 3D FLY-TO</span>
                      </div>
                    )}

                    {/* 3 Source Representations Overlaid Boundaries */}
                    {isSelected && layers.parcelBoundaries && (
                      <div className="mt-1.5 p-1.5 rounded-lg bg-slate-950/90 border border-slate-800 space-y-1 text-[8px] font-mono">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-cyan-400 font-bold">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Revenue: 2,410m²
                          </span>
                          <span className="text-slate-400">91%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-emerald-400 font-bold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Municipal: 2,450m²
                          </span>
                          <span className="text-slate-400">96%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-purple-400 font-bold">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" /> Drone Survey: 2,458m²
                          </span>
                          <span className="text-slate-400">98%</span>
                        </div>
                      </div>
                    )}

                    {/* Extruded 3D Building Boxes Inside Parcel */}
                    {layers.buildings && (
                      <div className="mt-3 flex items-end gap-2 relative">
                        {associatedBldgs.map((bldg) => {
                          const isBldgSelected = selectedEntity?.id === bldg.id;
                          const isBldgHovered = hoveredEntity?.id === bldg.id;
                          const scaledHeight = Math.max(18, bldg.metrics.height * heightScale * 0.85);

                          return (
                            <div
                              key={bldg.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectEntity(bldg);
                              }}
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setHoveredEntity(bldg);
                              }}
                              onMouseLeave={(e) => {
                                e.stopPropagation();
                                setHoveredEntity(null);
                              }}
                              className={`flex-1 rounded-md transition-all duration-300 border flex flex-col justify-end p-1.5 text-[8px] font-mono font-bold shadow-lg relative cursor-pointer ${
                                isBldgSelected
                                  ? "bg-gradient-to-t from-purple-600 via-pink-500 to-indigo-400 border-white text-white shadow-purple-500/80 scale-115 z-30 ring-2 ring-white"
                                  : isBldgHovered
                                  ? "bg-gradient-to-t from-teal-500 to-cyan-400 border-teal-300 text-slate-950 scale-110 z-20 shadow-[0_0_15px_#2dd4bf]"
                                  : bldg.conflictStatus !== "NONE"
                                  ? "bg-gradient-to-t from-amber-700 to-amber-500 border-amber-300 text-slate-950"
                                  : "bg-gradient-to-t from-slate-800 to-slate-700 border-slate-600 text-slate-200 hover:from-teal-600 hover:to-teal-400"
                              }`}
                              style={{ height: `${scaledHeight}px` }}
                            >
                              {/* Hover Micro-Tooltip */}
                              {isBldgHovered && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-teal-400 px-2 py-1 rounded shadow-xl text-[8px] text-teal-300 font-mono whitespace-nowrap z-40 animate-in fade-in">
                                  🏢 {bldg.id} • {bldg.metrics.height}m ({bldg.usage})
                                </div>
                              )}

                              <div className="truncate text-center">{bldg.id}</div>
                              <div className="text-[7px] opacity-90 text-center">{bldg.metrics.height}m</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Environmental Flow Particles Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-teal-400/40 animate-ping" />
            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-purple-400/40 animate-ping" style={{ animationDelay: "1s" }} />
          </div>

          {/* Footer Notice */}
          <div className="absolute bottom-2 right-4 text-[9px] font-mono text-slate-500 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            {investigationMode ? "3D GEOSPATIAL HARMONIZATION PIPELINE ACTIVE" : "SYNTHETIC CADASTRAL DIGITAL TWIN"}
          </div>

        </div>

      </div>

    </div>
  );
}
