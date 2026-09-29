import React from "react";
import { ThreeDEntity, ThreeDParcel, ThreeDBuilding } from "@/lib/maps/cesium/types";
import { X, Navigation, ExternalLink, ShieldAlert, Building2, MapPin, Database, Focus, Layers, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface CesiumInspectorProps {
  entity: ThreeDEntity | null;
  onClose: () => void;
  onFlyTo: (entity: ThreeDEntity) => void;
  onFocusParentParcel?: (parcelId: string) => void;
  onHighlightRelatedBuildings?: (parcelId: string) => void;
}

export function CesiumInspector({
  entity,
  onClose,
  onFlyTo,
  onFocusParentParcel,
  onHighlightRelatedBuildings,
}: CesiumInspectorProps) {
  if (!entity) return null;

  const isParcel = entity.type === "Parcel";
  const parcel = isParcel ? (entity as ThreeDParcel) : null;
  const building = !isParcel ? (entity as ThreeDBuilding) : null;

  return (
    <div className="w-80 bg-slate-900/95 border border-slate-800 backdrop-blur-xl rounded-2xl p-5 shadow-2xl text-slate-100 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/10 border border-teal-500/30 text-teal-300">
              {entity.type}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                entity.status === "Clear" || entity.status === "Verified"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
              }`}
            >
              {entity.status}
            </span>
          </div>
          <h2 className="text-base font-bold font-display text-white mt-1">{entity.id}</h2>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onFlyTo(entity)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition"
        >
          <Navigation className="h-3.5 w-3.5" />
          Fly To 3D
        </button>
        <Link
          to="/map"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 font-semibold text-xs transition"
        >
          <ExternalLink className="h-3.5 w-3.5 text-teal-400" />
          Open in 2D
        </Link>
      </div>

      {/* Building Specific Relationships Actions */}
      {building && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {onFocusParentParcel && (
            <button
              onClick={() => onFocusParentParcel(building.parcelId)}
              className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-indigo-500/40 bg-indigo-950/60 text-indigo-300 font-mono text-[11px] font-bold hover:bg-indigo-900/60 transition"
            >
              <ArrowLeft className="h-3 w-3" />
              FOCUS PARCEL
            </button>
          )}
          {onHighlightRelatedBuildings && (
            <button
              onClick={() => onHighlightRelatedBuildings(building.parcelId)}
              className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-teal-500/40 bg-teal-950/60 text-teal-300 font-mono text-[11px] font-bold hover:bg-teal-900/60 transition"
            >
              <Layers className="h-3 w-3" />
              SIBLING BUILDINGS
            </button>
          )}
        </div>
      )}

      {/* Deterministic Spatial Metrics Readout */}
      <div className="space-y-2 text-xs">
        <h4 className="font-mono font-bold text-[11px] text-teal-400 uppercase tracking-wider">
          {isParcel ? "PARCEL SPATIAL METRICS" : "BUILDING VOLUMETRIC METRICS"}
        </h4>
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 font-mono">
          {isParcel && parcel ? (
            <>
              <div>
                <div className="text-[10px] text-slate-500">Parcel Area</div>
                <div className="font-bold text-slate-100">{parcel.metrics.area.toLocaleString()} m²</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Perimeter</div>
                <div className="font-bold text-slate-100">{parcel.metrics.perimeter} m</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Buildings Count</div>
                <div className="font-bold text-teal-300">{parcel.metrics.buildingCount}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Coverage Ratio</div>
                <div className="font-bold text-teal-300">{Math.round(parcel.metrics.coverageRatio * 100)}%</div>
              </div>
            </>
          ) : building ? (
            <>
              <div>
                <div className="text-[10px] text-slate-500">Footprint Area</div>
                <div className="font-bold text-slate-100">{building.metrics.footprintArea} m²</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Extruded Height</div>
                <div className="font-bold text-teal-300">{building.metrics.height} m</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Floor Count</div>
                <div className="font-bold text-teal-300">{building.metrics.floorCount} Floors</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Est. Volume</div>
                <div className="font-bold text-slate-100">{building.metrics.estimatedVolume.toLocaleString()} m³</div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Data Intelligence & Provenance */}
      <div className="space-y-2 text-xs">
        <h4 className="font-mono font-bold text-[11px] text-teal-400 uppercase tracking-wider">DATA INTELLIGENCE</h4>
        <div className="space-y-1.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 font-mono text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Primary Source:</span>
            <span className="text-teal-300 font-bold">{entity.sourceName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Confidence:</span>
            <span className="text-teal-300 font-bold">{Math.round(entity.confidence * 100)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Observation Date:</span>
            <span className="text-slate-300">{entity.observationDate}</span>
          </div>
        </div>
      </div>

      {/* Evidence Module Integration */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400">
          <span className="flex items-center gap-1 text-purple-400">
            <Database className="h-3 w-3" />
            EVIDENCE INTELLIGENCE
          </span>
          <span className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px]">
            8 Records
          </span>
        </div>
        <Link
          to="/evidence"
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 text-[11px] font-mono transition"
        >
          <span>Explore Evidence Chain</span>
          <ExternalLink className="h-3 w-3 text-purple-400" />
        </Link>
      </div>

      {/* Sync Status Badge */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
        <span>2D ↔ 3D Synchronized</span>
        <span className="text-teal-400 font-bold">STATE MATCHED</span>
      </div>
    </div>
  );
}
