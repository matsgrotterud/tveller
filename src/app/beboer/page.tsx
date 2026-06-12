"use client";

import {
  ArrowRight,
  CalendarDays,
  FileText,
  Home,
  MessageSquare,
  Plus,
  ShoppingBag,
  Sparkles,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { StatusPill } from "@/components/shared/pills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate, formatRelative, formatTime, formatWeekday } from "@/lib/format";
import { DOCUMENTS, daysAgo, getSupplierByOrg } from "@/lib/seed";
import { OPEN_STATUSES, RESIDENT_STATUS_EXPLANATION } from "@/lib/status";
import { useStore } from "@/lib/store";

const QUICK_ACTIONS = [
  { label: "Ny reklamasjon", href: "/beboer/reklamasjoner/ny", icon: Plus, primary: true },
  { label: "Mine dokumenter", href: "/beboer/dokumenter", icon: FileText },
  { label: "Kalender", href: "/beboer/kalender", icon: CalendarDays },
  { label: "Meldinger", href: "/beboer/meldinger", icon: MessageSquare },
  { label: "Markedsplass", href: "/beboer/markedsplass", icon: ShoppingBag },
  { label: "Tilvalg", href: "/beboer/tilvalg", icon: Sparkles },
];

export default function MittHjemPage() {
  const { claims, appointments, notifications } = useStore();

  const myClaims = claims.filter((c) => c.resident_user_id === "u-lise");
  const openClaims = myClaims.filter((c) => OPEN_STATUSES.includes(c.status));
  const actionNeeded = myClaims.filter((c) => ["Tidspunkt foreslått", "Klar for kontroll", "Trenger mer info", "Ferdigstilt"].includes(c.status));
  const nextAppointment = appointments
    .filter((a) => a.resident_user_id === "u-lise" && new Date(a.start_at) > new Date() && a.status === "bekreftet")
    .sort((a, b) => a.start_at.localeCompare(b.start_at))[0];
  const myDocs = DOCUMENTS.filter((d) => d.unit_id === "unit-c103").slice(0, 3);
  const feed = notifications.filter((n) => n.user_role === "beboer").slice(0, 4);

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Hilsen */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hei, Lise 👋</h1>
        <p className="text-sm text-muted-foreground">Her er oversikten over boligen din.</p>
      </div>

      {/* Boligkort */}
      <Card className="overflow-hidden">
        <div className="gradient-brand p-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-evergreen-200">Min bolig</p>
              <p className="mt-1 text-xl font-semibold">Leilighet C103</p>
              <p className="text-sm text-evergreen-100">Middelthunet · Bygg C · Middelthuns gate 17C, 0368 Oslo</p>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10">
              <Home className="h-5 w-5" aria-hidden />
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge className="bg-white/15 text-white">Overtatt {formatDate(daysAgo(145))}</Badge>
            <Badge className="bg-white/15 text-white">78 m² · 2 soverom</Badge>
            <Badge className="bg-evergreen-500/30 text-evergreen-50">Protokoll signert</Badge>
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border text-center">
          <Link href="/beboer/reklamasjoner" className="p-3 hover:bg-muted/50">
            <p className="text-lg font-semibold">{openClaims.length}</p>
            <p className="text-xs text-muted-foreground">Åpne saker</p>
          </Link>
          <Link href="/beboer/kalender" className="p-3 hover:bg-muted/50">
            <p className="text-lg font-semibold">{nextAppointment ? formatWeekday(nextAppointment.start_at).split(" ")[0] : "–"}</p>
            <p className="text-xs text-muted-foreground">Neste avtale</p>
          </Link>
          <Link href="/beboer/dokumenter" className="p-3 hover:bg-muted/50">
            <p className="text-lg font-semibold">{DOCUMENTS.filter((d) => d.visibility === "resident").length}</p>
            <p className="text-xs text-muted-foreground">Dokumenter</p>
          </Link>
        </div>
      </Card>

      {/* Dette skjer nå */}
      {actionNeeded.length > 0 && (
        <Card className="border-fjord-200 bg-fjord-50/40 p-4">
          <p className="text-sm font-semibold text-fjord-800">Dette skjer nå</p>
          <div className="mt-2 space-y-2">
            {actionNeeded.slice(0, 2).map((c) => (
              <Link key={c.id} href={`/beboer/reklamasjoner/${c.id}`} className="flex items-center gap-3 rounded-xl border border-fjord-100 bg-surface p-3 hover:border-fjord-300">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{RESIDENT_STATUS_EXPLANATION[c.status]}</p>
                </div>
                <StatusPill status={c.status} className="shrink-0" />
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Hurtighandlinger */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground">Hurtighandlinger</h2>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={
                a.primary
                  ? "flex flex-col items-center gap-2 rounded-2xl gradient-brand p-4 text-white shadow-sm transition-transform hover:scale-[1.02]"
                  : "flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-4 transition-colors hover:bg-evergreen-50/60"
              }
            >
              <a.icon className={a.primary ? "h-5 w-5" : "h-5 w-5 text-evergreen-700"} aria-hidden />
              <span className="text-center text-xs font-medium leading-tight">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Kommende avtale */}
      {nextAppointment && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Kommende avtale</h2>
            <Link href="/beboer/kalender" className="text-xs font-medium text-evergreen-700 hover:underline">
              Se kalender
            </Link>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-evergreen-50 text-center">
              <CalendarDays className="h-5 w-5 text-evergreen-700" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium capitalize">{formatWeekday(nextAppointment.start_at)}</p>
              <p className="text-xs text-muted-foreground">
                kl. {formatTime(nextAppointment.start_at)}–{formatTime(nextAppointment.end_at)} · {getSupplierByOrg(nextAppointment.supplier_org_id)?.name}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Viktige dokumenter */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Viktige dokumenter</h2>
          <Link href="/beboer/dokumenter" className="text-xs font-medium text-evergreen-700 hover:underline">
            Se alle
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {myDocs.map((d) => (
            <Link key={d.id} href="/beboer/dokumenter" className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/50">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-fjord-50 text-fjord-700">
                <FileText className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{d.title}</p>
                <p className="text-xs text-muted-foreground">{d.category} · v{d.version}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
          ))}
        </div>
      </Card>

      {/* Varslingsfeed */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold">Siste oppdateringer</h2>
        <div className="mt-3 space-y-3">
          {feed.map((n) => (
            <div key={n.id} className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-evergreen-500" aria-hidden />
              <div className="min-w-0">
                <p className="text-sm font-medium leading-tight">{n.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{formatRelative(n.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Ny sak CTA */}
      <Link href="/beboer/reklamasjoner/ny">
        <Button className="w-full" size="lg">
          <Wrench aria-hidden />
          Meld ny reklamasjon
        </Button>
      </Link>
    </div>
  );
}
