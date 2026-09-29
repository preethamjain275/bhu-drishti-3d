import React, { useState } from "react";
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
import { TableProperties, ArrowRight, Check, AlertCircle } from "lucide-react";
import type { DataSource, SchemaField } from "@/lib/api/sources";

interface SchemaComparisonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sources: DataSource[];
}

export const SchemaComparisonModal: React.FC<SchemaComparisonModalProps> = ({
  open,
  onOpenChange,
  sources,
}) => {
  if (sources.length < 2) return null;

  const srcA = sources[0]!;
  const srcB = sources[1]!;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-purple-500/30 bg-slate-950 text-slate-100 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-950/80 text-purple-400 border border-purple-500/40">
              <TableProperties className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="font-display text-lg text-slate-100">
                SCHEMA HARMONIZATION COMPARISON
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Align attribute field names, data types, and nullability constraints between sources.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 my-2">
          {/* Source A */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="font-bold text-cyan-300 text-xs truncate">{srcA.name}</span>
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-[10px] font-mono">
                {srcA.schema.length} Fields
              </Badge>
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              {srcA.schema.map((f) => (
                <div key={f.name} className="flex items-center justify-between p-1.5 rounded bg-slate-950/60 border border-slate-800">
                  <div>
                    <span className="text-slate-200 font-semibold">{f.name}</span>
                    <span className="ml-2 text-[10px] text-slate-500">({f.type})</span>
                  </div>
                  <Badge variant="outline" className={`text-[9px] ${!f.nullable ? "border-amber-500/40 text-amber-300" : "border-slate-700 text-slate-500"}`}>
                    {!f.nullable ? "NOT NULL" : "NULLABLE"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Source B */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="font-bold text-purple-300 text-xs truncate">{srcB.name}</span>
              <Badge variant="outline" className="border-purple-500/30 text-purple-400 text-[10px] font-mono">
                {srcB.schema.length} Fields
              </Badge>
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              {srcB.schema.map((f) => (
                <div key={f.name} className="flex items-center justify-between p-1.5 rounded bg-slate-950/60 border border-slate-800">
                  <div>
                    <span className="text-slate-200 font-semibold">{f.name}</span>
                    <span className="ml-2 text-[10px] text-slate-500">({f.type})</span>
                  </div>
                  <Badge variant="outline" className={`text-[9px] ${!f.nullable ? "border-amber-500/40 text-amber-300" : "border-slate-700 text-slate-500"}`}>
                    {!f.nullable ? "NOT NULL" : "NULLABLE"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-slate-800 pt-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="border-slate-800 text-slate-400">
            Close Schema Comparison
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
