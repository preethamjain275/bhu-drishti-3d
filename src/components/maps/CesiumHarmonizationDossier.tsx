import React, { useState } from "react";
import {
  Building2,
  Layers,
  FileCheck,
  Brain,
  ShieldCheck,
  Check,
  Edit3,
  XCircle,
  Clock,
  ExternalLink,
  Eye,
  Box,
  Sliders,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Maximize2,
  Minimize2,
  X,
  Lock,
  Download,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Compass,
  MapPin,
  Share2,
} from "lucide-react";
import { ThreeDBuilding, ThreeDParcel, FloorInfo, RoomInfo } from "@/lib/maps/cesium/types";
import { MOCK_BUILDING_FLOORS } from "@/lib/mock/threeD";
import { cn } from "@/lib/utils";

interface CesiumHarmonizationDossierProps {
  building: ThreeDBuilding | null;
  parcel: ThreeDParcel | null;
  selectedFloor: number | null;
  onSelectFloor: (floorNumber: number | null) => void;
  selectedRoom: string | null;
  onSelectRoom: (roomId: string | null) => void;
  onToggleCutaway: () => void;
  isCutaway: boolean;
  onClose?: () => void;
  onSelectStage?: (stage: any) => void;
}

type TabKey = "DATA_FLOW" | "EVIDENCE" | "AI_ANALYSIS" | "ACTIONS";

