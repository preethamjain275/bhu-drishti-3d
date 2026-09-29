/**
 * BhuSetu — Platform Settings
 * Route: /settings
 *
 * Workspace-level configuration for CRS, confidence thresholds,
 * user profile, and notification preferences.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Settings,
  User,
  Globe,
  Bell,
  Shield,
  Sliders,
  Save,
  CheckCircle2,
  MapPin,
  Key,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/languageStore";

export const Route = createFileRoute("/_app/settings")({
  validateSearch: (search: Record<string, unknown>) => search,
  head: () => ({
    meta: [
      { title: "Settings — Bhu Drishti 3D" },
      {
        name: "description",
        content:
          "Workspace configuration: coordinate systems, confidence thresholds, roles and notification preferences.",
      },
      { property: "og:title", content: "Settings — Bhu Drishti 3D" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SettingsPage,
});

type SettingsTab = "profile" | "spatial" | "thresholds" | "notifications" | "security";

function SettingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [saved, setSaved] = useState(false);

  // Profile state
  const [displayName, setDisplayName] = useState(user?.full_name || "Rajesh Kumar");
  const [email, setEmail] = useState(user?.email || "rajesh.kumar@bhoomitra.gov.in");
  const [designation, setDesignation] = useState("Senior Land Registrar");

  // Spatial config
  const [defaultCRS, setDefaultCRS] = useState("EPSG:4326");
  const [toleranceM, setToleranceM] = useState("0.5");
  const [defaultZoom, setDefaultZoom] = useState("16");

  // Threshold config
  const [autoMatchThreshold, setAutoMatchThreshold] = useState("85");
  const [conflictThreshold, setConflictThreshold] = useState("10");
  const [qualityThreshold, setQualityThreshold] = useState("75");

  // Notification config
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [conflictAlerts, setConflictAlerts] = useState(true);
  const [verificationReminders, setVerificationReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs: { id: SettingsTab; label: string; icon: typeof Settings; description: string }[] = [
    { id: "profile", label: t("settings.profile"), icon: User, description: t("settings.profile.desc") },
    { id: "spatial", label: t("settings.spatial"), icon: Globe, description: t("settings.spatial.desc") },
    { id: "thresholds", label: t("settings.thresholds"), icon: Sliders, description: t("settings.thresholds.desc") },
    { id: "notifications", label: t("settings.notifications"), icon: Bell, description: t("settings.notifications.desc") },
    { id: "security", label: t("settings.security"), icon: Shield, description: t("settings.security.desc") },
  ];

  return (
    <div className="w-full px-4 py-6 md:px-6 md:py-8 pb-24 md:pb-8">
      {/* Page Header */}
      <div className="border-b border-border pb-6 mb-6">
        <p className="label-technical">{t("settings.header")}</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ivory md:text-[1.75rem]">
          {t("nav.settings")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("settings.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar Navigation */}
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all",
                activeTab === tab.id
                  ? "glass-panel border-primary/30 text-ivory"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface/60"
              )}
            >
              <tab.icon className={cn("h-5 w-5 shrink-0", activeTab === tab.id ? "text-primary" : "")} />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{tab.label}</p>
                <p className="text-[11px] text-muted-foreground truncate">{tab.description}</p>
              </div>
              {activeTab === tab.id && <ChevronRight className="ml-auto h-4 w-4 text-primary shrink-0" />}
            </button>
          ))}
        </nav>

        {/* Content Panel */}
        <div className="glass-panel p-6 space-y-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-ivory">{t("settings.profile.title")}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t("settings.profile.sub")}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">{t("settings.profile.fullname")}</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border/60 bg-surface/60 px-3 text-sm text-ivory focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">{t("settings.profile.email")}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border/60 bg-surface/60 px-3 text-sm text-ivory focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">{t("settings.profile.designation")}</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border/60 bg-surface/60 px-3 text-sm text-ivory focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">{t("settings.profile.role")}</label>
                  <div className="h-10 rounded-lg border border-border/60 bg-surface/60 px-3 flex items-center">
                    <span className="px-2 py-0.5 rounded bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[10px] font-mono font-bold">
                      SENIOR LAND REGISTRAR
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <Key className="h-4 w-4" />
                  {t("settings.profile.password")}
                </div>
                <p className="text-[11px] text-slate-400">
                  {t("settings.profile.password.desc")}
                </p>
              </div>
            </div>
          )}

          {/* Spatial Config Tab */}
          {activeTab === "spatial" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-ivory">{t("settings.spatial.title")}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t("settings.spatial.sub")}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">{t("settings.spatial.crs")}</label>
                  <select
                    value={defaultCRS}
                    onChange={(e) => setDefaultCRS(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border/60 bg-surface/60 px-3 text-sm text-ivory focus:border-primary focus:outline-none"
                  >
                    <option value="EPSG:4326">EPSG:4326 (WGS 84)</option>
                    <option value="EPSG:32643">EPSG:32643 (UTM Zone 43N)</option>
                    <option value="EPSG:32644">EPSG:32644 (UTM Zone 44N)</option>
                    <option value="EPSG:4269">EPSG:4269 (NAD83)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">{t("settings.spatial.tolerance")}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={toleranceM}
                    onChange={(e) => setToleranceM(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border/60 bg-surface/60 px-3 text-sm text-ivory focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">{t("settings.spatial.zoom")}</label>
                  <input
                    type="number"
                    min="1"
                    max="22"
                    value={defaultZoom}
                    onChange={(e) => setDefaultZoom(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border/60 bg-surface/60 px-3 text-sm text-ivory focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/10 flex items-start gap-3">
                <MapPin className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-400">
                  <p className="font-semibold text-cyan-300 mb-1">{t("settings.spatial.about")}</p>
                  <p>{t("settings.spatial.about.desc")}</p>
                </div>
              </div>
            </div>
          )}

          {/* Thresholds Tab */}
          {activeTab === "thresholds" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-ivory">{t("settings.thresholds.title")}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t("settings.thresholds.sub")}</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-300">{t("settings.thresholds.automatch")}</label>
                    <span className="text-xs font-mono font-bold text-cyan-300">{autoMatchThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={autoMatchThreshold}
                    onChange={(e) => setAutoMatchThreshold(e.target.value)}
                    className="w-full accent-[var(--primary)]"
                  />
                  <p className="text-[10px] text-slate-500">{t("settings.thresholds.automatch.sub")}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-300">{t("settings.thresholds.conflict")}</label>
                    <span className="text-xs font-mono font-bold text-amber-300">{conflictThreshold} m²</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={conflictThreshold}
                    onChange={(e) => setConflictThreshold(e.target.value)}
                    className="w-full accent-[var(--saffron)]"
                  />
                  <p className="text-[10px] text-slate-500">{t("settings.thresholds.conflict.sub")}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-300">{t("settings.thresholds.quality")}</label>
                    <span className="text-xs font-mono font-bold text-emerald-300">{qualityThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={qualityThreshold}
                    onChange={(e) => setQualityThreshold(e.target.value)}
                    className="w-full accent-[var(--verified)]"
                  />
                  <p className="text-[10px] text-slate-500">{t("settings.thresholds.quality.sub")}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-ivory">{t("settings.notifications.title")}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t("settings.notifications.sub")}</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: t("settings.notifications.email"), desc: t("settings.notifications.email.sub"), value: emailNotifications, setter: setEmailNotifications },
                  { label: t("settings.notifications.conflict"), desc: t("settings.notifications.conflict.sub"), value: conflictAlerts, setter: setConflictAlerts },
                  { label: t("settings.notifications.verification"), desc: t("settings.notifications.verification.sub"), value: verificationReminders, setter: setVerificationReminders },
                  { label: t("settings.notifications.digest"), desc: t("settings.notifications.digest.sub"), value: weeklyDigest, setter: setWeeklyDigest },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-surface/30">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{item.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => item.setter(!item.value)}
                      className={cn(
                        "relative h-6 w-11 rounded-full transition-colors duration-200",
                        item.value ? "bg-primary" : "bg-slate-700"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 shadow-sm",
                          item.value ? "left-[22px]" : "left-0.5"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-ivory">{t("settings.security.title")}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t("settings.security.sub")}</p>
              </div>

              <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-950/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-teal-400" />
                  <span className="text-sm font-semibold text-teal-300">{t("settings.security.yourrole")}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-500">{t("settings.security.role")}</span>
                    <p className="font-bold text-ivory">Senior Land Registrar</p>
                  </div>
                  <div>
                    <span className="text-slate-500">{t("settings.security.accesslevel")}</span>
                    <p className="font-bold text-emerald-300">{t("settings.security.fullaccess")}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">{t("settings.security.canverify")}</span>
                    <p className="font-bold text-emerald-300">{t("settings.security.yes")}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">{t("settings.security.canexport")}</span>
                    <p className="font-bold text-emerald-300">{t("settings.security.yes")}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  to="/settings/users"
                  className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-surface/30 hover:border-primary/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{t("settings.security.usermgmt")}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t("settings.security.usermgmt.sub")}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
            {saved && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                {t("settings.saved")}
              </span>
            )}
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs"
            >
              <Save className="mr-1.5 h-3.5 w-3.5" />
              {t("settings.save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
