/**
 * BHOO-MITRA AI — Spatial Entity Matching Intelligence Center
 * Route: /entity-matching
 *
 * Multi-source spatial entity resolution, candidate ranking, similarity metrics,
 * duplicate detection, relationship graph, and evidence-grounded decision workflow.
 *
 * ⚠️ SYNTHETIC DEMONSTRATION DATA & MATCHING SIGNALS ⚠️
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  GitMerge,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Copy,
  HelpCircle,
  Eye,
  Layers,
  Database,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/common/ModulePage";
import { DemoDataNotice } from "@/components/common/TrustBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import {
  getMatchingKPIs,
  getObservations,
  getCanonicalEntities,
  getCandidatesForObservation,
  getPotentialDuplicates,
  getUnresolvedMatches,
  submitMatchDecision,
  runMatchingDemo,
  type EntityObservation,
  type MatchCandidate,
  type DuplicateCandidate,
  type UnresolvedCase,
  type MatchStatus,
} from "@/lib/api/entityMatching";

import { MatchingKPIs } from "@/components/matching/MatchingKPIs";
import { MatchingWorkflowNav, type MatchingStep } from "@/components/matching/MatchingWorkflowNav";
import { ObservationTable } from "@/components/matching/ObservationTable";
import { CandidateMatchingPanel } from "@/components/matching/CandidateMatchingPanel";
import { MatchConfidenceBreakdown } from "@/components/matching/MatchConfidenceBreakdown";
import { MatchDecisionPanel } from "@/components/matching/MatchDecisionPanel";
import { MatchingMapViewer } from "@/components/matching/MatchingMapViewer";
import { PotentialDuplicatesPanel } from "@/components/matching/PotentialDuplicatesPanel";
import { UnresolvedMatchesPanel } from "@/components/matching/UnresolvedMatchesPanel";
import { EntityRelationshipGraph } from "@/components/matching/EntityRelationshipGraph";
import { EntityMatchInspector } from "@/components/matching/EntityMatchInspector";

export const Route = createFileRoute("/_app/entity-matching")({
  validateSearch: (s: Record<string, unknown>): { sources?: string; [key: string]: unknown } => {
    return { ...s };
  },
  head: () => ({
    meta: [
      { title: "Spatial Entity Matching Intelligence Center — Bhu Drishti 3D" },
      {
        name: "description",
        content:
          "Evidence-grounded spatial entity resolution, candidate ranking, similarity metrics, and duplicate detection.",
      },
      { property: "og:title", content: "Spatial Entity Matching Intelligence Center — Bhu Drishti 3D" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: EntityMatchingIntelligenceCenter,
});

function EntityMatchingIntelligenceCenter() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const comesFromHarmonization = !!searchParams["sources"];

  const [currentStep, setCurrentStep] = useState<MatchingStep>("CANDIDATE GENERATION");
  const [viewTab, setViewTab] = useState<"CANDIDATE_MATCHES" | "DUPLICATES" | "UNRESOLVED">("CANDIDATE_MATCHES");

  const [stats, setStats] = useState({
    totalObservations: 84,
    matchedEntities: 61,
    highConfidenceMatches: 48,
    mediumConfidenceMatches: 10,
    unresolvedMatches: 6,
    potentialDuplicates: 5,
  });

  const [observations, setObservations] = useState<EntityObservation[]>([]);
  const [selectedObs, setSelectedObs] = useState<EntityObservation | null>(null);
  const [candidates, setCandidates] = useState<MatchCandidate[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("CANONICAL-014");

  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>([]);
  const [unresolvedCases, setUnresolvedCases] = useState<UnresolvedCase[]>([]);

  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [isProcessingDemo, setIsProcessingDemo] = useState(false);
  const [demoProgressText, setDemoProgressText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const kpis = await getMatchingKPIs();
    setStats(kpis);
    const obs = await getObservations();
    setObservations(obs);
    if (obs.length > 0) {
      const defaultObs = obs[0]!;
      setSelectedObs(defaultObs);
      const cands = await getCandidatesForObservation(defaultObs.id);
      setCandidates(cands);
      if (cands.length > 0) setSelectedCandidateId(cands[0]!.candidateEntityId);
    }
    const dups = await getPotentialDuplicates();
    setDuplicates(dups);
    const unres = await getUnresolvedMatches();
    setUnresolvedCases(unres);
  };

  const handleSelectObservation = async (obs: EntityObservation) => {
    setSelectedObs(obs);
    const cands = await getCandidatesForObservation(obs.id);
    setCandidates(cands);
    if (cands.length > 0) setSelectedCandidateId(cands[0]!.candidateEntityId);
  };

  const currentCandidate = useMemo(() => {
    return candidates.find((c) => c.candidateEntityId === selectedCandidateId) ?? candidates[0] ?? null;
  }, [candidates, selectedCandidateId]);

  const handleSubmitDecision = async (decision: MatchStatus) => {
    if (!selectedObs || !currentCandidate) return;
    const updatedObs = await submitMatchDecision({
      observationId: selectedObs.id,
      candidateEntityId: currentCandidate.candidateEntityId,
      decision,
    });
    setSelectedObs(updatedObs);
    const refreshedObs = await getObservations();
    setObservations(refreshedObs);
  };

  const handleRunMatchingDemo = async () => {
    setIsProcessingDemo(true);
    await runMatchingDemo({
      onProgress: (stepText, _percent) => {
        setDemoProgressText(stepText);
      },
    });
    await loadData();
    setIsProcessingDemo(false);
  };

  return (
    <div className="space-y-6 px-4 py-6 md:px-6 md:py-8 pb-24 md:pb-8">
      {/* Page Header */}
      <PageHeader
        eyebrow="MULTI-SOURCE RESOLUTION"
        title="Spatial Entity Matching Intelligence Center"
        description="Evidence-grounded spatial entity disambiguation, candidate ranking, topology metrics, and duplicate detection."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInspectorOpen(true)}
              disabled={!selectedObs}
              className="border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 text-xs font-semibold"
            >
              <GitMerge className="mr-1.5 h-3.5 w-3.5" />
              OPEN MATCH INSPECTOR
            </Button>

            <Button
              size="sm"
              disabled={isProcessingDemo}
              onClick={handleRunMatchingDemo}
              className="bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold text-xs shadow-md"
            >
              {isProcessingDemo ? (
                <>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  {demoProgressText || "RUNNING MATCHING DEMO…"}
                </>
              ) : (
                <>
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  RUN MATCHING DEMO
                </>
              )}
            </Button>
          </div>
        }
      />

      {/* Context Banner from Harmonization */}
      {comesFromHarmonization && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-center justify-between font-mono">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Harmonized Source Context Loaded: Spatial reference EPSG:4326 and canonical fields aligned.
          </span>
          <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-[10px]">
            READY FOR RESOLUTION
          </Badge>
        </div>
      )}

      {/* Trust Notice */}
      <DemoDataNotice />

      {/* Overview KPIs */}
      <MatchingKPIs stats={stats} />

      {/* Workflow Stepper Pipeline */}
      <MatchingWorkflowNav currentStep={currentStep} onSelectStep={setCurrentStep} />

      {/* View Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-3 pt-2 text-xs font-mono">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: "CANDIDATE_MATCHES", label: "Candidate Matches & Observations" },
            { id: "DUPLICATES", label: `Potential Duplicates (${duplicates.length})` },
            { id: "UNRESOLVED", label: `Unresolved Review Queue (${unresolvedCases.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewTab(tab.id as any)}
              className={cn(
                "px-3 py-1.5 rounded-lg border font-semibold transition-all whitespace-nowrap",
                viewTab === tab.id
                  ? "border-cyan-500 bg-cyan-950/40 text-cyan-200 shadow"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {viewTab === "CANDIDATE_MATCHES" && (
        <div className="space-y-8">
          {/* Source Observation Table */}
          <ObservationTable
            observations={observations}
            selectedObsId={selectedObs?.id ?? null}
            onSelectObservation={handleSelectObservation}
          />

          {selectedObs && currentCandidate && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left/Center Column (8 cols): Candidate Ranking & Map Viewer */}
              <div className="lg:col-span-8 space-y-8">
                {/* Candidate Ranking & Metrics Panel */}
                <CandidateMatchingPanel
                  observation={selectedObs}
                  candidates={candidates}
                  selectedCandidateId={selectedCandidateId}
                  onSelectCandidate={setSelectedCandidateId}
                />

                {/* MapLibre Spatial Alignment Viewer */}
                <MatchingMapViewer observation={selectedObs} candidate={currentCandidate} heightClass="h-80" />

                {/* Transparent Match Confidence Breakdown */}
                <MatchConfidenceBreakdown candidate={currentCandidate} />

                {/* Decision Panel */}
                <MatchDecisionPanel
                  confidenceScore={currentCandidate.overallSignalScore}
                  currentStatus={selectedObs.status}
                  onSubmitDecision={handleSubmitDecision}
                  isSubmitting={isProcessingDemo}
                />
              </div>

              {/* Right Column (4 cols): Relationship Graph & Evidence Links */}
              <div className="lg:col-span-4 space-y-8">
                <EntityRelationshipGraph
                  observationId={selectedObs.id}
                  candidateId={currentCandidate.candidateEntityId}
                />

                {/* Quick Evidence & Conflict Integration Card */}
                <div className="glass-panel p-5 space-y-4 font-mono text-xs shadow-lg">
                  <div className="font-display font-semibold text-slate-200">
                    SUPPORTING EVIDENCE & CONFLICTS
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">Linked Evidence Records</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate({ to: "/evidence" })}
                        className="h-7 text-[11px] border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/40"
                      >
                        Evidence Graph <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>

                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">Related Boundary Conflicts</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate({ to: "/conflicts" })}
                        className="h-7 text-[11px] border-amber-500/30 text-amber-300 hover:bg-amber-950/40"
                      >
                        Conflict Explorer <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {viewTab === "DUPLICATES" && (
        <PotentialDuplicatesPanel
          duplicates={duplicates}
          onInvestigateDuplicate={(dup) => {
            const obs = observations.find((o) => o.id === dup.observationIds[0]) ?? observations[0];
            if (obs) handleSelectObservation(obs);
            setViewTab("CANDIDATE_MATCHES");
          }}
        />
      )}

      {viewTab === "UNRESOLVED" && (
        <UnresolvedMatchesPanel
          unresolvedCases={unresolvedCases}
          onInvestigateCase={(c) => {
            const obs = observations.find((o) => o.id === c.observationId) ?? observations[0];
            if (obs) handleSelectObservation(obs);
            setViewTab("CANDIDATE_MATCHES");
          }}
        />
      )}

      {/* Match Inspector Drawer */}
      <EntityMatchInspector
        open={inspectorOpen}
        onOpenChange={setInspectorOpen}
        observation={selectedObs}
        candidate={currentCandidate}
        onSubmitDecision={handleSubmitDecision}
      />
    </div>
  );
}
