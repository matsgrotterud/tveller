"use client";

import { ClipboardList, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { WorkOrderStatusPill } from "@/components/shared/pills";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { formatRelative } from "@/lib/format";
import { getProject, getUnit, getUser } from "@/lib/seed";
import { useStore } from "@/lib/store";
import type { WorkOrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: (WorkOrderStatus | "alle")[] = ["alle", "Ny", "Akseptert", "Tidspunkt foreslått", "Planlagt", "Pågår", "Ferdigstilt"];

export default function ArbeidsordreListe() {
  const { workOrders, claims } = useStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("alle");

  const filtered = workOrders
    .filter((w) => status === "alle" || w.status === status)
    .filter((w) => !query || `${w.title} ${w.wo_number}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <div className="max-w-4xl space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Arbeidsordre</h1>
        <p className="text-sm text-muted-foreground">{workOrders.length} arbeidsordre totalt · {workOrders.filter((w) => w.status === "Ny").length} nye</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input placeholder="Søk på tittel eller ordrenummer …" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Søk i arbeidsordre" />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-48" aria-label="Filtrer på status">
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === "alle" ? "Alle statuser" : s}</option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Ingen arbeidsordre" description="Nye arbeidsordre fra utbyggere dukker opp her." />
      ) : (
        <div className="space-y-2">
          {filtered.map((w) => {
            const claim = claims.find((c) => c.id === w.claim_id);
            const unit = claim ? getUnit(claim.unit_id) : undefined;
            const project = claim ? getProject(claim.project_id) : undefined;
            const resident = claim ? getUser(claim.resident_user_id) : undefined;
            return (
              <Link key={w.id} href={`/leverandor/arbeidsordre/${w.id}`} className="block">
                <Card className={cn("flex items-center gap-4 p-4 transition-shadow hover:shadow-[var(--shadow-card-hover)]", w.status === "Ny" && "border-evergreen-300")}>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{w.wo_number}</span>
                      <p className="font-medium">{w.title}</p>
                      {w.priority === "høy" && <Badge className="bg-red-50 text-red-700">Høy prioritet</Badge>}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {project?.name} · {unit?.unit_number} · {resident?.name} · Estimert {w.estimated_hours} t · Opprettet {formatRelative(w.created_at)}
                    </p>
                  </div>
                  <WorkOrderStatusPill status={w.status} className="shrink-0" />
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
