import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect, useMemo } from "react";
import {
  Building2,
  MapPin,
  Layers,
  Scale,
  ShieldAlert,
  FileText,
  Brain,
  Lightbulb,
  UserCheck,
  History,
  Sparkles,
  CloudSun,
  Flame,
  ArrowDownRight,
  Compass,
  Plus,
  Minus,
  Eye,
  Box,
  CheckCircle2,
  X,
  Globe,
  Trees,
  Waypoints,
  Layers as LayersIcon,
  Crosshair,
  Home,
  Check,
  Edit3,
  XCircle,
  Clock,
  Download,
  Maximize2,
  ChevronRight,
  HelpCircle,
  ShieldCheck,
  MousePointerClick,
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
  Disc,
  RotateCcw,
  FolderOpen,
  Trash2,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CITY_BUILDINGS_CATALOG,
  CITY_PARCELS_CATALOG,
  DynamicCityBuilding,
  DynamicCityParcel,
} from "@/lib/mock/threeD";

export const Route = createFileRoute("/_app/overview")({
  validateSearch: (search: Record<string, unknown>) => search,
  head: () => ({
    meta: [
      { title: "Overview — 3D Urban Land Intelligence | Bhu Drishti 3D" },
      {
        name: "description",
        content: "Live 3D Urban GIS & Digital Twin Command Center for Bhu Drishti 3D Geospatial Harmonization.",
      },
    ],
  }),
  component: OverviewPage,
});

type WorkflowStage =
  | "BUILDING"
  | "PARCEL"
  | "SOURCES"
  | "COMPARE"
  | "CONFLICT"
  | "EVIDENCE"
  | "EXPLAIN"
  | "RECOMMEND"
  | "VERIFY"
  | "AUDIT";

type SelectionType = "BUILDING" | "PARCEL" | null;
export type DroneFlightMode = "FPV" | "NADIR" | "ORBIT" | "THERMAL" | "NVG";

export interface SavedDroneSnapshot {
  id: string;
  timestamp: string;
  timeFormatted: string;
  coordinates: string;
  altitude: number;
  mode: string;
  gsd: string;
  targetTitle: string;
  type: string;
}

