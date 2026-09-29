import React, { useState } from "react";
import { ExportPreviewData } from "@/lib/api/analytics";
import { X, FileText, Download, CheckCircle2, Copy } from "lucide-react";

interface AnalyticsExportModalProps {
  isOpen: boolean;
  data: ExportPreviewData | null;
  onClose: () => void;
}

export function AnalyticsExportModal({ isOpen, data, onClose }: AnalyticsExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl text-slate-100 space-y-4 font-sans animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 font-mono font-bold text-sm text-teal-400">
              <FileText className="h-4 w-4" />
              ANALYTICS EXPORT PREVIEW
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              Structured export payload timestamped at {new Date(data.timestamp).toLocaleString()}
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* JSON Preview Box */}
        <div className="space-y-1.5 font-mono text-xs">
          <label className="text-slate-400 font-bold block text-[11px]">STRUCTURED ANALYTICAL DATASET (JSON)</label>
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-teal-300 font-mono text-[11px] max-h-72 overflow-y-auto leading-relaxed">
            {jsonString}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 font-mono text-xs">
          <div className="text-[10px] text-slate-500">Phase 23 full PDF report engine ready.</div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition"
            >
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "COPIED TO CLIPBOARD" : "COPY JSON"}
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition shadow-lg shadow-teal-500/20"
            >
              <Download className="h-3.5 w-3.5" />
              CLOSE PREVIEW
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
