import React, { useState, useEffect } from "react";
import { Download, X, Sparkles, Smartphone, Monitor, ShieldCheck } from "lucide-react";
import { usePWAInstall } from "@/lib/hooks/usePWAInstall";
import { BhuSetuMark } from "@/components/brand/BhuSetuLogo";

export function FloatingPWAInstallNotification() {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  // Auto-hide if already dismissed or installed
  if (isInstalled || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    const outcome = await installApp();
    if (outcome === "ios_guide" || outcome === "not_supported") {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {/* Floating Glassmorphism Notification Banner */}
      <div className="fixed bottom-24 lg:bottom-6 left-3 sm:left-6 z-50 max-w-[340px] sm:max-w-[380px] animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
        <div className="relative overflow-hidden rounded-2xl border border-teal-400/40 bg-slate-950/80 p-4 shadow-[0_8px_32px_rgba(20,184,166,0.25)] backdrop-blur-2xl ring-1 ring-white/10 hover:border-teal-400/60 transition-all group">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-teal-500/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none" />

          {/* Dismiss Button */}
          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss"
            className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3">
            {/* Logo / App Icon Badge */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-400/30 text-teal-300 shadow-inner group-hover:scale-105 transition-transform">
              <BhuSetuMark className="h-6 w-6" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400" />
              </span>
            </div>

            {/* Notification Content */}
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 bg-teal-500/15 px-1.5 py-0.2 rounded border border-teal-500/30">
                  PWA Ready
                </span>
                <span className="text-slate-400 text-[11px]">• Standalone App</span>
              </div>

              <h4 className="text-xs font-bold text-slate-100 mt-1">
                Install Bhu-Drishti 3D App
              </h4>
              <p className="text-[11px] text-slate-300/90 mt-0.5 leading-snug">
                Experience ultra-fast 3D Digital Twin with offline support and standalone launch.
              </p>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleInstall}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-400 text-slate-950 font-bold text-xs hover:brightness-110 shadow-md shadow-teal-500/20 transition-all cursor-pointer active:scale-95"
                >
                  <Download className="h-3.5 w-3.5 text-slate-950" />
                  <span>Install App</span>
                </button>
                <button
                  onClick={() => setIsDismissed(true)}
                  type="button"
                  className="px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* iOS Modal / Manual Add to Home Screen Instructions */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200 font-sans">
          <div className="relative w-full max-w-sm bg-slate-900 border border-teal-500/40 rounded-2xl p-5 shadow-2xl text-slate-100">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-slate-100"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-sm font-bold text-teal-300 mb-2 flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-teal-400" />
              Add to Home Screen
            </h3>
            <p className="text-xs text-slate-300 mb-3">
              To install on iPhone or iPad:
            </p>

            <ol className="text-xs space-y-2 text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <li className="flex items-center gap-2">
                <span className="h-5 w-5 rounded bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0">1</span>
                <span>Tap the <strong>Share</strong> button in Safari toolbar</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-5 w-5 rounded bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0">2</span>
                <span>Scroll down and tap <strong>Add to Home Screen</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-5 w-5 rounded bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0">3</span>
                <span>Tap <strong>Add</strong> in the top-right corner</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full mt-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
