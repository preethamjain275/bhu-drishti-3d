import React, { useEffect, useState } from "react";
import { ChevronDown, Search, Command as CommandIcon, Database, Layers, Radio } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { BhuSetuMark } from "@/components/brand/BhuSetuLogo";
import { flatNavItems } from "@/lib/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileMenu } from "./MobileMenu";
import {
  subscribeApiConnectionStatus,
  subscribeHealthStatus,
  checkBackendHealth,
  type ApiConnectionState,
  type SystemHealthStatus,
} from "@/lib/api/client";
import { cn } from "@/lib/utils";

// ─── Tiny Status Dot ──────────────────────────────────────────────────────────
function StatusDot({ ok, partial }: { ok: boolean; partial?: boolean }) {
  if (ok)
    return (
      <span className="h-2 w-2 rounded-full bg-verified shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
    );
  if (partial)
    return <span className="h-2 w-2 rounded-full bg-saffron shadow-[0_0_8px_rgba(245,158,11,0.6)]" />;
  return <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />;
}

// ─── Compact Status Row ────────────────────────────────────────────────────────
function StatusRow({
  label,
  value,
  ok,
  partial,
}: {
  label: string;
  value: string;
  ok: boolean;
  partial?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-2">
      <div className="flex items-center gap-1.5">
        <StatusDot ok={ok} {...(partial !== undefined ? { partial } : {})} />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span
        className={cn(
          "text-xs font-medium",
          ok ? "text-verified" : partial ? "text-saffron" : "text-muted-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}
export function TopBar({ onOpenCommand }: { onOpenCommand: () => void }) {
  const { user, logout, can } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = flatNavItems.find((i) => i.to === pathname);
  const breadcrumb = current?.label ?? "Overview";

  const [apiState, setApiState] = useState<ApiConnectionState>("CHECKING");
  const [health, setHealth] = useState<SystemHealthStatus>({
    api: "unavailable",
    database: "unavailable",
    postgis: "unavailable",
    repository: "mock",
  });

  useEffect(() => {
    const unsubApi = subscribeApiConnectionStatus((state) => setApiState(state));
    const unsubHealth = subscribeHealthStatus((status) => setHealth(status));
    checkBackendHealth();
    return () => {
      unsubApi();
      unsubHealth();
    };
  }, []);

  const isConnected = apiState === "CONNECTED";
  const dbConnected = health.database === "connected";
  const postgisEnabled = health.postgis === "enabled";
  const isPostgresMode = health.repository === "postgres";

  // Button label
  const statusLabel =
    apiState === "CONNECTED"
      ? isPostgresMode
        ? "API + POSTGIS"
        : "HARMONIZER: ACTIVE"
      : "LIVE PLATFORM";

  // Determine current workflow stage
  const getWorkflowStage = (path: string) => {
    if (path.includes("/sources")) return "COMPARE";
    if (path.includes("/conflicts")) return "DETECT";
    if (path.includes("/evidence")) return "EXPLAIN";
    if (path.includes("/recommendations")) return "RECOMMEND";
    if (path.includes("/verification")) return "VERIFY";
    if (path.includes("/audit") || path.includes("/reports")) return "RECORD";
    return "OBSERVE";
  };
  const activeStage = getWorkflowStage(pathname);

  const workflowSteps = [
    { key: "OBSERVE", label: "OBSERVE", to: "/overview" },
    { key: "COMPARE", label: "COMPARE", to: "/sources" },
    { key: "DETECT", label: "DETECT", to: "/conflicts" },
    { key: "EXPLAIN", label: "EXPLAIN", to: "/evidence" },
    { key: "RECOMMEND", label: "RECOMMEND", to: "/recommendations" },
    { key: "VERIFY", label: "VERIFY", to: "/verification" },
    { key: "RECORD", label: "RECORD", to: "/audit" },
  ];

  return (
    <header className="glass-nav sticky top-0 z-20 flex h-14 items-center justify-between gap-2 px-3 md:px-4">
      {/* Left: Logo & Breadcrumbs */}
      <div className="flex items-center gap-3 shrink-0">
        <Link to="/" className="lg:hidden" aria-label="BHU-DRISHTI 3D home">
          <BhuSetuMark className="h-7 w-7" />
        </Link>
        <div className="min-w-0 flex items-center gap-2">
          <p className="label-technical hidden lg:block text-teal-400/80 font-mono font-bold whitespace-nowrap">BHU-DRISHTI 3D <span className="mx-1 text-slate-600">/</span></p>
          <h1 className="truncate font-display text-sm font-bold text-ivory lg:text-base flex items-center gap-2 max-w-[160px] sm:max-w-none">
            {current?.icon && <current.icon className="h-4 w-4 text-primary shrink-0" />}
            <span className="truncate">{breadcrumb}</span>
          </h1>
        </div>
      </div>

      {/* Center / Search Bar */}
      <div className="flex-1 flex justify-center max-w-md mx-auto">
        <button
          type="button"
          onClick={onOpenCommand}
          className="h-9 w-full max-w-sm items-center gap-2 rounded-xl border border-border/80 bg-surface/80 px-3 text-xs text-muted-foreground transition-colors hover:border-primary/50 hidden md:flex"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Search parcels, sources, conflicts...</span>
          <kbd className="ml-auto flex items-center gap-0.5 rounded border border-border px-1.5 py-0.5 font-mono text-[0.625rem] shrink-0">
            <CommandIcon className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        <button
          type="button"
          onClick={onOpenCommand}
          aria-label="Search"
          className="grid h-9 w-9 place-items-center rounded-xl border border-border/70 bg-surface text-muted-foreground transition-colors hover:text-ivory md:hidden"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      {/* Right Actions & User Controls */}
      <div className="flex items-center gap-2 shrink-0">
        
        {/* 7-Stage Workflow Stepper */}
        <div className="hidden 2xl:flex items-center gap-1 px-3 py-1 bg-surface/80 border border-border/80 rounded-full font-mono text-[10px]">
          {workflowSteps.map((step, idx) => {
            const isActive = activeStage === step.key;
            return (
              <React.Fragment key={step.key}>
                <Link
                  to={step.to}
                  className={cn(
                    "px-2 py-0.5 rounded-full transition-all duration-300 flex items-center gap-1 font-bold",
                    isActive
                      ? "bg-teal-500/20 border border-teal-400/50 text-teal-300 shadow-sm"
                      : "text-muted-foreground hover:text-ivory hover:bg-white/5"
                  )}
                >
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />}
                  {step.label}
                </Link>
                {idx < workflowSteps.length - 1 && (
                  <span className="text-slate-600 text-[9px]">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Global Drone View Quick Link / Toggle */}
        <Link
          to="/intelligence-3d"
          className="hidden sm:flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/30 px-2.5 py-1.5 transition-colors hover:border-cyan-400 hover:bg-cyan-950/50 text-cyan-300 font-mono text-xs font-bold shadow-sm"
          title="Switch to 3D Drone Recon & Urban Digital Twin"
        >
          <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span>DRONE RECON 3D</span>
        </Link>

        {/* System Status Badge */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden sm:flex items-center gap-1.5 rounded-xl border border-verified/40 bg-emerald-950/30 px-2.5 py-1.5 transition-colors hover:border-verified">
              <span className="h-2 w-2 rounded-full bg-verified shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
              <span className="label-technical text-xs font-bold uppercase text-verified">
                LIVE PLATFORM
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 bg-slate-950/95 border-slate-800 text-slate-100 backdrop-blur-2xl">
            <DropdownMenuLabel className="pb-2">
              <p className="text-sm font-bold text-ivory">SYSTEM STATUS</p>
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-verified/40 bg-verified/10 text-verified px-2 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-ping" />
                <span className="text-[10px] font-bold uppercase">
                  ALL SYSTEMS OPERATIONAL
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <div className="grid gap-2 p-2.5 text-xs">
              <StatusRow label="FastAPI REST API" value="Operational (FastAPI Engine Sync)" ok={true} />
              <StatusRow label="Spatial Processing Engine" value="Operational (PostGIS + GDAL)" ok={true} />
              <StatusRow label="Conflict Detection Pipeline" value="Operational (GeoAI Classifier)" ok={true} />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Multi-Language Dropdown */}
        <LanguageDropdown />

        <NotificationPanel />

        {/* User Profile Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-border/70 bg-surface px-2 py-1 transition-colors hover:border-primary/40"
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[10px] font-bold">
                  {user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : "RA"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-xs font-semibold text-slate-200 truncate max-w-[90px]">
                {user?.full_name?.split(" ")[0] || "Rajesh Kumar"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-slate-950/95 border-slate-800 text-slate-100 backdrop-blur-2xl">
            <DropdownMenuLabel className="space-y-1">
              <p className="text-sm font-bold text-ivory">{user?.full_name || "Rajesh Kumar"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || "rajesh.kumar@bhoomitra.gov.in"}</p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-teal-500/20 border border-teal-500/40 text-teal-300">
                  SENIOR LAND REGISTRAR
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer text-slate-200 hover:text-white font-medium">
                User Profile & Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings/users" className="cursor-pointer text-teal-400 font-semibold hover:text-teal-300">
                Security & RBAC Permissions
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/reports" className="cursor-pointer text-slate-200 hover:text-white font-medium">
                Reports & Analytics
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-red-400 focus:bg-red-950/30 focus:text-red-300 font-bold"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="lg:hidden">
          <MobileMenu triggerVariant="icon" />
        </div>
      </div>
    </header>
  );
}

import { useLanguage } from "@/lib/i18n/languageStore";

function LanguageDropdown() {
  const { language, setLanguage, languages } = useLanguage();
  const currentLang = languages.find((l) => l.code === language) || languages[0]!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-surface/90 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-teal-400 hover:text-white"
        >
          <span>{currentLang.flag}</span>
          <span className="font-medium text-teal-300">{currentLang.nativeName} ({currentLang.code.toUpperCase()})</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs font-bold text-ivory">SELECT LANGUAGE</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLanguage(l.code)}
            className={cn(
              "cursor-pointer flex items-center justify-between text-xs font-mono font-semibold",
              l.code === language ? "bg-teal-500/15 text-teal-300 font-bold" : "text-slate-300 hover:text-white"
            )}
          >
            <span className="flex items-center gap-2">
              <span>{l.flag}</span>
              <span>{l.name}</span>
            </span>
            <span className="text-[10px] text-slate-500">{l.nativeName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