function OverviewPage() {
  const navigate = useNavigate();

  // Workflow Stage
  const [currentStage, setCurrentStage] = useState<WorkflowStage>("BUILDING");

  // Dynamic Selection State
  const [selectionType, setSelectionType] = useState<SelectionType>("BUILDING");
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>("B-10482");
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>("P-10482");
  const [selectedFloor, setSelectedFloor] = useState<number | null>(4);
  const [selectedRoom, setSelectedRoom] = useState<string | null>("4B");
  const [isExploded, setIsExploded] = useState<boolean>(true);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Drone Camera View & Flight Modes
  const [isDroneView, setIsDroneView] = useState<boolean>(true);
  const [droneMode, setDroneMode] = useState<DroneFlightMode>("FPV");
  const [droneAltitude, setDroneAltitude] = useState<number>(250);
  const [gimbalPitch, setGimbalPitch] = useState<number>(-65);
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [snapshotFlash, setSnapshotFlash] = useState<boolean>(false);
  const [timeOfDay, setTimeOfDay] = useState<"DAY" | "DUSK" | "NIGHT">("NIGHT");
  const [orbitAngle, setOrbitAngle] = useState<number>(0);

  // Modals & Panels UI State
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isLayersCollapsed, setIsLayersCollapsed] = useState<boolean>(false);
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState<boolean>(false);

  // Stored / Saved Georeferenced Snapshots
  const [savedSnapshots, setSavedSnapshots] = useState<SavedDroneSnapshot[]>([
    {
      id: "SNAP-10928-01",
      timestamp: "2026-09-28T14:32:00Z",
      timeFormatted: "14:32:00 IST",
      coordinates: "12.9716° N, 77.5946° E",
      altitude: 250,
      mode: "FPV Survey Scan",
      gsd: "2.5 cm/px",
      targetTitle: "Building B-10482 (Commercial High-Rise)",
      type: "RGB 4K Orthomosaic",
    },
    {
      id: "SNAP-10928-02",
      timestamp: "2026-09-28T15:10:45Z",
      timeFormatted: "15:10:45 IST",
      coordinates: "12.9721° N, 77.5952° E",
      altitude: 120,
      mode: "Nadir 90° Ortho",
      gsd: "1.2 cm/px",
      targetTitle: "Parcel P-10482 (Boundary Conflict Zone)",
      type: "Cadastral Overlay Grid",
    },
  ]);

  // Auto Orbit Loop
  useEffect(() => {
    let animationFrame: number;
    if (droneMode === "ORBIT") {
      const step = () => {
        setOrbitAngle((prev) => (prev + 0.35) % 360);
        animationFrame = requestAnimationFrame(step);
      };
      animationFrame = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [droneMode]);

  // Hover Tooltip State
  const [hoveredFeature, setHoveredFeature] = useState<{
    id: string;
    title: string;
    subtitle: string;
    x: number;
    y: number;
  } | null>(null);

  // Active Map Layers
  const [layers, setLayers] = useState({
    wardBoundary: true,
    municipalLimits: true,
    revenueParcels: true,
    municipalParcels: true,
    surveyImagery: true,
    spatialDifferences: true,
    buildings3d: true,
    buildingInteriors: true,
    roadNetwork: true,
    terrain: true,
    satelliteImagery: true,
  });

  const activeBuilding: DynamicCityBuilding | null = selectedBuildingId
    ? CITY_BUILDINGS_CATALOG[selectedBuildingId] || null
    : null;

  const activeParcel: DynamicCityParcel | null = selectedParcelId
    ? CITY_PARCELS_CATALOG[selectedParcelId] || null
    : null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Capture Snapshot and Save to stored array
  const handleCaptureSnapshot = () => {
    setSnapshotFlash(true);
    const newSnap: SavedDroneSnapshot = {
      id: `SNAP-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString(),
      coordinates: "12.9716° N, 77.5946° E",
      altitude: droneAltitude,
      mode: droneMode === "FPV" ? "FPV Survey Scan" : droneMode === "NADIR" ? "Nadir 90° Ortho" : droneMode === "ORBIT" ? "360° Orbit Recon" : droneMode === "THERMAL" ? "Thermal LiDAR Scan" : "Night Vision NVG",
      gsd: droneAltitude <= 45 ? "0.8 cm/px" : droneAltitude <= 120 ? "1.5 cm/px" : "2.5 cm/px",
      targetTitle: activeBuilding ? `Building ${activeBuilding.id}` : activeParcel ? `Parcel ${activeParcel.parcelId}` : "Central Urban Cadastre",
      type: droneMode === "THERMAL" ? "Thermal Elevation Heatmap" : droneMode === "NVG" ? "Night Vision Surveillance" : "High-Res Orthophoto",
    };

    setSavedSnapshots((prev) => [newSnap, ...prev]);
    showToast(`📸 Saved to Gallery: ${newSnap.id} @ ${droneAltitude}m ALT (${newSnap.coordinates})`);
    setTimeout(() => setSnapshotFlash(false), 250);
  };

  const handleDownloadSnapshot = (snap: SavedDroneSnapshot) => {
    // Generate a simple simulated download of snapshot metadata / PNG
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snap, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${snap.id}_georeferenced_metadata.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`⬇ Downloaded metadata file for ${snap.id}`);
  };

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      showToast(`Layer "${key}" ${next[key] ? "Enabled" : "Disabled"}`);
      return next;
    });
  };

  // Perspective 3D transforms for Drone Flight Modes
  const sceneTransform = useMemo(() => {
    if (!isDroneView) return `scale(${zoomScale})`;
    if (droneMode === "NADIR") return `scale(${zoomScale * 1.05}) rotateX(32deg) rotateZ(0deg)`;
    if (droneMode === "ORBIT") return `scale(${zoomScale}) rotateX(${Math.abs(gimbalPitch) * 0.35}deg) rotateZ(${orbitAngle * 0.12}deg)`;
    const pitchOffset = (gimbalPitch + 65) * 0.2;
    return `scale(${zoomScale * (droneAltitude === 45 ? 1.2 : droneAltitude === 120 ? 1.08 : droneAltitude === 250 ? 1.0 : 0.9)}) rotateX(${pitchOffset}deg)`;
  }, [isDroneView, droneMode, zoomScale, gimbalPitch, orbitAngle, droneAltitude]);

  // Feature Picking Handlers
  const handleSelectBuilding = (buildingId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const b = CITY_BUILDINGS_CATALOG[buildingId];
    if (!b) return;

    setSelectionType("BUILDING");
    setSelectedBuildingId(buildingId);
    setSelectedParcelId(b.parcelId);
    setSelectedFloor(b.floors >= 4 ? 4 : b.floors);
    setSelectedRoom(null);
    setCurrentStage("BUILDING");
    showToast(`Building ${b.id} (${b.type}, ${b.height}m) selected on Parcel ${b.parcelId}`);
  };

  const handleSelectParcel = (parcelId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const p = CITY_PARCELS_CATALOG[parcelId];
    if (!p) return;

    setSelectionType("PARCEL");
    setSelectedParcelId(parcelId);
    setSelectedBuildingId(p.associatedBuildingId || null);
    setCurrentStage("PARCEL");
    showToast(`Parcel ${p.parcelId} (${p.landUse}, ${p.area.toLocaleString()} m²) selected`);
  };

  const handleClearSelection = () => {
    setSelectionType(null);
    setSelectedBuildingId(null);
    setSelectedParcelId(null);
    setSelectedFloor(null);
    setSelectedRoom(null);
    showToast("Selection cleared — Click any building or parcel to inspect.");
  };

  const handleSelectFloor = (num: number) => {
    setSelectedFloor(num);
    setIsExploded(true);
    showToast(`Floor ${num}F isolated in 3D exploded view.`);
  };

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoom(roomId);
    showToast(`Room ${roomId} isolated.`);
  };

  const currentBuildingFloors = activeBuilding ? activeBuilding.floorData : [];
  const currentFloorData = currentBuildingFloors.find((f) => f.floorNumber === selectedFloor) || currentBuildingFloors[0];

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full bg-[#030712] text-slate-100 overflow-hidden relative font-sans select-none">
      
      {/* ── 1. Top Sub-Header Bar with Key KPI Metrics ──────────────────────── */}
      <div className="h-12 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-30 font-sans">
        
        {/* Left: Overview Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
            <div className="h-6 w-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-sm">
              <LayersIcon className="h-3.5 w-3.5" />
            </div>
            <span>Overview</span>
          </div>
        </div>

        {/* Center/Right: 4 Metric Badges */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 text-xs font-mono">
          {/* Harmony Rate */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
            <div className="relative h-5 w-5 flex items-center justify-center">
              <svg className="h-5 w-5 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="4"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray="86, 100"
                />
              </svg>
              <span className="absolute text-[8px] font-bold text-emerald-400">86</span>
            </div>
            <div>
              <span className="font-bold text-white text-[11px]">86% harmony rate</span>
              <span className="text-[9px] text-slate-400 block leading-tight font-sans">Across all sources</span>
            </div>
          </div>

          {/* Conflicts Detected */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
            <div className="h-6 w-6 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Flame className="h-3.5 w-3.5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-red-400 text-[11px]">+12 today</span>
              <span className="text-[9px] text-slate-400 block leading-tight font-sans">Conflicts detected</span>
            </div>
          </div>

          {/* Conflicts Resolved */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
            <div className="h-6 w-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ArrowDownRight className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="font-bold text-emerald-400 text-[11px]">-5 since yesterday</span>
              <span className="text-[9px] text-slate-400 block leading-tight font-sans">Conflicts resolved</span>
            </div>
          </div>

          {/* Weather info */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
            <CloudSun className="h-4 w-4 text-amber-400" />
            <div>
              <span className="font-bold text-slate-200 text-[11px]">Bengaluru, KA</span>
              <span className="text-[9px] text-slate-400 block leading-tight font-sans">28°C Partly Cloudy</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── 2. Central Interactive 3D Urban GIS & Floating Panels ────────────── */}
      <div
        className="relative flex-1 w-full overflow-hidden flex items-center justify-center bg-[#050b14] cursor-default"
        onClick={handleClearSelection}
      >
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-teal-950/90 border border-teal-400 text-teal-200 text-xs font-mono shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 pointer-events-none">
            <CheckCircle2 className="h-4 w-4 text-teal-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Hover Floating Tooltip */}
        {hoveredFeature && (
          <div
            className="absolute z-40 px-2.5 py-1.5 rounded-lg bg-slate-950/90 border border-cyan-400/80 text-white text-[11px] font-mono shadow-2xl pointer-events-none transition-all duration-75"
            style={{
              left: Math.min(hoveredFeature.x + 15, window.innerWidth - 180),
              top: Math.max(hoveredFeature.y - 45, 20),
            }}
          >
            <div className="font-bold text-cyan-300">{hoveredFeature.title}</div>
            <div className="text-[9px] text-slate-400">{hoveredFeature.subtitle}</div>
          </div>
        )}

        {/* ── LEFT HUD: MAP LAYERS PANEL ────────────────────────────────────── */}
        {isLayersCollapsed ? (
          <button
            onClick={() => setIsLayersCollapsed(false)}
            className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold shadow-2xl backdrop-blur-xl hover:bg-slate-900 transition cursor-pointer"
            title="Expand Map Layers"
          >
            <LayersIcon className="h-4 w-4 text-cyan-400" />
            <span>Map Layers</span>
          </button>
        ) : (
          <div
            className="absolute top-4 left-4 z-20 w-[230px] xl:w-[250px] bg-slate-950/95 border border-slate-800/90 backdrop-blur-2xl rounded-2xl p-3 shadow-2xl text-slate-200 space-y-2.5 font-sans max-h-[calc(100vh-10rem)] overflow-y-auto no-scrollbar animate-in fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white tracking-wider font-mono uppercase">
                <LayersIcon className="h-3.5 w-3.5 text-cyan-400" />
                <span>Map Layers</span>
              </div>
              <button
                onClick={() => setIsLayersCollapsed(true)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white text-xs transition cursor-pointer"
                title="Minimize Layers Panel"
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </button>
            </div>

          {/* 1. Administrative */}
          <div className="space-y-1">
            <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Globe className="h-3 w-3 text-cyan-400" />
              <span>Administrative</span>
            </div>
            
            <button
              onClick={() => toggleLayer("wardBoundary")}
              className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-xs transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="text-[11px] text-slate-200">Ward boundary</span>
              </div>
              <div className={cn("h-4 w-7 rounded-full transition-colors flex items-center p-0.5", layers.wardBoundary ? "bg-teal-500 justify-end" : "bg-slate-700 justify-start")}>
                <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
              </div>
            </button>

            <button
              onClick={() => toggleLayer("municipalLimits")}
              className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-xs transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="text-[11px] text-slate-200">Municipal limits</span>
              </div>
              <div className={cn("h-4 w-7 rounded-full transition-colors flex items-center p-0.5", layers.municipalLimits ? "bg-teal-500 justify-end" : "bg-slate-700 justify-start")}>
                <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
              </div>
            </button>
          </div>

          {/* 2. Land */}
          <div className="space-y-1">
            <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="h-3 w-3 text-emerald-400" />
              <span>Land</span>
            </div>

            <button
              onClick={() => toggleLayer("revenueParcels")}
              className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-xs transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-slate-200">Revenue parcels</span>
              </div>
              <div className={cn("h-4 w-7 rounded-full transition-colors flex items-center p-0.5", layers.revenueParcels ? "bg-teal-500 justify-end" : "bg-slate-700 justify-start")}>
                <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
              </div>
            </button>

            <button
              onClick={() => toggleLayer("municipalParcels")}
              className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-xs transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="text-[11px] text-slate-200">Municipal parcels</span>
              </div>
              <div className={cn("h-4 w-7 rounded-full transition-colors flex items-center p-0.5", layers.municipalParcels ? "bg-teal-500 justify-end" : "bg-slate-700 justify-start")}>
                <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
              </div>
            </button>

            <button
              onClick={() => toggleLayer("surveyImagery")}
              className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-xs transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                <span className="text-[11px] text-slate-200">Survey / Imagery</span>
              </div>
              <div className={cn("h-4 w-7 rounded-full transition-colors flex items-center p-0.5", layers.surveyImagery ? "bg-teal-500 justify-end" : "bg-slate-700 justify-start")}>
                <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
              </div>
            </button>

            <button
              onClick={() => toggleLayer("spatialDifferences")}
              className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-xs transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="text-[11px] text-slate-200">Spatial differences</span>
              </div>
              <div className={cn("h-4 w-7 rounded-full transition-colors flex items-center p-0.5", layers.spatialDifferences ? "bg-teal-500 justify-end" : "bg-slate-700 justify-start")}>
                <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
              </div>
            </button>
          </div>

          {/* 3. Built Environment */}
          <div className="space-y-1">
            <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="h-3 w-3 text-cyan-400" />
              <span>Built Environment</span>
            </div>

            <button
              onClick={() => toggleLayer("buildings3d")}
              className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-xs transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-3 w-3 text-cyan-400" />
                <span className="text-[11px] text-slate-200">3D Buildings</span>
              </div>
              <div className={cn("h-4 w-7 rounded-full transition-colors flex items-center p-0.5", layers.buildings3d ? "bg-teal-500 justify-end" : "bg-slate-700 justify-start")}>
                <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
              </div>
            </button>

            <button
              onClick={() => toggleLayer("buildingInteriors")}
              className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-xs transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Home className="h-3 w-3 text-indigo-400" />
                <span className="text-[11px] text-slate-200">Building interiors</span>
              </div>
              <div className={cn("h-4 w-7 rounded-full transition-colors flex items-center p-0.5", layers.buildingInteriors ? "bg-teal-500 justify-end" : "bg-slate-700 justify-start")}>
                <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
              </div>
            </button>

            <button
              onClick={() => toggleLayer("roadNetwork")}
              className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-xs transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Waypoints className="h-3 w-3 text-slate-400" />
                <span className="text-[11px] text-slate-200">Road network</span>
              </div>
              <div className={cn("h-4 w-7 rounded-full transition-colors flex items-center p-0.5", layers.roadNetwork ? "bg-teal-500 justify-end" : "bg-slate-700 justify-start")}>
                <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
              </div>
            </button>
          </div>

          {/* 4. Additional */}
          <div className="space-y-1">
            <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Trees className="h-3 w-3 text-emerald-400" />
              <span>Additional</span>
            </div>

            <button
              onClick={() => toggleLayer("terrain")}
              className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-xs transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 text-emerald-400" />
                <span className="text-[11px] text-slate-200">Terrain</span>
              </div>
              <div className={cn("h-4 w-7 rounded-full transition-colors flex items-center p-0.5", layers.terrain ? "bg-teal-500 justify-end" : "bg-slate-700 justify-start")}>
                <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
              </div>
            </button>

            <button
              onClick={() => toggleLayer("satelliteImagery")}
              className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-xs transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Eye className="h-3 w-3 text-purple-400" />
                <span className="text-[11px] text-slate-200">Satellite imagery</span>
              </div>
              <div className={cn("h-4 w-7 rounded-full transition-colors flex items-center p-0.5", layers.satelliteImagery ? "bg-teal-500 justify-end" : "bg-slate-700 justify-start")}>
                <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
              </div>
            </button>
          </div>

          {/* Bottom Mini-Map Radar Compass */}
          <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 relative overflow-hidden flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-cyan-400 animate-spin-slow" />
              <div className="text-[9px] font-mono text-slate-400">
                <span>N 12.9716°</span>
                <span className="block">E 77.5946°</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomScale((s) => Math.min(s + 0.15, 1.5))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
              </button>
              <button
                onClick={() => setZoomScale((s) => Math.max(s - 0.15, 0.8))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
              >
                <Minus className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

        {/* ── 1. Top Drone Control Bar & Mode Toggles ─────────────────────────── */}
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drone HUD Master Switch */}
          <button
            onClick={() => {
              const next = !isDroneView;
              setIsDroneView(next);
              showToast(next ? "🛸 Drone Recon Camera HUD Activated" : "Drone Recon HUD Deactivated");
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs font-black transition-all shadow-md cursor-pointer",
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
                        if (m.id === "NADIR") setGimbalPitch(-90);
                        else if (m.id === "FPV") setGimbalPitch(-45);
                        else setGimbalPitch(-65);
                        showToast(`Flight Mode: ${m.label}`);
                      }}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer",
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
                    onClick={() => {
                      setDroneAltitude(alt);
                      showToast(`Drone Altitude set to ${alt}m AGL`);
                    }}
                    className={cn(
                      "px-2 py-0.5 rounded transition cursor-pointer",
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-black transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
                title="Capture Georeferenced Orthophoto"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>SNAP</span>
              </button>

              {/* Saved Snapshots Gallery */}
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 font-mono text-xs font-bold transition shadow-sm cursor-pointer"
                title="View Saved Drone Snapshots Gallery"
              >
                <FolderOpen className="h-3.5 w-3.5 text-cyan-400" />
                <span>SAVED ({savedSnapshots.length})</span>
              </button>
            </>
          )}

          {/* Lighting Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => {
                setTimeOfDay("DAY");
                showToast("☀️ Daytime Sunlight Lighting Activated");
              }}
              className={cn(
                "p-1.5 rounded-lg transition cursor-pointer",
                timeOfDay === "DAY" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-400 hover:text-white"
              )}
              title="Daytime Sun Lighting"
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                setTimeOfDay("DUSK");
                showToast("🌅 Dusk Twilight Golden Hour Activated");
              }}
              className={cn(
                "p-1.5 rounded-lg transition cursor-pointer",
                timeOfDay === "DUSK" ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" : "text-slate-400 hover:text-white"
              )}
              title="Dusk Twilight Golden Hour"
            >
              <Sunset className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                setTimeOfDay("NIGHT");
                showToast("🌙 Night Cyber Grid Activated");
              }}
              className={cn(
                "p-1.5 rounded-lg transition cursor-pointer",
                timeOfDay === "NIGHT" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-white"
              )}
              title="Night Digital Twin Grid"
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ── Shutter Snapshot Flash ─────────────────────────────────────────── */}
        {snapshotFlash && (
          <div className="absolute inset-0 z-50 bg-white pointer-events-none animate-out fade-out duration-300" />
        )}

        {/* ── Realistic Drone Camera HUD Overlays & Reticles ───────────────── */}
        {isDroneView && (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden font-mono select-none">
            {/* Outer Lens Vignette & Scanlines */}
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                droneMode === "NVG"
                  ? "bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,40,10,0.85)_100%)] mix-blend-multiply opacity-95"
                  : droneMode === "THERMAL"
                  ? "bg-[radial-gradient(circle_at_center,transparent_45%,rgba(30,0,50,0.75)_100%)] opacity-85"
                  : "bg-[radial-gradient(circle_at_center,transparent_50%,rgba(2,6,23,0.7)_100%)] opacity-70"
              )}
            />

            {/* Subdued CRT Scanline Texture */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

            {/* 4 Corner Framing Brackets */}
            <div className="absolute top-16 left-5 w-12 h-12 border-t-2 border-l-2 border-cyan-400/80" />
            <div className="absolute top-16 right-5 w-12 h-12 border-t-2 border-r-2 border-cyan-400/80" />
            <div className="absolute bottom-16 left-5 w-12 h-12 border-b-2 border-l-2 border-cyan-400/80" />
            <div className="absolute bottom-16 right-5 w-12 h-12 border-b-2 border-r-2 border-cyan-400/80" />

            {/* Top HUD Telemetry Banner */}
            <div className="absolute top-20 left-8 flex items-center gap-4 text-xs font-bold text-cyan-300 drop-shadow-md">
              {/* Flashing Recording Dot */}
              <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-xl">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-red-400">REC [00:12:44.18]</span>
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
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative flex items-center justify-center">
                {/* Outer Cyan Horizon Ring */}
                <div
                  className="w-48 h-48 rounded-full border border-cyan-400/30 flex items-center justify-center transition-transform duration-300"
                  style={{ transform: `rotate(${orbitAngle}deg)` }}
                >
                  <span className="absolute top-1 font-mono text-[9px] text-cyan-300 font-black">N</span>
                  <span className="absolute right-1 font-mono text-[9px] text-cyan-300 font-bold">E</span>
                  <span className="absolute bottom-1 font-mono text-[9px] text-cyan-300 font-bold">S</span>
                  <span className="absolute left-1 font-mono text-[9px] text-cyan-300 font-bold">W</span>
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
            <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 bg-slate-950/80 border border-slate-800 p-3 rounded-2xl pointer-events-auto">
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
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 bg-slate-950/80 border border-slate-800 p-3 rounded-2xl pointer-events-auto">
              <span className="text-[10px] font-black text-cyan-400">SPEED</span>
              <div className="h-36 w-2 bg-slate-800 rounded-full overflow-hidden flex flex-col justify-end p-0.5">
                <div className="w-full bg-cyan-400 rounded-full h-1/2" />
              </div>
              <span className="font-mono text-xs font-black text-white">18.4 km/h</span>
            </div>
          </div>
        )}

        {/* ── 3D URBAN GIS / DIGITAL TWIN SCENE CANVAS ───────────────────────── */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-all duration-500 ease-out"
          style={{
            transform: sceneTransform,
            filter:
              droneMode === "NVG"
                ? "hue-rotate(90deg) contrast(1.4) brightness(1.1)"
                : droneMode === "THERMAL"
                ? "invert(0.15) hue-rotate(240deg) saturate(2.5)"
                : timeOfDay === "DAY"
                ? "brightness(1.15) saturate(1.1) contrast(1.05)"
                : timeOfDay === "DUSK"
                ? "brightness(0.95) saturate(1.35) sepia(0.15) hue-rotate(-12deg)"
                : "none",
          }}
        >
          {/* Atmospheric Layer */}
          <div className="absolute inset-0 pointer-events-none transition-all duration-700">
            <div
              className={cn(
                "absolute top-0 left-0 right-0 h-52 transition-all duration-700",
                timeOfDay === "DAY"
                  ? "bg-gradient-to-b from-sky-400/25 via-sky-600/10 to-transparent"
                  : timeOfDay === "DUSK"
                  ? "bg-gradient-to-b from-amber-500/30 via-rose-700/15 to-transparent"
                  : "bg-gradient-to-b from-[#0284c715] via-[#0369a10c] to-transparent"
              )}
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          </div>

          <svg
            viewBox="0 0 1200 700"
            className="w-full h-full overflow-visible select-none"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <filter id="overview-cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="overview-neon" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Lake / Water Body at North */}
            <path
              d="M 100 80 Q 400 40 700 90 T 1150 70 L 1200 0 L 0 0 Z"
              fill="#075985"
              fillOpacity="0.25"
            />

            {/* Roads Network */}
            {layers.roadNetwork && (
              <g opacity="0.75">
                <path d="M 0 540 L 560 310 L 1200 540" stroke="#334155" strokeWidth="26" fill="none" />
                <path d="M 0 540 L 560 310 L 1200 540" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="14 14" fill="none" opacity="0.7" />
                <path d="M 640 160 L 560 310 L 560 700" stroke="#334155" strokeWidth="22" fill="none" />
                <path d="M 640 160 L 560 310 L 560 700" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="12 12" fill="none" opacity="0.7" />
              </g>
            )}

            {/* Tree Canopies & Green Zones */}
            <g opacity="0.7">
              <ellipse cx="430" cy="510" rx="40" ry="20" fill="#065f46" />
              <circle cx="415" cy="505" r="10" fill="#10b981" />
              <circle cx="435" cy="500" r="12" fill="#059669" />
              <circle cx="445" cy="510" r="9" fill="#10b981" />
            </g>

            {/* ── ALL DYNAMICALLY PICKABLE PARCELS ON GROUND ────────────────── */}
            {Object.values(CITY_PARCELS_CATALOG).map((parcel) => {
              const isSelected = selectedParcelId === parcel.parcelId;
              const hasConflict = !!parcel.conflictType;

              return (
                <g
                  key={parcel.parcelId}
                  className="cursor-pointer transition-all duration-200"
                  onClick={(e) => handleSelectParcel(parcel.parcelId, e)}
                  onMouseEnter={(e) =>
                    setHoveredFeature({
                      id: parcel.parcelId,
                      title: `Parcel ${parcel.parcelId}`,
                      subtitle: `${parcel.landUse} · ${parcel.area.toLocaleString()} m²`,
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <polygon
                    points={parcel.polygonPoints}
                    fill={parcel.color}
                    fillOpacity={isSelected ? 0.35 : 0.12}
                    stroke={isSelected ? "#00ffff" : hasConflict ? "#f87171" : parcel.color}
                    strokeWidth={isSelected ? 3 : 1.5}
                    filter={isSelected ? "url(#overview-cyan-glow)" : undefined}
                    className={isSelected ? "animate-pulse" : ""}
                  />

                  {/* Parcel Vertex Dots */}
                  {isSelected && (
                    <>
                      <circle cx={parcel.centroid.x} cy={parcel.centroid.y} r="3" fill="#00ffff" />
                    </>
                  )}
                </g>
              );
            })}

            {/* ── ALL DYNAMICALLY PICKABLE 3D BUILDINGS ────────────────────── */}
            {layers.buildings3d &&
              Object.values(CITY_BUILDINGS_CATALOG).map((bldg) => {
                const isSelected = selectedBuildingId === bldg.id;
                const isCutawayActive = isSelected && isExploded;

                // If this is the active selected cutaway building, render exploded floor storeys
                if (isCutawayActive) {
                  return (
                    <g
                      key={bldg.id}
                      filter="url(#overview-neon)"
                      className="cursor-pointer group"
                      onClick={(e) => handleSelectBuilding(bldg.id, e)}
                    >
                      {bldg.floorData.map((fl) => {
                        const isFlActive = selectedFloor === fl.floorNumber;
                        const baseY = 410 - fl.floorNumber * 44;
                        const offsetY = isFlActive ? -16 : 0;
                        const y = baseY + offsetY;

                        return (
                          <g
                            key={fl.label}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectBuilding(bldg.id);
                              handleSelectFloor(fl.floorNumber);
                            }}
                            className="transition-all duration-300"
                          >
                            {/* Roof / Slab */}
                            <polygon
                              points={`450,${y} 500,${y - 30} 545,${y} 495,${y + 30}`}
                              fill={isFlActive ? "#38bdf8" : "#0284c7"}
                              stroke={isFlActive ? "#ffffff" : "#00ffff"}
                              strokeWidth={isFlActive ? 2 : 1}
                            />
                            {/* Left Wall */}
                            <polygon
                              points={`450,${y} 495,${y + 30} 495,${y + 68} 450,${y + 38}`}
                              fill={isFlActive ? "#0284c7" : "#0369a1"}
                              stroke="#38bdf8"
                              strokeWidth="1"
                            />
                            {/* Right Wall / Glass Panes */}
                            <polygon
                              points={`495,${y + 30} 545,${y} 545,${y + 38} 495,${y + 68}`}
                              fill={isFlActive ? "#06b6d4" : "#0891b2"}
                              stroke="#00ffff"
                              strokeWidth="1"
                            />

                            {/* Floor Label Tag */}
                            <g transform={`translate(460, ${y + 14})`}>
                              <rect
                                x="0"
                                y="0"
                                width="20"
                                height="14"
                                rx="3"
                                fill={isFlActive ? "#00ffff" : "#0f172a"}
                              />
                              <text
                                x="10"
                                y="10"
                                textAnchor="middle"
                                className={cn(
                                  "font-mono text-[8px] font-bold",
                                  isFlActive ? "fill-slate-950 font-black" : "fill-slate-200"
                                )}
                              >
                                {fl.label}
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </g>
                  );
                }

                // Standard 3D Extruded Building Mesh
                const p = bldg.svgPoints.split(" ").map((pt) => pt.split(",").map(Number));
                const x0 = (p[0] && p[0][0]) ?? bldg.centroid.x - 30;
                const y0 = (p[0] && p[0][1]) ?? bldg.centroid.y;
                const x1 = (p[1] && p[1][0]) ?? bldg.centroid.x;
                const y1 = (p[1] && p[1][1]) ?? bldg.centroid.y - 20;
                const x2 = (p[2] && p[2][0]) ?? bldg.centroid.x + 30;
                const y2 = (p[2] && p[2][1]) ?? bldg.centroid.y;
                const x3 = (p[3] && p[3][0]) ?? bldg.centroid.x;
                const y3 = (p[3] && p[3][1]) ?? bldg.centroid.y + 20;
                const h = Math.round(bldg.height * 2.2);

                return (
                  <g
                    key={bldg.id}
                    className="cursor-pointer transition-all duration-200"
                    onClick={(e) => handleSelectBuilding(bldg.id, e)}
                    onMouseEnter={(e) =>
                      setHoveredFeature({
                        id: bldg.id,
                        title: `Building ${bldg.id}`,
                        subtitle: `${bldg.type} · ${bldg.floors} Floors · ${bldg.height}m`,
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    {/* Roof */}
                    <polygon
                      points={`${x0},${y0 - h} ${x1},${y1 - h} ${x2},${y2 - h} ${x3},${y3 - h}`}
                      fill={isSelected ? "#38bdf8" : bldg.color}
                      fillOpacity={isSelected ? 0.95 : 0.8}
                      stroke={isSelected ? "#ffffff" : "#475569"}
                      strokeWidth={isSelected ? 2 : 1}
                      filter={isSelected ? "url(#overview-cyan-glow)" : undefined}
                    />
                    {/* Left Wall */}
                    <polygon
                      points={`${x0},${y0 - h} ${x3},${y3 - h} ${x3},${y3} ${x0},${y0}`}
                      fill={isSelected ? "#0284c7" : "#334155"}
                      stroke={isSelected ? "#38bdf8" : "#1e293b"}
                      strokeWidth="1"
                    />
                    {/* Right Wall */}
                    <polygon
                      points={`${x3},${y3 - h} ${x2},${y2 - h} ${x2},${y2} ${x3},${y3}`}
                      fill={isSelected ? "#0ea5e9" : "#1e293b"}
                      stroke={isSelected ? "#38bdf8" : "#0f172a"}
                      strokeWidth="1"
                    />
                  </g>
                );
              })}

            {/* ── ON-SCREEN HOLOGRAPHIC CALLOUT LABELS (Dynamically Anchored) */}
            {activeBuilding && (
              <g
                transform={`translate(${activeBuilding.centroid.x - 30}, ${activeBuilding.centroid.y - 180})`}
                className="animate-in fade-in duration-300"
              >
                <polyline
                  points="35,55 35,28 0,28"
                  fill="none"
                  stroke="#00ffff"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <circle cx="35" cy="55" r="3" fill="#00ffff" />

                <rect
                  x="-90"
                  y="10"
                  width="130"
                  height="36"
                  rx="8"
                  fill="#0b1329"
                  fillOpacity="0.9"
                  stroke="#00ffff"
                  strokeWidth="1.5"
                  filter="url(#overview-cyan-glow)"
                />
                <g transform="translate(-80, 24)">
                  <rect x="0" y="0" width="14" height="14" rx="3" fill="#0284c7" />
                  <text x="7" y="10" textAnchor="middle" fill="#ffffff" className="font-mono text-[8px] font-bold">
                    B
                  </text>
                </g>
                <text x="-58" y="27" fill="#ffffff" className="font-mono text-xs font-bold">
                  {activeBuilding.id}
                </text>
                <text x="-58" y="38" fill="#38bdf8" className="font-mono text-[9px]">
                  ({activeBuilding.type})
                </text>
              </g>
            )}

            {/* Parcel ID Callout Anchored to active parcel */}
            {activeParcel && (
              <g
                transform={`translate(${activeParcel.centroid.x + 80}, ${activeParcel.centroid.y - 20})`}
                className="animate-in fade-in duration-300"
              >
                <polyline
                  points="-80,20 -20,20 15,20"
                  fill="none"
                  stroke="#00ffff"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <circle cx="-80" cy="20" r="3" fill="#00ffff" />

                <rect
                  x="15"
                  y="0"
                  width="165"
                  height="50"
                  rx="10"
                  fill="#0b1329"
                  fillOpacity="0.92"
                  stroke="#00ffff"
                  strokeWidth="1.5"
                  filter="url(#overview-cyan-glow)"
                />
                <circle cx="32" cy="18" r="5" fill="#00ffff" />
                <text x="44" y="18" fill="#ffffff" className="font-mono text-[11px] font-bold">
                  Parcel ID : {activeParcel.parcelId}
                </text>
                <text x="44" y="30" fill="#38bdf8" className="font-mono text-[10px]">
                  Area : {activeParcel.area.toLocaleString()} m²
                </text>
                <text x="44" y="42" fill="#94a3b8" className="font-mono text-[9px]">
                  Status : {activeParcel.status}
                </text>
              </g>
            )}

          </svg>
        </div>

        {/* 3D / Perspective Navigation Controls */}
        <div
          className={cn(
            "absolute top-4 z-20 flex flex-col gap-1.5 font-mono text-xs transition-all duration-300",
            isDetailsCollapsed ? "right-44" : "right-[325px] xl:right-[355px]"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => showToast("3D Perspective View active")}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-teal-300 font-bold hover:bg-slate-800 shadow-md cursor-pointer"
          >
            3D
          </button>
          <button
            onClick={() => showToast("Switched Layer Overlay")}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 shadow-md cursor-pointer"
          >
            <Layers className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (activeBuilding) {
                showToast(`Camera focused on ${activeBuilding.id}`);
              } else {
                showToast("Camera reset to central urban core");
              }
            }}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 shadow-md cursor-pointer"
          >
            <Crosshair className="h-4 w-4" />
          </button>
        </div>

        {/* ── RIGHT HUD: DYNAMIC DETAILS PANEL (BUILDING OR PARCEL) ─────────── */}
        {isDetailsCollapsed ? (
          <button
            onClick={() => setIsDetailsCollapsed(false)}
            className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/90 border border-teal-500/40 text-teal-300 font-mono text-xs font-bold shadow-2xl backdrop-blur-xl hover:bg-slate-900 transition cursor-pointer"
            title="Expand Feature Details"
          >
            <Building2 className="h-4 w-4 text-teal-400" />
            <span>Feature Details</span>
          </button>
        ) : (
          <div
            className="absolute top-4 right-4 z-20 w-[310px] xl:w-[340px] bg-slate-950/95 border border-slate-800/90 backdrop-blur-2xl rounded-2xl p-3.5 shadow-2xl text-slate-100 space-y-2.5 font-sans max-h-[calc(100vh-10rem)] overflow-y-auto no-scrollbar animate-in slide-in-from-right-4"
            onClick={(e) => e.stopPropagation()}
          >
            {selectionType === "BUILDING" && activeBuilding ? (
              <>
                {/* Building Details Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-xs text-slate-100 uppercase tracking-wide">Building Details</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setDroneMode("ORBIT");
                        setDroneAltitude(120);
                        setGimbalPitch(-65);
                        showToast(`🛸 Drone Recon Camera locked on ${activeBuilding.id}`);
                      }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-bold hover:bg-cyan-500/30 transition shadow-sm cursor-pointer"
                      title="Fly Drone Camera to Inspect this Target"
                    >
                      <Crosshair className="h-3 w-3 text-cyan-400 animate-pulse" />
                      <span>LOCK DRONE</span>
                    </button>
                    <button
                      onClick={() => setIsDetailsCollapsed(true)}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                      title="Minimize Details Panel"
                    >
                      <Minimize2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              {/* Thumbnail and Spec Matrix */}
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-teal-500/20 to-indigo-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0 shadow-inner">
                  <Building2 className="h-7 w-7 text-cyan-400" />
                </div>
                <div className="space-y-0.5 text-[11px] font-mono leading-tight">
                  <div className="font-bold text-slate-100">Building ID : {activeBuilding.id}</div>
                  <div className="text-slate-400">Parcel ID : <strong className="text-cyan-400">{activeBuilding.parcelId}</strong></div>
                  <div className="text-slate-400">Type : <span className="text-emerald-400">{activeBuilding.type}</span></div>
                  <div className="text-slate-400">Height : <span className="text-teal-300">{activeBuilding.height} m</span></div>
                  <div className="text-slate-400">Floors : {activeBuilding.floors}</div>
                  <div className="text-slate-400">Built-up Area : <span className="text-cyan-300">{activeBuilding.builtUpArea.toLocaleString()} m²</span></div>
                </div>
              </div>

              {/* Floor Information (Dynamic for this specific building) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                  <span>Floor Information ({activeBuilding.floors} Levels)</span>
                  <span className="text-teal-400">CLICK TO EXPLODE</span>
                </div>

                <div className="space-y-1 font-mono text-[11px] max-h-40 overflow-y-auto pr-0.5">
                  {currentBuildingFloors.map((fl) => {
                    const isSelected = selectedFloor === fl.floorNumber;

                    return (
                      <button
                        key={fl.label}
                        onClick={() => handleSelectFloor(fl.floorNumber)}
                        className={cn(
                          "w-full flex items-center justify-between p-1.5 rounded-lg border transition-all cursor-pointer",
                          isSelected
                            ? "bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                            : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-850"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "h-4 w-5 rounded flex items-center justify-center font-bold text-[9px]",
                            isSelected ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-300"
                          )}>
                            {fl.label}
                          </span>
                          <span className="font-medium text-[10px] truncate max-w-[150px]">{fl.usage}</span>
                        </div>
                        <span className={cn("text-[9px]", isSelected ? "text-cyan-300 font-bold" : "text-slate-400")}>
                          ({fl.area.toLocaleString()} m²)
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rooms for Active Floor */}
              {currentFloorData && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-teal-300 uppercase">
                    <span>Rooms ({currentFloorData.label} - {currentFloorData.rooms.length} Spaces)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
                    {currentFloorData.rooms.map((rm) => {
                      const isRmActive = selectedRoom === rm.id;

                      return (
                        <button
                          key={rm.id}
                          onClick={() => handleSelectRoom(rm.id)}
                          className={cn(
                            "p-1.5 rounded-lg border text-left transition-all cursor-pointer",
                            isRmActive
                              ? "bg-teal-500/20 border-teal-400 text-white shadow-sm"
                              : "bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-850"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[10px] text-teal-300">{rm.id}</span>
                            <span className="text-[9px] text-cyan-400">{rm.area} m²</span>
                          </div>
                          <div className="text-[9px] text-slate-400 truncate">{rm.type}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-800 font-mono text-[11px]">
                <button
                  onClick={() => {
                    setIsExploded(!isExploded);
                    showToast(isExploded ? "Reset to Solid Exterior" : "Exploded 3D Cutaway Activated");
                  }}
                  className="py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center transition cursor-pointer shadow-md"
                >
                  Explore
                </button>

                <button
                  onClick={() => navigate({ to: "/intelligence-3d" })}
                  className="py-2 rounded-xl bg-slate-900 border border-cyan-500/50 hover:bg-slate-850 text-cyan-300 font-bold flex items-center justify-center transition cursor-pointer"
                >
                  Compare
                </button>

                <button
                  onClick={() => {
                    showToast(`AI Analysis: Building ${activeBuilding.id} aligns with municipal master plan.`);
                  }}
                  className="py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold flex items-center justify-center transition cursor-pointer shadow-md"
                >
                  AI Analysis
                </button>
              </div>
            </>
          ) : selectionType === "PARCEL" && activeParcel ? (
            <>
              {/* Parcel Details View */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="font-bold text-xs text-slate-100 uppercase tracking-wide">Parcel Intelligence</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setDroneMode("NADIR");
                      setDroneAltitude(120);
                      setGimbalPitch(-90);
                      showToast(`🛸 Drone Nadir Survey locked on Parcel ${activeParcel.parcelId}`);
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-bold hover:bg-cyan-500/30 transition shadow-sm cursor-pointer"
                    title="Fly Drone Camera to Inspect this Target"
                  >
                    <Crosshair className="h-3 w-3 text-cyan-400 animate-pulse" />
                    <span>LOCK DRONE</span>
                  </button>
                  <button
                    onClick={handleClearSelection}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Parcel Summary Card */}
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Parcel {activeParcel.parcelId}</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] border border-cyan-500/30">
                    {activeParcel.landUse}
                  </span>
                </div>
                <div className="text-slate-400">Total Registered Area : <strong className="text-cyan-300">{activeParcel.area.toLocaleString()} m²</strong></div>
                <div className="text-slate-400">Status : <span className="text-emerald-400">{activeParcel.status}</span></div>
                {activeParcel.associatedBuildingId && (
                  <div className="text-slate-400">Associated Building : <strong className="text-teal-300">{activeParcel.associatedBuildingId}</strong></div>
                )}
              </div>

              {/* 3 Data Source Registers */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-slate-300 uppercase">Available Data Sources</div>
                
                <div className="p-2 rounded-xl bg-slate-900/60 border border-cyan-500/30 flex items-center justify-between font-mono text-[11px]">
                  <div>
                    <div className="text-slate-200 font-bold">Revenue / Cadastral</div>
                    <div className="text-[9px] text-slate-500">{activeParcel.sources.revenue.date}</div>
                  </div>
                  <span className="text-cyan-300 font-bold">{activeParcel.sources.revenue.area.toLocaleString()} m²</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/60 border border-emerald-500/30 flex items-center justify-between font-mono text-[11px]">
                  <div>
                    <div className="text-slate-200 font-bold">Municipal GIS</div>
                    <div className="text-[9px] text-slate-500">{activeParcel.sources.municipal.date}</div>
                  </div>
                  <span className="text-emerald-300 font-bold">{activeParcel.sources.municipal.area.toLocaleString()} m²</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/60 border border-purple-500/30 flex items-center justify-between font-mono text-[11px]">
                  <div>
                    <div className="text-slate-200 font-bold">Survey / Drone Imagery</div>
                    <div className="text-[9px] text-slate-500">{activeParcel.sources.survey.date}</div>
                  </div>
                  <span className="text-purple-300 font-bold">{activeParcel.sources.survey.area.toLocaleString()} m²</span>
                </div>
              </div>

              {/* Conflict Status if any */}
              {activeParcel.conflictType && (
                <div className="p-2 rounded-xl bg-red-950/40 border border-red-500/40 space-y-1 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-red-400 font-bold text-[10px]">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>{activeParcel.conflictType}</span>
                  </div>
                  <div className="text-[10px] text-slate-300">
                    Max discrepancy: <strong className="text-amber-300">{activeParcel.maxDifference} m²</strong> between Municipal and Survey registers.
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 font-mono text-[11px]">
                <button
                  onClick={() => navigate({ to: "/intelligence-3d" })}
                  className="py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold flex items-center justify-center gap-1 transition cursor-pointer shadow-md"
                >
                  <Scale className="h-3.5 w-3.5" />
                  Compare Sources
                </button>
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="py-2.5 rounded-xl bg-slate-900 border border-teal-500/40 hover:bg-slate-850 text-teal-300 font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <Brain className="h-3.5 w-3.5" />
                  AI Analysis
                </button>
              </div>
            </>
          ) : (
            /* Neutral State when nothing is selected */
            <div className="py-8 text-center space-y-3 font-sans">
              <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-400 mx-auto shadow-inner">
                <MousePointerClick className="h-6 w-6 animate-bounce" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-200">Interactive Digital Twin</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[240px] mx-auto font-sans leading-relaxed">
                  Click any 3D building or land parcel anywhere on the map to inspect its digital twin, floor cutaways, and cadastral sources.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                <span>9 Buildings · 6 Registered Parcels Ready</span>
              </div>
            </div>
          )}
        </div>
      )}

      </div>

      {/* ── 3. Bottom 10-Stage Workflow Stepper ───────────────────────────────── */}
      <div className="shrink-0 z-20 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-xl px-4 py-2 flex items-center justify-between overflow-x-auto select-none no-scrollbar font-sans">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: "BUILDING", num: 1, label: "Building", icon: Building2 },
            { id: "PARCEL", num: 2, label: "Parcel", icon: MapPin },
            { id: "SOURCES", num: 3, label: "Sources", icon: Layers },
            { id: "COMPARE", num: 4, label: "Compare", icon: Scale },
            { id: "CONFLICT", num: 5, label: "Conflict", icon: ShieldAlert, alert: true },
            { id: "EVIDENCE", num: 6, label: "Evidence", icon: FileText },
            { id: "EXPLAIN", num: 7, label: "Explain", icon: Brain },
            { id: "RECOMMEND", num: 8, label: "Recommend", icon: Lightbulb },
            { id: "VERIFY", num: 9, label: "Verify", icon: UserCheck },
            { id: "AUDIT", num: 10, label: "Audit", icon: History },
          ].map((st, idx) => {
            const isActive = currentStage === st.id;
            const Icon = st.icon;

            return (
              <React.Fragment key={st.id}>
                <button
                  onClick={() => {
                    setCurrentStage(st.id as WorkflowStage);
                    showToast(`Workflow Stage: ${st.num}. ${st.label}`);
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center px-2 py-1 rounded-xl transition-all duration-300 cursor-pointer",
                    isActive
                      ? "bg-teal-500/20 border border-teal-400 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.3)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                  )}
                >
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center transition-all",
                      isActive
                        ? "bg-teal-500 text-slate-950 font-bold shadow-md"
                        : "bg-slate-900 border border-slate-800 text-slate-400"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                  </div>
                  <span className="mt-0.5 font-mono text-[8px] font-bold">
                    {st.num}. {st.label}
                  </span>
                </button>

                {idx < 9 && (
                  <div className="h-[1px] w-2 bg-slate-800 flex items-center justify-center">
                    <span className="text-[6px] text-slate-600">›</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Inline AI Copilot Button */}
        <div className="shrink-0 pl-3">
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] transition cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI COPILOT</span>
          </button>
        </div>
      </div>

      {/* ── 4. Saved Snapshots Gallery Modal ──────────────────────────────────── */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl p-5 space-y-4 font-sans text-slate-100 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                  <Camera className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white font-mono">DRONE ORTHO SNAPSHOT GALLERY</h3>
                  <p className="text-xs text-slate-400">{savedSnapshots.length} georeferenced survey captures stored in session memory</p>
                </div>
              </div>
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Snapshots Grid / List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-mono text-xs">
              {savedSnapshots.map((snap) => (
                <div
                  key={snap.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between gap-3 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-300">{snap.id}</span>
                      <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-bold">
                        {snap.mode}
                      </span>
                      <span className="text-[10px] text-slate-500">{snap.timeFormatted}</span>
                    </div>
                    <div className="text-[11px] text-slate-300">{snap.targetTitle}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-3">
                      <span>Coords: <strong className="text-slate-200">{snap.coordinates}</strong></span>
                      <span>Alt: <strong className="text-teal-300">{snap.altitude}m</strong></span>
                      <span>GSD: <strong className="text-cyan-300">{snap.gsd}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleDownloadSnapshot(snap)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] transition shadow cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>DOWNLOAD</span>
                    </button>
                    <button
                      onClick={() => {
                        setSavedSnapshots((prev) => prev.filter((s) => s.id !== snap.id));
                        showToast(`Deleted snapshot ${snap.id}`);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 transition cursor-pointer"
                      title="Delete Snapshot"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>CRS: EPSG:4326 (WGS84) · SVAMITVA / NAKSHA Spec</span>
              <button
                onClick={() => {
                  setSavedSnapshots([]);
                  showToast("Cleared all saved snapshots.");
                }}
                className="text-red-400 hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. AI GeoAI Analysis & Harmonization Modal ──────────────────────── */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-teal-500/40 rounded-2xl shadow-2xl p-5 space-y-4 font-sans text-slate-100 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white font-mono">GEOAI HARMONIZATION EXPLANATION</h3>
                  <p className="text-xs text-teal-300">Spatial Entity Matching & Automated Conflict Resolver</p>
                </div>
              </div>
              <button
                onClick={() => setIsAIModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Confidence Score</span>
                  <span className="text-emerald-400 font-bold text-sm">94.8% Match</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full w-[94.8%]" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-slate-300 font-bold">1. Multi-Source Evidence Corroboration</div>
                <p className="text-slate-400 leading-relaxed text-[11px] font-sans">
                  Revenue Cadastral record (1,200 m²) aligns with latest Drone Orthomosaic survey (1,195 m²) within standard survey tolerance (0.42%). Municipal GIS boundary exhibits a 150 m² southern overhang conflict due to legacy digitization shift in 2018.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>2. Recommended Action</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px] font-sans">
                  Accept Survey / Drone boundary as authoritative baseline. Align Municipal polygon vertices to OR1 Survey coordinates and emit versioned blockchain audit trail #AUD-2026-9281.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">SIH26013 GeoAI Harmonization Pipeline</span>
              <button
                onClick={() => {
                  setIsAIModalOpen(false);
                  navigate({ to: "/harmonization" });
                }}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow cursor-pointer"
              >
                Apply Recommended Harmonization
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
