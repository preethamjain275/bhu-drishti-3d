import React, { useEffect, useState } from "react";
import { SyncEventFeedback } from "@/lib/map/mapTypes";
import { ArrowLeftRight, CheckCircle2 } from "lucide-react";

interface CesiumSyncToastProps {
  feedback: SyncEventFeedback | null;
}

export function CesiumSyncToast({ feedback }: CesiumSyncToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (feedback) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [feedback]);

  if (!visible || !feedback) return null;

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-teal-500/40 text-slate-100 text-xs font-mono shadow-2xl backdrop-blur-xl">
        <ArrowLeftRight className="h-4 w-4 text-teal-400 animate-pulse" />
        <span>{feedback.message}</span>
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 ml-1" />
      </div>
    </div>
  );
}
