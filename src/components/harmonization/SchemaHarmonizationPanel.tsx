import React, { useState } from "react";
import {
  TableProperties,
  Sparkles,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Sliders,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CANONICAL_URBAN_SCHEMA,
  type SchemaMapping,
  type AttributeMappingRule,
} from "@/lib/api/harmonization";

interface SchemaHarmonizationPanelProps {
  mappings: SchemaMapping[];
  attributeRules: AttributeMappingRule[];
  onSuggestMappings: () => void;
  onUpdateMapping: (id: string, canonicalField: string) => void;
}

export const SchemaHarmonizationPanel: React.FC<SchemaHarmonizationPanelProps> = ({
  mappings,
  attributeRules,
  onSuggestMappings,
  onUpdateMapping,
}) => {
  const [selectedExplanation, setSelectedExplanation] = useState<SchemaMapping | null>(null);

  const getCompatibilityBadge = (comp: SchemaMapping["compatibility"]) => {
    switch (comp) {
      case "EXACT MATCH":
        return <Badge variant="outline" className="border-emerald-500/40 bg-emerald-950/30 text-emerald-300 font-mono text-[10px]">EXACT MATCH</Badge>;
      case "SEMANTIC MATCH":
        return <Badge variant="outline" className="border-cyan-500/40 bg-cyan-950/30 text-cyan-300 font-mono text-[10px]">SEMANTIC MATCH</Badge>;
      case "TYPE CONVERSION":
        return <Badge variant="outline" className="border-purple-500/40 bg-purple-950/30 text-purple-300 font-mono text-[10px]">TYPE CONVERSION</Badge>;
      default:
        return <Badge variant="outline" className="border-amber-500/40 bg-amber-950/30 text-amber-300 font-mono text-[10px]">{comp}</Badge>;
    }
  };

  return (
    <div className="panel-surface rounded-xl border border-slate-800 bg-slate-950/70 p-5 space-y-6 shadow-lg backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <TableProperties className="h-5 w-5 text-purple-400" />
          <div>
            <h3 className="font-display font-semibold text-slate-100 text-base">SCHEMA & ATTRIBUTE HARMONIZATION WORKSPACE</h3>
            <p className="text-xs text-slate-400">Map heterogeneous source attributes to BhuSetu canonical urban land schema.</p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={onSuggestMappings}
          className="bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold text-xs shadow-md"
        >
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          SUGGEST FIELD MAPPINGS
        </Button>
      </div>

      {/* Field Mapping Interface Table */}
      <div className="space-y-3 font-mono text-xs">
        <div className="flex justify-between items-center text-slate-300">
          <span className="font-display font-semibold text-xs uppercase tracking-wider text-slate-200">
            SOURCE TO CANONICAL FIELD MAPPINGS ({mappings.length})
          </span>
          <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-[10px]">
            SYSTEM DEMO SUGGESTION ENGINE
          </Badge>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase">
                <th className="p-3">Source Dataset</th>
                <th className="p-3">Source Field</th>
                <th className="p-3">Mapped Canonical Field</th>
                <th className="p-3">Compatibility</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Status</th>
                <th className="p-3">Why?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {mappings.map((m) => (
                <tr key={m.id} className="hover:bg-slate-900/60">
                  <td className="p-3 font-bold text-cyan-300">{m.sourceName}</td>
                  <td className="p-3 font-semibold text-slate-100">{m.sourceField}</td>
                  <td className="p-3">
                    <select
                      value={m.canonicalField}
                      onChange={(e) => onUpdateMapping(m.id, e.target.value)}
                      className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-emerald-300 font-bold focus:ring-purple-500"
                    >
                      {CANONICAL_URBAN_SCHEMA.map((cf) => (
                        <option key={cf.name} value={cf.name}>
                          {cf.name} ({cf.label})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">{getCompatibilityBadge(m.compatibility)}</td>
                  <td className="p-3 font-bold text-purple-300">{m.confidence}%</td>
                  <td className="p-3">
                    <Badge variant="outline" className={m.status === "Mapped" ? "border-emerald-500/40 text-emerald-300 text-[10px]" : "border-amber-500/40 text-amber-300 text-[10px]"}>
                      {m.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-purple-400 hover:text-purple-200">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 border-purple-500/30 bg-slate-950 text-slate-100 text-xs font-mono space-y-2">
                        <div className="font-bold text-purple-300">WHY THIS MAPPING?</div>
                        <div>Source: <span className="text-cyan-300">{m.sourceField}</span> → <span className="text-emerald-300">{m.canonicalField}</span></div>
                        <div className="text-slate-400">Confidence Score: <strong className="text-purple-300">{m.confidence}%</strong></div>
                        <div className="space-y-1 pt-1 border-t border-slate-800">
                          <span className="text-[10px] text-slate-500">MATCH SIGNALS:</span>
                          {m.signals.map((sig, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                              <span>{sig}</span>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Type Normalization & Attribute Standardization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        {/* Type Normalization */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <h4 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider">
            TYPE NORMALIZATION PREVIEW
          </h4>
          <div className="space-y-2">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div><span className="text-slate-500">BEFORE:</span> <span className="text-amber-300">"1245.70"</span> (String)</div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
              <div><span className="text-slate-500">CANONICAL:</span> <span className="text-emerald-300">1245.70</span> (NUMBER)</div>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div><span className="text-slate-500">BEFORE:</span> <span className="text-amber-300">"ACTIVE"</span> (Uppercase)</div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
              <div><span className="text-slate-500">CANONICAL:</span> <span className="text-emerald-300">"Active"</span> (Title Case)</div>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div><span className="text-slate-500">BEFORE:</span> <span className="text-amber-300">"2025/04/18"</span> (Slash Date)</div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
              <div><span className="text-slate-500">CANONICAL:</span> <span className="text-emerald-300">2025-04-18</span> (ISO 8601)</div>
            </div>
          </div>
        </div>

        {/* Attribute Standardization Dictionary */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <h4 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider">
            CANONICAL ATTRIBUTE DICTIONARIES
          </h4>
          <div className="space-y-1.5 overflow-y-auto max-h-40 pr-1">
            {attributeRules.map((rule, idx) => (
              <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-cyan-400 font-bold">{rule.field}:</span>{" "}
                  <span className="text-amber-300">{rule.originalValue}</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                <span className="font-bold text-emerald-300">{rule.canonicalValue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
