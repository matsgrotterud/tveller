"use client";

import { AlertTriangle, Eye, LifeBuoy, Lock, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { formatRelative } from "@/lib/format";
import { TENANTS } from "@/lib/seed";
import { useStore } from "@/lib/store";

export default function SupportPage() {
  const { supportAccessLog, grantSupportAccess, toast } = useStore();
  const [tenant, setTenant] = useState(TENANTS[0].name);
  const [reason, setReason] = useState("");
  const [mode, setMode] = useState<"view_only" | "emergency">("view_only");
  const [query, setQuery] = useState("");

  return (
    <div className="max-w-4xl space-y-5 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Supportkonsoll</h1>
        <p className="text-sm text-muted-foreground">All tilgang til kundedata krever begrunnelse og logges – også synlig for kunden</p>
      </div>

      {/* Søk */}
      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Search className="h-4 w-4 text-evergreen-700" aria-hidden />
          Søk i plattformen
        </h2>
        <div className="mt-3 flex gap-2">
          <Input
            placeholder="Søk på kunde, bruker, prosjekt eller saksnummer …"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Søk"
          />
          <Button variant="outline" onClick={() => toast({ title: "Søk utført", description: query ? `Fant 3 treff på «${query}» (kun metadata).` : "Skriv inn et søkeord først." })}>
            Søk
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Søket returnerer kun metadata. Innhold krever aktiv supporttilgang.</p>
      </Card>

      {/* Be om tilgang */}
      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Lock className="h-4 w-4 text-evergreen-700" aria-hidden />
          Be om supporttilgang
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="sup-tenant">Kunde</Label>
            <Select id="sup-tenant" value={tenant} onChange={(e) => setTenant(e.target.value)} className="mt-1">
              {TENANTS.map((t) => <option key={t.id}>{t.name}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="sup-mode">Tilgangsnivå</Label>
            <Select id="sup-mode" value={mode} onChange={(e) => setMode(e.target.value as "view_only" | "emergency")} className="mt-1">
              <option value="view_only">Kun lesetilgang (standard, 60 min)</option>
              <option value="emergency">Nødstilgang (krever ekstra godkjenning)</option>
            </Select>
          </div>
        </div>
        <div className="mt-3">
          <Label htmlFor="sup-reason">Begrunnelse (påkrevd)</Label>
          <Textarea
            id="sup-reason"
            rows={2}
            placeholder="F.eks. Feilsøking av varsler som ikke ble levert for sak RK-2024-0121"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1"
          />
        </div>
        {mode === "emergency" && (
          <p className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Nødstilgang gir skrivetilgang og varsler kundens administratorer umiddelbart. Bruk kun ved kritiske hendelser.
          </p>
        )}
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Eye className="h-3.5 w-3.5" aria-hidden />
            Tilgangen logges i revisjonsloggen før den aktiveres.
          </p>
          <Button
            disabled={reason.trim().length < 10}
            onClick={() => {
              grantSupportAccess(tenant, reason.trim(), mode);
              setReason("");
              toast({
                title: "Supporttilgang aktivert",
                description: `${mode === "view_only" ? "Lesetilgang" : "Nødstilgang"} til ${tenant} i 60 minutter. Hendelsen er logget.`,
                variant: "success",
              });
            }}
          >
            <LifeBuoy aria-hidden />
            Aktiver tilgang
          </Button>
        </div>
      </Card>

      {/* Logg */}
      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck className="h-4 w-4 text-evergreen-700" aria-hidden />
          Tilgangslogg
        </h2>
        <ul className="mt-3 space-y-2">
          {supportAccessLog.length === 0 && <p className="text-sm text-muted-foreground">Ingen supporttilganger registrert.</p>}
          {supportAccessLog.map((a) => (
            <li key={a.id} className="rounded-xl border border-border p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">{a.tenant_name}</p>
                <Badge className={a.mode === "view_only" ? "bg-fjord-50 text-fjord-700" : "bg-red-50 text-red-700"}>
                  {a.mode === "view_only" ? "Kun lesetilgang" : "Nødstilgang"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Årsak: {a.reason}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{a.requested_by} · {formatRelative(a.granted_at)} · utløper etter 60 min</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
