import React from "react";
import { Compass, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CRSProfile, CRSValidationCheck, TransformationPreview } from "@/lib/api/harmonization";

interface CRSHarmonizationPanelProps {
  profiles: CRSProfile[];
  validationChecks: CRSValidationCheck[];
  transformationPreview: TransformationPreview;
}

export const CRSHarmonizationPanel: React.FC<CRSHarmonizationPanelProps> = ({
  profiles,
  validationChecks,
  transformationPreview,
}) => {
  return (
    <div className="panel-surface rounded-xl border border-slate-800 bg-slate-950/70 p-5 space-y-5 shadow-lg backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-cyan-400" />
          <div>
            <h3 className="font-display font-semibold text-slate-100 text-base">SPATIAL CRS HARMONIZATION</h3>
            <p className="text-xs text-slate-400">Validate reference coordinate systems and inspect reprojection pipelines.</p>
          </div>
        </div>
        <Badge variant="outline" className="border-emerald-500/40 bg-emerald-950/40 text-emerald-300 font-mono text-xs">
          TARGET: EPSG:4326 (WGS 84)
        </Badge>
      </div>

      {/* CRS Transformation Diagram */}
      <div className="rounded-xl border border-cyan-500/30 bg-slate-900/60 p-4 space-y-3">
        <h4 className="font-display font-semibold text-xs text-cyan-300 uppercase tracking-wider">
          REPROJECTION PIPELINE STEPS
        </h4>
        <div className="flex items-center justify-between text-xs font-mono overflow-x-auto p-2 rounded bg-slate-950/80 border border-slate-800">
          <div className="text-center p-2 rounded bg-slate-900 border border-slate-700">
            <div className="text-slate-400 text-[10px]">Source CRS</div>
            <div className="font-bold text-cyan-300">EPSG:32643</div>
          </div>
          <ArrowRight className="h-4 w-4 text-cyan-400 shrink-0" />
          <div className="text-center p-2 rounded bg-slate-900 border border-slate-700">
            <div className="text-slate-400 text-[10px]">Datum Projection</div>
            <div className="font-bold text-indigo-300">UTM Zone 43N</div>
          </div>
          <ArrowRight className="h-4 w-4 text-cyan-400 shrink-0" />
          <div className="text-center p-2 rounded bg-slate-900 border border-slate-700">
            <div className="text-slate-400 text-[10px]">Ellipsoid Shift</div>
            <div className="font-bold text-slate-200">WGS 84 Datum</div>
          </div>
          <ArrowRight className="h-4 w-4 text-cyan-400 shrink-0" />
          <div className="text-center p-2 rounded bg-slate-900 border border-emerald-500/40 bg-emerald-950/30">
            <div className="text-emerald-400 text-[10px]">Target CRS</div>
            <div className="font-bold text-emerald-300">EPSG:4326</div>
          </div>
        </div>
      </div>

      {/* Simulated Coordinate Transformation Preview */}
      <div className="rounded-xl border border-purple-500/30 bg-slate-900/60 p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="font-display font-semibold text-xs text-purple-300 uppercase tracking-wider">
            SIMULATED TRANSFORMATION PREVIEW
          </span>
          <Badge variant="outline" className="border-purple-500/40 text-purple-300 text-[10px]">
            Feature: {transformationPreview.sampleFeatureId}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px]">ORIGINAL COORDINATES ({transformationPreview.originalCrs}):</span>
            <div className="font-bold text-slate-200 text-sm">
              Easting: {transformationPreview.originalCoords[0]} m
            </div>
            <div className="font-bold text-slate-200 text-sm">
              Northing: {transformationPreview.originalCoords[1]} m
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/30 space-y-1">
            <span className="text-emerald-400 text-[10px]">TRANSFORMED GEOGRAPHIC ({transformationPreview.transformedCrs}):</span>
            <div className="font-bold text-emerald-300 text-sm">
              Lng: {transformationPreview.transformedCoords[0]}°
            </div>
            <div className="font-bold text-emerald-300 text-sm">
              Lat: {transformationPreview.transformedCoords[1]}°
            </div>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 flex justify-between">
          <span>Method: {transformationPreview.method}</span>
          <span>Estimated Accuracy: ±{transformationPreview.estimatedAccuracyMeters}m</span>
        </div>
      </div>

      {/* CRS Validation Checks */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <h4 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider">
          AUTOMATED CRS VALIDATION DIAGNOSTICS
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          {validationChecks.map((val) => (
            <div key={val.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-200">{val.label}</span>
                <Badge
                  variant="outline"
                  className={
                    val.status === "PASS"
                      ? "border-emerald-500/40 text-emerald-300 text-[10px]"
                      : "border-amber-500/40 text-amber-300 text-[10px]"
                  }
                >
                  {val.status}
                </Badge>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">{val.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
