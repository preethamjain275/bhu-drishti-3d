import React, { useState, type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { MobileTabBar } from "./MobileTabBar";
import { CommandPalette } from "./CommandPalette";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import { FloatingAIChatbot } from "@/components/ai/FloatingAIChatbot";
import { FloatingPWAInstallNotification } from "@/components/common/FloatingPWAInstallNotification";

export function AppShell({ children }: { children: ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <NotificationProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onOpenCommand={() => setCommandOpen(true)} />
          <main className="spatial-atmosphere min-w-0 flex-1 overflow-y-auto pb-20 lg:pb-0 animate-in fade-in slide-in-from-bottom-1 duration-300">
            {children}
          </main>
        </div>
        <MobileTabBar />
        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
        <FloatingPWAInstallNotification />
        <FloatingAIChatbot />
      </div>
    </NotificationProvider>
  );
}
