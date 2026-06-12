"use client";

import {
  AlertTriangle,
  Building2,
  Clock,
  FileText,
  FolderOpen,
  Home,
  RefreshCcw,
  Scale,
  Sparkles,
  Timer,
  Upload,
  UserPlus,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AIDisclaimer, AIInsightCard } from "@/components/shared/ai-insight-card";
import { MetricCard } from "@/components/shared/metric-card";
import { RiskPill, StatusPill } from "@/components/shared/pills";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AI_DASHBOARD_INSIGHTS } from "@/lib/ai";
import { daysUntil, formatNOK, formatNumber, formatRelative } from "@/lib/format";
import { CLAIMS_OVER_TIME, PROJECTS, SUPPLIERS, getUnit } from "@/lib/seed";
import { OPEN_STATUSES } from "@/lib/status";
import { useStore } from "@/lib/store";

export default function UtbyggerDashboardPage() {
  const { claims, notifications, toast } = useStore();

  const open = claims.filter((c) => OPEN_STATUSES.includes(c.status));
  const newClaims = claims.filter((c) => c.status === "Sendt inn" || c.status === "Mottatt");
  const resolved = claims.filter((c) => ["Ferdigstilt", "Bekreftet av beboer", "Arkivert"].includes(c.status));
  const deadlineRisk = claims.filter((c) => c.deadline_risk_level === "høy" && OPEN_STATUSES.includes(c.status));
  const legalRisk = claims.filter((c) => c.legal_risk_level === "høy" && OPEN_STATUSES.includes(c.status));
  const reopened = claims.filter((c) => c.reopened);
  const nearingDeadline = open
    .filter((c) => c.due_at)
    .sort((a, b) => (a.due_at ?? "").localeCompare(b.due_at ?? ""))
    .slice(0, 5);
  const recentNotifications = notifications.filter((n) => n.user_role === "utbygger").slice(0, 5);
  const totalUnits = PROJECTS.reduce((s, p) => s + p.units_count, 0);

  const projectComparison = PROJECTS.filter((p) => p.units_count > 0 && p.status !== "planning").map((p) => ({
    name: p.name,
    saker: claims.filter((c) => c.project_id === p.id).length || p.open_claims,
  }));

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">God morgen, Kari</h1>
          <p className="text-sm text-muted-foreground">Porteføljeoversikt for Nordheim Bolig AS</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/utbygger/import">
            <Button variant="outline" size="sm">
              <Upload aria-hidden />
              Importer enheter
            </Button>
          </Link>
          <Link href="/utbygger/invitasjoner">
            <Button variant="outline" size="sm">
              <UserPlus aria-hidden />
              Inviter beboere
            </Button>
          </Link>
          <Link href="/utbygger/dokumenter">
            <Button variant="outline" size="sm">
              <FileText aria-hidden />
              Last opp FDV
            </Button>
          </Link>
          <Button size="sm" onClick={() => toast({ title: "Rapport eksportert", description: "Porteføljerapport (PDF) er generert.", variant: "success" })}>
            <FolderOpen aria-hidden />
            Eksporter rapport
          </Button>
        </div>
      </div>

      {/* Nøkkeltall */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <MetricCard label="Antall enheter" value={formatNumber(totalUnits)} icon={Home} hint={`${PROJECTS.length} prosjekter`} />
        <MetricCard label="Nye saker" value={newClaims.length} icon={Wrench} trend="+3 denne uken" trendPositive={false} />
        <MetricCard label="Åpne saker" value={open.length} icon={FolderOpen} hint={`${reopened.length} gjenåpnet`} />
        <MetricCard label="Løste saker" value={resolved.length} icon={RefreshCcw} trend="+12 % siste 30 d" trendPositive />
        <MetricCard label="Snitt løsningstid" value="4,2 d" icon={Clock} trend="-0,8 d" trendPositive />
        <MetricCard label="Saker med fristfare" value={deadlineRisk.length} icon={Timer} hint="intern frist < 3 dager" />
        <MetricCard label="Juridisk risiko" value={legalRisk.length} icon={Scale} hint="krever oppfølging" />
        <MetricCard label="Gjenåpnede saker" value={reopened.length} icon={AlertTriangle} hint="8,4 % av løste" />
        <MetricCard label="Tid spart (est.)" value="214 t" icon={Sparkles} hint="siste 90 dager" />
        <MetricCard label="Estimert kostnad" value={formatNOK(486000)} icon={Building2} hint="åpne saker" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {/* AI: dette bør du gjøre i dag */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-600" aria-hidden />
              Dette bør du gjøre i dag
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {AI_DASHBOARD_INSIGHTS.slice(0, 4).map((i) => (
              <AIInsightCard key={i.id} icon={i.icon} text={i.text} detail={i.detail} confidence={i.confidence} />
            ))}
            <AIDisclaimer className="pt-1" />
          </CardContent>
        </Card>

        {/* Saker over tid */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Saker over tid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CLAIMS_OVER_TIME} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e7e4" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#5c6b64" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#5c6b64" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e7e4", fontSize: 13 }} />
                  <Line type="monotone" dataKey="nye" name="Nye saker" stroke="#1d748d" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="løste" name="Løste saker" stroke="#2b6655" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {/* Saker nær frist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-amber-600" aria-hidden />
              Saker nær frist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {nearingDeadline.map((c) => {
              const unit = getUnit(c.unit_id);
              const days = c.due_at ? daysUntil(c.due_at) : null;
              return (
                <Link key={c.id} href={`/utbygger/reklamasjoner/${c.id}`} className="flex items-center justify-between gap-2 rounded-xl border border-border p-3 hover:bg-evergreen-50/40">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.case_number} · {unit?.unit_number}</p>
                  </div>
                  <RiskPill level={days !== null && days <= 2 ? "høy" : days !== null && days <= 5 ? "middels" : "lav"} label={days !== null ? `${days} d igjen` : "–"} />
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Prosjektsammenligning */}
        <Card>
          <CardHeader>
            <CardTitle>Prosjektsammenligning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectComparison} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e7e4" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#5c6b64" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#5c6b64" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e7e4", fontSize: 13 }} />
                  <Bar dataKey="saker" name="Saker" fill="#2b6655" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Leverandørytelse */}
        <Card>
          <CardHeader>
            <CardTitle>Leverandørytelse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[...SUPPLIERS]
              .sort((a, b) => b.score - a.score)
              .slice(0, 5)
              .map((s) => (
                <Link key={s.id} href="/utbygger/underleverandorer" className="flex items-center justify-between gap-2 rounded-xl border border-border p-3 hover:bg-evergreen-50/40">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.trades.join(", ")} · {s.avg_response_time_hours} t responstid</p>
                  </div>
                  <span className={`text-sm font-semibold ${s.score >= 85 ? "text-evergreen-700" : s.score >= 75 ? "text-amber-700" : "text-red-700"}`}>{s.score}</span>
                </Link>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Siste hendelser */}
      <Card>
        <CardHeader>
          <CardTitle>Siste hendelser</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {recentNotifications.map((n) => {
            const claim = n.entity_type === "claim" ? claims.find((c) => c.id === n.entity_id) : null;
            return (
              <div key={n.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-evergreen-50 text-evergreen-700">
                  <Wrench className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{n.body}</p>
                  <p className="text-xs text-muted-foreground">{formatRelative(n.created_at)}</p>
                </div>
                {claim && <StatusPill status={claim.status} className="hidden sm:inline-flex" />}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
