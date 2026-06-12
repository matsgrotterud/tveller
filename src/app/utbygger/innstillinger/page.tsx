"use client";

import { Bell, Building2, CreditCard, Palette, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import { UsageMeter } from "@/components/shared/usage-meter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROLE_LABEL } from "@/lib/permissions";
import { CURRENT_TENANT, FEATURE_FLAGS, USAGE_METRICS, USERS } from "@/lib/seed";
import { useStore } from "@/lib/store";

const NOTIFICATION_RULES = [
  { key: "new_claim", label: "Ny reklamasjon mottatt", channels: "I app + e-post", enabled: true },
  { key: "deadline", label: "Fristvarsel (3 dager før intern frist)", channels: "I app + e-post + SMS", enabled: true },
  { key: "reopened", label: "Sak gjenåpnet av beboer", channels: "I app + e-post", enabled: true },
  { key: "completion", label: "Utbedring meldt ferdig", channels: "I app", enabled: true },
  { key: "weekly", label: "Ukentlig oppsummering (AI)", channels: "E-post mandag kl. 07", enabled: false },
];

export default function InnstillingerPage() {
  const { featureFlags, toast } = useStore();
  const [rules, setRules] = useState(NOTIFICATION_RULES);

  const orgUsers = USERS.filter((u) => u.tenant_id === "t1" && ["utbygger_admin", "prosjektleder", "kundebehandler", "juridisk"].includes(u.role));

  return (
    <div className="max-w-4xl space-y-5 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Innstillinger</h1>
        <p className="text-sm text-muted-foreground">{CURRENT_TENANT.name} · org.nr. {CURRENT_TENANT.org_number}</p>
      </div>

      <Tabs defaultValue="organisasjon">
        <TabsList>
          <TabsTrigger value="organisasjon">Organisasjon</TabsTrigger>
          <TabsTrigger value="brukere">Brukere</TabsTrigger>
          <TabsTrigger value="varsler">Varsler</TabsTrigger>
          <TabsTrigger value="abonnement">Abonnement</TabsTrigger>
          <TabsTrigger value="gdpr">GDPR</TabsTrigger>
        </TabsList>

        <TabsContent value="organisasjon">
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Building2 className="h-4 w-4 text-evergreen-700" aria-hidden />
              Organisasjonsprofil
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="org-name">Navn</Label>
                <Input id="org-name" defaultValue={CURRENT_TENANT.name} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="org-nr">Organisasjonsnummer</Label>
                <Input id="org-nr" defaultValue={CURRENT_TENANT.org_number} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="org-email">Faktura-e-post</Label>
                <Input id="org-email" type="email" defaultValue={CURRENT_TENANT.billing_email} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="org-phone">Telefon</Label>
                <Input id="org-phone" defaultValue="+47 22 00 14 00" className="mt-1" />
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-border p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Palette className="h-4 w-4 text-fjord-700" aria-hidden />
                Merkevare
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Egen logo og farger i beboerportal og e-poster krever Enterprise-plan (white-label).
              </p>
              <Badge className="mt-2 bg-amber-50 text-amber-800">Oppgrader for å aktivere</Badge>
            </div>
            <Button className="mt-4" onClick={() => toast({ title: "Innstillinger lagret", description: "Organisasjonsprofilen er oppdatert.", variant: "success" })}>
              Lagre endringer
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="brukere">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Users className="h-4 w-4 text-evergreen-700" aria-hidden />
                Brukere og roller
              </h2>
              <Button size="sm" onClick={() => toast({ title: "Invitasjon sendt", description: "Ny bruker invitert på e-post (demo).", variant: "success" })}>
                Inviter bruker
              </Button>
            </div>
            <ul className="mt-4 space-y-2">
              {orgUsers.map((u) => (
                <li key={u.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <Badge className="bg-fjord-50 text-fjord-700">{ROLE_LABEL[u.role]}</Badge>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Roller styrer tilgang: kundebehandlere ser ikke fakturering, og kun juridisk ansvarlig kan endre fristregler.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="varsler">
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Bell className="h-4 w-4 text-evergreen-700" aria-hidden />
              Varslingsregler
            </h2>
            <ul className="mt-4 space-y-3">
              {rules.map((r) => (
                <li key={r.key} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.channels}</p>
                  </div>
                  <Switch
                    checked={r.enabled}
                    onCheckedChange={(v) => {
                      setRules((prev) => prev.map((x) => (x.key === r.key ? { ...x, enabled: v } : x)));
                      toast({ title: "Varslingsregel oppdatert", description: `«${r.label}» er ${v ? "aktivert" : "deaktivert"}.`, variant: "success" });
                    }}
                    aria-label={r.label}
                  />
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="abonnement">
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <CreditCard className="h-4 w-4 text-evergreen-700" aria-hidden />
              Abonnement og forbruk
            </h2>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-evergreen-50/60 p-4">
              <div>
                <p className="font-semibold capitalize">{CURRENT_TENANT.plan}-plan</p>
                <p className="text-sm text-muted-foreground">Fakturert månedlig · neste fornyelse 1. juli 2026</p>
              </div>
              <Button variant="outline" onClick={() => toast({ title: "Faktureringsportal", description: "Stripe-kundeportal åpnes når Stripe er tilkoblet (demo)." })}>
                Administrer fakturering
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              {USAGE_METRICS.filter((m) => m.included > 0).map((m) => (
                <UsageMeter key={m.type} label={m.unit} used={m.used} included={m.included} />
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Forbruk utover inkludert volum faktureres etterskuddsvis per måned.</p>
          </Card>
        </TabsContent>

        <TabsContent value="gdpr">
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-evergreen-700" aria-hidden />
              GDPR og sikkerhet
            </h2>
            <ul className="mt-4 space-y-3">
              {[
                { label: "Databehandleravtale (DPA)", value: "Signert 12. januar 2026", ok: true },
                { label: "Datalagring", value: "EU/EØS (Stockholm)", ok: true },
                { label: "AI-databehandling", value: "Beslutningsstøtte – trener ikke på kundedata", ok: true },
                { label: "Tofaktorautentisering", value: "Påkrevd for administratorer", ok: true },
                { label: "Slettefrist inaktive beboerdata", value: "36 måneder etter reklamasjonsperiodens utløp", ok: true },
              ].map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="text-right font-medium">{row.value}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-border p-3.5">
              <div>
                <p className="text-sm font-medium">Aktive funksjoner på planen</p>
                <p className="text-xs text-muted-foreground">{featureFlags.filter((f) => f.enabled).length} av {FEATURE_FLAGS.length} moduler aktivert</p>
              </div>
              <Badge className="bg-evergreen-50 text-evergreen-700">Administreres av TvellerOS</Badge>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
