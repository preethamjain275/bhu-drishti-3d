import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import satImg from "@/assets/satellite-view.jpg";
import droneImg from "@/assets/drone-view.jpg";
import surveyImg from "@/assets/field-survey.jpg";
import { Radar, Layers, MapPin, Satellite, Scan } from "lucide-react";

const LAND_MODES = [
  {
    id: "satellite",
    title: "Satellite Multi-Spectral Land View",
    subtitle: "Sentinel-2 & High-Res Imagery",
    img: satImg,
    badge: "SATELLITE SCAN · 0.5m GSD",
    color: "text-cyan",
    border: "border-cyan/40",
  },
  {
    id: "drone",
    title: "Drone Orthomosaic & Terrain",
    subtitle: "High Precision Land Parcel Capture",
    img: droneImg,
    badge: "DRONE ORTHOMOSAIC · ZONE 4",
    color: "text-teal",
    border: "border-teal/40",
  },
  {
    id: "survey",
    title: "Field GNSS & Boundary Cadastral",
    subtitle: "Ground Control & Revenue Alignment",
    img: surveyImg,
    badge: "FIELD GNSS SURVEY · SP-2291",
    color: "text-saffron",
    border: "border-saffron/40",
  },
];

const PARCELS = [
  { id: "P-10482", label: "Ward 18 · Res-04", area: "1,240 m²", top: "25%", left: "55%", color: "#3fb8b0" },
  { id: "P-10483", label: "Ward 18 · Com-01", area: "3,810 m²", top: "42%", left: "30%", color: "#7fdcef" },
  { id: "P-10484", label: "Ward 18 · Agri-12", area: "8,950 m²", top: "60%", left: "68%", color: "#f0b661" },
];

export function SpatialVisual({ className }: { className?: string }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % LAND_MODES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentLandMode = LAND_MODES[activeIdx]!;

  return (
    <div className={cn("relative overflow-hidden bg-background", className)} aria-hidden="true">
      {/* Dynamic Land Imagery Layers with hardware acceleration */}
      {LAND_MODES.map((mode, idx) => (
        <div
          key={mode.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            idx === activeIdx ? "opacity-40" : "opacity-0"
          )}
        >
          <img
            src={mode.img}
            alt={mode.title}
            className="h-full w-full object-cover transform-gpu scale-100"
            loading="lazy"
          />
        </div>
      ))}

      {/* Cadastral Grid Overlay */}
      <div className="spatial-grid absolute inset-0 opacity-30 pointer-events-none" />
      <div className="spatial-grid-fine absolute inset-0 opacity-15 pointer-events-none" />

      {/* Laser Scanning Sweep Line across Land */}
      <div className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan to-transparent opacity-70 scan-sweep shadow-[0_0_15px_#7fdcef]" />

      {/* Cadastral Land Parcel Highlights & Nodes */}
      <div className="pointer-events-none absolute inset-0">
        {PARCELS.map((p, i) => (
          <div
            key={p.id}
            className="absolute rounded-xl border border-white/20 bg-background/30 p-2.5 backdrop-blur-xs transition-all duration-700"
            style={{ top: p.top, left: p.left }}
          >
            <div className="flex items-center gap-1.5">
              <span className="badge-pulse h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="font-mono text-[10px] font-bold text-ivory">{p.id}</span>
            </div>
            <p className="mt-0.5 text-[9px] text-muted-foreground">{p.label}</p>
            <p className="font-mono text-[9px] font-semibold text-ivory/80">{p.area}</p>
          </div>
        ))}

        {/* Survey Control Point Nodes */}
        {[
          { t: "18%", l: "22%" },
          { t: "75%", l: "40%" },
          { t: "35%", l: "82%" },
          { t: "80%", l: "78%" },
        ].map((pt, i) => (
          <div
            key={i}
            className="absolute flex items-center gap-1 rounded-full border border-cyan/40 bg-background/50 px-2 py-0.5 text-[9px] font-mono text-cyan backdrop-blur-xs"
            style={{ top: pt.t, left: pt.l }}
          >
            <MapPin className="h-2.5 w-2.5 text-cyan animate-pulse" />
            <span>CP-0{i + 1}</span>
          </div>
        ))}
      </div>

      {/* Land Intelligence Visual HUD Badge */}
      <div className="pointer-events-none absolute right-4 top-4 z-10 flex flex-col items-end gap-2">
        <div className="liquid-glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-ivory shadow-lg">
          <Radar className="h-3.5 w-3.5 text-cyan animate-spin" style={{ animationDuration: "8s" }} />
          <span className="font-mono font-bold text-[11px] tracking-wider text-cyan">
            {currentLandMode.badge}
          </span>
        </div>
      </div>

      {/* Mode Switcher Tabs for Land Animation */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2">
        {LAND_MODES.map((mode, idx) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition-all duration-300 pointer-events-auto",
              idx === activeIdx
                ? "bg-primary text-primary-foreground font-bold shadow-md"
                : "liquid-glass text-muted-foreground hover:text-ivory"
            )}
          >
            {mode.id === "satellite" && <Satellite className="h-3 w-3" />}
            {mode.id === "drone" && <Scan className="h-3 w-3" />}
            {mode.id === "survey" && <Layers className="h-3 w-3" />}
            <span>{mode.id.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {/* Gradient Vignette Scrim for Copy Contrast */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_65%_45%,transparent_30%,color-mix(in_oklab,var(--background)_85%,transparent)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_oklab,var(--background)_75%,transparent)_40%,transparent_70%)]" />
    </div>
  );
}
