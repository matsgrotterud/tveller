"use client";

import { Clock } from "lucide-react";
import Link from "next/link";
import { RiskPill, SeverityPill } from "@/components/shared/pills";
import { Button } from "@/components/ui/button";
import { daysBetween } from "@/lib/format";
import { getSupplierByOrg, getUnit } from "@/lib/seed";
import { CLAIM_STATUS_STYLE, KANBAN_COLUMNS, ROOM_LABEL } from "@/lib/status";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function KanbanPage() {
  const { claims } = useStore();

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kanban</h1>
          <p className="text-sm text-muted-foreground">Saksflyt etter status – klikk på et kort for å åpne saken</p>
        </div>
        <Link href="/utbygger/reklamasjoner">
          <Button variant="outline" size="sm">Tabellvisning</Button>
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((col) => {
          const cards = claims
            .filter((c) => c.status === col)
            .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
          const style = CLAIM_STATUS_STYLE[col];
          return (
            <section key={col} className="w-72 shrink-0" aria-label={`Kolonne ${col}`}>
              <div className={cn("flex items-center justify-between rounded-xl px-3 py-2", style.bg)}>
                <p className={cn("text-sm font-semibold", style.text)}>{col}</p>
                <span className={cn("rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold", style.text)}>{cards.length}</span>
              </div>
              <div className="mt-2 space-y-2">
                {cards.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">Ingen saker</div>
                )}
                {cards.map((c) => {
                  const unit = getUnit(c.unit_id);
                  const supplier = getSupplierByOrg(c.assigned_supplier_org_id);
                  const age = daysBetween(c.created_at, new Date());
                  return (
                    <Link
                      key={c.id}
                      href={`/utbygger/reklamasjoner/${c.id}`}
                      className="block rounded-xl border border-border bg-surface p-3 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
                    >
                      <p className="text-xs font-mono text-muted-foreground">{c.case_number}</p>
                      <p className="mt-1 text-sm font-medium leading-snug">{c.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {unit?.unit_number} · {ROOM_LABEL[c.room_type]}
                      </p>
                      {supplier && <p className="mt-0.5 truncate text-xs text-muted-foreground">→ {supplier.name}</p>}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <SeverityPill severity={c.severity} />
                        {c.deadline_risk_level !== "lav" && <RiskPill level={c.deadline_risk_level} label="Frist" />}
                        <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3" aria-hidden />
                          {age} d
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
