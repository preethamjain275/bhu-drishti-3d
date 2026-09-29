import { Bell, BellRing, Check } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNotifications } from "./NotificationProvider";
import { categoryLabel, formatRelative, type AppNotification } from "./notifications";

const priorityRing: Record<AppNotification["priority"], string> = {
  critical: "bg-conflict",
  high: "bg-saffron",
  normal: "bg-primary",
};

function NotificationRow({
  item,
  onRead,
}: {
  item: AppNotification;
  onRead: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onRead(item.id)}
      className={cn(
        "group relative w-full rounded-lg border px-4 py-3 text-left transition-colors",
        item.read
          ? "border-border/60 bg-surface/40"
          : "border-border bg-surface-raised/70 hover:border-primary/40",
      )}
    >
      <span
        className={cn(
          "absolute top-4 left-0 h-6 w-[2px] rounded-full",
          priorityRing[item.priority],
          item.read && "opacity-40",
        )}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="label-technical">{categoryLabel[item.category]}</span>
            {!item.read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
          </div>
          <p
            className={cn(
              "mt-1 text-sm font-semibold",
              item.read ? "text-foreground/70" : "text-ivory",
            )}
          >
            {item.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
        </div>
        <span className="shrink-0 font-mono text-[0.625rem] text-muted-foreground">
          {formatRelative(item.createdAt)}
        </span>
      </div>
    </button>
  );
}

export function NotificationPanel() {
  const { notifications, unreadCount, markRead, markAllRead, requestPushPermission } =
    useNotifications();

  const enablePush = async () => {
    const result = await requestPushPermission();
    if (result === "granted") toast.success("Browser alerts enabled for this workspace");
    else if (result === "unsupported") toast.error("This browser does not support alerts");
    else toast.message("Browser alerts stay off. You can enable them later.");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
          className="relative grid h-9 w-9 place-items-center rounded-md border border-border/70 bg-surface text-muted-foreground transition-colors hover:border-primary/40 hover:text-ivory"
        >
          {unreadCount > 0 ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
          {unreadCount > 0 && (
            <>
              <span className="badge-pulse absolute -top-1 -right-1 h-4 w-4 rounded-full bg-conflict/50" />
              <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-conflict px-1 font-mono text-[0.5625rem] font-bold text-background">
                {unreadCount}
              </span>
            </>
          )}
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full border-border bg-background p-0 sm:max-w-md [&>button]:top-5"
      >
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-base text-ivory">
            Notifications
            <span className="label-technical">{unreadCount} unread</span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex items-center justify-between gap-2 px-5 py-3">
          <Button variant="ghost" size="sm" onClick={markAllRead} className="gap-1.5 text-xs">
            <Check className="h-3.5 w-3.5" /> Mark all read
          </Button>
          <Button variant="outline" size="sm" onClick={enablePush} className="text-xs">
            Enable browser alerts
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-9.5rem)] px-5 pb-8">
          <div className="space-y-2">
            {notifications.map((n) => (
              <NotificationRow key={n.id} item={n} onRead={markRead} />
            ))}
          </div>
          <p className="mt-4 text-[0.6875rem] leading-relaxed text-muted-foreground">
            Demo notifications shown for interface purposes. Not connected to any official record
            system.
          </p>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
