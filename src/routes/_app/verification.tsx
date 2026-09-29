import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { PageHeader, Panel } from "@/components/common/ModulePage";
import { DemoDataNotice } from "@/components/common/TrustBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getVerificationQueue,
  getVerificationCase,
  subscribeVerificationQueue,
  markInReview,
  type VerificationCase,
  type VerificationStatus,
  CURRENT_REVIEWER,
} from "@/lib/api/verification";
import { VerificationCaseWorkspace } from "@/components/verification/VerificationCaseWorkspace";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import {
  ShieldCheck,
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  Play,
  FileCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  UserCheck,
} from "lucide-react";

export const Route = createFileRoute("/_app/verification")({
  validateSearch: (search: Record<string, unknown>) => search,
  head: () => ({
    meta: [
      { title: "Human Verification Command Center — Bhu Drishti 3D" },
      {
        name: "description",
        content: "Statutory Human Verification Queue and Decision Workspace for Bhu Drishti 3D land records harmonization.",
      },
    ],
  }),
  component: VerificationCommandCenterPage,
});

function VerificationCommandCenterPage() {
  const navigate = useNavigate();
  const { push } = useNotifications();
  const [queue, setQueue] = useState<VerificationCase[]>(getVerificationQueue);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | "ALL">("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [confidenceFilter, setConfidenceFilter] = useState<"ALL" | "HIGH" | "LOW">("ALL");

  useEffect(() => {
    const unsub = subscribeVerificationQueue((updated) => {
      setQueue(updated);
    });
    return unsub;
  }, []);

  // Filtered Queue Calculation
  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = item.id.toLowerCase().includes(q);
        const matchesEntity = item.entityId.toLowerCase().includes(q);
        const matchesProp = item.propertyId.toLowerCase().includes(q);
        const matchesConflict = item.conflictId.toLowerCase().includes(q);
        if (!matchesId && !matchesEntity && !matchesProp && !matchesConflict) {
          return false;
        }
      }

      // Status
      if (statusFilter !== "ALL" && item.status !== statusFilter) {
        return false;
      }

      // Severity
      if (severityFilter !== "ALL" && item.severity !== severityFilter) {
        return false;
      }

      // Confidence
      if (confidenceFilter === "HIGH" && item.confidence < 80) return false;
      if (confidenceFilter === "LOW" && item.confidence >= 80) return false;

      return true;
    });
  }, [queue, searchQuery, statusFilter, severityFilter, confidenceFilter]);

  // KPI Metrics
  const pendingCount = queue.filter((q) => q.status === "PENDING_REVIEW").length;
  const inReviewCount = queue.filter((q) => q.status === "IN_REVIEW").length;
  const highConfidenceCount = queue.filter((q) => q.confidence >= 80).length;
  const lowConfidenceCount = queue.filter((q) => q.confidence < 80).length;
  const needsEvidenceCount = queue.filter((q) => q.status === "NEEDS_MORE_EVIDENCE").length;
  const approvedTodayCount = queue.filter((q) => q.status === "APPROVED" || q.status === "MODIFIED").length;

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setSeverityFilter("ALL");
    setConfidenceFilter("ALL");
  };

  // Start Interactive Verification Demo
  const handleRunDemo = () => {
    setSelectedCaseId("VER-014");
    markInReview("VER-014", CURRENT_REVIEWER);
    push({
      title: "Interactive Verification Demo Activated",
      body: "Loaded case VER-014 (PARCEL-DEMO-014) in Active Review Mode.",
      category: "verification",
      priority: "normal",
    });
  };

  // Active Selected Case
  const selectedCase = selectedCaseId ? queue.find((c) => c.id === selectedCaseId) : null;

  if (selectedCase) {
    return (
      <div className="space-y-4">
        <VerificationCaseWorkspace
          caseData={selectedCase}
          onBackToQueue={() => setSelectedCaseId(null)}
          onNextCase={() => {
            const next = queue.find((q) => q.id !== selectedCase.id && q.status === "PENDING_REVIEW");
            if (next) {
              setSelectedCaseId(next.id);
              markInReview(next.id);
            }
          }}
          onViewHarmonization={() => {
            navigate({ to: "/harmonization" });
          }}
          onViewEvidenceGraph={() => {
            navigate({ to: "/evidence" });
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          eyebrow="Resolution & Arbitration"
          title="Human Verification Command Center"
          description="Statutory review queue for multi-source cadastral harmonization. AI provides suggestions — only authorized human arbiters record binding decisions."
        />

        <div className="flex items-center gap-2">
          <Button
            onClick={handleRunDemo}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-1.5 shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Run Verification Demo (VER-014)
          </Button>
        </div>
      </div>

      <DemoDataNotice />

      {/* Top Verification KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => setStatusFilter("PENDING_REVIEW")}
          className={cn(
            "p-3 rounded-xl border text-left transition-all",
            statusFilter === "PENDING_REVIEW"
              ? "border-amber-500/80 bg-amber-500/10 shadow-sm"
              : "border-border bg-card/60 hover:border-amber-500/40"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Pending Review</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-amber-300">{pendingCount}</p>
        </button>

        <button
          onClick={() => setStatusFilter("IN_REVIEW")}
          className={cn(
            "p-3 rounded-xl border text-left transition-all",
            statusFilter === "IN_REVIEW"
              ? "border-blue-500/80 bg-blue-500/10 shadow-sm"
              : "border-border bg-card/60 hover:border-blue-500/40"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">In Review</span>
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-blue-300">{inReviewCount}</p>
        </button>

        <button
          onClick={() => setConfidenceFilter(confidenceFilter === "HIGH" ? "ALL" : "HIGH")}
          className={cn(
            "p-3 rounded-xl border text-left transition-all",
            confidenceFilter === "HIGH"
              ? "border-emerald-500/80 bg-emerald-500/10 shadow-sm"
              : "border-border bg-card/60 hover:border-emerald-500/40"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">High Confidence</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-emerald-300">{highConfidenceCount}</p>
        </button>

        <button
          onClick={() => setConfidenceFilter(confidenceFilter === "LOW" ? "ALL" : "LOW")}
          className={cn(
            "p-3 rounded-xl border text-left transition-all",
            confidenceFilter === "LOW"
              ? "border-rose-500/80 bg-rose-500/10 shadow-sm"
              : "border-border bg-card/60 hover:border-rose-500/40"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Low Confidence</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-rose-300">{lowConfidenceCount}</p>
        </button>

        <button
          onClick={() => setStatusFilter("NEEDS_MORE_EVIDENCE")}
          className={cn(
            "p-3 rounded-xl border text-left transition-all",
            statusFilter === "NEEDS_MORE_EVIDENCE"
              ? "border-purple-500/80 bg-purple-500/10 shadow-sm"
              : "border-border bg-card/60 hover:border-purple-500/40"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Needs Evidence</span>
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-purple-300">{needsEvidenceCount}</p>
        </button>

        <button
          onClick={() => setStatusFilter("APPROVED")}
          className={cn(
            "p-3 rounded-xl border text-left transition-all",
            statusFilter === "APPROVED"
              ? "border-emerald-500/80 bg-emerald-500/10 shadow-sm"
              : "border-border bg-card/60 hover:border-emerald-500/40"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Decided Today</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="mt-1 font-display text-2xl font-bold text-emerald-300">{approvedTodayCount}</p>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-xl bg-card border border-border/80 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Verification ID, Entity ID, Parcel ID, or Conflict ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-background/80 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-background/80 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="NEEDS_MORE_EVIDENCE">Needs Evidence</option>
            <option value="APPROVED">Approved</option>
            <option value="MODIFIED">Modified</option>
            <option value="REJECTED">Rejected</option>
            <option value="DEFERRED">Deferred</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-background/80 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Severity</option>
            <option value="HIGH">High Severity</option>
            <option value="MEDIUM">Medium Severity</option>
            <option value="LOW">Low Severity</option>
          </select>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Verification Queue List */}
      <Panel
        title="Active Human Verification Cases"
        meta={<span className="font-mono text-xs text-muted-foreground">{filteredQueue.length} Cases Listed</span>}
      >
        {filteredQueue.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
            <p>No verification cases match your current filter criteria.</p>
            <Button size="sm" variant="outline" onClick={resetFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {filteredQueue.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "p-4 rounded-xl border text-xs space-y-3 transition-all",
                  item.status === "APPROVED"
                    ? "bg-emerald-950/10 border-emerald-500/30"
                    : item.status === "IN_REVIEW"
                    ? "bg-blue-950/10 border-blue-500/30"
                    : "bg-card border-border/80 hover:border-primary/50"
                )}
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground">{item.id}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="font-mono text-muted-foreground">{item.entityId}</span>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-mono font-semibold border",
                      item.severity === "CRITICAL"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        : item.severity === "HIGH"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                    )}
                  >
                    {item.severity}
                  </span>
                </div>

                {/* Conflict and Recommendation */}
                <div className="space-y-1">
                  <p className="text-[11px] text-muted-foreground">Conflict: <strong className="text-foreground">{item.conflictType}</strong></p>
                  <p className="font-medium text-emerald-300 text-xs">
                    Candidate: {item.aiRecommendationTitle}
                  </p>
                </div>

                {/* Badges & Metrics row */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-[11px]">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">AI Confidence</span>
                    <span className="font-mono font-semibold text-foreground">{item.confidence}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Evidence</span>
                    <span className="font-semibold text-emerald-400">{item.evidenceStrength}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Sources</span>
                    <span className="text-foreground">{item.sourceCount} Repositories</span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                  <span
                    className={cn(
                      "text-[11px] font-semibold",
                      item.status === "APPROVED"
                        ? "text-emerald-400"
                        : item.status === "IN_REVIEW"
                        ? "text-blue-400"
                        : "text-amber-300"
                    )}
                  >
                    ● {item.status}
                  </span>

                  <Button
                    size="sm"
                    onClick={() => {
                      markInReview(item.id, CURRENT_REVIEWER);
                      setSelectedCaseId(item.id);
                    }}
                    className="bg-primary/90 hover:bg-primary text-primary-foreground font-medium text-xs h-7 px-3 flex items-center gap-1"
                  >
                    Enter Review Mode
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
