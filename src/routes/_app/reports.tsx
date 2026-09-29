import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import {
  ReportType,
  ReportConfig,
  GeneratedReport,
  generateReport,
  MOCK_REPORT_HISTORY,
  exportReportPayload,
} from "@/lib/api/reports";
import { ReportBuilder } from "@/components/reports/ReportBuilder";
import { ReportPreview } from "@/components/reports/ReportPreview";
import { ReportHistoryTable } from "@/components/reports/ReportHistoryTable";
import { FileText, Sparkles, Download, Layers, ShieldAlert, CheckCircle2, RefreshCw, Printer, Database, Info } from "lucide-react";

export const Route = createFileRoute("/_app/reports")({
  validateSearch: (search: Record<string, unknown>) => search,
  head: () => ({
    meta: [
      { title: "Report & Export Center — Bhu Drishti 3D" },
      { name: "description", content: "Automated Land Intelligence Report Generator & Multi-Format Export Center." },
      { property: "og:title", content: "Report & Export Center — Bhu Drishti 3D" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const searchParams = Route.useSearch();
  const [history, setHistory] = useState<GeneratedReport[]>(MOCK_REPORT_HISTORY);
  const [activeReport, setActiveReport] = useState<GeneratedReport | null>(MOCK_REPORT_HISTORY[0] || null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize from search query params if passed from Analytics, Conflicts, or Verification
  useEffect(() => {
    if (searchParams.target && typeof searchParams.target === "string") {
      const targetId = searchParams.target;
      const rType: ReportType = (searchParams.template as ReportType) || "PARCEL_INTELLIGENCE";
      handleGenerateReport({
        reportType: rType,
        targetId,
        sections: {
          executiveSummary: true,
          parcelInfo: true,
          sourceComparison: true,
          geometryMetrics: true,
          buildings: true,
          conflicts: true,
          evidence: true,
          recommendation: true,
          verification: true,
          auditTrail: true,
        },
      });
    }
  }, [searchParams]);

  const handleGenerateReport = async (config: ReportConfig) => {
    setIsGenerating(true);
    try {
      const newReport = await generateReport(config);
      setActiveReport(newReport);
      setHistory((prev) => [newReport, ...prev]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDemoReport = () => {
    handleGenerateReport({
      reportType: "PARCEL_INTELLIGENCE",
      targetId: "PARCEL-DEMO-014",
      title: "SIH Demo Parcel Intelligence Report - PARCEL-DEMO-014",
      sections: {
        executiveSummary: true,
        parcelInfo: true,
        sourceComparison: true,
        geometryMetrics: true,
        buildings: true,
        conflicts: true,
        evidence: true,
        recommendation: true,
        verification: true,
        auditTrail: true,
      },
    });
  };

  /**
   * Generate a proper PDF using the browser's native print-to-PDF.
   * We build a clean HTML document and open it in a new window for printing.
   */
  const handleExportPDF = (reportToExport?: GeneratedReport) => {
    const rpt = reportToExport || activeReport;
    if (!rpt) return;

    const d = rpt.data;
    const now = new Date(rpt.createdAt).toLocaleString();

    // Build clean HTML for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${rpt.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; color: #1a1a2e; padding: 40px; line-height: 1.6; background: white; }
    .header { border-bottom: 3px solid #0d9488; padding-bottom: 20px; margin-bottom: 30px; }
    .header-badge { display: inline-block; background: #0d9488; color: white; padding: 4px 12px; border-radius: 6px; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
    .header h1 { font-size: 22px; font-weight: 800; margin-top: 12px; color: #0f172a; }
    .header .meta { font-size: 11px; color: #64748b; margin-top: 6px; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #0d9488; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
    .summary-text { font-size: 13px; color: #334155; line-height: 1.8; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #0d9488; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
    th { background: #f1f5f9; padding: 10px 12px; text-align: left; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; }
    td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; }
    tr:hover td { background: #fafbfc; }
    .metric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .metric-card { padding: 14px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; }
    .metric-label { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
    .metric-value { font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px; }
    .recommendation { padding: 16px; background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; }
    .recommendation-title { font-weight: 700; color: #4338ca; font-size: 12px; }
    .verification { padding: 16px; background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 8px; }
    .verification-title { font-weight: 700; color: #047857; font-size: 12px; }
    .provenance { padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-top: 20px; }
    .provenance-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; font-size: 11px; margin-top: 8px; }
    .footer { margin-top: 30px; padding-top: 16px; border-top: 2px solid #e2e8f0; text-align: center; font-size: 10px; color: #94a3b8; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <span class="header-badge">BHU-DRISHTI 3D — Land Intelligence Platform</span>
    <span class="header-badge" style="background: #7c3aed; margin-left: 6px;">OFFICIAL REPORT</span>
    <h1>${rpt.title}</h1>
    <div class="meta">
      Report ID: ${rpt.reportId} &bull; Target Entity: ${rpt.targetId} &bull; 
      Generated: ${now} &bull; By: ${rpt.createdBy} &bull; 
      Status: <strong style="color: #059669;">${rpt.status}</strong>
    </div>
  </div>

  <div class="section">
    <div class="section-title">1. Executive Summary</div>
    <div class="summary-text">${rpt.summaryText}</div>
  </div>

  ${d.parcelId ? `
  <div class="section">
    <div class="section-title">2. Parcel & Spatial Identity</div>
    <div class="metric-grid">
      <div class="metric-card">
        <div class="metric-label">Parcel ID</div>
        <div class="metric-value" style="font-size:14px;">${d.parcelId}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Area</div>
        <div class="metric-value">${d.areaSqM} m²</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Perimeter</div>
        <div class="metric-value">${d.perimeterM} m</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Buildings</div>
        <div class="metric-value">${d.buildingsCount}</div>
      </div>
    </div>
  </div>` : ""}

  ${d.sources ? `
  <div class="section">
    <div class="section-title">3. Source Observation Comparison</div>
    <table>
      <thead><tr><th>Source Name</th><th>Confidence</th><th>Reported Area</th></tr></thead>
      <tbody>
        ${d.sources.map((s) => `<tr><td><strong>${s.name}</strong></td><td>${Math.round(s.confidence * 100)}%</td><td>${s.area} m²</td></tr>`).join("")}
      </tbody>
    </table>
  </div>` : ""}

  ${d.geometryDifference ? `
  <div class="section">
    <div class="section-title">4. Geometry Difference Analysis</div>
    <div class="metric-grid">
      <div class="metric-card">
        <div class="metric-label">Area Difference</div>
        <div class="metric-value" style="color:#d97706;">${d.geometryDifference.areaDiff} m²</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Centroid Shift</div>
        <div class="metric-value" style="color:#d97706;">${d.geometryDifference.centroidShiftM} m</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Overlap Ratio</div>
        <div class="metric-value" style="color:#0d9488;">${Math.round(d.geometryDifference.overlapRatio * 100)}%</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">IoU Score</div>
        <div class="metric-value" style="color:#0d9488;">${d.geometryDifference.iou}</div>
      </div>
    </div>
  </div>` : ""}

  ${d.evidenceRecords ? `
  <div class="section">
    <div class="section-title">5. Evidence Records</div>
    <table>
      <thead><tr><th>Evidence ID</th><th>Type</th><th>Reliability</th></tr></thead>
      <tbody>
        ${d.evidenceRecords.map((e) => `<tr><td>${e.id}</td><td>${e.type}</td><td>${Math.round(e.reliability * 100)}%</td></tr>`).join("")}
      </tbody>
    </table>
  </div>` : ""}

  <div class="two-col">
    ${d.recommendation ? `
    <div class="recommendation">
      <div class="recommendation-title">🤖 AI-Assisted Recommendation</div>
      <p style="font-size:12px; color:#4338ca; margin-top:6px;">${d.recommendation.action}</p>
      <p style="font-size:11px; color:#6366f1; margin-top:4px;">Confidence: ${Math.round(d.recommendation.confidence * 100)}%</p>
    </div>` : ""}
    ${d.verification ? `
    <div class="verification">
      <div class="verification-title">✅ Human Verification State</div>
      <p style="font-size:12px; color:#047857; margin-top:6px;">Status: <strong>${d.verification.status}</strong></p>
      <p style="font-size:11px; color:#059669; margin-top:4px;">Assigned: ${d.verification.assignedRole}</p>
    </div>` : ""}
  </div>

  <div class="provenance">
    <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:1px;">Report Provenance & Integrity</div>
    <div class="provenance-grid">
      <div>Source Feeds: <strong style="color:#0d9488;">✓ ${rpt.provenance.sourceIds.length} Feeds</strong></div>
      <div>Conflict Refs: <strong style="color:#0d9488;">✓ ${rpt.provenance.conflictIds.length} Matched</strong></div>
      <div>Evidence Chain: <strong style="color:#0d9488;">✓ ${rpt.provenance.evidenceIds.length} Records</strong></div>
      <div>Audit Events: <strong style="color:#0d9488;">✓ ${rpt.provenance.auditEventsCount} Events</strong></div>
      <div>Demo Label: <strong style="color:#7c3aed;">✓ Included</strong></div>
    </div>
  </div>

  <div class="footer">
    <p><strong>BHU-DRISHTI 3D — Land Intelligence Platform</strong></p>
    <p style="margin-top:4px;">${d.governanceDisclaimer || "DECISION SUPPORT ONLY — AI recommendations require authorized human verification."}</p>
    <p style="margin-top:4px;">Generated on ${now} • Report ID: ${rpt.reportId}</p>
  </div>
</body>
</html>`;

    // Open in new window and trigger print (Save as PDF)
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      // Wait for fonts to load, then print
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleExportJSON = async (reportToExport?: GeneratedReport) => {
    const rpt = reportToExport || activeReport;
    if (!rpt) return;
    const payload = await exportReportPayload(rpt, "json");
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${rpt.reportId}_payload.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = async (reportToExport?: GeneratedReport) => {
    const rpt = reportToExport || activeReport;
    if (!rpt) return;
    const payload = await exportReportPayload(rpt, "csv");
    const blob = new Blob([payload], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${rpt.reportId}_summary.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full text-slate-100 px-4 py-6 md:px-6 md:py-8 space-y-8 font-sans pb-24 md:pb-8">
      
      {/* 1. Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-teal-400 font-bold uppercase tracking-wider">
            <FileText className="h-4 w-4" />
            LAND INTELLIGENCE REPORT & EXPORT CENTER
          </div>
          <h1 className="text-2xl font-black font-display text-white mt-2">Automated Report Generator</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Generate traceable land intelligence dossiers with source observations, evidence chains, AI recommendations, and verification records.
          </p>
        </div>

        {/* SIH Demo Action */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleDemoReport}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black shadow-lg shadow-teal-500/20 transition"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? "GENERATING..." : "GENERATE DEMO REPORT"}
          </button>
        </div>
      </div>

      {/* 2. Report Builder Workspace */}
      <ReportBuilder onGenerateReport={handleGenerateReport} isGenerating={isGenerating} />

      {/* 3. Live Report Preview Section */}
      <ReportPreview
        report={activeReport}
        onPrint={() => handleExportPDF()}
        onExportJSON={() => handleExportJSON(activeReport || undefined)}
        onExportCSV={() => handleExportCSV(activeReport || undefined)}
      />

      {/* 4. Report History Archive */}
      <ReportHistoryTable
        history={history}
        onOpenReport={(rpt) => setActiveReport(rpt)}
        onExportReport={(rpt, fmt) => {
          if (fmt === "json") handleExportJSON(rpt);
          if (fmt === "csv") handleExportCSV(rpt);
          if (fmt === "pdf") handleExportPDF(rpt);
        }}
      />

      {/* 5. Governance Notice */}
      <div className="glass-panel p-4 font-mono text-[11px] text-slate-400 flex items-start gap-3">
        <Info className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-teal-400 font-bold">GOVERNANCE DISCLAIMER:</strong> BHU-DRISHTI 3D reports summarize source observations, evidence, and verification states for decision support. AI recommendations require authorized human verification. Synthetic demo content is for demonstration only.
        </span>
      </div>

    </div>
  );
}
