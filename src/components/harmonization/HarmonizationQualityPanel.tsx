import React, { useState } from "react";
import { CheckCircle2, Sliders, ShieldCheck, MapPin, Layers, RefreshCw, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { HarmonizationReadiness } from "@/lib/api/harmonization";
import { SourceCoverageMap } from "@/components/maps/SourceCoverageMap";

interface HarmonizationQualityPanelProps {
  readiness: HarmonizationReadiness;
}

export const HarmonizationQualityPanel: React.FC<HarmonizationQualityPanelProps> = ({ readiness }) => {
  const [mapMode, setMapMode] = useState<"BEFORE" | "HARMONIZED">("HARMONIZED");
  const [areaUnit, setAreaUnit] = useState("Square meters (m²)");
  const [distanceUnit, setDistanceUnit] = useState("Meters (m)");
  const [coordPrecision, setCoordPrecision] = useState("6 Decimal Places");
  const [dateFormat, setDateFormat] = useState("ISO 8601 (YYYY-MM-DD)");

  // Synthetic demo source object for MapLibre map preview
  const demoSource = {
    id: "HARMONIZED-COMPOSITE-PREVIEW",
    name: "Harmonized Composite Cadastral Layer",
    type: "Government GIS" as const,
    format: "GeoJSON" as const,
    status: "CONNECTED" as const,
    organization: "BhuSetu Spatial Harmonization Engine",
    contactEmail: "spatial-engine@bhusetu.gov.in",
    description: "Standardized composite cadastral parcel vector aligned to EPSG:4326.",
    entityCount: 18240,
    assetCount: 3,
    lastUpdated: "2026-09-25",
    spatial: {
      crs: mapMode === "BEFORE" ? "EPSG:32643 (UTM 43N)" : "EPSG:4326 (WGS 84 Harmonized)",
      crsName: "Standard Geographic Reference",
      targetCrs: "EPSG:4326",
      transformationName: "PROJ Datum Shift Direct Mapping",
      geometryType: "Polygon" as const,
      bbox: [77.201, 28.599, 77.205, 28.604] as [number, number, number, number],
      coveragePercentage: 99.2,
      spatialExtentDescription: "Harmonized Urban Parcel Envelope",
      accuracyMeters: 0.05,
    },
    temporal: { observationDate: "2025-11-12", lastUpdated: "2026-09-25", dataVintage: "FY 2026", updateFrequency: "Real-time" },
    quality: { completeness: 98, geometryValidity: 99, attributeCompleteness: 95, crsValidity: 100, duplicateRate: 0, overallQualityScore: 98, weights: { geometry: 0.3, attributes: 0.25, completeness: 0.2, crs: 0.15, duplicates: 0.1 } },
    reliability: { score: 98, level: "Very High" as const, historicalConsistency: 99, geometryQuality: 99, attributeQuality: 95, temporalFreshness: 98, verificationHistoryCount: 420 },
    schema: [],
    assets: [],
    validation: { passed: true, summary: { geometry: "PASS" as const, crs: "PASS" as const, schema: "PASS" as const, duplicates: "PASS" as const, requiredFields: "PASS" as const, missingAttributes: "PASS" as const }, warnings: [], errors: [] },
    observedEntityIds: ["PARCEL-DEMO-014"],
  };

  return (
    <div className="panel-surface rounded-xl border border-slate-800 bg-slate-950/70 p-5 space-y-6 shadow-lg backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <div>
            <h3 className="font-display font-semibold text-slate-100 text-base">HARMONIZATION QUALITY & READINESS</h3>
            <p className="text-xs text-slate-400">Automated readiness evaluation and simulated spatial map comparison.</p>
          </div>
        </div>
        <Badge variant="outline" className="border-emerald-500/40 bg-emerald-950/40 text-emerald-300 font-mono text-xs">
          {readiness.status}
        </Badge>
      </div>

      {/* Quality Readiness Dashboard */}
      <div className="rounded-xl border border-emerald-500/30 bg-slate-900/60 p-5 space-y-4 font-mono text-xs">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <div className="font-display font-semibold text-slate-100 text-sm">HARMONIZATION READINESS SCORE</div>
            <div className="text-[11px] text-slate-400">SYSTEM DEMO READINESS SIGNAL</div>
          </div>
          <div className="text-right">
            <span className="font-bold text-2xl text-emerald-400">{readiness.overallScore}%</span>
            <div className="text-[10px] text-slate-500">Overall Readiness Index</div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span>CRS Compatibility</span>
              <span className="font-bold text-cyan-300">{readiness.crsCompatibility}%</span>
            </div>
            <Progress value={readiness.crsCompatibility} className="h-2 bg-slate-800" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Schema Compatibility</span>
              <span className="font-bold text-cyan-300">{readiness.schemaCompatibility}%</span>
            </div>
            <Progress value={readiness.schemaCompatibility} className="h-2 bg-slate-800" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Metadata Completeness</span>
              <span className="font-bold text-cyan-300">{readiness.metadataCompleteness}%</span>
            </div>
            <Progress value={readiness.metadataCompleteness} className="h-2 bg-slate-800" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Geometry Validity</span>
              <span className="font-bold text-emerald-400">{readiness.geometryValidity}%</span>
            </div>
            <Progress value={readiness.geometryValidity} className="h-2 bg-slate-800" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Attribute Compatibility</span>
              <span className="font-bold text-cyan-300">{readiness.attributeCompatibility}%</span>
            </div>
            <Progress value={readiness.attributeCompatibility} className="h-2 bg-slate-800" />
          </div>
        </div>
      </div>

      {/* Map Preview with BEFORE vs HARMONIZED toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-cyan-400" />
            <span className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider">
              SPATIAL MAP PREVIEW
            </span>
          </div>

          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900 p-0.5 text-xs font-mono">
            <button
              onClick={() => setMapMode("BEFORE")}
              className={`px-3 py-1 rounded font-bold transition-all ${
                mapMode === "BEFORE" ? "bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              BEFORE HARMONIZATION
            </button>
            <button
              onClick={() => setMapMode("HARMONIZED")}
              className={`px-3 py-1 rounded font-bold transition-all ${
                mapMode === "HARMONIZED" ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              HARMONIZED PREVIEW
            </button>
          </div>
        </div>

        <SourceCoverageMap source={demoSource} heightClass="h-72" />
      </div>

      {/* Geometry Standardization & Units Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <h4 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider">
            GEOMETRY STANDARDIZATION SPECIFICATION
          </h4>
          <div className="space-y-1 text-slate-300 divide-y divide-slate-800">
            <div className="flex justify-between pt-1"><span>Target Geometry:</span><span className="font-bold text-slate-100">Polygon / MultiPolygon</span></div>
            <div className="flex justify-between pt-1"><span>Coordinate Dimension:</span><span className="font-bold text-cyan-300">2D (X, Y)</span></div>
            <div className="flex justify-between pt-1"><span>Winding Order:</span><span className="font-bold text-slate-200">Counter-Clockwise (Exterior)</span></div>
            <div className="flex justify-between pt-1"><span>Vertex Precision:</span><span className="font-bold text-emerald-400">Sub-meter 0.05m</span></div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <h4 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider">
            UNITS & PRECISION CONFIGURATION
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-500">Area Unit</label>
              <select value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)} className="w-full rounded border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-200">
                <option value="Square meters (m²)">Square meters (m²)</option>
                <option value="Hectares (ha)">Hectares (ha)</option>
                <option value="Acres">Acres</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500">Distance Unit</label>
              <select value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value)} className="w-full rounded border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-200">
                <option value="Meters (m)">Meters (m)</option>
                <option value="Kilometers (km)">Kilometers (km)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
