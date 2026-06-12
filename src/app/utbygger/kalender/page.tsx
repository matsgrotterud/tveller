"use client";

import { AlertTriangle, CalendarDays, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { formatTime, formatWeekday } from "@/lib/format";
import { PROJECTS, getSupplierByOrg, getUnit } from "@/lib/seed";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function UtbyggerKalenderPage() {
  const { appointments, claims, toast } = useStore();
  const [projectFilter, setProjectFilter] = useState("alle");

  const days = useMemo(() => {
    const result: { date: Date; label: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      d.setHours(0, 0, 0, 0);
      result.push({ date: d, label: formatWeekday(d) });
    }
    return result;
  }, []);

  const enriched = appointments
    .map((a) => {
      const claim = claims.find((c) => c.id === a.claim_id);
      return { appointment: a, claim, supplier: getSupplierByOrg(a.supplier_org_id), unit: claim ? getUnit(claim.unit_id) : undefined };
    })
    .filter((x) => projectFilter === "alle" || x.claim?.project_id === projectFilter);

  /* Konfliktdeteksjon: samme leverandør, overlappende tid */
  const conflicts = new Set<string>();
  for (const a of enriched) {
    for (const b of enriched) {
      if (a.appointment.id !== b.appointment.id && a.appointment.supplier_org_id === b.appointment.supplier_org_id) {
        if (a.appointment.start_at < b.appointment.end_at && b.appointment.start_at < a.appointment.end_at) {
          conflicts.add(a.appointment.id);
        }
      }
    }
  }

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kalender</h1>
          <p className="text-sm text-muted-foreground">Avtaler og leverandørbesøk de neste 7 dagene</p>
        </div>
        <div className="flex gap-2">
          <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="w-48" aria-label="Filtrer på prosjekt">
            <option value="alle">Alle prosjekter</option>
            {PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
          <Button variant="outline" onClick={() => toast({ title: "Kalender eksportert", description: "ICS-fil generert (demo).", variant: "success" })}>
            <Download aria-hidden />
            Eksporter
          </Button>
        </div>
      </div>

      {conflicts.size > 0 && (
        <Card className="flex items-center gap-3 border-amber-300 bg-amber-50/50 p-3.5">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700" aria-hidden />
          <p className="text-sm text-amber-900">Mulig konflikt: samme leverandør har overlappende avtaler. Sjekk markerte avtaler.</p>
        </Card>
      )}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7 xl:gap-2">
        {days.map(({ date, label }) => {
          const dayAppointments = enriched
            .filter((x) => {
              const d = new Date(x.appointment.start_at);
              return d.toDateString() === date.toDateString();
            })
            .sort((a, b) => a.appointment.start_at.localeCompare(b.appointment.start_at));
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <section key={label} aria-label={label} className="min-h-32">
              <p className={cn("rounded-lg px-2 py-1.5 text-xs font-semibold capitalize", isToday ? "bg-evergreen-700 text-white" : "bg-muted text-muted-foreground")}>
                {label}
              </p>
              <div className="mt-1.5 space-y-1.5">
                {dayAppointments.length === 0 && <p className="px-2 text-xs text-muted-foreground">–</p>}
                {dayAppointments.map(({ appointment, claim, supplier, unit }) => (
                  <div
                    key={appointment.id}
                    className={cn(
                      "rounded-xl border p-2.5 text-xs",
                      conflicts.has(appointment.id) ? "border-amber-300 bg-amber-50" : "border-border bg-surface",
                    )}
                  >
                    <p className="font-semibold">{formatTime(appointment.start_at)}–{formatTime(appointment.end_at)}</p>
                    <p className="mt-0.5 line-clamp-2 font-medium">{claim?.title}</p>
                    <p className="mt-0.5 text-muted-foreground">{unit?.unit_number} · {supplier?.name}</p>
                    {appointment.status === "bekreftet" && <Badge className="mt-1.5 bg-evergreen-50 text-evergreen-700">Bekreftet</Badge>}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <Card className="flex items-center gap-3 p-4">
        <CalendarDays className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">
          Dra-og-slipp for ombooking, ressursvisning per tekniker og synkronisering mot Outlook/Google kommer når
          kalenderintegrasjonen (CALENDAR_PROVIDER) kobles til.
        </p>
      </Card>
    </div>
  );
}
