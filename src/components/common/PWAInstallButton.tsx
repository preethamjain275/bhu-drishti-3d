import React, { useState } from "react";
import { Download, Smartphone, Monitor, CheckCircle, Share, PlusSquare, X } from "lucide-react";
import { usePWAInstall } from "@/lib/hooks/usePWAInstall";
import { BhuSetuMark } from "@/components/brand/BhuSetuLogo";

export function PWAInstallButton({ variant = "default" }: { variant?: "default" | "compact" | "badge" }) {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    const outcome = await installApp();
    if (outcome === "ios_guide") {
      setShowIOSModal(true);
    } else if (outcome === "not_supported") {
      setShowIOSModal(true);
    } else if (outcome === "accepted") {
      setStatusMsg("App installed successfully!");
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  return (
    <>
      {variant === "compact" ? (
        <button
          onClick={handleInstallClick}
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-teal-500/40 bg-teal-950/40 text-teal-300 hover:bg-teal-900/50 hover:border-teal-400 font-mono text-xs font-bold transition-all shadow-sm group cursor-pointer"
          title="Install Bhu-Drishti as Standalone App"
        >
          <Download className="h-3.5 w-3.5 text-teal-400 group-hover:animate-bounce" />
          <span>INSTALL APP</span>
        </button>
      ) : variant === "badge" ? (
        <button
          onClick={handleInstallClick}
          type="button"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 text-xs font-bold hover:brightness-110 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
        >
          <Download className="h-3.5 w-3.5 text-slate-950" />
          <span>Install Bhu-Drishti App</span>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          type="button"
          className="flex items-center justify-between w-full p-3 rounded-xl border border-teal-500/30 bg-teal-950/20 hover:bg-teal-950/40 text-left transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
              <Download className="h-4 w-4 text-teal-300 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                Install Bhu-Drishti 3D App
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">PWA</span>
              </p>
              <p className="text-[11px] text-slate-400">Add to home screen / desktop for instant offline access</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-teal-400 group-hover:translate-x-0.5 transition-transform font-mono">
            Install →
          </span>
        </button>
      )}

      {/* iOS or Manual Install Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-teal-500/40 rounded-2xl p-6 shadow-2xl text-slate-100">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                <BhuSetuMark className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Install Bhu-Drishti 3D</h3>
                <p className="text-xs text-teal-400 font-mono">Add to Home Screen / Mobile App</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 bg-slate-950/60 border border-slate-800 rounded-xl p-4 mb-5">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-md bg-slate-800 flex items-center justify-center shrink-0 text-teal-400 font-bold">1</div>
                <p>Tap the <span className="font-semibold text-teal-300 inline-flex items-center gap-1"><Share className="h-3.5 w-3.5 inline" /> Share</span> icon in Safari / Chrome toolbar.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-md bg-slate-800 flex items-center justify-center shrink-0 text-teal-400 font-bold">2</div>
                <p>Scroll down and select <span className="font-semibold text-teal-300 inline-flex items-center gap-1"><PlusSquare className="h-3.5 w-3.5 inline" /> Add to Home Screen</span>.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-md bg-slate-800 flex items-center justify-center shrink-0 text-teal-400 font-bold">3</div>
                <p>Confirm by tapping <span className="font-semibold text-teal-300">Add</span>. The app icon will appear directly on your home screen!</p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-xs hover:brightness-110 transition-all cursor-pointer"
            >
              Got it, continue!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
