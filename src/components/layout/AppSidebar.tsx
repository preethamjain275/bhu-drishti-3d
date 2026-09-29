import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { navGroups } from "@/lib/navigation";
import { BhuSetuMark } from "@/components/brand/BhuSetuLogo";
import { Animated3DHamburger } from "@/components/brand/Animated3DHamburger";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { useLanguage } from "@/lib/i18n/languageStore";

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useLanguage();

  const getGroupTitle = (title: string) => {
    const key = `group.${title.toLowerCase()}`;
    const tr = t(key);
    return tr !== key ? tr : title;
  };

  const getItemLabel = (to: string, label: string) => {
    const map: Record<string, string> = {
      "/overview": "nav.overview",
      "/data-sources": "nav.sources",
      "/harmonization": "nav.harmonization",
      "/entity-matching": "nav.matching",
      "/map": "nav.map",
      "/conflicts": "nav.conflicts",
      "/evidence": "nav.evidence",
      "/intelligence-3d": "nav.intelligence3d",
      "/verification": "nav.verification",
      "/audit": "nav.audit",
      "/reports": "nav.reports",
      "/settings": "nav.settings",
    };
    return map[to] ? t(map[to]) : label;
  };

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out lg:flex",
        collapsed ? "w-16" : "w-[248px]"
      )}
    >
      {/* Static Header with Logo & Animated 3D Hamburger Toggle */}
      <div className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-border bg-sidebar/95 px-3.5 backdrop-blur-md">
        <Link to="/" aria-label="BHU-DRISHTI 3D home" className="flex items-center gap-2.5 overflow-hidden">
          <BhuSetuMark className="h-8 w-8 shrink-0" />
          <div className={cn("leading-none transition-all duration-300", collapsed ? "opacity-0 w-0" : "opacity-100")}>
            <div className="font-display text-[1.0625rem] font-black tracking-tight text-white flex items-center gap-1">
              <span>BHU-DRISHTI</span>
              <span className="text-[0.6875rem] font-mono font-bold text-teal-400 bg-teal-500/20 border border-teal-400/40 px-1 py-0.5 rounded">3D</span>
            </div>
            <div className="text-[0.5625rem] font-mono text-teal-400/80 uppercase tracking-widest mt-0.5">
              Land Intelligence
            </div>
          </div>
        </Link>

        {/* Static 3D Motion Hamburger Button */}
        <Animated3DHamburger
          active={collapsed}
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar menu" : "Collapse sidebar menu"}
          className={cn("shrink-0", collapsed && "mx-auto")}
        />
      </div>

      {/* Scrollable Navigation Items */}
      <nav className="scrollbar-slim flex-1 overflow-y-auto px-3 py-4 overflow-x-hidden">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-5">
            {!collapsed && (
              <p className="label-technical px-2 pb-2 transition-opacity duration-300 opacity-100">{getGroupTitle(group.title)}</p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.to;
                const translatedLabel = getItemLabel(item.to, item.label);
                return (
                  <li key={item.to}>
                    <Tooltip delayDuration={collapsed ? 0 : 1000}>
                      <TooltipTrigger asChild>
                        <Link
                          to={item.to}
                          className={cn(
                            "group relative flex items-center rounded-md px-2.5 py-2 text-[0.8125rem] font-medium transition-all duration-300",
                            active
                              ? "bg-sidebar-accent text-ivory"
                              : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                            collapsed ? "justify-center" : "gap-2.5"
                          )}
                        >
                          <span
                            className={cn(
                              "absolute top-1.5 bottom-1.5 -left-1 w-[2px] rounded-full bg-primary transition-all duration-300",
                              active ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <item.icon
                            className={cn(
                              "h-5 w-5 shrink-0 transition-colors",
                              active ? "text-primary" : "text-muted-foreground"
                            )}
                          />
                          {!collapsed && (
                            <span className="truncate transition-opacity duration-300">{translatedLabel}</span>
                          )}
                          {!collapsed && item.badge ? (
                            <span className="ml-auto rounded-full bg-conflict/15 px-1.5 py-0.5 font-mono text-[0.625rem] font-bold text-conflict">
                              {item.badge}
                            </span>
                          ) : null}
                        </Link>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right" className="font-semibold">
                          {translatedLabel}{" "}
                          <span className="block font-normal text-muted-foreground">{item.hint}</span>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Static Footer Status */}
      <div className="sticky bottom-0 z-20 flex flex-col border-t border-border bg-sidebar/95 p-3 gap-2 backdrop-blur-md">
        {!collapsed ? (
          <div className="flex items-center gap-2 px-2 transition-opacity duration-300">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-verified badge-pulse" />
            <span className="label-technical truncate">Harmonized Platform</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="h-2 w-2 rounded-full bg-verified badge-pulse" title="Harmonized Platform" />
          </div>
        )}
      </div>
    </aside>
  );
}
