"use client";

import { Building2, Plus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/format";
import { PROJECTS } from "@/lib/seed";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  planning: "Planlegging",
  construction: "Under bygging",
  handover: "Overtakelse",
  aftersales: "Ettermarked",
  completed: "Fullført",
};

export default function ProsjekterPage() {
  const { claims, toast } = useStore();

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Prosjekter</h1>
          <p className="text-sm text-muted-foreground">{PROJECTS.length} prosjekter · {formatNumber(PROJECTS.reduce((s, p) => s + p.units_count, 0))} enheter</p>
        </div>
        <Button onClick={() => toast({ title: "Nytt prosjekt", description: "Prosjektoppretting åpnes (demo).", variant: "info" })}>
          <Plus aria-hidden />
          Opprett prosjekt
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PROJECTS.map((p) => {
          const projectClaims = claims.filter((c) => c.project_id === p.id);
          return (
            <Link key={p.id} href={`/utbygger/prosjekter/${p.id}`}>
              <Card className="h-full p-5 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl gradient-brand text-white">
                      <Building2 className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.address}, {p.city}</p>
                    </div>
                  </div>
                  <Badge className="bg-muted text-muted-foreground">{STATUS_LABEL[p.status]}</Badge>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Helsescore</p>
                  <p className={cn("text-lg font-semibold", p.health_score >= 85 ? "text-evergreen-700" : p.health_score >= 75 ? "text-amber-700" : "text-red-700")}>
                    {p.health_score}
                  </p>
                </div>
                <Progress value={p.health_score} barClassName={p.health_score >= 85 ? undefined : p.health_score >= 75 ? "bg-amber-500" : "bg-red-500"} />

                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Enheter</dt><dd className="font-medium">{p.units_count}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Saker</dt><dd className="font-medium">{projectClaims.length || p.open_claims}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Overtakelser</dt><dd className="font-medium">{p.handovers_completed}/{p.units_count}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Leverandører</dt><dd className="font-medium">{p.active_suppliers}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">FDV-dekning</dt><dd className="font-medium">{p.fdv_completeness} %</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Aktivering</dt><dd className="font-medium">{p.resident_activation} %</dd></div>
                </dl>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
