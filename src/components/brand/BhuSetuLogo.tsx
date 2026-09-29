import { cn } from "@/lib/utils";

/**
 * BhuDrishti / BhuSetu Mark — 3D Isometric Geospatial Land Prism with Orbital AI Telemetry & Laser Beacon.
 * Distinctive, high-tech, futuristic government-grade visual identity.
 */
export function BhuSetuMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="BHU-DRISHTI 3D"
      className={cn("h-8 w-8 shrink-0 transition-transform duration-300 hover:scale-105", className)}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="prism-top-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        <linearGradient id="prism-left-g" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0F766E" />
          <stop offset="100%" stopColor="#042F2E" />
        </linearGradient>

        <linearGradient id="prism-right-g" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#082F49" />
        </linearGradient>

        <linearGradient id="beacon-flare" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>

        <linearGradient id="orbit-laser" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9" />
        </linearGradient>

        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Orbital Telemetry Ring / Satellite Scan Track */}
      <g transform="rotate(-22 32 32)">
        <ellipse
          cx="32"
          cy="32"
          rx="27"
          ry="11"
          fill="none"
          stroke="url(#orbit-laser)"
          strokeWidth="1.25"
          strokeDasharray="4 2.5 1 2.5"
          opacity="0.85"
        />
        {/* Orbiting Sensor Node */}
        <circle cx="59" cy="32" r="2.2" fill="#F59E0B" filter="url(#logo-glow)" />
        <circle cx="5" cy="32" r="1.6" fill="#38BDF8" />
      </g>

      {/* 3D Isometric Base Polygon - Left Facet */}
      <polygon
        points="10,21 32,33.5 32,54 10,41.5"
        fill="url(#prism-left-g)"
        stroke="#14B8A6"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.95"
      />

      {/* 3D Isometric Base Polygon - Right Facet */}
      <polygon
        points="32,33.5 54,21 54,41.5 32,54"
        fill="url(#prism-right-g)"
        stroke="#38BDF8"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.95"
      />

      {/* 3D Isometric Top Land Parcel Plate */}
      <polygon
        points="32,8.5 54,21 32,33.5 10,21"
        fill="url(#prism-top-g)"
        stroke="#5EEAD4"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Cadastral Land Grid Lines on Top Surface */}
      <path
        d="M21,14.75 L43,27.25 M43,14.75 L21,27.25"
        stroke="#042F2E"
        strokeWidth="0.9"
        strokeDasharray="2 1.5"
        opacity="0.75"
      />

      {/* Elevated 3D Building Core / Digital Twin Extrusion */}
      <polygon
        points="32,15 40,19.5 32,24 24,19.5"
        fill="#0F172A"
        stroke="#F59E0B"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <polygon
        points="24,19.5 32,24 32,28.5 24,24"
        fill="#B45309"
        stroke="#F59E0B"
        strokeWidth="0.8"
      />
      <polygon
        points="32,24 40,19.5 40,24 32,28.5"
        fill="#D97706"
        stroke="#F59E0B"
        strokeWidth="0.8"
      />

      {/* Laser Alignment Beam / Vertical Spatial Datum */}
      <line
        x1="32"
        y1="2"
        x2="32"
        y2="15"
        stroke="url(#beacon-flare)"
        strokeWidth="1.5"
        strokeLinecap="round"
        filter="url(#logo-glow)"
      />

      {/* Golden Apex Beacon */}
      <circle cx="32" cy="2" r="2.2" fill="#FEF08A" filter="url(#logo-glow)" />
      <circle cx="32" cy="2" r="1.2" fill="#FFFFFF" />

      {/* Spatial Ground Datum Vertices */}
      <circle cx="10" cy="21" r="1.6" fill="#2DD4BF" />
      <circle cx="54" cy="21" r="1.6" fill="#38BDF8" />
      <circle cx="32" cy="54" r="1.8" fill="#14B8A6" />
      <circle cx="32" cy="33.5" r="1.6" fill="#FDE047" />
    </svg>
  );
}

export function BhuSetuLogo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <BhuSetuMark className={compact ? "h-7 w-7" : "h-9 w-9"} />
      {!compact && (
        <div className="leading-none">
          <div className="font-display text-[1.125rem] font-black tracking-tight text-white flex items-center gap-1.5">
            <span>BHU-DRISHTI</span>
            <span className="rounded-md bg-gradient-to-r from-teal-500/30 to-cyan-500/30 border border-teal-400/50 px-1.5 py-0.5 text-[0.6875rem] font-mono font-black text-teal-300 tracking-wider shadow-[0_0_10px_rgba(20,184,166,0.3)]">
              3D AI
            </span>
          </div>
          <div className="mt-1 text-[0.625rem] font-semibold tracking-[0.18em] text-teal-400/90 uppercase font-mono">
            National Land Intelligence
          </div>
        </div>
      )}
    </div>
  );
}

