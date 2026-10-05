import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Layers,
  Map,
  ShieldCheck,
  Workflow,
  Box,
  Shield,
  Sparkles,
  Cpu,
  LogIn,
  Database,
  GitMerge,
  Scale,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  Compass,
  MapPin,
  Building2,
  FileText,
  Clock,
  Eye,
  Crosshair,
  UserCheck,
  ChevronRight,
  Maximize2,
  Radar,
  Waypoints,
  Globe,
  Share2,
} from "lucide-react";
import { BhuSetuLogo } from "@/components/brand/BhuSetuLogo";
import { Button } from "@/components/ui/button";
import { DemoDataNotice } from "@/components/common/TrustBadge";
import { cn } from "@/lib/utils";
import { BhooMitraHero } from "@/components/hero/BhooMitraHero";
import { FloatingPWAInstallNotification } from "@/components/common/FloatingPWAInstallNotification";

import { useAuth } from "@/lib/auth/AuthProvider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BHU-DRISHTI 3D — National Urban Digital Twin & Geospatial Harmonization" },
      {
        name: "description",
        content:
          "Intelligent 3D land record harmonization and geospatial digital twin platform for urban land administration under NAKSHA Programme.",
      },
      { property: "og:title", content: "BHU-DRISHTI 3D — One Spatial Truth" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-teal-500 selection:text-slate-950 font-sans overflow-x-hidden relative">
      
      {/* ── Dynamic Atmospheric GIS Background Grid & Particle Sweeper ─────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-950/20 via-[#030712] to-[#030712]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Animated Radar Pulse Beam */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full border border-teal-500/10 animate-ping opacity-20 pointer-events-none" />
      </div>

      {/* ── 1. Top Government GIS Command Header ────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <BhuSetuLogo />

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-mono font-semibold text-slate-300">
            <Link to={isAuthenticated ? "/overview" : "/login"} className="hover:text-teal-300 transition-colors flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-teal-400" /> Overview
            </Link>
            <Link to={isAuthenticated ? "/intelligence-3d" : "/login"} className="hover:text-teal-300 transition-colors flex items-center gap-1">
              <Box className="h-3.5 w-3.5 text-cyan-400" /> Digital Twin
            </Link>
            <Link to={isAuthenticated ? "/harmonization" : "/login"} className="hover:text-teal-300 transition-colors flex items-center gap-1">
              <GitMerge className="h-3.5 w-3.5 text-emerald-400" /> Harmonization
            </Link>
            <Link to={isAuthenticated ? "/evidence" : "/login"} className="hover:text-teal-300 transition-colors flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-purple-400" /> Evidence
            </Link>
            <Link to={isAuthenticated ? "/conflicts" : "/login"} className="hover:text-teal-300 transition-colors flex items-center gap-1">
              <Scale className="h-3.5 w-3.5 text-amber-400" /> Conflicts
            </Link>
            <Link to={isAuthenticated ? "/audit" : "/login"} className="hover:text-teal-300 transition-colors flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" /> Audit
            </Link>
          </nav>

          {/* Header Action Controls */}
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <Button asChild size="sm" className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/25">
                <Link to="/login">
                  <LogIn className="mr-1.5 h-3.5 w-3.5 text-slate-950" /> Sign In
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm" className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/25">
                <Link to="/overview">
                  Command Center <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. ScrollExpandMedia Bhoo-Mitra AI 3D Digital Twin Hero Section ── */}
      <BhooMitraHero />

      {/* ── 3. Scroll-Driven 5-Stage Harmonization Workflow Showcase ─────────── */}
      <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:py-12 border-t border-slate-800/80">
        
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono text-xs font-bold uppercase">
            <GitMerge className="h-3.5 w-3.5" />
            <span>End-to-End Harmonization Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            How BHU-DRISHTI Resolves Land Discrepancies
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            From multi-source data ingestion to transparent AI conflict detection and immutable officer verification.
          </p>
        </div>

        {/* 5-Step Pipeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          
          {/* Step 1 */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-1.5">
            <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-mono text-xs">
              01
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-white">Multi-Source Ingest</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Ingests Revenue cadastre, Municipal GIS vectors, and Drone orthophotos into standardized CRS EPSG:32643.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-teal-500/40 transition-all space-y-1.5">
            <div className="h-7 w-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold font-mono text-xs">
              02
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-white">Entity Matching</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Matches parcels across differing legacy schema using IoU polygon overlap, topological Hausdorff metrics, and fuzzy address tags.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-red-500/40 transition-all space-y-1.5">
            <div className="h-7 w-7 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-bold font-mono text-xs">
              03
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-white">Conflict Detection</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Flags spatial discrepancies, area variations (25 m²), boundary overlaps, and building setback violations in 3D.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 transition-all space-y-1.5">
            <div className="h-7 w-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold font-mono text-xs">
              04
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-white">AI Synthesis</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              AI evaluates temporal confidence, sensor GSD precision, and legal precedents to recommend a candidate spatial truth.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-1.5">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono text-xs">
              05
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-white">Human Sign-off</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Officer verifies (`Accept` / `Modify` / `Reject`), digitally signs the dossier, and commits to an immutable audit ledger.
            </p>
          </div>

        </div>

      </section>

      {/* ── 4. Bottom Hero CTA ────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:py-12 text-center">
        <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/95 p-6 sm:p-10 shadow-[0_0_60px_rgba(20,184,166,0.15)] backdrop-blur-2xl space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-3.5 py-1 font-mono text-xs font-bold text-teal-300">
            <Box className="h-4 w-4 text-teal-400" />
            <span>ENTER THE URBAN DIGITAL TWIN</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Ready to Experience Autonomous
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
              Geospatial Land Intelligence?
            </span>
          </h2>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            Ingest multi-source cadastre, detect parcel deviations, explore exploded BIM interiors, and certify legally harmonized land records.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Button
              asChild
              size="default"
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs px-6 py-5 rounded-xl shadow-lg shadow-teal-500/30 transition cursor-pointer"
            >
              <Link to={isAuthenticated ? "/intelligence-3d" : "/login"}>
                <Box className="mr-2 h-4 w-4" /> {isAuthenticated ? "LAUNCH 3D INTELLIGENCE" : "SIGN IN / ENTER 3D TWIN"}
              </Link>
            </Button>

            <Button
              asChild
              size="default"
              variant="outline"
              className="border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-xs px-6 py-5 rounded-xl transition cursor-pointer"
            >
              <Link to={isAuthenticated ? "/overview" : "/login"}>
                <Workflow className="mr-2 h-4 w-4 text-teal-400" /> OPEN COMMAND WORKSPACE
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 5. Core Pillars ─────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 transition space-y-3">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Box className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-white">3D Urban Digital Twin</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Interactive 3D building extrusions, BIM cutaways, floor-by-floor inspection, and synchronized 2D/3D spatial boundaries.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition space-y-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Workflow className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-white">Transparent Harmonization</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Every reconciliation step logs exact provenance, sensor timestamps, and explainable AI metrics so officers follow every deduction.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-white">Human Verification First</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Automated suggestions remain proposals until confirmed by an authorized revenue/GIS officer before committing to the master ledger.
            </p>
          </div>
        </div>

        <DemoDataNotice className="mt-8" />
      </section>

      {/* ── 5. Platform Footer ──────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 py-8 text-xs font-mono text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:px-6 md:text-left">
          <BhuSetuLogo compact />
          <p>
            BHU-DRISHTI 3D — National Urban Land Intelligence & Geospatial Harmonization Platform.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hover:text-teal-400 transition-colors">Sign In</Link>
            <span>·</span>
            <Link to="/overview" className="hover:text-teal-400 transition-colors">Overview</Link>
            <span>·</span>
            <Link to="/intelligence-3d" className="hover:text-teal-400 transition-colors">3D Scene</Link>
          </div>
        </div>
      </footer>

      {/* Floating PWA Glassmorphism Notification */}
      <FloatingPWAInstallNotification />

    </div>
  );
}
