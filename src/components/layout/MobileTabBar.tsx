import { Link, useRouterState } from "@tanstack/react-router";
import { mobileNavItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";
import { useLanguage } from "@/lib/i18n/languageStore";

export function MobileTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useLanguage();

  const getItemLabel = (to: string, label: string) => {
    const map: Record<string, string> = {
      "/overview": "nav.overview",
      "/data-sources": "nav.sources",
      "/map": "nav.map",
      "/conflicts": "nav.conflicts",
    };
    return map[to] ? t(map[to]) : label;
  };

  return (
    <nav
      aria-label="Primary"
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl lg:hidden"
    >
      <div className="flex h-16 items-stretch justify-around px-1">
        {mobileNavItems.map((item) => {
          const active = pathname === item.to;
          const label = getItemLabel(item.to, item.label);
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-label={item.hint}
              className={cn(
                "relative flex min-w-16 flex-col items-center justify-center gap-1 transition-colors duration-300",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "absolute top-0 h-[2px] rounded-full bg-primary transition-all duration-300",
                  active ? "w-8 opacity-100" : "w-0 opacity-0",
                )}
              />
              <span className="relative">
                <item.icon className={cn("h-5 w-5 transition-transform duration-300", active && "scale-110")} />
                {item.badge ? (
                  <span className="absolute -top-1 -right-2 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-conflict px-1 font-mono text-[0.5rem] font-bold text-background">
                    {item.badge}
                  </span>
                ) : null}
              </span>
              <span className="text-[0.625rem] font-medium">{label}</span>
            </Link>
          );
        })}
        <MobileMenu triggerVariant="tab" badge={1} />
      </div>
    </nav>
  );
}
