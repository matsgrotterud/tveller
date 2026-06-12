"use client";

import { HardHat, Mail, Phone, Star, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PROJECTS, SUPPLIERS } from "@/lib/seed";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function UnderleverandorerPage() {
  const { toast } = useStore();

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Underleverandører</h1>
          <p className="text-sm text-muted-foreground">{SUPPLIERS.length} leverandører med kvalitetsscore basert på faktiske saker</p>
        </div>
        <Button onClick={() => toast({ title: "Invitasjon sendt", description: "Ny leverandør er invitert til leverandørportalen (demo).", variant: "success" })}>
          <UserPlus aria-hidden />
          Inviter leverandør
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...SUPPLIERS]
          .sort((a, b) => b.score - a.score)
          .map((s) => (
            <Card key={s.id} className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-evergreen-50 text-evergreen-700">
                    <HardHat className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.trades.join(", ")}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("text-2xl font-semibold", s.score >= 85 ? "text-evergreen-700" : s.score >= 75 ? "text-amber-700" : "text-red-700")}>{s.score}</p>
                  <p className="text-[11px] text-muted-foreground">kvalitetsscore</p>
                </div>
              </div>

              <Progress value={s.score} className="mt-3" barClassName={s.score >= 85 ? undefined : s.score >= 75 ? "bg-amber-500" : "bg-red-500"} />

              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Åpne saker</dt><dd className="font-medium">{s.cases_open}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Løste saker</dt><dd className="font-medium">{s.cases_closed}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Responstid</dt><dd className="font-medium">{s.avg_response_time_hours} t</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Løsningstid</dt><dd className="font-medium">{s.avg_resolution_time_hours} t</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Gjenåpning</dt><dd className={cn("font-medium", s.reopened_rate > 10 ? "text-red-700" : "")}>{s.reopened_rate} %</dd></div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Vurdering</dt>
                  <dd className="flex items-center gap-1 font-medium">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
                    {s.rating.toFixed(1)}
                  </dd>
                </div>
              </dl>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.project_ids.map((pid) => {
                  const p = PROJECTS.find((x) => x.id === pid);
                  return p ? <Badge key={pid} className="bg-muted text-muted-foreground">{p.name}</Badge> : null;
                })}
              </div>

              <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">{s.contact_name}</p>
                <p className="mt-1 flex items-center gap-1.5"><Mail className="h-3 w-3" aria-hidden />{s.contact_email}</p>
                <p className="mt-0.5 flex items-center gap-1.5"><Phone className="h-3 w-3" aria-hidden />{s.contact_phone}</p>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}
