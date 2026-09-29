import React, { useState } from "react";
import { TableProperties, CheckCircle2, AlertTriangle, RefreshCw, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MetadataComparisonItem } from "@/lib/api/harmonization";

interface MetadataHarmonizationPanelProps {
  comparison: MetadataComparisonItem[];
  onNormalizeMetadata: () => void;
}

export const MetadataHarmonizationPanel: React.FC<MetadataHarmonizationPanelProps> = ({
  comparison,
  onNormalizeMetadata,
}) => {
  const [normalized, setNormalized] = useState(false);

  const handleNormalize = () => {
    setNormalized(true);
    onNormalizeMetadata();
  };

  const getStatusBadge = (status: MetadataComparisonItem["status"]) => {
    switch (status) {
      case "MATCH":
        return <Badge variant="outline" className="border-emerald-500/40 bg-emerald-950/30 text-emerald-300 font-mono text-[10px]">MATCH</Badge>;
      case "DIFFERENT":
        return <Badge variant="outline" className="border-amber-500/40 bg-amber-950/30 text-amber-300 font-mono text-[10px]">DIFFERENT</Badge>;
      case "MISSING":
        return <Badge variant="outline" className="border-rose-500/40 bg-rose-950/30 text-rose-300 font-mono text-[10px]">MISSING</Badge>;
      default:
        return <Badge variant="outline" className="border-purple-500/40 bg-purple-950/30 text-purple-300 font-mono text-[10px]">NEEDS REVIEW</Badge>;
    }
  };

  return (
    <div className="panel-surface rounded-xl border border-slate-800 bg-slate-950/70 p-5 space-y-5 shadow-lg backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-display font-semibold text-slate-100 text-base">METADATA HARMONIZATION & COMPARISON</h3>
          <p className="text-xs text-slate-400">Inspect and standardize spatial reference, observation dates, and schema versions.</p>
        </div>

        <Button
          size="sm"
          onClick={handleNormalize}
          className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md"
        >
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          NORMALIZE METADATA
        </Button>
      </div>

      {normalized && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-center justify-between font-mono">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            SIMULATED METADATA NORMALIZATION PREVIEW ACTIVE
          </span>
          <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-[10px]">
            Target Schema v1.0
          </Badge>
        </div>
      )}

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono uppercase">
              <th className="p-3">Attribute</th>
              <th className="p-3">Municipal GIS</th>
              <th className="p-3">Property Registry</th>
              <th className="p-3">Survey Dataset</th>
              <th className="p-3">Planning Dataset</th>
              <th className="p-3">Status</th>
              <th className="p-3">Normalized Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            {comparison.map((item) => (
              <tr key={item.attribute} className="hover:bg-slate-900/60">
                <td className="p-3 font-bold text-slate-100">{item.attribute}</td>
                <td className="p-3 text-cyan-300">{item.municipalValue}</td>
                <td className="p-3 text-cyan-300">{item.registryValue}</td>
                <td className="p-3 text-cyan-300">{item.surveyValue}</td>
                <td className="p-3 text-cyan-300">{item.planningValue}</td>
                <td className="p-3">{getStatusBadge(item.status)}</td>
                <td className="p-3 font-bold text-emerald-400">{item.normalizedTarget}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
