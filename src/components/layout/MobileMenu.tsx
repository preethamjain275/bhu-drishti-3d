import { Link, useRouterState } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { navGroups } from "@/lib/navigation";
import { BhuSetuLogo } from "@/components/brand/BhuSetuLogo";
import { Animated3DHamburger } from "@/components/brand/Animated3DHamburger";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/languageStore";

/** Full navigation drawer for mobile / tablet. */
export function MobileMenu({
  triggerVariant = "tab",
  badge,
}: {
  triggerVariant?: "tab" | "icon";
  badge?: number;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
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
    <Sheet>
      <SheetTrigger asChild>
        {triggerVariant === "icon" ? (
          <Animated3DHamburger title="Open navigation menu" />
        ) : (
          <div
            role="button"
            tabIndex={0}
            aria-label="More — open navigation menu"
            className="relative flex h-full min-w-16 flex-col items-center justify-center gap-1 text-muted-foreground cursor-pointer"
          >
            <Animated3DHamburger className="h-6 w-6" title="More navigation" />
            <span className="text-[0.625rem] font-medium">More</span>
            {badge ? (
              <span className="absolute top-1.5 right-3 h-1.5 w-1.5 rounded-full bg-conflict" />
            ) : null}
          </div>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="w-[290px] border-border bg-sidebar p-0">
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <BhuSetuLogo />
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-5rem)] px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-5">
              <p className="label-technical px-2 pb-2">{getGroupTitle(group.title)}</p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.to;
                  const label = getItemLabel(item.to, item.label);
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-sidebar-accent text-ivory"
                            : "text-muted-foreground hover:bg-sidebar-accent/50",
                        )}
                      >
                        <item.icon
                          className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")}
                        />
                        {label}
                        {item.badge ? (
                          <span className="ml-auto rounded-full bg-conflict/15 px-1.5 py-0.5 font-mono text-[0.625rem] font-bold text-conflict">
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
