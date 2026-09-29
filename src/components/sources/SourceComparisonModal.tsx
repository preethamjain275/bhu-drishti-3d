import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, ArrowRight, Check, AlertTriangle, Layers, ShieldCheck } from "lucide-react";
import type { DataSource } from "@/lib/api/sources";

interface SourceComparisonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sources: DataSource[];
  onPrepareHarmonization: () => void;
}

export const SourceComparisonModal: React.FC<SourceComparisonModalProps> = ({
  open,
  onOpenChange,
  sources,
  onPrepareHarmonization,
}) => {
  if (sources.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-cyan-500/30 bg-slate-950 text-slate-100 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="font-display text-lg text-slate-100">
                  SOURCE COMPARISON MATRIX
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400">
                  Compare heterogeneous geospatial data sources across spatial CRS, coverage, schema, and quality signals.
                </DialogDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-cyan-500/40 bg-cyan-950/50 text-cyan-300 font-mono">
              {sources.length} Sources Selected
            </Badge>
          </div>
        </DialogHeader>

        <div className="overflow-x-auto my-2 rounded-lg border border-slate-800 bg-slate-900/50">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono uppercase tracking-wider">
                <th className="p-3 w-40">Attribute / Signal</th>
                {sources.map((src) => (
                  <th key={src.id} className="p-3 min-w-[200px] border-l border-slate-800">
                    <div className="font-bold text-slate-100 font-display text-sm">{src.name}</div>
                    <div className="text-[10px] text-cyan-400 font-mono">{src.type}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr>
                <td className="p-3 font-semibold text-slate-400">CRS / Reference</td>
                {sources.map((src) => (
                  <td key={src.id} className="p-3 border-l border-slate-800 font-mono text-cyan-300 font-bold">
                    {src.spatial.crs}
                    <div className="text-[10px] text-slate-500 font-normal">{src.spatial.crsName}</div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400">Format & Assets</td>
                {sources.map((src) => (
                  <td key={src.id} className="p-3 border-l border-slate-800">
                    <span className="text-slate-200">{src.format}</span>
                    <div className="text-[10px] text-slate-400">{src.assetCount} registered assets</div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400">Entity & Feature Count</td>
                {sources.map((src) => (
                  <td key={src.id} className="p-3 border-l border-slate-800 font-bold text-slate-100">
                    {src.entityCount.toLocaleString()}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400">Geometry Type</td>
                {sources.map((src) => (
                  <td key={src.id} className="p-3 border-l border-slate-800 text-indigo-300">
                    {src.spatial.geometryType}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400">Spatial Extent Coverage</td>
                {sources.map((src) => (
                  <td key={src.id} className="p-3 border-l border-slate-800">
                    <span className="font-bold text-emerald-400">{src.spatial.coveragePercentage}%</span>
                    <div className="text-[10px] text-slate-500">{src.spatial.spatialExtentDescription}</div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400">Attribute Schema Fields</td>
                {sources.map((src) => (
                  <td key={src.id} className="p-3 border-l border-slate-800">
                    <div className="flex flex-wrap gap-1">
                      {src.schema.slice(0, 4).map((f) => (
                        <span key={f.name} className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
                          {f.name}
                        </span>
                      ))}
                      {src.schema.length > 4 && (
                        <span className="text-[10px] text-slate-500">+{src.schema.length - 4} more</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400">Observation Date</td>
                {sources.map((src) => (
                  <td key={src.id} className="p-3 border-l border-slate-800 text-slate-300">
                    {src.temporal.observationDate}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400">Data Quality Score</td>
                {sources.map((src) => (
                  <td key={src.id} className="p-3 border-l border-slate-800">
                    <span className="font-bold text-cyan-400 text-sm">{src.quality.overallQualityScore}%</span>
                    <div className="text-[10px] text-slate-500">
                      Geom: {src.quality.geometryValidity}% · Attr: {src.quality.attributeCompleteness}%
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400">Reliability Signal</td>
                {sources.map((src) => (
                  <td key={src.id} className="p-3 border-l border-slate-800">
                    <Badge
                      variant="outline"
                      className="border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-[10px]"
                    >
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      {src.reliability.score}% ({src.reliability.level})
                    </Badge>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <DialogFooter className="border-t border-slate-800 pt-3 flex items-center justify-between sm:justify-between">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="border-slate-800 text-slate-400">
            Close Comparison
          </Button>

          <Button
            size="sm"
            onClick={onPrepareHarmonization}
            className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs shadow-md"
          >
            PREPARE FOR HARMONIZATION
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
