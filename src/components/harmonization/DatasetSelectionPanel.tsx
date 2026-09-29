import React from "react";
import { Database, CheckSquare, Square, Play, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { HarmonizationDataset } from "@/lib/api/harmonization";

interface DatasetSelectionPanelProps {
  datasets: HarmonizationDataset[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (selected: boolean) => void;
  onStartHarmonization: () => void;
  isProcessing?: boolean;
}

export const DatasetSelectionPanel: React.FC<DatasetSelectionPanelProps> = ({
  datasets,
  onToggleSelect,
  onSelectAll,
  onStartHarmonization,
  isProcessing,
}) => {
  const selectedCount = datasets.filter((d) => d.selected).length;

  return (
    <div className="panel-surface flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4 shadow-lg backdrop-blur">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-cyan-400" />
            <h3 className="font-display font-semibold text-slate-100 text-sm">
              SOURCE DATASETS
            </h3>
          </div>
          <Badge variant="outline" className="border-cyan-500/40 bg-cyan-950/50 text-cyan-300 font-mono text-xs">
            {selectedCount} Selected
          </Badge>
        </div>

        {/* Selection Toolbar */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <button
            onClick={() => onSelectAll(true)}
            className="hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <CheckSquare className="h-3.5 w-3.5 text-cyan-400" /> SELECT ALL
          </button>
          <button
            onClick={() => onSelectAll(false)}
            className="hover:text-slate-200 transition-colors flex items-center gap-1"
          >
            <Square className="h-3.5 w-3.5" /> CLEAR SELECTION
          </button>
        </div>

        {/* Datasets List */}
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {datasets.map((d) => (
            <div
              key={d.id}
              onClick={() => onToggleSelect(d.id)}
              className={cn(
                "cursor-pointer rounded-lg border p-3 text-xs transition-all hover:border-cyan-500/40",
                d.selected
                  ? "border-cyan-500/60 bg-cyan-950/30 shadow-md ring-1 ring-cyan-500/30"
                  : "border-slate-800 bg-slate-900/50 text-slate-400 opacity-70"
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="font-mono text-[10px] text-cyan-400 uppercase">{d.sourceName}</span>
                  <h4 className="font-display font-bold text-slate-100 text-xs leading-snug">{d.assetName}</h4>
                </div>
                <input
                  type="checkbox"
                  checked={d.selected}
                  onChange={() => {}} // handled by parent onClick
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-1 font-mono text-[11px] text-slate-300 pt-1 border-t border-slate-800/60">
                <div>CRS: <span className="text-cyan-300 font-bold">{d.crs}</span></div>
                <div>Format: <span className="text-indigo-300">{d.format}</span></div>
                <div>Features: <span className="text-slate-100 font-bold">{d.featureCount.toLocaleString()}</span></div>
                <div>Quality: <span className="text-emerald-400 font-bold">{d.qualityScore}%</span></div>
              </div>

              <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Geom: {d.geometryType}</span>
                <span>Date: {d.observationDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Action */}
      <div className="pt-4 border-t border-slate-800 mt-4">
        <Button
          disabled={selectedCount === 0 || isProcessing}
          onClick={onStartHarmonization}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md h-10"
        >
          <Play className="mr-2 h-4 w-4 fill-slate-950" />
          START HARMONIZATION ({selectedCount})
        </Button>
      </div>
    </div>
  );
};