export function CesiumHarmonizationDossier({
  building,
  parcel,
  selectedFloor = 4,
  onSelectFloor,
  selectedRoom = "4B",
  onSelectRoom,
  onToggleCutaway,
  isCutaway = true,
  onClose,
}: CesiumHarmonizationDossierProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("DATA_FLOW");
  const [verificationStatus, setVerificationStatus] = useState<string | null>("Accepted");
  const [activeSourceFilter, setActiveSourceFilter] = useState<"ALL" | "REVENUE" | "MUNICIPAL" | "SURVEY">("ALL");
  const [modifyNotes, setModifyNotes] = useState<string>("");
  const [isModifying, setIsModifying] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [auditLog, setAuditLog] = useState<{ id: string; time: string; user: string; action: string; note: string; status: string }[]>([
    {
      id: "AUD-8091",
      time: "2026-09-27 17:35",
      user: "Rajesh Kumar (Senior Registrar)",
      action: "Accepted",
      note: "Harmonized using latest survey data (1,190 m² baseline)",
      status: "VERIFIED",
    },
    {
      id: "AUD-8089",
      time: "2026-09-27 16:12",
      user: "Vikram Mehta (GIS Analyst)",
      action: "Identified",
      note: "3D parcel polygon boundary mismatch detected (25 m²)",
      status: "FLAGGED",
    },
  ]);

  const floors = building?.floors && building.floors.length > 0 ? building.floors : MOCK_BUILDING_FLOORS;
  
  // Safe floor data resolution for floor 0 (Ground) or any number
  const currentFloorData = floors.find((f) => f.floorNumber === (selectedFloor !== null ? selectedFloor : 4)) || floors[1] || floors[0]!;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAction = (action: string) => {
    if (action === "Modified") {
      setIsModifying(true);
      return;
    }
    
    setVerificationStatus(action);
    const newLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      time: new Date().toISOString().replace("T", " ").substring(0, 16),
      user: "Rajesh Kumar (Registrar)",
      action,
      note:
        action === "Accepted"
          ? "Harmonized representation confirmed & published to master cadastral ledger."
          : action === "Rejected"
          ? "Discrepancy rejected pending physical ground re-survey."
          : "Deferred for senior committee spatial review.",
      status: action === "Accepted" ? "VERIFIED" : action === "Rejected" ? "REJECTED" : "PENDING",
    };
    setAuditLog((prev) => [newLog, ...prev]);
    showToast(`Verification Action: ${action} recorded in audit trail.`);
  };

  const submitModification = () => {
    setVerificationStatus("Modified");
    setIsModifying(false);
    const newLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      time: new Date().toISOString().replace("T", " ").substring(0, 16),
      user: "Rajesh Kumar (Registrar)",
      action: "Modified",
      note: modifyNotes || "Custom boundary offset tolerance applied (±0.05m buffer).",
      status: "MODIFIED",
    };
    setAuditLog((prev) => [newLog, ...prev]);
    showToast("Modification applied and recorded.");
  };

  const exportDossierPDF = () => {
    showToast("Downloading Signed Harmonization Dossier (PDF)...");
    const dummyPdfContent = `BHOO-MITRA AI HARMONIZATION DOSSIER\nParcel: ${parcel?.parcelId || "P-10482"}\nBuilding: ${building?.buildingId || "B-10482"}\nStatus: ${verificationStatus}\nTimestamp: ${new Date().toISOString()}`;
    const blob = new Blob([dummyPdfContent], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Harmonization_Dossier_${parcel?.parcelId || "P-10482"}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportDossierJSON = () => {
    showToast("Exporting GeoJSON & Audit Provenance...");
    const dossierData = {
      parcelId: parcel?.parcelId || "P-10482",
      buildingId: building?.buildingId || "B-10482",
      verificationStatus,
      timestamp: new Date().toISOString(),
      floors: floors.length,
      builtUpArea: building?.metrics.totalBuiltUpArea || 4850,
      sources: {
        revenue: { area: 1200, date: "2024-06-12" },
        municipal: { area: 1175, date: "2025-01-20" },
        survey: { area: 1190, date: "2026-03-15" },
      },
      auditLog,
    };
    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Harmonization_Dossier_${parcel?.parcelId || "P-10482"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-[380px] xl:w-[420px] bg-slate-950/95 border border-slate-800/90 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl text-slate-100 space-y-4 max-h-[calc(100vh-8.5rem)] overflow-y-auto font-sans animate-in fade-in select-none no-scrollbar relative">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="absolute top-2 left-4 right-4 z-50 p-2.5 rounded-xl bg-teal-950 border border-teal-500 text-teal-200 text-xs font-mono shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1 font-mono text-[11px] font-bold">
          <button
            onClick={() => setActiveTab("DATA_FLOW")}
            className={cn(
              "px-2.5 py-1 rounded-lg transition-all cursor-pointer",
              activeTab === "DATA_FLOW"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            )}
          >
            Data Flow
          </button>
          <button
            onClick={() => setActiveTab("EVIDENCE")}
            className={cn(
              "px-2.5 py-1 rounded-lg transition-all cursor-pointer",
              activeTab === "EVIDENCE"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            )}
          >
            Evidence
          </button>
          <button
            onClick={() => setActiveTab("AI_ANALYSIS")}
            className={cn(
              "px-2.5 py-1 rounded-lg transition-all cursor-pointer",
              activeTab === "AI_ANALYSIS"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            )}
          >
            AI Analysis
          </button>
          <button
            onClick={() => setActiveTab("ACTIONS")}
            className={cn(
              "px-2.5 py-1 rounded-lg transition-all cursor-pointer",
              activeTab === "ACTIONS"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            )}
          >
            Actions
          </button>
        </div>

        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: DATA FLOW (Default Urban GIS & BIM Explorer) */}
      {/* ============================================================ */}
      {activeTab === "DATA_FLOW" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Building Details Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-indigo-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-md">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base text-slate-100">{building?.buildingId || "B-10482"}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {building?.usage || "Commercial"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Associated Parcel: <strong className="text-cyan-400">{parcel?.parcelId || "P-10482"}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center font-mono">
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[9px] text-slate-500 uppercase">Floors</div>
                <div className="text-xs font-bold text-slate-200 mt-0.5">{building?.metrics.floorCount || 5}</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[9px] text-slate-500 uppercase">Height</div>
                <div className="text-xs font-bold text-teal-300 mt-0.5">{building?.metrics.height || 18.5} m</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[9px] text-slate-500 uppercase">Built-up Area</div>
                <div className="text-xs font-bold text-cyan-300 mt-0.5">{building?.metrics.totalBuiltUpArea || 4850} m²</div>
              </div>
            </div>
          </div>

          {/* Floor Information Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                Floor Information
              </span>
              <span className="text-[10px] font-mono text-teal-400 font-bold">CLICK TO EXPLODE</span>
            </div>

            <div className="space-y-1.5">
              {floors.map((floor) => {
                const isFloorSelected = selectedFloor === floor.floorNumber;

                return (
                  <button
                    key={floor.label}
                    onClick={() => {
                      onSelectFloor(isFloorSelected ? null : floor.floorNumber);
                      showToast(`Floor ${floor.label} (${floor.usage}) isolated in 3D scene.`);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-xl border font-mono text-xs transition-all cursor-pointer",
                      isFloorSelected
                        ? "bg-cyan-950/70 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] text-white"
                        : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "h-6 w-7 rounded-lg flex items-center justify-center font-bold text-[11px]",
                          isFloorSelected ? "bg-cyan-500 text-slate-950 font-extrabold" : "bg-slate-800 text-slate-300"
                        )}
                      >
                        {floor.label}
                      </span>
                      <span className="font-semibold">{floor.usage}</span>
                    </div>
                    <span className={cn("text-[11px]", isFloorSelected ? "text-cyan-300 font-bold" : "text-slate-400")}>
                      ({floor.area.toLocaleString()} m²)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Room Details (For Active Floor) */}
          {currentFloorData && (
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-teal-300 uppercase">
                  Room Details ({currentFloorData.label})
                </span>
                <span className="text-[9px] font-mono text-slate-400">{currentFloorData.rooms.length} Spaces</span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                {currentFloorData.rooms.map((room) => {
                  const isRoomActive = selectedRoom === room.id;

                  return (
                    <button
                      key={room.id}
                      onClick={() => {
                        onSelectRoom(isRoomActive ? null : room.id);
                        showToast(`Room ${room.name} (${room.area} m²) selected.`);
                      }}
                      className={cn(
                        "p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between",
                        isRoomActive
                          ? "bg-teal-500/20 border-teal-400 text-white shadow-md shadow-teal-500/20"
                          : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn("font-bold text-[11px]", isRoomActive ? "text-teal-300" : "text-slate-200")}>
                          {room.name || room.id}
                        </span>
                        <span className="text-[10px] text-cyan-400 font-bold">{room.area} m²</span>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-1 truncate">{room.type}</div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  onToggleCutaway();
                  showToast(isCutaway ? "Switched to Solid 3D Building Model" : "Switched to Exploded 3D Cutaway Model");
                }}
                className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-indigo-500/20 border border-teal-500/40 hover:border-teal-400 text-teal-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Box className="h-4 w-4" />
                {isCutaway ? "Exploded 3D Cutaway Active" : "View Building 3D Model"}
              </button>
            </div>
          )}

          {/* Data Sources Register */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                Data Sources
              </span>
              <span className="text-[9px] font-mono text-emerald-400">3 VERIFIED REGISTERS</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <button
                onClick={() => {
                  setActiveSourceFilter(activeSourceFilter === "REVENUE" ? "ALL" : "REVENUE");
                  showToast("Revenue / Cadastral boundary isolated.");
                }}
                className={cn(
                  "w-full p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer text-left",
                  activeSourceFilter === "REVENUE"
                    ? "bg-cyan-950/60 border-cyan-400 shadow-md"
                    : "bg-slate-900/60 border-cyan-500/30 hover:border-cyan-500/60"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-200 text-xs">Revenue / Cadastral</div>
                    <div className="text-[9px] text-slate-500">Updated: 2024-06-12</div>
                  </div>
                </div>
                <span className="font-bold text-cyan-300 text-xs">1,200 m²</span>
              </button>

              <button
                onClick={() => {
                  setActiveSourceFilter(activeSourceFilter === "MUNICIPAL" ? "ALL" : "MUNICIPAL");
                  showToast("Municipal GIS boundary isolated.");
                }}
                className={cn(
                  "w-full p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer text-left",
                  activeSourceFilter === "MUNICIPAL"
                    ? "bg-emerald-950/60 border-emerald-400 shadow-md"
                    : "bg-slate-900/60 border-emerald-500/30 hover:border-emerald-500/60"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-200 text-xs">Municipal GIS</div>
                    <div className="text-[9px] text-slate-500">Updated: 2025-01-20</div>
                  </div>
                </div>
                <span className="font-bold text-emerald-300 text-xs">1,175 m²</span>
              </button>

              <button
                onClick={() => {
                  setActiveSourceFilter(activeSourceFilter === "SURVEY" ? "ALL" : "SURVEY");
                  showToast("Survey / High-Res Ortho boundary isolated.");
                }}
                className={cn(
                  "w-full p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer text-left",
                  activeSourceFilter === "SURVEY"
                    ? "bg-purple-950/60 border-purple-400 shadow-md"
                    : "bg-slate-900/60 border-purple-500/30 hover:border-purple-500/60"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-200 text-xs">Survey / Imagery</div>
                    <div className="text-[9px] text-slate-500">Updated: 2026-03-15</div>
                  </div>
                </div>
                <span className="font-bold text-purple-300 text-xs">1,190 m²</span>
              </button>
            </div>
          </div>

          {/* Comparison Wireframe Box */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="font-bold text-slate-300 uppercase">Comparison</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setActiveSourceFilter("REVENUE")} className="flex items-center gap-1 text-cyan-400 hover:underline cursor-pointer">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Revenue
                </button>
                <button onClick={() => setActiveSourceFilter("MUNICIPAL")} className="flex items-center gap-1 text-amber-400 hover:underline cursor-pointer">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Municipal
                </button>
                <button onClick={() => setActiveSourceFilter("SURVEY")} className="flex items-center gap-1 text-emerald-400 hover:underline cursor-pointer">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Survey
                </button>
              </div>
            </div>

            <div className="relative h-28 w-full rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 240 120" className="w-full h-full">
                <path d="M10 90 L120 40 L230 90 L120 115 Z" fill="none" stroke="#1e293b" strokeWidth="1" />
                <polygon points="40,80 120,45 200,80 120,110" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3 2" />
                <polygon points="45,78 123,43 195,78 117,108" fill="none" stroke="#f59e0b" strokeWidth="2" />
                <polygon points="42,79 121,44 198,79 119,109" fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="2.5" />
              </svg>

              <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-mono text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40">
                <ShieldAlert className="h-3 w-3" />
                <span>Geometry Conflict</span>
              </div>
            </div>

            <div className="space-y-1 font-mono text-[10px]">
              <div className="flex justify-between text-slate-400">
                <span>Boundary Mismatch:</span>
                <span className="text-amber-300 font-bold">Max difference: 25 m²</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Area Comparison:</span>
                <span>Rev: 1,200 m² | Muni: 1,175 m² | Sur: 1,190 m²</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-0.5">
                <span>Conflict Type:</span>
                <span className="text-red-400 font-bold">Geometry + Area Discrepancy</span>
              </div>
            </div>
          </div>

          {/* AI Explanation Summary */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-teal-500/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-teal-400 font-mono text-[11px] font-bold">
              <Brain className="h-3.5 w-3.5" />
              <span>AI Explanation</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              The three sources represent the same parcel, but their geometries and area values differ. The latest survey data provides the most consistent boundary representation and is recommended for harmonization.
            </p>
          </div>

          {/* Recommended Harmonized Representation */}
          <div className="p-3 rounded-2xl bg-teal-950/40 border border-teal-500/40 space-y-1 text-xs font-mono">
            <div className="flex items-center justify-between text-[11px] font-bold text-teal-300">
              <span>Recommended Harmonized Representation</span>
              <span className="text-emerald-400">87% Conf</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Source: Survey (Latest)</span>
              <span className="font-bold text-white">Area: 1,190 m²</span>
            </div>
          </div>

          {/* Quick Decision Buttons */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Human Verification</span>
              <span className="text-[9px] text-slate-500 font-mono">Officer Decision</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
              <button
                onClick={() => handleAction("Accepted")}
                className="flex items-center justify-center gap-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition cursor-pointer shadow-md hover:shadow-emerald-500/20"
              >
                <Check className="h-3.5 w-3.5" />
                Accept
              </button>
              <button
                onClick={() => handleAction("Modified")}
                className="flex items-center justify-center gap-1 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 hover:bg-slate-800 text-cyan-300 font-bold transition cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Modify
              </button>
              <button
                onClick={() => handleAction("Rejected")}
                className="flex items-center justify-center gap-1 py-2 rounded-xl bg-red-950/60 border border-red-500/40 hover:bg-red-900/60 text-red-300 font-bold transition cursor-pointer"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </button>
              <button
                onClick={() => handleAction("Deferred")}
                className="flex items-center justify-center gap-1 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold transition cursor-pointer"
              >
                <Clock className="h-3.5 w-3.5" />
                Defer
              </button>
            </div>
          </div>

          {/* Audit History Log */}
          <div className="space-y-1.5 pt-1 border-t border-slate-800 font-mono text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Audit History</span>
              <button onClick={exportDossierPDF} className="text-teal-400 hover:underline flex items-center gap-1 cursor-pointer">
                <Download className="h-3 w-3" /> Export
              </button>
            </div>
            <div className="space-y-1">
              {auditLog.map((log) => (
                <div key={log.id} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", log.action === "Accepted" ? "bg-emerald-400" : log.action === "Modified" ? "bg-cyan-400" : "bg-amber-400")} />
                    <span className="text-slate-300">{log.time} · {log.user.split(" ")[0]} · <strong className="text-emerald-400">{log.action}</strong></span>
                  </div>
                  <span className="text-slate-500 truncate max-w-[110px]">{log.note}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: EVIDENCE INTELLIGENCE & PROVENANCE */}
      {/* ============================================================ */}
      {activeTab === "EVIDENCE" && (
        <div className="space-y-4 animate-in fade-in duration-200 font-mono text-xs">
          
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-300 font-bold">
                <ShieldCheck className="h-4 w-4 text-teal-400" />
                <span>Geospatial Evidence Graph</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 text-[10px] border border-teal-500/30">
                IoU: 0.94
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Multi-source sensor evidence, historical cadastral sheets, and high-resolution drone orthophotography.
            </p>

            {/* Evidence items */}
            <div className="space-y-2 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-slate-200 font-bold">Orthophoto 2026-03 (0.05m GSD)</div>
                  <div className="text-[10px] text-slate-500">Sensor: Trimble UX5 Aerial Drone</div>
                </div>
                <span className="text-emerald-400 font-bold">Verified</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-slate-200 font-bold">GNSS Ground Control Points (GCP)</div>
                  <div className="text-[10px] text-slate-500">Precision: ±0.015m (EPSG:32643)</div>
                </div>
                <span className="text-teal-400 font-bold">4 Points</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-slate-200 font-bold">Cadastral Revenue Sheet #42</div>
                  <div className="text-[10px] text-slate-500">Survey Dept (1982 Digitized)</div>
                </div>
                <span className="text-amber-400 font-bold">Shifted 1.8m</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportDossierPDF}
              className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Download Evidence Dossier
            </button>
            <button
              onClick={exportDossierJSON}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              GeoJSON
            </button>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: AI ANALYSIS & REASONING */}
      {/* ============================================================ */}
      {activeTab === "AI_ANALYSIS" && (
        <div className="space-y-4 animate-in fade-in duration-200 font-mono text-xs">
          
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-teal-500/40 space-y-3">
            <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
              <Sparkles className="h-4 w-4 text-teal-400" />
              <span>Multi-Layer AI Harmonization Engine</span>
            </div>

            <div className="space-y-2 text-[11px] font-sans text-slate-300 leading-relaxed">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <strong className="text-teal-400 font-mono">1. Geometric Discrepancy:</strong> The western boundary of the Municipal dataset exhibits a 1.2m inward indentation not present in the 2026 orthophoto.
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <strong className="text-cyan-400 font-mono">2. Built-up Footprint Fit:</strong> Building B-10482 aligns with 98.6% IoU against the Drone Survey boundary.
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <strong className="text-emerald-400 font-mono">3. Harmonization Synthesis:</strong> Retain Survey Geometry (1,190 m²) as Master Spatial Boundary with reference links to Revenue & Municipal IDs.
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-[10px] uppercase font-bold text-slate-400">Confidence Breakdown</div>
            <div className="space-y-1.5">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                  <span>Spatial Boundary Accuracy</span>
                  <span className="text-emerald-400 font-bold">96%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full w-[96%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                  <span>Legal Ownership Cross-Validation</span>
                  <span className="text-teal-400 font-bold">89%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400 rounded-full w-[89%]" />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: ACTIONS & VERIFICATION WORKSTATION */}
      {/* ============================================================ */}
      {activeTab === "ACTIONS" && (
        <div className="space-y-4 animate-in fade-in duration-200 font-mono text-xs">
          
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-300 font-bold">
                <ShieldCheck className="h-4 w-4 text-teal-400" />
                <span>Decision Workstation</span>
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold border",
                verificationStatus === "Accepted" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
              )}>
                {verificationStatus ? `STATUS: ${verificationStatus.toUpperCase()}` : "AWAITING DECISION"}
              </span>
            </div>

            {isModifying ? (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-[11px] text-slate-300 font-sans font-semibold">Custom Modification Notes / Buffer:</label>
                <textarea
                  value={modifyNotes}
                  onChange={(e) => setModifyNotes(e.target.value)}
                  placeholder="Enter custom boundary adjustments or reasons for modification..."
                  className="w-full h-20 p-2 rounded-xl bg-slate-950 border border-cyan-500/50 text-slate-100 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                <div className="flex gap-2">
                  <button
                    onClick={submitModification}
                    className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition cursor-pointer"
                  >
                    Confirm Modification
                  </button>
                  <button
                    onClick={() => setIsModifying(false)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleAction("Accepted")}
                  className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <Check className="h-4 w-4" />
                  Accept Harmonization
                </button>
                <button
                  onClick={() => handleAction("Modified")}
                  className="py-2.5 rounded-xl bg-slate-900 border border-cyan-500/50 hover:bg-slate-850 text-cyan-300 font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" />
                  Modify Boundary
                </button>
                <button
                  onClick={() => handleAction("Rejected")}
                  className="py-2.5 rounded-xl bg-red-950/70 border border-red-500/50 hover:bg-red-900/70 text-red-300 font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <XCircle className="h-4 w-4" />
                  Reject Recommendation
                </button>
                <button
                  onClick={() => handleAction("Deferred")}
                  className="py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-850 text-slate-300 font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Clock className="h-4 w-4" />
                  Defer Decision
                </button>
              </div>
            )}
          </div>

          {/* Audit Ledger Summary */}
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
              <span>Immutable Audit Ledger</span>
              <button onClick={exportDossierPDF} className="text-teal-400 hover:underline flex items-center gap-1 cursor-pointer">
                <Download className="h-3 w-3" /> Export Signed PDF
              </button>
            </div>

            <div className="space-y-1.5">
              {auditLog.map((log) => (
                <div key={log.id} className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-teal-300 font-bold">{log.id}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-300 font-bold">{log.action}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 truncate max-w-[220px]">{log.note}</div>
                  </div>
                  <div className="text-right text-[9px] text-slate-500">
                    <div>{log.time.split(" ")[1]}</div>
                    <div className="text-emerald-400">{log.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
