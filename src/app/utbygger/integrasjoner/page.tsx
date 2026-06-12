"use client";

import { Cable, CheckCircle2, CircleDashed, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { INTEGRATIONS } from "@/lib/seed";
import { useStore } from "@/lib/store";

const STATUS_META: Record<string, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  connected: { label: "Tilkoblet", cls: "bg-evergreen-50 text-evergreen-700", icon: CheckCircle2 },
  mock: { label: "Demo-modus", cls: "bg-amber-50 text-amber-800", icon: FlaskConical },
  not_connected: { label: "Ikke tilkoblet", cls: "bg-muted text-muted-foreground", icon: CircleDashed },
};

export default function IntegrasjonerPage() {
  const { toast } = useStore();

  return (
    <div className="space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Integrasjoner</h1>
        <p className="text-sm text-muted-foreground">
          Tjenester i demo-modus bruker innebygde mock-adaptere. Legg inn API-nøkler i miljøvariabler for å aktivere.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {INTEGRATIONS.map((i) => {
          const meta = STATUS_META[i.status];
          const Icon = meta.icon;
          return (
            <Card key={i.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-fjord-50 text-fjord-700">
                    <Cable className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold">{i.provider}</p>
                    <p className="text-xs text-muted-foreground">{i.category}</p>
                  </div>
                </div>
                <Badge className={meta.cls}>
                  <Icon className="h-3 w-3" aria-hidden />
                  {meta.label}
                </Badge>
              </div>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{i.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {i.env_keys.map((k) => (
                  <code key={k} className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">{k}</code>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() =>
                  toast({
                    title: i.status === "not_connected" ? "Oppsett startet" : "Konfigurasjon åpnet",
                    description: `Se SETUP_GUIDE.md for hvordan du kobler til ${i.provider}.`,
                  })
                }
              >
                {i.status === "not_connected" ? "Koble til" : "Konfigurer"}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
