"use client";

import { ArrowRight, CalendarDays, ClipboardList, RefreshCw, Sparkles, Star, Timer } from "lucide-react";
import Link from "next/link";
import { MetricCard } from "@/components/shared/metric-card";
import { AIBadge, WorkOrderStatusPill } from "@/components/shared/pills";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatRelative, formatTime, formatWeekday } from "@/lib/format";
import { SUPPLIERS, getUnit, getUser } from "@/lib/seed";
import { useStore } from "@/lib/store";

export default function LeverandorDashboard() {
  const { workOrders, appointments, claims, notifications } = useStore();

  const supplier = SUPPLIERS.find((s) => s.organization_id === "org-bareror") ?? SUPPLIERS[0];
  const newOrders = workOrders.filter((w) => w.status === "Ny");
  const awaitingResident = workOrders.filter((w) => w.status === "Tidspunkt foreslått");
  const inProgress = workOrders.filter((w) => w.status === "Pågår");
  const reopened = claims.filter((c) => c.status === "Gjenåpnet");

  const today = new Date().toDateString();
  const todaysAppointments = appointments.filter((a) => new Date(a.start_at).toDateString() === today);
  const supplierNotifications = notifications.filter((n) => n.user_role === "leverandor").slice(0, 4);

  const nextBest = newOrders[0] ?? workOrders.find((w) => w.status === "Akseptert");

  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">God dag, Thomas</h1>
        <p className="text-sm text-muted-foreground">Her er status for Bare Rør AS i dag</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Nye arbeidsordre" value={newOrders.length} icon={ClipboardList} />
        <MetricCard label="Avtaler i dag" value={todaysAppointments.length} icon={CalendarDays} />
        <MetricCard label="Venter på beboer" value={awaitingResident.length} hint="tidspunkt foreslått" />
        <MetricCard label="Pågående arbeid" value={inProgress.length} />
        <MetricCard label="Gjenåpnede saker" value={reopened.length} icon={RefreshCw} trend={reopened.length > 0 ? "krever oppfølging" : undefined} trendPositive={false} />
        <MetricCard label="Kvalitetsscore" value={supplier.score} icon={Star} trend="+2 denne mnd." trendPositive />
      </div>

      {/* Neste beste handling */}
      {nextBest && (
        <Card className="border-violet-200 bg-violet-50/40 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-violet-100 p-2 text-violet-700">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Neste beste handling</p>
                  <AIBadge />
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {nextBest.status === "Ny"
                    ? `Aksepter «${nextBest.title}» (${nextBest.wo_number}) – prioritet ${nextBest.priority}.`
                    : `Foreslå tidspunkter for «${nextBest.title}» – beboer venter på avtale.`}
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href={`/leverandor/arbeidsordre/${nextBest.id}`}>
                Åpne arbeidsordre
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Dagens avtaler */}
        <Card className="p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="h-4 w-4 text-evergreen-700" aria-hidden />
            Kommende avtaler
          </h2>
          <div className="mt-3 space-y-2">
            {appointments.length === 0 && <p className="text-sm text-muted-foreground">Ingen avtaler planlagt.</p>}
            {[...appointments]
              .sort((a, b) => a.start_at.localeCompare(b.start_at))
              .slice(0, 4)
              .map((a) => {
                const claim = claims.find((c) => c.id === a.claim_id);
                return (
                  <div key={a.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">{claim?.title}</p>
                      <p className="text-xs capitalize text-muted-foreground">
                        {formatWeekday(a.start_at)} · {formatTime(a.start_at)}–{formatTime(a.end_at)} · {a.location}
                      </p>
                    </div>
                    <Timer className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  </div>
                );
              })}
          </div>
        </Card>

        {/* Arbeidsordre som trenger handling */}
        <Card className="p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <ClipboardList className="h-4 w-4 text-evergreen-700" aria-hidden />
            Trenger handling
          </h2>
          <div className="mt-3 space-y-2">
            {workOrders
              .filter((w) => ["Ny", "Akseptert", "Pågår"].includes(w.status))
              .slice(0, 4)
              .map((w) => {
                const claim = claims.find((c) => c.id === w.claim_id);
                const unit = claim ? getUnit(claim.unit_id) : undefined;
                const resident = claim ? getUser(claim.resident_user_id) : undefined;
                return (
                  <Link key={w.id} href={`/leverandor/arbeidsordre/${w.id}`} className="block">
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-border p-3 transition-colors hover:border-evergreen-300">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{w.title}</p>
                        <p className="text-xs text-muted-foreground">{w.wo_number} · {unit?.unit_number} · {resident?.name}</p>
                      </div>
                      <WorkOrderStatusPill status={w.status} />
                    </div>
                  </Link>
                );
              })}
          </div>
        </Card>
      </div>

      {/* Varsler */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold">Siste varsler</h2>
        <ul className="mt-3 space-y-2.5">
          {supplierNotifications.map((n) => (
            <li key={n.id} className="flex items-start gap-3 text-sm">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-fjord-500" aria-hidden />
              <div>
                <p className="font-medium">{n.title}</p>
                <p className="text-muted-foreground">{n.body}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{formatRelative(n.created_at)}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
