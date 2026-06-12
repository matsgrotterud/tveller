"use client";

import { UserPlus, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/lib/store";
import { cn, initials } from "@/lib/utils";

const TEAM = [
  { name: "Martin Sletten", role: "Rørlegger / servicetekniker", skills: ["Sanitær", "Varme", "Sluk og avløp"], availability: "Tilgjengelig", workload: 65, openOrders: 3 },
  { name: "Jonas Vik", role: "Rørlegger", skills: ["Sanitær", "Lekkasjesøk"], availability: "Opptatt til torsdag", workload: 90, openOrders: 5 },
  { name: "Selma Dahl", role: "Lærling", skills: ["Sanitær"], availability: "Tilgjengelig", workload: 40, openOrders: 1 },
];

export default function TeamPage() {
  const { toast } = useStore();

  return (
    <div className="max-w-4xl space-y-4 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
          <p className="text-sm text-muted-foreground">{TEAM.length} teknikere · fordel arbeid og se kapasitet</p>
        </div>
        <Button onClick={() => toast({ title: "Invitasjon sendt", description: "Ny tekniker er invitert til leverandørportalen (demo).", variant: "success" })}>
          <UserPlus aria-hidden />
          Legg til tekniker
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TEAM.map((t) => (
          <Card key={t.name} className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-evergreen-100 text-sm font-bold text-evergreen-800">
                {initials(t.name)}
              </span>
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {t.skills.map((s) => (
                <Badge key={s} className="bg-fjord-50 text-fjord-700">
                  <Wrench className="h-3 w-3" aria-hidden />
                  {s}
                </Badge>
              ))}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Kapasitet denne uken</span>
                <span className={cn("font-medium", t.workload > 85 ? "text-red-700" : "")}>{t.workload} %</span>
              </div>
              <Progress value={t.workload} className="mt-1.5" barClassName={t.workload > 85 ? "bg-red-500" : t.workload > 70 ? "bg-amber-500" : undefined} />
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className={cn("text-xs font-medium", t.availability === "Tilgjengelig" ? "text-evergreen-700" : "text-amber-700")}>
                {t.availability}
              </span>
              <span className="text-xs text-muted-foreground">{t.openOrders} åpne ordre</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => toast({ title: "Arbeid tildelt", description: `${t.name} har fått varsel om ny arbeidsordre (demo).`, variant: "success" })}
            >
              Tildel arbeid
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
