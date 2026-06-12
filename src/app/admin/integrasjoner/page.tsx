"use client";

import { CheckCircle2, CircleDashed, FlaskConical, Plug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { INTEGRATIONS } from "@/lib/seed";
import { useStore } from "@/lib/store";

const STATUS_META: Record<string, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  connected: { label: "Tilkoblet", cls: "bg-evergreen-50 text-evergreen-700", icon: CheckCircle2 },
  mock: { label: "Mock-adapter aktiv", cls: "bg-amber-50 text-amber-800", icon: FlaskConical },
  not_connected: { label: "Ikke tilkoblet", cls: "bg-muted text-muted-foreground", icon: CircleDashed },
};

export default function AdminIntegrasjonerPage() {
  const { toast } = useStore();

  return (
    <div className="space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Integrasjoner</h1>
        <p className="text-sm text-muted-foreground">
          Plattformnivå-integrasjoner. Mock-adaptere gjør hele appen kjørbar uten eksterne nøkler.
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
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-evergreen-50 text-evergreen-700">
                    <Plug className="h-5 w-5" aria-hidden />
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
              <p className="mt-2 text-xs text-muted-foreground">
                Siste synk: {i.last_sync_at ? i.last_sync_at : "–"} · Feillogg: ingen feil siste 7 dager
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {i.env_keys.map((k) => (
                  <code key={k} className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">{k}</code>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => toast({ title: "Tilkoblingstest", description: `${i.provider}: ${i.status === "mock" ? "Mock-adapter svarer OK." : "Konfigurer nøkler i .env først."}` })}
              >
                Test tilkobling
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
