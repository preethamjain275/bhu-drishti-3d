"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ThreeDBuilding,
  ThreeDParcel,
  LayerVisibilityState,
  VisualMode,
  FloorInfo,
  RoomInfo,
} from "@/lib/maps/cesium/types";
import { MOCK_3D_BUILDINGS, MOCK_3D_PARCELS, MOCK_BUILDING_FLOORS, CITY_BUILDINGS_CATALOG, CITY_PARCELS_CATALOG } from "@/lib/mock/threeD";
import {
  Building2,
  MapPin,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Box,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Radio,
  Camera,
  ScanLine,
  Navigation,
  Gauge,
  BatteryCharging,
  Wifi,
  Sun,
  Moon,
  Sunset,
  Crosshair,
  SlidersHorizontal,
  Disc,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CesiumUrbanDigitalTwinProps {
  selectedBuilding: ThreeDBuilding | null;
  selectedParcel: ThreeDParcel | null;
  selectedFloor: number | null;
  selectedRoom: string | null;
  onSelectBuilding: (building: ThreeDBuilding) => void;
  onSelectFloor: (floorNumber: number | null) => void;
  onSelectRoom: (roomId: string | null) => void;
  layers: LayerVisibilityState;
  isCutaway: boolean;
}

export type DroneFlightMode = "FPV" | "NADIR" | "ORBIT" | "THERMAL" | "NVG";
export type DroneSensorMode = "RGB_4K" | "THERMAL_IR" | "LIDAR_ELEV" | "SURVEY_GRID" | "NVG";

export function CesiumUrbanDigitalTwin({
  selectedBuilding,
  selectedParcel,
  selectedFloor = 4,
  selectedRoom = "4B",
  onSelectBuilding,
  onSelectFloor,
  onSelectRoom,
  layers,
  isCutaway = true,
}: CesiumUrbanDigitalTwinProps) {
  // Navigation & Zoom
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [cameraPan, setCameraPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Drone View States
  const [isDroneView, setIsDroneView] = useState<boolean>(true);
  const [droneMode, setDroneMode] = useState<DroneFlightMode>("FPV");
  const [sensorMode, setSensorMode] = useState<DroneSensorMode>("RGB_4K");
  const [droneAltitude, setDroneAltitude] = useState<number>(250);
  const [gimbalPitch, setGimbalPitch] = useState<number>(-65);
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [isOrbiting, setIsOrbiting] = useState<boolean>(false);
  const [orbitAngle, setOrbitAngle] = useState<number>(0);
  const [snapshotFlash, setSnapshotFlash] = useState<boolean>(false);
  const [timeOfDay, setTimeOfDay] = useState<"DAY" | "DUSK" | "NIGHT">("NIGHT");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hover states
  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(null);

  const activeBuilding = selectedBuilding || MOCK_3D_BUILDINGS[0]!;
  const floors = activeBuilding.floors || MOCK_BUILDING_FLOORS;
  const activeFloorNumber = selectedFloor ?? 4;
  const activeFloor = floors.find((f) => f.floorNumber === activeFloorNumber) || floors[1]!;
  const activeRoomId = selectedRoom ?? "4B";

  // Auto Orbit loop
  useEffect(() => {
    let animationFrame: number;
    if (isOrbiting || droneMode === "ORBIT") {
      const step = () => {
        setOrbitAngle((prev) => (prev + 0.4) % 360);
        animationFrame = requestAnimationFrame(step);
      };
      animationFrame = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isOrbiting, droneMode]);

  // Flash Snapshot Handler
  const handleCaptureSnapshot = () => {
    setSnapshotFlash(true);
    setToastMessage(`📸 Georeferenced Ortho Captured: 13.0827° N, 80.2707° E @ ${droneAltitude}m ALT`);
    setTimeout(() => setSnapshotFlash(false), 250);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - cameraPan.x, y: e.clientY - cameraPan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setCameraPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Dynamic transforms based on flight modes
  const scenePerspectiveTransform = useMemo(() => {
    if (!isDroneView) {
      return `scale(${zoomLevel}) translate(${cameraPan.x}px, ${cameraPan.y}px)`;
    }
    if (droneMode === "NADIR") {
      return `scale(${zoomLevel * 1.08}) rotateX(32deg) rotateZ(0deg) translate(${cameraPan.x}px, ${cameraPan.y}px)`;
    }
    if (droneMode === "ORBIT") {
      return `scale(${zoomLevel}) rotateX(${Math.abs(gimbalPitch) * 0.4}deg) rotateZ(${orbitAngle * 0.15}deg) translate(${cameraPan.x}px, ${cameraPan.y}px)`;
    }
    // FPV or Thermal
    const pitchOffset = (gimbalPitch + 65) * 0.25;
    return `scale(${zoomLevel * (droneAltitude === 45 ? 1.25 : droneAltitude === 120 ? 1.1 : droneAltitude === 250 ? 1.0 : 0.88)}) rotateX(${pitchOffset}deg) translate(${cameraPan.x}px, ${cameraPan.y}px)`;
  }, [isDroneView, droneMode, zoomLevel, gimbalPitch, orbitAngle, droneAltitude, cameraPan]);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={cn(
        "relative w-full h-full overflow-hidden flex items-center justify-center select-none font-sans cursor-grab active:cursor-grabbing transition-colors duration-700",
        sensorMode === "NVG"
          ? "bg-[#02140a]"
          : sensorMode === "THERMAL_IR" || droneMode === "THERMAL"
          ? "bg-[#180324]"
          : timeOfDay === "DAY"
          ? "bg-[#0f172a]"
          : timeOfDay === "DUSK"
          ? "bg-[#1e132b]"
          : "bg-[#050b14]"
      )}
    >
      {/* ── Shutter Snapshot Flash ─────────────────────────────────────────── */}
      {snapshotFlash && (
        <div className="absolute inset-0 z-50 bg-white pointer-events-none animate-out fade-out duration-300" />
      )}

      {/* ── Toast Notification ─────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl bg-slate-950/95 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <Camera className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. Top Drone Control Bar & Mode Toggles ─────────────────────────── */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
        {/* Drone HUD Master Switch */}
        <button
          onClick={() => setIsDroneView(!isDroneView)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs font-black transition-all shadow-md",
            isDroneView
              ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-teal-500/25 ring-2 ring-cyan-400"
              : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          )}
          title="Toggle Live Drone Recon Camera HUD"
        >
          <Radio className={cn("h-3.5 w-3.5", isDroneView && "animate-pulse text-slate-950")} />
          <span>{isDroneView ? "DRONE CAM ACTIVE" : "ENABLE DRONE CAM"}</span>
        </button>

        {isDroneView && (
          <>
            <div className="h-4 w-px bg-slate-800" />

            {/* Flight Mode Pills */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 text-[11px] font-mono">
              {(
                [
                  { id: "FPV", label: "FPV Scan", icon: Navigation },
                  { id: "NADIR", label: "Nadir 90°", icon: Compass },
                  { id: "ORBIT", label: "360° Orbit", icon: RotateCcw },
                  { id: "THERMAL", label: "Thermal IR", icon: Sparkles },
                  { id: "NVG", label: "Night NVG", icon: Eye },
                ] as const
              ).map((m) => {
                const Icon = m.icon;
                const isActive = droneMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setDroneMode(m.id);
                      if (m.id === "THERMAL") setSensorMode("THERMAL_IR");
                      else if (m.id === "NVG") setSensorMode("NVG");
                      else setSensorMode("RGB_4K");
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all",
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    )}
                  >
                    <Icon className={cn("h-3 w-3", isActive && "text-cyan-400")} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-px bg-slate-800" />

            {/* Altitude Quick Toggles */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 text-[10px] font-mono font-bold">
              <span className="text-slate-500 px-1">ALT:</span>
              {[45, 120, 250, 480].map((alt) => (
                <button
                  key={alt}
                  onClick={() => setDroneAltitude(alt)}
                  className={cn(
                    "px-2 py-0.5 rounded transition",
                    droneAltitude === alt
                      ? "bg-teal-500 text-slate-950 font-black shadow"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  {alt}m
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-slate-800" />

            {/* Shutter Snapshot */}
            <button
              onClick={handleCaptureSnapshot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-black transition shadow-lg shadow-amber-500/20 active:scale-95"
              title="Capture Georeferenced Orthophoto"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>SNAP</span>
            </button>
          </>
        )}
      </div>

      {/* ── 2. Top-Right Telemetry & Sensor Controls ───────────────────────── */}
      <div className="absolute top-3 right-4 z-30 flex items-center gap-2 font-mono text-xs">
        {/* Lighting Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-950/90 border border-slate-800 p-1 rounded-xl shadow-xl">
          <button
            onClick={() => setTimeOfDay("DAY")}
            className={cn(
              "p-1.5 rounded-lg transition",
              timeOfDay === "DAY" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-400 hover:text-white"
            )}
            title="Daytime Sun Lighting"
          >
            <Sun className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setTimeOfDay("DUSK")}
            className={cn(
              "p-1.5 rounded-lg transition",
              timeOfDay === "DUSK" ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" : "text-slate-400 hover:text-white"
            )}
            title="Dusk Twilight Golden Hour"
          >
            <Sunset className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setTimeOfDay("NIGHT")}
            className={cn(
              "p-1.5 rounded-lg transition",
              timeOfDay === "NIGHT" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-white"
            )}
            title="Night Digital Twin Grid"
          >
            <Moon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── 3. Realistic Drone Camera HUD Overlays & Reticles ───────────────── */}
      {isDroneView && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden font-mono select-none">
          {/* Outer Lens Vignette & Scanlines */}
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              sensorMode === "NVG"
                ? "bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,40,10,0.85)_100%)] mix-blend-multiply opacity-95"
                : sensorMode === "THERMAL_IR"
                ? "bg-[radial-gradient(circle_at_center,transparent_45%,rgba(30,0,50,0.75)_100%)] opacity-85"
                : "bg-[radial-gradient(circle_at_center,transparent_50%,rgba(2,6,23,0.7)_100%)] opacity-70"
            )}
          />

          {/* Subdued CRT Scanline Texture */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

          {/* 4 Corner Framing Brackets */}
          <div className="absolute top-5 left-5 w-12 h-12 border-t-2 border-l-2 border-cyan-400/80" />
          <div className="absolute top-5 right-5 w-12 h-12 border-t-2 border-r-2 border-cyan-400/80" />
          <div className="absolute bottom-16 left-5 w-12 h-12 border-b-2 border-l-2 border-cyan-400/80" />
          <div className="absolute bottom-16 right-5 w-12 h-12 border-b-2 border-r-2 border-cyan-400/80" />

          {/* Top HUD Telemetry Banner */}
          <div className="absolute top-16 left-8 flex items-center gap-4 text-xs font-bold text-cyan-300 drop-shadow-md">
            {/* Flashing Recording Dot */}
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-xl">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-400">REC [00:14:32.08]</span>
              <span className="text-slate-400 text-[10px]">4K 60FPS</span>
            </div>

            {/* GPS & RTK Accuracy */}
            <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-xl text-slate-300 text-[11px]">
              <div className="flex items-center gap-1 text-emerald-400">
                <Wifi className="h-3 w-3" />
                <span>RTK FIX 0.02m</span>
              </div>
              <div className="flex items-center gap-1 text-teal-300">
                <Navigation className="h-3 w-3" />
                <span>18 SATS</span>
              </div>
              <div className="flex items-center gap-1 text-amber-300">
                <BatteryCharging className="h-3 w-3" />
                <span>94% (28 MIN)</span>
              </div>
            </div>
          </div>

          {/* Center Tactical Flight Crosshair & Rangefinder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Outer Cyan Horizon Ring */}
              <div
                className="w-48 h-48 rounded-full border border-cyan-400/30 flex items-center justify-center transition-transform duration-300"
                style={{
                  transform: `rotate(${orbitAngle}deg)`,
                }}
              >
                {/* Heading Markers */}
                <span className="absolute top-1 font-mono text-[9px] text-cyan-300 font-black">N</span>
                <span className="absolute right-1 font-mono text-[9px] text-cyan-300 font-bold">E</span>
                <span className="absolute bottom-1 font-mono text-[9px] text-cyan-300 font-bold">S</span>
                <span className="absolute left-1 font-mono text-[9px] text-cyan-300 font-bold">W</span>
                
                {/* Degree tick notches */}
                <div className="w-full h-px bg-cyan-400/20" />
                <div className="h-full w-px bg-cyan-400/20 absolute" />
              </div>

              {/* Artificial Horizon Pitch Ladder */}
              <div className="absolute flex flex-col items-center gap-3 opacity-60">
                <div className="w-16 h-0.5 bg-cyan-400 flex justify-between px-1 text-[8px] text-cyan-300">
                  <span>+10</span>
                  <span>+10</span>
                </div>
                <div className="w-24 h-0.5 bg-cyan-300" />
                <div className="w-16 h-0.5 bg-cyan-400 flex justify-between px-1 text-[8px] text-cyan-300">
                  <span>-10</span>
                  <span>-10</span>
                </div>
              </div>

              {/* Center Target Box */}
              <div className="w-10 h-10 border border-cyan-400 rounded flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              {/* Live Laser Rangefinder Readout */}
              <div className="absolute top-28 bg-slate-950/90 border border-cyan-400/60 px-2.5 py-1 rounded-md text-[10px] font-black text-cyan-300 shadow-xl flex items-center gap-1.5">
                <Crosshair className="h-3 w-3 text-cyan-400" />
                <span>LASER LOCK: 84.6m · GIMBAL {gimbalPitch}°</span>
              </div>
            </div>
          </div>

          {/* Left Vertical Flight Gauge (Altitude Tape) */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 bg-slate-950/80 border border-slate-800 p-3 rounded-2xl">
            <span className="text-[10px] font-black text-teal-400">ALT (m)</span>
            <div className="h-36 w-2 bg-slate-800 rounded-full overflow-hidden flex flex-col justify-end p-0.5">
              <div
                className="w-full bg-gradient-to-t from-teal-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ height: `${(droneAltitude / 480) * 100}%` }}
              />
            </div>
            <span className="font-mono text-xs font-black text-white">{droneAltitude}m</span>
          </div>

          {/* Right Vertical Flight Gauge (Speed & Pitch Tape) */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 bg-slate-950/80 border border-slate-800 p-3 rounded-2xl">
            <span className="text-[10px] font-black text-cyan-400">SPEED</span>
            <div className="h-36 w-2 bg-slate-800 rounded-full overflow-hidden flex flex-col justify-end p-0.5">
              <div className="w-full bg-cyan-400 rounded-full h-1/2" />
            </div>
            <span className="font-mono text-xs font-black text-white">18.4 km/h</span>
          </div>

          {/* Bottom Telemetry Strip */}
          <div className="absolute bottom-5 left-8 right-8 flex items-center justify-between text-[11px] text-slate-300 font-bold bg-slate-950/80 border border-slate-800/80 px-4 py-2 rounded-xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="text-teal-300">GSD: 2.5 cm/px</span>
              <span className="text-slate-600">|</span>
              <span>SENSOR: SONY ILX-R1 61MP</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-300">OVERLAP: 80% FWD / 70% SIDE</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-amber-400">NAKSHA COMPLIANT (SVAMITVA SPEC)</span>
              <span className="text-slate-600">|</span>
              <span>COORDS: 13.0827°N, 80.2707°E</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Central 3D Scene Viewport (SVG / Isometric Digital Twin) ───── */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-center transition-all duration-700 ease-out"
        style={{
          transform: scenePerspectiveTransform,
          filter:
            sensorMode === "NVG"
              ? "hue-rotate(90deg) contrast(1.4) brightness(1.1)"
              : sensorMode === "THERMAL_IR" || droneMode === "THERMAL"
              ? "invert(0.15) hue-rotate(240deg) saturate(2.5)"
              : timeOfDay === "DAY"
              ? "brightness(1.15) saturate(1.1) contrast(1.05)"
              : timeOfDay === "DUSK"
              ? "brightness(0.95) saturate(1.35) sepia(0.15) hue-rotate(-12deg)"
              : "none",
        }}
      >
        <svg
          viewBox="0 0 1200 700"
          className="w-full h-full overflow-visible select-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Neon Glow Filters */}
            <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="building-neon" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Gradients for 3D Building Extrusions */}
            <linearGradient id="facade-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={timeOfDay === "DAY" ? "#475569" : "#1e293b"} stopOpacity="0.95" />
              <stop offset="100%" stopColor={timeOfDay === "DAY" ? "#334155" : "#0f172a"} stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="selected-facade-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="selected-facade-right" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0e7490" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="floor-interior-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="active-floor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* ── Ground Satellite Plane & Roads ────────────────────────────── */}
          {layers.roadNetwork && (
            <g className="opacity-75">
              {/* Main Arterial Roadways */}
              <path d="M 50 550 L 550 320 L 1150 550" stroke={timeOfDay === "DAY" ? "#64748b" : "#334155"} strokeWidth="24" fill="none" />
              <path d="M 50 550 L 550 320 L 1150 550" stroke="#f8fafc" strokeWidth="1.5" strokeDasharray="12 12" fill="none" opacity="0.6" />
              <path d="M 600 200 L 550 320 L 550 680" stroke={timeOfDay === "DAY" ? "#64748b" : "#334155"} strokeWidth="20" fill="none" />
              <path d="M 600 200 L 550 320 L 550 680" stroke="#f8fafc" strokeWidth="1.5" strokeDasharray="10 10" fill="none" opacity="0.6" />
            </g>
          )}

          {/* ── Surrounding City Buildings (Mid-Rise & High-Rise Matrix) ─── */}
          {layers.buildings3d && (
            <g className="transition-opacity duration-300">
              {/* Left Background City Cluster */}
              <g className="opacity-80">
                {/* Block 1 */}
                <polygon points="180,320 250,285 300,310 230,345" fill={timeOfDay === "DAY" ? "#64748b" : "#334155"} />
                <polygon points="180,320 230,345 230,420 180,395" fill={timeOfDay === "DAY" ? "#475569" : "#1e293b"} />
                <polygon points="230,345 300,310 300,385 230,420" fill={timeOfDay === "DAY" ? "#334155" : "#0f172a"} />

                {/* Block 2 */}
                <polygon points="280,260 340,230 380,250 320,280" fill={timeOfDay === "DAY" ? "#94a3b8" : "#475569"} />
                <polygon points="280,260 320,280 320,350 280,330" fill={timeOfDay === "DAY" ? "#64748b" : "#334155"} />
                <polygon points="320,280 380,250 380,320 320,350" fill={timeOfDay === "DAY" ? "#475569" : "#1e293b"} />

                {/* Block 3 */}
                <polygon points="120,400 170,375 210,395 160,420" fill={timeOfDay === "DAY" ? "#64748b" : "#334155"} />
                <polygon points="120,400 160,420 160,480 120,460" fill={timeOfDay === "DAY" ? "#475569" : "#1e293b"} />
                <polygon points="160,420 210,395 210,455 160,480" fill={timeOfDay === "DAY" ? "#334155" : "#0f172a"} />
              </g>

              {/* Right Background City Cluster */}
              <g className="opacity-80">
                {/* Block 4 */}
                <polygon points="780,280 850,245 900,270 830,305" fill={timeOfDay === "DAY" ? "#64748b" : "#334155"} />
                <polygon points="780,280 830,305 830,380 780,355" fill={timeOfDay === "DAY" ? "#475569" : "#1e293b"} />
                <polygon points="830,305 900,270 900,345 830,380" fill={timeOfDay === "DAY" ? "#334155" : "#0f172a"} />

                {/* Block 5 Tower */}
                <polygon points="880,230 940,200 980,220 920,250" fill={timeOfDay === "DAY" ? "#94a3b8" : "#475569"} />
                <polygon points="880,230 920,250 920,330 880,310" fill={timeOfDay === "DAY" ? "#64748b" : "#334155"} />
                <polygon points="920,250 980,220 980,300 920,330" fill={timeOfDay === "DAY" ? "#475569" : "#1e293b"} />

                {/* Block 6 Foreground */}
                <polygon points="740,430 820,390 880,420 800,460" fill={timeOfDay === "DAY" ? "#64748b" : "#334155"} />
                <polygon points="740,430 800,460 800,540 740,510" fill={timeOfDay === "DAY" ? "#475569" : "#1e293b"} />
                <polygon points="800,460 880,420 880,500 800,540" fill={timeOfDay === "DAY" ? "#334155" : "#0f172a"} />
              </g>

              {/* Green Park / Trees Area */}
              <g className="opacity-60">
                <ellipse cx="440" cy="510" rx="60" ry="30" fill="#065f46" />
                <circle cx="420" cy="500" r="10" fill="#10b981" />
                <circle cx="445" cy="495" r="12" fill="#059669" />
                <circle cx="460" cy="510" r="9" fill="#10b981" />
                <circle cx="430" cy="520" r="8" fill="#047857" />
              </g>
            </g>
          )}

          {/* ── Glowing Parcel Boundary on Ground (P-10482) ─────────────── */}
          {layers.revenueParcels && (
            <g className="animate-in fade-in duration-500">
              {/* Outer Ground Polygon Ring */}
              <polygon
                points="360,540 580,410 780,520 560,650"
                fill="#0ea5e9"
                fillOpacity="0.15"
                stroke="#00ffff"
                strokeWidth="2.5"
                filter="url(#cyan-glow)"
                className="transition-all duration-300"
              />
              
              {/* Cadastral Corner Vertex Markers */}
              <circle cx="360" cy="540" r="4" fill="#00ffff" />
              <circle cx="580" cy="410" r="4" fill="#00ffff" />
              <circle cx="780" cy="520" r="4" fill="#00ffff" />
              <circle cx="560" cy="650" r="4" fill="#00ffff" />

              {/* Grid Subdivisions inside Parcel */}
              <line x1="470" y1="475" x2="670" y2="585" stroke="#00ffff" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
              <line x1="470" y1="595" x2="670" y2="465" stroke="#00ffff" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
            </g>
          )}

          {/* ── 3D EXPLODED / CUTAWAY BUILDING MODEL (B-10482) ─────────── */}
          <g className="cursor-pointer group" filter="url(#building-neon)">
            {/* Base Shadow */}
            <polygon points="440,540 560,470 680,540 560,610" fill="#000000" fillOpacity="0.6" />

            {/* Render 5 Floors + Ground in Exploded Isometric Perspective */}
            {floors.map((floor) => {
              const isFloorActive = activeFloorNumber === floor.floorNumber;
              const baseFloorY = 480 - floor.floorNumber * 52;
              const explodedOffset = isFloorActive ? -20 : 0;
              const floorY = baseFloorY + explodedOffset;

              const leftX = 450;
              const centerX = 560;
              const rightX = 670;
              const floorHeight = 44;

              return (
                <g
                  key={floor.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectFloor(floor.floorNumber);
                  }}
                  className="transition-all duration-500 ease-out"
                >
                  {/* Left Facade Wall */}
                  <polygon
                    points={`${leftX},${floorY} ${centerX},${floorY + 55} ${centerX},${floorY + 55 + floorHeight} ${leftX},${floorY + floorHeight}`}
                    fill={isFloorActive ? "url(#selected-facade-left)" : "url(#facade-grad)"}
                    stroke={isFloorActive ? "#38bdf8" : "#475569"}
                    strokeWidth={isFloorActive ? 2 : 1}
                  />

                  {/* Cutaway Interior Slice (Exposing Rooms & Interior Warm Light) */}
                  <polygon
                    points={`${centerX},${floorY + 55} ${rightX},${floorY} ${rightX},${floorY + floorHeight} ${centerX},${floorY + 55 + floorHeight}`}
                    fill={isFloorActive ? "url(#active-floor-grad)" : "url(#floor-interior-grad)"}
                    stroke={isFloorActive ? "#00ffff" : "#f59e0b"}
                    strokeWidth={isFloorActive ? 2.5 : 1}
                    fillOpacity={isFloorActive ? 0.9 : 0.6}
                  />

                  {/* Floor Slab Top Surface */}
                  <polygon
                    points={`${leftX},${floorY} ${centerX},${floorY - 55} ${rightX},${floorY} ${centerX},${floorY + 55}`}
                    fill={isFloorActive ? "#0284c7" : "#334155"}
                    stroke={isFloorActive ? "#38bdf8" : "#64748b"}
                    strokeWidth={isFloorActive ? 2 : 1}
                    fillOpacity={isFloorActive ? 0.9 : 0.75}
                  />

                  {/* Floor Level Label Pill on Facade (5F, 4F, 3F, 2F, 1F, G) */}
                  <g transform={`translate(${leftX + 25}, ${floorY + 26})`}>
                    <rect
                      x="0"
                      y="0"
                      width="26"
                      height="18"
                      rx="4"
                      fill={isFloorActive ? "#00ffff" : "#0f172a"}
                      stroke={isFloorActive ? "#ffffff" : "#475569"}
                      strokeWidth="1"
                    />
                    <text
                      x="13"
                      y="12"
                      textAnchor="middle"
                      className={cn(
                        "font-mono text-[10px] font-extrabold",
                        isFloorActive ? "fill-slate-950 font-black" : "fill-slate-200"
                      )}
                    >
                      {floor.label}
                    </text>
                  </g>

                  {/* Interior Room Partition Slices (Inside Floor) */}
                  {isFloorActive && (
                    <g className="animate-in fade-in duration-300">
                      {/* Room 4A Slice */}
                      <line x1={centerX + 25} y1={floorY + 40} x2={centerX + 25} y2={floorY + 75} stroke="#38bdf8" strokeWidth="2" />
                      {/* Room 4B Slice (Active Highlight) */}
                      <rect
                        x={centerX + 32}
                        y={floorY + 22}
                        width="42"
                        height="32"
                        rx="3"
                        fill="#38bdf8"
                        fillOpacity="0.4"
                        stroke="#00ffff"
                        strokeWidth="2"
                      />
                      <text x={centerX + 53} y={floorY + 42} textAnchor="middle" className="fill-white font-mono text-[9px] font-bold">
                        4B
                      </text>
                      {/* Room 4C Slice */}
                      <line x1={centerX + 80} y1={floorY + 20} x2={centerX + 80} y2={floorY + 55} stroke="#38bdf8" strokeWidth="1.5" />
                    </g>
                  )}
                </g>
              );
            })}

            {/* Outer Cyan Bounding Wireframe Box */}
            <g className="pointer-events-none">
              <line x1="450" y1="180" x2="450" y2="520" stroke="#00ffff" strokeWidth="2" strokeDasharray="4 3" opacity="0.7" />
              <line x1="560" y1="235" x2="560" y2="575" stroke="#00ffff" strokeWidth="2.5" />
              <line x1="670" y1="180" x2="670" y2="520" stroke="#00ffff" strokeWidth="2" strokeDasharray="4 3" opacity="0.7" />
            </g>
          </g>

          {/* ── ON-SCREEN CALLOUT BADGES WITH LEADER LINES ─────────────── */}
          {/* 1. Top Building Badge */}
          <g className="animate-in slide-in-from-top-4 duration-500">
            <polyline
              points="560,180 560,120 440,85"
              fill="none"
              stroke="#00ffff"
              strokeWidth="1.8"
            />
            <circle cx="560" cy="180" r="4" fill="#00ffff" className="animate-ping" />
            <circle cx="560" cy="180" r="3" fill="#00ffff" />

            {/* Building Tooltip Card */}
            <foreignObject x="220" y="45" width="220" height="90">
              <div className="bg-slate-950/95 border border-cyan-400/80 rounded-xl p-2.5 shadow-2xl backdrop-blur-md text-slate-100 font-mono text-[10px] space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                    <Building2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs">Building ID: B-10482</span>
                    <div className="text-[9px] text-teal-300">Type: Commercial</div>
                  </div>
                </div>
                <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
                  <span>Height: 18.5 m</span>
                  <span className="font-bold text-cyan-300">Floors: 5</span>
                </div>
              </div>
            </foreignObject>
          </g>

          {/* 2. Ground Parcel Badge */}
          <g className="animate-in slide-in-from-left-4 duration-500">
            <polyline
              points="360,540 280,500 240,500"
              fill="none"
              stroke="#00ffff"
              strokeWidth="1.8"
            />
            <circle cx="360" cy="540" r="4" fill="#00ffff" />

            {/* Parcel Tooltip Card */}
            <foreignObject x="40" y="450" width="200" height="85">
              <div className="bg-slate-950/95 border border-cyan-400/80 rounded-xl p-2.5 shadow-2xl backdrop-blur-md text-slate-100 font-mono text-[10px] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-cyan-300 text-xs">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Parcel ID: P-10482</span>
                </div>
                <div className="text-slate-300">Area: 1,200 m²</div>
                <div className="text-[9px] text-emerald-400 font-bold">Status: Matched (3 sources)</div>
              </div>
            </foreignObject>
          </g>

          {/* 3. Selected Room Badge (Floor 4 -> Room 4B) */}
          <g className="animate-in slide-in-from-right-4 duration-500">
            <polyline
              points="610,270 700,290 730,290"
              fill="none"
              stroke="#00ffff"
              strokeWidth="1.8"
            />
            <circle cx="610" cy="270" r="4" fill="#00ffff" className="animate-pulse" />

            {/* Room Tooltip Card */}
            <foreignObject x="730" y="260" width="160" height="65">
              <div className="bg-slate-950/95 border border-cyan-400 rounded-xl p-2 shadow-2xl backdrop-blur-md text-slate-100 font-mono text-[10px] space-y-0.5">
                <div className="font-bold text-cyan-300 text-xs">Room 4B</div>
                <div className="text-slate-200">Office Space (280 m²)</div>
                <div className="text-[8px] text-emerald-400">● Active Selected Space</div>
              </div>
            </foreignObject>
          </g>
        </svg>
      </div>

      {/* ── 5. Floating Zoom & Orientation Controls ────────────────────────── */}
      <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2 font-mono text-xs">
        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 2.0))}
          className="h-8 w-8 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-teal-400 transition shadow-lg"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.6))}
          className="h-8 w-8 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-teal-400 transition shadow-lg"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            setZoomLevel(1);
            setCameraPan({ x: 0, y: 0 });
            setDroneAltitude(250);
            setGimbalPitch(-65);
          }}
          className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-1 text-slate-300 hover:text-white hover:border-teal-400 transition shadow-lg text-[10px]"
          title="Reset Camera"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}

