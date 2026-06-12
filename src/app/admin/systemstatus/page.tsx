"use client";

import { Activity, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SERVICES = [
  { name: "API / applikasjon", status: "Operativ", uptime: "99,98 %", latency: "84 ms" },
  { name: "Database (mock)", status: "Operativ", uptime: "100 %", latency: "3 ms" },
  { name: "Fillagring (mock)", status: "Operativ", uptime: "99,99 %", latency: "120 ms" },
  { name: "SMS-utsendelse (mock)", status: "Operativ", uptime: "99,95 %", latency: "1,2 s" },
  { name: "E-postutsendelse (mock)", status: "Operativ", uptime: "99,97 %", latency: "640 ms" },
  { name: "AI-tjenester (mock)", status: "Degradert tidligere i dag", uptime: "99,82 %", latency: "2,1 s" },
];

const INCIDENTS = [
  { date: "I dag 14:02", title: "AI-tjeneste: forhøyet responstid", detail: "Triage-forslag tok opptil 8 sekunder i 9 minutter. Automatisk failover til kø. Løst 14:11.", resolved: true },
  { date: "3. juni", title: "Planlagt vedlikehold database", detail: "Oppgradering av Postgres gjennomført uten nedetid (read-replica failover).", resolved: true },
];

export default function SystemstatusPage() {
  return (
    <div className="max-w-4xl space-y-5 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Systemstatus</h1>
          <p className="text-sm text-muted-foreground">Driftsstatus for alle plattformtjenester</p>
        </div>
        <Badge className="bg-evergreen-50 text-evergreen-700">
          <CheckCircle2 className="h-3 w-3" aria-hidden />
          Alle systemer operative
        </Badge>
      </div>

      <Card className="divide-y divide-border p-0">
        {SERVICES.map((s) => {
          const ok = s.status === "Operativ";
          return (
            <div key={s.name} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <span className={cn("h-2.5 w-2.5 rounded-full", ok ? "bg-evergreen-500" : "bg-amber-500")} aria-hidden />
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className={cn("text-xs", ok ? "text-muted-foreground" : "text-amber-700")}>{s.status}</p>
                </div>
              </div>
              <div className="flex gap-6 text-right text-xs text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">{s.uptime}</p>
                  <p>oppetid 90 d</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{s.latency}</p>
                  <p>responstid</p>
                </div>
              </div>
            </div>
          );
        })}
      </Card>

      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Activity className="h-4 w-4 text-evergreen-700" aria-hidden />
          Hendelseslogg
        </h2>
        <ul className="mt-3 space-y-3">
          {INCIDENTS.map((i) => (
            <li key={i.title} className="rounded-xl border border-border p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">{i.title}</p>
                <Badge className="bg-evergreen-50 text-evergreen-700">Løst</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{i.detail}</p>
              <p className="mt-1 text-xs text-muted-foreground">{i.date}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
