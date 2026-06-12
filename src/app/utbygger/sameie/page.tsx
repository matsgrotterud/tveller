"use client";

import { Building2, FileText, Megaphone, Plus, Users } from "lucide-react";
import { StatusPill } from "@/components/shared/pills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate, formatRelative } from "@/lib/format";
import { COMMON_AREA_CLAIMS, SAMEIE_ANNOUNCEMENTS, SAMEIE_MEETINGS } from "@/lib/seed";
import { useStore } from "@/lib/store";

const BOARD = [
  { name: "Henrik Lund", role: "Styreleder", unit: "B402" },
  { name: "Amalie Berg", role: "Styremedlem", unit: "A201" },
  { name: "Eirik Johansen", role: "Varamedlem", unit: "A305" },
];

export default function SameieAdminPage() {
  const { toast } = useStore();

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sameie</h1>
          <p className="text-sm text-muted-foreground">Sameiet Middelthunet · 182 enheter · konstituert</p>
        </div>
        <Button onClick={() => toast({ title: "Kunngjøring publisert", description: "Alle beboere i Middelthunet får varsel (demo).", variant: "success" })}>
          <Plus aria-hidden />
          Ny kunngjøring
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Fellesarealsaker */}
        <Card className="p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Building2 className="h-4 w-4 text-evergreen-700" aria-hidden />
            Fellesarealsaker
          </h2>
          <div className="mt-3 space-y-2.5">
            {COMMON_AREA_CLAIMS.map((c) => (
              <div key={c.id} className="rounded-xl border border-border p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{c.title}</p>
                  <StatusPill status={c.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.area} · Meldt av {c.reported_by} · {formatRelative(c.created_at)}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Fellesarealsaker følger samme flyt som vanlige reklamasjoner, men er synlige for styret.
          </p>
        </Card>

        {/* Styret */}
        <Card className="p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-evergreen-700" aria-hidden />
            Styret
          </h2>
          <ul className="mt-3 space-y-2">
            {BOARD.map((m) => (
              <li key={m.name} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">Enhet {m.unit}</p>
                </div>
                <Badge className="bg-fjord-50 text-fjord-700">{m.role}</Badge>
              </li>
            ))}
          </ul>
          <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => toast({ title: "Invitasjon sendt", description: "Nytt styremedlem invitert med styretilgang (demo).", variant: "success" })}>
            Inviter styremedlem
          </Button>
        </Card>

        {/* Kunngjøringer */}
        <Card className="p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Megaphone className="h-4 w-4 text-evergreen-700" aria-hidden />
            Kunngjøringer
          </h2>
          <div className="mt-3 space-y-2.5">
            {SAMEIE_ANNOUNCEMENTS.map((a) => (
              <div key={a.id} className="rounded-xl border border-border p-3.5">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">{a.author} · {formatRelative(a.created_at)}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Møter og dokumenter */}
        <Card className="p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <FileText className="h-4 w-4 text-evergreen-700" aria-hidden />
            Møter og dokumenter
          </h2>
          {SAMEIE_MEETINGS.map((m) => (
            <div key={m.id} className="mt-3 rounded-xl border border-border p-3.5">
              <p className="text-sm font-medium">{m.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(m.date)} · {m.location}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Agenda</p>
              <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm text-muted-foreground">
                {m.agenda.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </div>
          ))}
          <div className="mt-3 space-y-2">
            {["Husordensregler Sameiet Middelthunet", "Vedtekter (vedtatt 2025)", "Referat styremøte mai 2026"].map((d) => (
              <div key={d} className="flex items-center justify-between rounded-xl bg-muted px-3 py-2.5 text-sm">
                <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-fjord-700" aria-hidden />{d}</span>
                <Badge className="bg-amber-50 text-amber-800">Kun styret</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
