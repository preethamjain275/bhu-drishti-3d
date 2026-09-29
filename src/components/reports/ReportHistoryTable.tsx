import React, { useState } from "react";
import { GeneratedReport } from "@/lib/api/reports";
import { FileText, Download, ExternalLink, RefreshCw, CheckCircle2, Search } from "lucide-react";

interface ReportHistoryTableProps {
  history: GeneratedReport[];
  onOpenReport: (report: GeneratedReport) => void;
  onExportReport: (report: GeneratedReport, format: "pdf" | "json" | "csv") => void;
}

export function ReportHistoryTable({ history, onOpenReport, onExportReport }: ReportHistoryTableProps) {
  const [search, setSearch] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("ALL");

  const filteredHistory = history.filter((rpt) => {
    if (selectedTypeFilter !== "ALL" && rpt.reportType !== selectedTypeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        rpt.reportId.toLowerCase().includes(q) ||
        rpt.targetId.toLowerCase().includes(q) ||
        rpt.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 text-slate-100 font-sans backdrop-blur-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 font-mono text-xs">
        <div className="flex items-center gap-2 font-bold text-teal-400">
          <FileText className="h-4 w-4" />
          REPORT HISTORY & ARCHIVE ({filteredHistory.length})
        </div>

        {/* Search & Filter Inputs */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports..."
              className="pl-8 pr-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-[11px] focus:outline-none focus:border-teal-500"
            />
          </div>

          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-[11px] focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">ALL TYPES</option>
            <option value="PARCEL_INTELLIGENCE">PARCEL INTELLIGENCE</option>
            <option value="CONFLICT_INVESTIGATION">CONFLICT INVESTIGATION</option>
            <option value="HARMONIZATION">HARMONIZATION</option>
            <option value="VERIFICATION_SUMMARY">VERIFICATION SUMMARY</option>
            <option value="DATA_QUALITY">DATA QUALITY</option>
            <option value="EXECUTIVE_ANALYTICS">EXECUTIVE ANALYTICS</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs bg-slate-950/70">
        <div className="bg-slate-900 p-3 grid grid-cols-6 font-bold text-slate-400 text-[10px] uppercase">
          <span>Report ID</span>
          <span>Title & Entity</span>
          <span>Type</span>
          <span>Created By</span>
          <span>Timestamp</span>
          <span className="text-right">Export Actions</span>
        </div>

        {filteredHistory.map((rpt) => (
          <div key={rpt.reportId} className="p-3 grid grid-cols-6 items-center hover:bg-slate-900/60 transition text-[11px]">
            <span className="font-bold text-teal-300">{rpt.reportId}</span>
            <div>
              <div className="font-bold text-slate-200 line-clamp-1">{rpt.title}</div>
              <div className="text-[10px] text-slate-500">Target: {rpt.targetId}</div>
            </div>
            <span className="text-[10px] text-purple-300">{rpt.reportType.replace(/_/g, " ")}</span>
            <span className="text-slate-400">{rpt.createdBy}</span>
            <span className="text-slate-400 text-[10px]">{new Date(rpt.createdAt).toLocaleDateString()}</span>
            <div className="flex items-center justify-end gap-1.5">
              <button
                onClick={() => {
                  onOpenReport(rpt);
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                className="px-2 py-1 rounded bg-teal-500/20 border border-teal-500/40 hover:bg-teal-500/30 text-teal-300 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
              >
                VIEW <ExternalLink className="h-3 w-3" />
              </button>
              <button
                onClick={() => onExportReport(rpt, "pdf")}
                className="px-2 py-1 rounded bg-rose-500/20 border border-rose-500/40 hover:bg-rose-500/30 text-rose-300 text-[10px] font-bold transition flex items-center gap-0.5 cursor-pointer"
              >
                <Download className="h-3 w-3" /> PDF
              </button>
              <button
                onClick={() => onExportReport(rpt, "json")}
                className="px-2 py-1 rounded bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500/30 text-purple-300 text-[10px] font-bold transition cursor-pointer"
              >
                JSON
              </button>
              <button
                onClick={() => onExportReport(rpt, "csv")}
                className="px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold transition cursor-pointer"
              >
                CSV
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
