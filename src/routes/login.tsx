import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { DEMO_ACCOUNTS } from "@/lib/auth/types";
import { Shield, Lock, Mail, ArrowRight, CheckCircle, Database, Server, Key } from "lucide-react";
import { BhuSetuMark } from "@/components/brand/BhuSetuLogo";
import { PWAInstallButton } from "@/components/common/PWAInstallButton";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Portal Authentication — Bhu Drishti 3D" },
      { name: "description", content: "Official Login Portal for Bhu Drishti 3D National Land Intelligence Platform" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, selectDemoAccount, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("rajesh.kumar@bhoomitra.gov.in");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate({ to: "/overview" });
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoClick = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    setIsSubmitting(true);
    try {
      await selectDemoAccount(demoEmail);
      navigate({ to: "/overview" });
    } catch (err: any) {
      setError(err.message || "Demo login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center bg-slate-950 px-3 sm:px-6 py-4 sm:py-6 text-slate-100">
      {/* Background GIS Grid & Radar Radial Animation */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Floating Animated Radar Pulsar */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-teal-500/10 animate-ping opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-stretch my-auto">
        
        {/* Left Form Panel */}
        <div className="md:col-span-7 bg-slate-900/85 border border-slate-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shadow-inner">
                <BhuSetuMark className="h-7 w-7" />
              </div>
              <div>
                <h1 className="font-display font-black text-lg sm:text-xl text-white tracking-wide flex items-center gap-1.5">
                  BHU-DRISHTI <span className="text-teal-400 font-mono text-xs px-1.5 py-0.5 rounded bg-teal-500/20 border border-teal-400/30">3D</span>
                </h1>
                <p className="text-[10px] sm:text-xs text-teal-400 font-mono tracking-wider uppercase font-semibold">National Land Intelligence Platform</p>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-slate-100">Sign in to your account</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Secure Government Decision-Support Environment (Auth & RBAC Enforced)
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email / Username</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rajesh.kumar@bhoomitra.gov.in"
                    className="w-full rounded-lg border border-slate-700/80 bg-slate-950/80 pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-700/80 bg-slate-950/80 pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold px-4 py-2.5 text-sm transition shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Authenticating..." : "Sign In & Enter Platform"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* PWA Install & System Status Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              System Status: Operational
            </span>
            <div className="w-full sm:w-auto">
              <PWAInstallButton variant="compact" />
            </div>
          </div>
        </div>

        {/* Right Single Admin Demo Account Panel */}
        <div className="md:col-span-5 bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold tracking-wider text-teal-400 uppercase font-mono">⚡ 1-Click Instant Demo</h3>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold">
                SUPER ADMIN
              </span>
            </div>
            
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Click below to authenticate as the <span className="text-teal-300 font-semibold">Chief Registrar & District Administrator</span> with complete access to all 3D Digital Twin, Harmonization, and Verification capabilities:
            </p>

            {/* Single Master Admin Button */}
            <button
              type="button"
              onClick={() => handleDemoClick("rajesh.kumar@bhoomitra.gov.in", "admin123")}
              disabled={isSubmitting}
              className="w-full text-left p-4 rounded-xl border-2 border-teal-500/50 bg-gradient-to-br from-teal-950/50 via-slate-900/90 to-indigo-950/40 hover:border-teal-400 hover:from-teal-900/60 hover:to-indigo-900/50 transition-all duration-300 group cursor-pointer shadow-lg shadow-teal-950/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white group-hover:text-teal-300 transition flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse" />
                  Rajesh Kumar
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  CHIEF REGISTRAR / ADMIN
                </span>
              </div>
              
              <div className="flex flex-col gap-1 text-[11px] font-mono text-teal-300/90 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ID:</span>
                  <span className="text-slate-200">rajesh.kumar@bhoomitra.gov.in</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Pass:</span>
                  <span className="text-slate-200">admin123</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-semibold text-teal-400 group-hover:text-teal-300">
                <span>Enter as Super Admin</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 text-center font-mono">
            Full permissions: 3D GIS · Harmonization · Verified Records · Cryptographic Audit
          </div>
        </div>

      </div>
    </div>
  );
}
