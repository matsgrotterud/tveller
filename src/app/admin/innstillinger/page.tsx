"use client";

import { KeyRound, RefreshCw, Settings, Webhook } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { useStore } from "@/lib/store";

const API_KEYS = [
  { name: "Produksjon (les/skriv)", key: "tvos_live_••••••••••4f2a", scopes: "claims:read, claims:write, webhooks", lastUsed: "2 timer siden" },
  { name: "Analyse (kun les)", key: "tvos_live_••••••••••9c1b", scopes: "analytics:read", lastUsed: "i går" },
];

export default function AdminInnstillingerPage() {
  const { toast, resetDemo } = useStore();

  return (
    <div className="max-w-3xl space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Innstillinger</h1>
        <p className="text-sm text-muted-foreground">Plattforminnstillinger for Tveller AS</p>
      </div>

      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Settings className="h-4 w-4 text-evergreen-700" aria-hidden />
          Plattformprofil
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="pf-name">Plattformnavn</Label>
            <Input id="pf-name" defaultValue="TvellerOS" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="pf-url">App-URL</Label>
            <Input id="pf-url" defaultValue="https://app.tveller.no" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="pf-support">Support-e-post</Label>
            <Input id="pf-support" type="email" defaultValue="support@tveller.no" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="pf-org">Org.nr.</Label>
            <Input id="pf-org" defaultValue="931 000 111" className="mt-1" />
          </div>
        </div>
        <Button className="mt-4" onClick={() => toast({ title: "Lagret", description: "Plattforminnstillingene er oppdatert.", variant: "success" })}>
          Lagre endringer
        </Button>
      </Card>

      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <KeyRound className="h-4 w-4 text-evergreen-700" aria-hidden />
          API-nøkler
        </h2>
        <ul className="mt-3 space-y-2">
          {API_KEYS.map((k) => (
            <li key={k.name} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3.5">
              <div>
                <p className="text-sm font-medium">{k.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{k.key}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Scopes: {k.scopes} · sist brukt {k.lastUsed}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast({ title: "Nøkkel rullert", description: "Ny nøkkel er generert. Den gamle er gyldig i 24 timer.", variant: "success" })}>
                Ruller nøkkel
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Webhook className="h-4 w-4 text-evergreen-700" aria-hidden />
          Webhooks
        </h2>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3.5">
          <div>
            <p className="font-mono text-sm">https://hooks.tveller.no/internal</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Hendelser: claim.*, billing.*, gdpr.* · signert med WEBHOOK_SECRET</p>
          </div>
          <Badge className="bg-evergreen-50 text-evergreen-700">Aktiv</Badge>
        </div>
      </Card>

      <Card className="border-amber-200 p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <RefreshCw className="h-4 w-4 text-amber-700" aria-hidden />
          Demo
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Tilbakestill all demodata til utgangspunktet. Nyttig etter å ha testet hele saksflyten.
        </p>
        <Button variant="outline" className="mt-3" onClick={resetDemo}>
          Tilbakestill demodata
        </Button>
      </Card>
    </div>
  );
}
