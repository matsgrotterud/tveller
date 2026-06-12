"use client";

import { CheckCircle2, FileCheck, Globe, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatRelative } from "@/lib/format";
import { TENANTS } from "@/lib/seed";
import { useStore } from "@/lib/store";

const SUBPROCESSORS = [
  { name: "Supabase (AWS eu-north-1)", purpose: "Database og lagring", region: "EU/EØS" },
  { name: "Vercel", purpose: "Hosting og CDN", region: "EU/EØS" },
  { name: "Stripe", purpose: "Betalingsbehandling", region: "EU/US (SCC)" },
  { name: "Link Mobility", purpose: "SMS-utsendelse", region: "Norge" },
  { name: "Resend", purpose: "E-postutsendelse", region: "EU/US (SCC)" },
  { name: "OpenAI", purpose: "AI-beslutningsstøtte (uten trening)", region: "EU-endepunkt" },
];

const PROCESSING_ACTIVITIES = [
  { name: "Reklamasjonsbehandling", basis: "Avtale (bustadoppføringslova)", retention: "Reklamasjonsperiode + 36 mnd" },
  { name: "Beboerkommunikasjon", basis: "Avtale", retention: "Til sletting eller anonymisering" },
  { name: "FDV-dokumentasjon", basis: "Rettslig forpliktelse (TEK17)", retention: "Byggets levetid" },
  { name: "AI-triage av saker", basis: "Berettiget interesse", retention: "Ingen lagring hos AI-leverandør" },
  { name: "Fakturering og regnskap", basis: "Rettslig forpliktelse (bokføringsloven)", retention: "5 år" },
];

export default function GdprAdminPage() {
  const { gdprRequests, completeGdprRequest, toast } = useStore();

  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">GDPR-senter</h1>
        <p className="text-sm text-muted-foreground">Databehandleravtaler, behandlingsaktiviteter og innsynsforespørsler</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Forespørsler */}
        <Card className="p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <FileCheck className="h-4 w-4 text-evergreen-700" aria-hidden />
            Innsyns- og sletteforespørsler
          </h2>
          <div className="mt-3 space-y-2">
            {gdprRequests.map((r) => (
              <div key={r.id} className="rounded-xl border border-border p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{r.user_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.type === "export" ? "Dataeksport" : r.type === "deletion" ? "Sletting" : "Innsyn"} · {formatRelative(r.requested_at)}
                      {r.handled_by && ` · behandles av ${r.handled_by}`}
                    </p>
                  </div>
                  <Badge className={r.status === "Fullført" ? "bg-evergreen-50 text-evergreen-700" : "bg-amber-50 text-amber-800"}>
                    {r.status}
                  </Badge>
                </div>
                {r.status !== "Fullført" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={() => {
                      completeGdprRequest(r.id);
                      toast({ title: "Forespørsel fullført", description: `${r.type === "deletion" ? "Anonymisering" : "Eksport"} er gjennomført og logget.`, variant: "success" });
                    }}
                  >
                    <CheckCircle2 aria-hidden />
                    Marker som fullført
                  </Button>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Ved sletting beholdes dokumentasjon med rettslig grunnlag (f.eks. reklamasjonshistorikk), mens persondata anonymiseres.
          </p>
        </Card>

        {/* DPA-status */}
        <Card className="p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4 text-evergreen-700" aria-hidden />
            Databehandleravtaler (DPA)
          </h2>
          <ul className="mt-3 space-y-2">
            {TENANTS.map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                <span className="font-medium">{t.name}</span>
                <Badge className={t.status === "trial" ? "bg-amber-50 text-amber-800" : "bg-evergreen-50 text-evergreen-700"}>
                  {t.status === "trial" ? "Venter på signering" : "Signert"}
                </Badge>
              </li>
            ))}
          </ul>

          <h3 className="mt-5 flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-violet-600" aria-hidden />
            AI-databehandling
          </h3>
          <div className="mt-2 rounded-xl bg-violet-50/60 p-3.5 text-sm">
            <p className="font-medium">AI brukes som beslutningsstøtte og trener ikke på kundedata som standard.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              AI_DATA_PROCESSING_MODE=no_training · EU-endepunkt · ingen lagring av prompt-data hos leverandør.
            </p>
          </div>

          <h3 className="mt-5 flex items-center gap-2 text-sm font-semibold">
            <Globe className="h-4 w-4 text-fjord-700" aria-hidden />
            Datalagring
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">All kundedata lagres i EU/EØS (AWS Stockholm). Konfigurerbart per Enterprise-kunde.</p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Underdatabehandlere */}
        <Card className="p-5">
          <h2 className="text-sm font-semibold">Underdatabehandlere</h2>
          <ul className="mt-3 space-y-2">
            {SUBPROCESSORS.map((s) => (
              <li key={s.name} className="flex items-center justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.purpose}</p>
                </div>
                <Badge className="shrink-0 bg-muted text-muted-foreground">{s.region}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        {/* Behandlingsaktiviteter */}
        <Card className="p-5">
          <h2 className="text-sm font-semibold">Behandlingsaktiviteter (protokoll)</h2>
          <ul className="mt-3 space-y-2.5">
            {PROCESSING_ACTIVITIES.map((p) => (
              <li key={p.name} className="rounded-xl bg-muted p-3 text-sm">
                <p className="font-medium">{p.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Grunnlag: {p.basis} · Lagring: {p.retention}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
