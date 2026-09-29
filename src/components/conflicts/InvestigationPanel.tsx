import { useState } from "react";
import { Panel } from "@/components/common/ModulePage";
import { cn } from "@/lib/utils";
import { useServerFn } from "@tanstack/react-start";
import { investigate } from "@/lib/investigator.functions";
import { Button } from "@/components/ui/button";

type Label = "Source fact" | "System finding" | "AI interpretation" | "User note";
type Ev = { title: string; type: string; label: Label; strength: "Strong" | "Moderate" | "Weak"; stance: "Supports" | "Contradicts" | "Neutral"; detail: string };

export type InvConflict = { id: string; parcel: string; kind: string; sources: string; conf: number; metric: string; why: string[] };

const LABEL_TONE: Record<Label, string> = {
  "Source fact": "border-teal/50 text-teal",
  "System finding": "border-cyan/50 text-cyan",
  "AI interpretation": "border-saffron/50 text-saffron",
  "User note": "border-border text-foreground",
};

function buildEvidence(c: InvConflict, notes: string[]): Ev[] {
  const [a, b] = c.sources.split(" ↔ ");
  return [
    { title: `${a ?? "Source A"} record`, type: "Source metadata", label: "Source fact", strength: "Strong", stance: "Neutral", detail: `Parcel ${c.parcel} as published by ${a}. Capture 2024, survey-derived.` },
    { title: `${b ?? "Source B"} record`, type: "Source metadata", label: "Source fact", strength: "Moderate", stance: "Neutral", detail: `Counterpart from ${b ?? a}. Digitized, partial metadata.` },
    { title: "Measured difference", type: "Spatial evidence", label: "System finding", strength: "Strong", stance: "Supports", detail: `${c.metric}. Computed after alignment to project CRS.` },
    ...c.why.map((w, i) => ({ title: `Rule check ${i + 1}`, type: "Processing evidence", label: "System finding" as Label, strength: "Moderate" as const, stance: "Supports" as const, detail: w })),
    { title: "Capture-date gap", type: "Temporal evidence", label: "System finding", strength: "Weak", stance: "Contradicts", detail: "Sources captured ~1–4 years apart; difference may reflect real change, not error." },
    { title: "Possible georeferencing offset", type: "Spatial evidence", label: "AI interpretation", strength: "Weak", stance: "Contradicts", detail: "Pattern resembles a systematic shift in the digitized source. Interpretation only — not verified." },
    ...notes.map((n) => ({ title: "Investigator note", type: "User evidence", label: "User note" as Label, strength: "Moderate" as const, stance: "Neutral" as const, detail: n })),
  ];
}

const TABS = ["Evidence", "AI Investigator", "Spatial", "Temporal", "Provenance"] as const;

