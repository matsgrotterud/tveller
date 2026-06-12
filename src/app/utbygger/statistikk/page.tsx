"use client";

import { Sparkles } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AIDisclaimer, AIInsightCard } from "@/components/shared/ai-insight-card";
import { MetricCard } from "@/components/shared/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AI_DASHBOARD_INSIGHTS } from "@/lib/ai";
import { CLAIMS_BY_TRADE, CLAIMS_OVER_TIME, PROJECTS, ROOM_CATEGORY_HEATMAP, SUPPLIERS } from "@/lib/seed";
import { OPEN_STATUSES } from "@/lib/status";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const STATUS_COLORS = ["#1d748d", "#2b6655", "#b45309", "#b3261e", "#7c3aed", "#5c6b64"];

export default function StatistikkPage() {
  const { claims } = useStore();

  const statusDist = [
    { name: "Åpne", value: claims.filter((c) => OPEN_STATUSES.includes(c.status)).length },
    { name: "Ferdigstilt", value: claims.filter((c) => ["Ferdigstilt", "Bekreftet av beboer"].includes(c.status)).length },
    { name: "Avvist", value: claims.filter((c) => c.status === "Avvist").length },
    { name: "Arkivert", value: claims.filter((c) => c.status === "Arkivert").length },
  ];

  const supplierChart = SUPPLIERS.map((s) => ({ name: s.name.replace(" AS", ""), saker: s.cases_open + s.cases_closed, gjenåpning: s.reopened_rate }));

  const histogram = [
    { bucket: "0–2 d", saker: 14 },
    { bucket: "3–5 d", saker: 22 },
    { bucket: "6–10 d", saker: 17 },
    { bucket: "11–20 d", saker: 9 },
    { bucket: "21+ d", saker: 5 },
  ];

  const heatMax = Math.max(...ROOM_CATEGORY_HEATMAP.flatMap((r) => [r.Overflater, r["Rør og sanitær"], r.Elektro, r.Fukt, r.Annet]));

  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Statistikk og innsikt</h1>
        <p className="text-sm text-muted-foreground">Kvalitetsintelligens på tvers av porteføljen</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <MetricCard label="Saker per enhet" value="0,46" hint="porteføljesnitt" />
        <MetricCard label="Snitt responstid" value="11 t" trend="-3 t" trendPositive />
        <MetricCard label="Snitt løsningstid" value="4,2 d" trend="-0,8 d" trendPositive />
        <MetricCard label="Gjenåpningsrate" value="6,8 %" trend="+1,2 pp" trendPositive={false} />
        <MetricCard label="Beboertilfredshet" value="4,5 / 5" trend="+0,2" trendPositive />
        <MetricCard label="Avtaler gjennomført" value="94 %" hint="uten ombooking" />
      </div>

      {/* AI-innsikt */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-600" aria-hidden />
            AI-innsikt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
            {AI_DASHBOARD_INSIGHTS.map((i) => (
              <AIInsightCard key={i.id} icon={i.icon} text={i.text} detail={i.detail} confidence={i.confidence} />
            ))}
          </div>
          <AIDisclaimer className="mt-3" />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Saker over tid</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CLAIMS_OVER_TIME} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e7e4" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#5c6b64" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#5c6b64" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e7e4", fontSize: 13 }} />
                  <Line type="monotone" dataKey="nye" name="Nye" stroke="#1d748d" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="løste" name="Løste" stroke="#2b6655" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Saker per fag</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CLAIMS_BY_TRADE} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e7e4" />
                  <XAxis dataKey="trade" tick={{ fontSize: 11 }} stroke="#5c6b64" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#5c6b64" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e7e4", fontSize: 13 }} />
                  <Bar dataKey="antall" name="Saker" fill="#2b6655" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Statusfordeling</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusDist} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {statusDist.map((_, i) => (
                      <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e7e4", fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {statusDist.map((s, i) => (
                <span key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[i] }} aria-hidden />
                  {s.name} ({s.value})
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tid til løsning (histogram)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histogram} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e7e4" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 12 }} stroke="#5c6b64" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#5c6b64" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e7e4", fontSize: 13 }} />
                  <Bar dataKey="saker" name="Saker" fill="#1d748d" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap rom vs kategori */}
      <Card>
        <CardHeader><CardTitle>Rom vs. feilkategori</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-semibold uppercase text-muted-foreground">Rom</th>
                  {["Overflater", "Rør og sanitær", "Elektro", "Fukt", "Annet"].map((c) => (
                    <th key={c} scope="col" className="px-3 py-2 text-center text-xs font-semibold uppercase text-muted-foreground">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROOM_CATEGORY_HEATMAP.map((row) => (
                  <tr key={row.room} className="border-t border-border">
                    <th scope="row" className="px-3 py-2 text-left font-medium">{row.room}</th>
                    {(["Overflater", "Rør og sanitær", "Elektro", "Fukt", "Annet"] as const).map((c) => {
                      const v = row[c];
                      const intensity = v / heatMax;
                      return (
                        <td key={c} className="px-3 py-2 text-center">
                          <span
                            className={cn("inline-grid h-9 w-12 place-items-center rounded-lg text-sm font-medium", v === 0 && "text-muted-foreground")}
                            style={{ background: v === 0 ? "var(--color-muted)" : `rgba(43, 102, 85, ${0.12 + intensity * 0.65})`, color: intensity > 0.55 ? "white" : undefined }}
                          >
                            {v}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Leverandør-leaderboard */}
        <Card>
          <CardHeader><CardTitle>Leverandørbenchmark</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={supplierChart} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e7e4" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#5c6b64" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#5c6b64" width={110} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e7e4", fontSize: 13 }} />
                  <Bar dataKey="saker" name="Saker totalt" fill="#2b6655" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Prosjektbenchmark */}
        <Card>
          <CardHeader><CardTitle>Prosjektbenchmark</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase text-muted-foreground">
                  <th scope="col" className="pb-2">Prosjekt</th>
                  <th scope="col" className="pb-2 text-right">Saker/enhet</th>
                  <th scope="col" className="pb-2 text-right">FDV</th>
                  <th scope="col" className="pb-2 text-right">Aktivering</th>
                  <th scope="col" className="pb-2 text-right">Helse</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS.filter((p) => p.status !== "planning").map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="py-2.5 font-medium">{p.name}</td>
                    <td className="py-2.5 text-right">{(p.open_claims / Math.max(1, p.handovers_completed)).toFixed(2)}</td>
                    <td className="py-2.5 text-right">{p.fdv_completeness} %</td>
                    <td className="py-2.5 text-right">{p.resident_activation} %</td>
                    <td className={cn("py-2.5 text-right font-semibold", p.health_score >= 85 ? "text-evergreen-700" : p.health_score >= 75 ? "text-amber-700" : "text-red-700")}>{p.health_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
