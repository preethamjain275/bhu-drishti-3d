import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Download } from "lucide-react";
import { PageHeader, Panel } from "@/components/common/ModulePage";
import { DemoDataNotice } from "@/components/common/TrustBadge";
import { Button } from "@/components/ui/button";
import { useVerificationQueue } from "@/hooks/use-verification";
import { polyArea } from "@/lib/verification";
import { download } from "@/lib/export";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/records")({
  validateSearch: (search: Record<string, unknown>) => search,
  head: () => ({
    meta: [
      { title: "Verified Record Registry — Bhu Drishti 3D" },
      { name: "description", content: "Records verified by an authorized human reviewer, with full lineage from sources to decision." },
      { property: "og:title", content: "Verified Record Registry — Bhu Drishti 3D" },
      { property: "og:description", content: "Human-verified harmonized land records with lineage and accepted differences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RecordsPage,
});

function RecordsPage() {
  const queue = useVerificationQueue();
  const recs = queue.filter((i) => i.verified);
  const [sel, setSel] = useState<string | null>(null);
  const cur = recs.find((r) => r.id === sel) ?? recs[0];

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Records" title="Verified Record Registry" description="Only records explicitly accepted by a human reviewer appear here. Application-level verification in a demo — not an official land record." />
      <DemoDataNotice />
      {recs.length === 0 ? (
        <Panel><p className="py-10 text-center text-sm text-muted-foreground">No verified records yet. <Link to="/verification" className="text-primary underline">Review a candidate</Link> to create one.</p></Panel>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
          <Panel title="Registry" meta={<span className="label-technical">{recs.length}</span>}>
            <ul className="space-y-2">
              {recs.map((r) => (
                <li key={r.id}><button onClick={() => setSel(r.id)} className={cn("min-h-11 w-full rounded-lg border p-3 text-left text-xs", cur?.id === r.id ? "border-verified/60" : "border-border")}>
                  <p className="font-mono text-verified">✓ {r.verified!.id}</p><p className="text-muted-foreground">{r.location} · v{r.verified!.version} · {new Date(r.verified!.at).toLocaleDateString()}</p>
                </button></li>
              ))}
            </ul>
          </Panel>
          {cur?.verified && (
            <div className="space-y-4">
              <Panel title={cur.verified.id} meta={<Button size="sm" variant="outline" onClick={() => download(`${cur.verified!.id}.json`, JSON.stringify({ demo: true, record: cur.verified, decision: cur.decision, versions: cur.versions, audit: cur.events }, null, 2))}><Download className="size-4" />Export JSON</Button>}>
                <p className="label-technical text-verified">Verified by authorized human reviewer</p>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <svg viewBox="0 0 320 240" className="spatial-grid-fine w-full rounded-lg border border-border" role="img" aria-label="Verified geometry">
                    {cur.sources.map((s) => <polygon key={s.name} points={s.geometry.join(" ")} className="fill-none stroke-muted-foreground" strokeDasharray="3 3" />)}
                    <polygon points={cur.verified.geometry.join(" ")} className="fill-verified/15 stroke-verified" strokeWidth="2.5" />
                  </svg>
                  <dl className="grid grid-cols-2 gap-y-1.5 text-xs">
                    {[...Object.entries(cur.verified.attributes), ["computed area", `${(polyArea(cur.verified.geometry) * 0.044).toFixed(1)} m²`], ["reviewer", cur.verified.reviewer], ["verified at", new Date(cur.verified.at).toLocaleString()], ["from candidate", `v${cur.verified.version}`], ["decision reason", cur.decision?.reason ?? ""]].map(([k, v]) => (
                      <div key={k} className="contents"><dt className="font-mono text-muted-foreground">{k}</dt><dd className="text-right text-ivory">{v}</dd></div>
                    ))}
                  </dl>
                </div>
              </Panel>
              <div className="grid gap-4 md:grid-cols-2">
                <Panel title="Lineage">
                  <ol className="space-y-1 text-xs text-muted-foreground">
                    {cur.sources.map((s) => <li key={s.name}>Source · {s.name} (immutable)</li>)}
                    {cur.versions.map((v) => <li key={v.v}>Candidate v{v.v} · {v.changes.join("; ")}</li>)}
                    <li className="text-verified">Verified record · {cur.verified.id}</li>
                  </ol>
                </Panel>
                <Panel title="Accepted differences & conflicts">
                  {cur.verified.differences.map((d) => <p key={d.conflict} className="text-xs"><span className="text-ivory">{d.conflict}</span> — <span className="text-saffron">{d.status}</span> <span className="text-muted-foreground">({d.reason})</span></p>)}
                </Panel>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