export function InvestigationPanel({ c, notes }: { c: InvConflict; notes: string[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Evidence");
  const ev = buildEvidence(c, notes);
  const sup = ev.filter((e) => e.stance === "Supports").length;
  const con = ev.filter((e) => e.stance === "Contradicts").length;
  const run = useServerFn(investigate);
  const [ai, setAi] = useState<{ q: string | null; text: string; err?: boolean }[]>([]);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const ask = async (question: string | null) => {
    setBusy(true);
    const evidence = `Conflict ${c.id} (${c.kind}) on ${c.parcel}, sources ${c.sources}, ${c.metric}, detection confidence ${Math.round(c.conf * 100)}%.\n` + ev.map((e) => `- [${e.label}] ${e.title} (${e.stance}, ${e.strength}): ${e.detail}`).join("\n");
    try {
      const r = await run({ data: { evidence, question } });
      setAi((a) => [...a, r.ok ? { q: question, text: r.text } : { q: question, text: r.error, err: true }]);
    } catch {
      setAi((a) => [...a, { q: question, text: "AI request failed. Try again later.", err: true }]);
    }
    setBusy(false);
    setQ("");
  };

  return (
    <Panel title="Investigation" meta={<span className="label-technical">{ev.length} evidence items</span>}>
      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        {[["Supporting", sup, "text-verified"], ["Contradicting", con, "text-saffron"], ["Gaps", 2, "text-muted-foreground"]].map(([k, v, t]) => (
          <div key={k as string} className="rounded-lg border border-border p-2"><p className="label-technical">{k}</p><p className={cn("font-display text-xl font-bold", t as string)}>{v}</p></div>
        ))}
      </div>
      <div className="scrollbar-slim mb-4 flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("whitespace-nowrap border-b-2 px-3 py-2 text-xs", tab === t ? "border-primary text-ivory" : "border-transparent text-muted-foreground")}>{t}</button>
        ))}
      </div>

      {tab === "Evidence" && (
        <ul className="grid gap-2 md:grid-cols-2">
          {ev.map((e, i) => (
            <li key={i} className="rounded-lg border border-border p-3 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={cn("rounded border px-1.5 py-0.5 text-[10px]", LABEL_TONE[e.label])}>{e.label}</span>
                <span className="text-[10px] text-muted-foreground">{e.type}</span>
              </div>
              <p className="mt-1.5 font-medium text-ivory">{e.title}</p>
              <p className="mt-1 text-muted-foreground">{e.detail}</p>
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">{e.stance} · {e.strength}</p>
            </li>
          ))}
        </ul>
      )}

      {tab === "AI Investigator" && (
        <div className="space-y-3 text-xs">
          <p className="rounded-md border border-saffron/40 bg-saffron/5 p-2 text-saffron">AI interpretation — decision support only. It never determines the legally correct boundary or which source is true.</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" disabled={busy} onClick={() => ask(null)}>{busy ? "Investigating…" : "Generate AI summary"}</Button>
          </div>
          {ai.map((m, i) => (
            <div key={i} className={cn("rounded-lg border p-3", m.err ? "border-conflict/50 text-conflict" : "border-saffron/30")}>
              {m.q && <p className="mb-1 font-medium text-ivory">Q: {m.q}</p>}
              <p className="whitespace-pre-wrap text-foreground">{m.text}</p>
            </div>
          ))}
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (q.trim()) ask(q.trim()); }}>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about this conflict…" className="h-9 flex-1 rounded-md border border-border bg-transparent px-2 text-sm" />
            <Button size="sm" type="submit" disabled={busy || !q.trim()}>Ask</Button>
          </form>
          <p className="label-technical">Rule-based outline (no AI)</p>
          {[
            ["What was observed", `${c.kind} on ${c.parcel}: ${c.metric}.`],
            ["Evidence supporting the observation", `${sup} items, mainly system measurements after alignment.`],
            ["Evidence that introduces uncertainty", `${con} items: capture-date gap and a possible positional offset.`],
            ["Possible contributing factors", "Digitization accuracy, georeferencing shift, unrecorded subdivision, real change on the ground."],
            ["Evidence gaps", "No field survey for this parcel; Source B lacks accuracy metadata."],
            ["Suggested investigation focus", "Compare against GNSS control points and recent imagery before verification."],
            ["Confidence explanation", `Detection confidence ${Math.round(c.conf * 100)}% reflects measurement strength; interpretation confidence is lower because of the gaps above.`],
          ].map(([h, t]) => (
            <div key={h}><p className="label-technical">{h}</p><p className="mt-1 text-foreground">{t}</p></div>
          ))}
        </div>
      )}

      {tab === "Spatial" && (
        <div className="text-xs text-muted-foreground">
          <svg viewBox="0 0 200 120" className="h-40 w-full rounded-lg border border-border" strokeWidth="1.5">
            <path d="M30 20 H150 V100 H30 Z" className="fill-teal/15 stroke-teal" />
            <path d="M40 14 H162 V96 H40 Z" className="fill-none stroke-saffron" strokeDasharray="4 3" />
            {[[30, 20], [150, 100], [30, 100]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="3" className="fill-cyan" />)}
          </svg>
          <p className="mt-2">Teal: Source A · Saffron: Source B · Cyan: GNSS control points (illustrative). Open the Map page for the full compare view.</p>
        </div>
      )}

      {tab === "Temporal" && (
        <ol className="space-y-2 border-l border-border pl-3 text-xs">
          {[["2021", "Municipal capture"], ["2023", "Municipal update"], ["2024", "Revenue survey"], ["2025", "Drone imagery"], ["Now", `${c.id} detected`]].map(([y, t]) => (
            <li key={y}><span className="font-mono text-primary">{y}</span> <span className="text-foreground">{t}</span></li>
          ))}
        </ol>
      )}

      {tab === "Provenance" && (
        <ol className="space-y-2 text-xs">
          {["Source files ingested (immutable originals)", "CRS transformed → EPSG:32643", "Geometry validated, ring orientation normalized", "Control-point alignment (RMSE 0.71 m)", "Entity matched by overlap + ID", `Consistency rule raised ${c.id}`].map((s, i) => (
            <li key={s} className="flex gap-2"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-muted font-mono text-[10px]">{i + 1}</span><span className="text-foreground">{s}</span></li>
          ))}
        </ol>
      )}
    </Panel>
  );
}
