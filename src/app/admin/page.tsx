"use client";

import { Activity, ArrowRight, Building2, CreditCard, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MetricCard } from "@/components/shared/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNOK, formatNumber, formatRelative } from "@/lib/format";
import { MRR_HISTORY, TENANTS, USAGE_METRICS } from "@/lib/seed";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const SYSTEM_EVENTS = [
  { id: "se1", label: "Stripe-webhook (mock): invoice.paid for Urban Eiendom AS", time: -2, ok: true },
  { id: "se2", label: "SMS-kø prosessert: 412 meldinger sendt siste døgn", time: -5, ok: true },
  { id: "se3", label: "Fjordbyen Utvikling AS startet prøveperiode (Starter)", time: -18, ok: true },
  { id: "se4", label: "AI-tjeneste: forhøyet responstid 14:02–14:11 (løst)", time: -26, ok: false },
];

export default function AdminOversikt() {
  const { auditEvents } = useStore();

  const mrr = TENANTS.reduce((s, t) => s + t.mrr, 0);
  const active = TENANTS.filter((t) => t.status === "active").length;
  const trial = TENANTS.filter((t) => t.status === "trial").length;
  const churnRisk = TENANTS.filter((t) => t.health_score < 70);

  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">SaaS-oversikt</h1>
        <p className="text-sm text-muted-foreground">TvellerOS plattformdrift og forretningsmetrikker</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="MRR" value={formatNOK(mrr)} icon={TrendingUp} trend="+8,2 %" trendPositive />
        <MetricCard label="ARR" value={formatNOK(mrr * 12)} icon={CreditCard} />
        <MetricCard label="Aktive kunder" value={active} icon={Building2} hint={`${trial} i prøveperiode`} />
        <MetricCard label="Aktive enheter" value={formatNumber(376)} hint="på tvers av kunder" />
        <MetricCard label="Saker behandlet" value={formatNumber(1284)} hint="siste 12 mnd" />
        <MetricCard label="Marketplace GMV" value={formatNOK(184000)} trend="+14 %" trendPositive hint="prov. 18 400 kr" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        {/* MRR-graf */}
        <Card>
          <CardHeader><CardTitle>MRR-utvikling</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MRR_HISTORY} margin={{ top: 4, right: 8, bottom: 0, left: -12 }}>
                  <defs>
                    <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2b6655" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#2b6655" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e7e4" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#5c6b64" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#5c6b64" tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e7e4", fontSize: 13 }} formatter={(v) => [formatNOK(Number(v)), "MRR"]} />
                  <Area type="monotone" dataKey="mrr" stroke="#2b6655" strokeWidth={2} fill="url(#mrrFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Kundehelse */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Kundehelse</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/kunder">
                Alle kunder
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
          <ul className="mt-3 space-y-2">
            {TENANTS.map((t) => (
              <li key={t.id}>
                <Link href={`/admin/kunder/${t.id}`} className="block">
                  <div className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:border-evergreen-300">
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs capitalize text-muted-foreground">{t.plan} · {t.mrr > 0 ? `${formatNOK(t.mrr)}/mnd` : "prøveperiode"}</p>
                    </div>
                    <span className={cn("text-lg font-semibold", t.health_score >= 80 ? "text-evergreen-700" : t.health_score >= 70 ? "text-amber-700" : "text-red-700")}>
                      {t.health_score}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {churnRisk.length > 0 && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-800">
              Churn-risiko: {churnRisk.map((t) => t.name).join(", ")} har lav helsescore. Lav aktivering i prøveperioden.
            </p>
          )}
        </Card>
      </div>

      {/* Forbruk */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-evergreen-700" aria-hidden />
            Plattformforbruk (alle kunder, denne måneden)
          </h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "SMS sendt", value: "4 218" },
              { label: "E-poster", value: "18 304" },
              { label: "AI-kall", value: "2 941" },
              { label: "Lagring", value: "212 GB" },
            ].map((m) => (
              <div key={m.label} className="rounded-xl bg-muted p-3">
                <dt className="text-xs text-muted-foreground">{m.label}</dt>
                <dd className="mt-0.5 text-lg font-semibold">{m.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            Nordheim Bolig AS bruker {USAGE_METRICS.find((m) => m.type === "sms")?.used} av {USAGE_METRICS.find((m) => m.type === "sms")?.included} inkluderte SMS.
          </p>
        </Card>

        {/* Systemhendelser */}
        <Card className="p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Activity className="h-4 w-4 text-evergreen-700" aria-hidden />
            Siste systemhendelser
          </h2>
          <ul className="mt-3 space-y-2.5">
            {SYSTEM_EVENTS.map((e) => (
              <li key={e.id} className="flex items-start gap-2.5 text-sm">
                <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", e.ok ? "bg-evergreen-500" : "bg-amber-500")} aria-hidden />
                <div>
                  <p>{e.label}</p>
                  <p className="text-xs text-muted-foreground">{Math.abs(e.time)} timer siden</p>
                </div>
              </li>
            ))}
            {auditEvents.filter((a) => a.sensitive).slice(0, 1).map((a) => (
              <li key={a.id} className="flex items-start gap-2.5 text-sm">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" aria-hidden />
                <div>
                  <p>
                    Sensitiv hendelse: {a.action} <Badge className="ml-1 bg-red-50 text-red-700">logget</Badge>
                  </p>
                  <p className="text-xs text-muted-foreground">{a.actor} · {formatRelative(a.created_at)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
