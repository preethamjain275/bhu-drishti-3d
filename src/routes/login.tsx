import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { DEMO_ACCOUNTS } from "@/lib/auth/types";
import { Shield, Lock, Mail, ArrowRight, CheckCircle, Database, Server, Key } from "lucide-react";
import { BhuSetuMark } from "@/components/brand/BhuSetuLogo";

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
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 overflow-hidden">
      {/* Background GIS Grid & Radar Radial Animation */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-950 to-slate-950" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Floating Animated Radar Pulsar */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-teal-500/10 animate-ping opacity-25 pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Form Panel */}
        <div className="md:col-span-7 bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-11 w-11 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shadow-inner">
                <BhuSetuMark className="h-8 w-8" />
              </div>
              <div>
                <h1 className="font-display font-black text-xl text-white tracking-wide flex items-center gap-1.5">
                  BHU-DRISHTI <span className="text-teal-400 font-mono text-sm px-1.5 py-0.5 rounded bg-teal-500/20 border border-teal-400/30">3D</span>
                </h1>
                <p className="text-xs text-teal-400 font-mono tracking-wider uppercase font-semibold">National Land Intelligence Platform</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-100">Sign in to your account</h2>
              <p className="text-xs text-slate-400 mt-1">
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

          {/* System Status Footer */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              System Status: Operational
            </span>
            <span>AUTH_MODE: database</span>
          </div>
        </div>

        {/* Right Demo Accounts Panel */}
        <div className="md:col-span-5 bg-slate-900/60 border border-slate-800/60 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold tracking-wider text-teal-400 uppercase font-mono">Quick 1-Click Demo Login</h3>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold">
                TEST CREDENTIALS
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Click any role below to pre-fill demo credentials and enter with that role:
            </p>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {[
                {
                  label: "Senior Land Registrar",
                  role: "ADMIN / REGISTRAR",
                  email: "rajesh.kumar@bhoomitra.gov.in",
                  pass: "admin123",
                  desc: "Full verification authority, export access, and governance sign-off."
                },
                {
                  label: "Geospatial GIS Analyst",
                  role: "ANALYST",
                  email: "vikram.mehta@bhoomitra.gov.in",
                  pass: "analyst123",
                  desc: "3D conflict investigation, spatial difference computation, and data ingestion."
                },
                {
                  label: "Field Demarcation Surveyor",
                  role: "SURVEYOR",
                  email: "priya.sharma@bhoomitra.gov.in",
                  pass: "surveyor123",
                  desc: "Drone survey uploads, ground GNSS checkpoints, and boundary notes."
                }
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleDemoClick(acc.email, acc.pass)}
                  disabled={isSubmitting}
                  className="w-full text-left p-3 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-800/80 hover:border-teal-500/50 transition group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-teal-300 transition">
                      {acc.label}
                    </span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 group-hover:bg-teal-500/20 group-hover:text-teal-300">
                      {acc.role}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono text-teal-400">
                    <span>{acc.email}</span>
                    <span>•</span>
                    <span className="text-slate-400">Pass: {acc.pass}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{acc.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500 text-center font-mono">
            Clicking a role will auto-sign-in and open the intelligence workspace.
          </div>
        </div>

      </div>
    </div>
  );
}
