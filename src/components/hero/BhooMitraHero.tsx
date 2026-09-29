"use client";

import React, { useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Box,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  GitMerge,
  Scale,
  Brain,
  FileText,
  Clock,
  Radar,
  Workflow,
  Radio,
  Navigation,
  Compass,
  CheckCircle2,
  Eye,
  Activity,
  Maximize2,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthProvider";

export function BhooMitraHero() {
  const { isAuthenticated } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      // Fast, smooth playback speed for dynamic geospatial footage
      videoRef.current.playbackRate = 1.35;
    }
  }, []);

  const primaryTarget = isAuthenticated ? "/intelligence-3d" : "/login";
  const secondaryTarget = isAuthenticated ? "/overview" : "/login";
  const harmonizationTarget = isAuthenticated ? "/harmonization" : "/login";

  return (
    <section className="relative min-h-[88vh] lg:min-h-[90vh] w-full overflow-hidden flex flex-col justify-between pt-6 pb-10 px-4 md:px-8 font-sans select-none">
      
      {/* ── 1. 100% High-Clarity Crisp Video Background (No Blur, Full Brightness) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src="/map.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover opacity-95 sm:opacity-100 filter contrast-105 saturate-110 brightness-95 transition-opacity duration-500"
        />
        {/* Soft, non-blur gradient framing to blend into header and footer seamlessly */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/75 via-transparent to-[#030712]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#030712]/20 to-[#030712]/80" />
        
        {/* Corner HUD Framing Accents */}
        <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-teal-400/70" />
        <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-teal-400/70" />
        <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-teal-400/70" />
        <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-teal-400/70" />
      </div>

      {/* ── 2. Top Telemetry Pill ────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex items-center justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/50 bg-slate-950/75 px-3.5 py-1 font-mono text-[11px] font-semibold text-teal-300 shadow-xl backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
          </span>
          <span className="tracking-wider uppercase">SIH26013 · NAKSHA URBAN LAND INTELLIGENCE</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-400 font-mono">EPSG:32643</span>
        </div>
      </div>

      {/* ── 3. Central Heroic Copy & Clean Resized Headline ──────────────────── */}
      <div className="relative z-10 mx-auto max-w-4xl text-center space-y-4 my-auto pt-2">
        
        {/* Sub-label */}
        <div className="flex items-center justify-center gap-1.5 font-mono text-[11px] font-bold tracking-wider text-cyan-300 uppercase">
          <Radio className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
          <span>BHU-DRISHTI · AUTONOMOUS GEOSPATIAL HARMONIZATION</span>
        </div>

        {/* Clean, Well-Proportioned Headline (Small & Crisp) */}
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]">
          ONE SPATIAL TRUTH.
          <span className="block mt-1 bg-gradient-to-r from-teal-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
            BUILT FROM MANY SOURCES.
          </span>
        </h1>

        {/* Narrative Subtitle */}
        <p className="mx-auto max-w-xl text-xs sm:text-sm md:text-base text-slate-200 font-sans leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
          Automated integration, 3D entity matching, and intelligent conflict harmonization for fragmented urban land records under the NAKSHA programme.
        </p>

        {/* Compact Source Badges */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 font-mono text-[11px]">
          <div className="rounded-lg border border-cyan-500/40 bg-slate-950/75 px-2.5 py-1 text-cyan-200 backdrop-blur-md shadow">
            🏛️ REVENUE
          </div>
          <span className="text-teal-400 font-bold">+</span>
          <div className="rounded-lg border border-teal-500/40 bg-slate-950/75 px-2.5 py-1 text-teal-200 backdrop-blur-md shadow">
            🗺️ MUNICIPAL
          </div>
          <span className="text-teal-400 font-bold">+</span>
          <div className="rounded-lg border border-indigo-500/40 bg-slate-950/75 px-2.5 py-1 text-indigo-200 backdrop-blur-md shadow">
            📡 SURVEY
          </div>
          <span className="text-teal-400 font-bold">+</span>
          <div className="rounded-lg border border-amber-500/40 bg-slate-950/75 px-2.5 py-1 text-amber-200 backdrop-blur-md shadow">
            🚁 DRONE
          </div>
          <span className="text-cyan-400 font-bold">→</span>
          <div className="rounded-lg border border-teal-400 bg-teal-500/25 px-2.5 py-1 text-white font-bold backdrop-blur-md shadow-[0_0_12px_rgba(20,184,166,0.3)]">
            ✨ BHU-DRISHTI 3D
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            asChild
            size="default"
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs px-6 py-5 rounded-xl shadow-[0_0_25px_rgba(20,184,166,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Link to={primaryTarget}>
              {isAuthenticated ? (
                <>
                  <Box className="mr-1.5 h-4 w-4" /> LAUNCH 3D DRONE RECON
                </>
              ) : (
                <>
                  <LogIn className="mr-1.5 h-4 w-4" /> SIGN IN / LAUNCH RECON
                </>
              )}
            </Link>
          </Button>

          <Button
            asChild
            size="default"
            variant="outline"
            className="border-slate-600 bg-slate-950/80 hover:bg-slate-900 text-slate-100 font-bold text-xs px-6 py-5 rounded-xl backdrop-blur-md transition transform hover:-translate-y-0.5 cursor-pointer shadow-lg"
          >
            <Link to={secondaryTarget}>
              <Workflow className="mr-1.5 h-4 w-4 text-teal-400" /> EXPLORE DIGITAL TWIN
            </Link>
          </Button>

          <Button
            asChild
            size="default"
            variant="ghost"
            className="border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-teal-300 font-mono text-xs px-5 py-5 rounded-xl backdrop-blur-md transition cursor-pointer"
          >
            <Link to={harmonizationTarget}>
              <GitMerge className="mr-1.5 h-4 w-4 text-emerald-400" /> HARMONIZATION
            </Link>
          </Button>
        </div>
      </div>

      {/* ── 4. Bottom Live Intelligence HUD Cards (Compact & Glassmorphic) ─── */}
      <div className="relative z-10 mx-auto w-full max-w-5xl pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 font-mono">
          
          {/* Card 1 */}
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-teal-500/50 backdrop-blur-md shadow-lg transition space-y-0.5">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>BUILDINGS</span>
              <Building2 className="h-3.5 w-3.5 text-teal-400" />
            </div>
            <div className="text-lg font-black text-white">12,482</div>
            <div className="text-[9px] text-teal-300 font-sans">100% 3D BIM Modelled</div>
          </div>

          {/* Card 2 */}
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-cyan-500/50 backdrop-blur-md shadow-lg transition space-y-0.5">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>PARCELS</span>
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="text-lg font-black text-cyan-300">8,214</div>
            <div className="text-[9px] text-cyan-300 font-sans">Cadastral Sync Verified</div>
          </div>

          {/* Card 3 */}
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-emerald-500/50 backdrop-blur-md shadow-lg transition space-y-0.5">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>AI CONFIDENCE</span>
              <Brain className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-black text-emerald-400">99.4%</div>
            <div className="text-[9px] text-emerald-300 font-sans">Automated Match Rate</div>
          </div>

          {/* Card 4 */}
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-amber-500/50 backdrop-blur-md shadow-lg transition space-y-0.5">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>DRONE SENSORS</span>
              <Radar className="h-3.5 w-3.5 text-amber-400 animate-spin-slow" />
            </div>
            <div className="text-lg font-black text-amber-300">4K + LiDAR</div>
            <div className="text-[9px] text-amber-300 font-sans">2.5cm/px Ground GSD</div>
          </div>

        </div>
      </div>

    </section>
  );
}
