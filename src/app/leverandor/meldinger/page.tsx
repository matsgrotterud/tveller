"use client";

import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { WorkOrderStatusPill } from "@/components/shared/pills";
import { Card } from "@/components/ui/card";
import { formatRelative } from "@/lib/format";
import { getUnit } from "@/lib/seed";
import { useStore } from "@/lib/store";

export default function LeverandorMeldingerPage() {
  const { workOrders, claims } = useStore();

  const threads = workOrders
    .map((w) => {
      const claim = claims.find((c) => c.id === w.claim_id);
      const visible = claim?.comments.filter((m) => m.visibility === "public" || m.visibility === "supplier_internal") ?? [];
      return { workOrder: w, claim, last: visible[visible.length - 1], count: visible.length };
    })
    .filter((t) => t.count > 0)
    .sort((a, b) => (b.last?.created_at ?? "").localeCompare(a.last?.created_at ?? ""));

  return (
    <div className="max-w-3xl space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Meldinger</h1>
        <p className="text-sm text-muted-foreground">Samtaler knyttet til arbeidsordre</p>
      </div>

      {threads.length === 0 ? (
        <EmptyState icon={MessageSquare} title="Ingen samtaler" description="Meldinger fra utbygger og beboere vises her per arbeidsordre." />
      ) : (
        <div className="space-y-2">
          {threads.map(({ workOrder, claim, last, count }) => (
            <Link key={workOrder.id} href={`/leverandor/arbeidsordre/${workOrder.id}`} className="block">
              <Card className="flex items-center gap-3 p-4 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{workOrder.wo_number}</span>
                    <p className="truncate text-sm font-medium">{workOrder.title}</p>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {claim ? getUnit(claim.unit_id)?.unit_number : ""} · {last ? `${last.author_name.split(" ")[0]}: ${last.body}` : ""} · {count} meldinger
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <WorkOrderStatusPill status={workOrder.status} />
                  {last && <span className="text-[11px] text-muted-foreground">{formatRelative(last.created_at)}</span>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
