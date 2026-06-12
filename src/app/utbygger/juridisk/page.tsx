"use client";

import { Archive, FileText, Gavel, Scale, Send, Settings2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AIDisclaimer } from "@/components/shared/ai-insight-card";
import { RiskPill, StatusPill } from "@/components/shared/pills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/input";
import { daysUntil } from "@/lib/format";
import { getProject, getUnit } from "@/lib/seed";
import { OPEN_STATUSES } from "@/lib/status";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const TEMPLATE_LETTERS = [
  { id: "tl1", title: "Mottatt reklamasjon", body: "Vi bekrefter å ha mottatt din reklamasjon datert {{dato}} vedrørende {{tittel}}. Saken er registrert med saksnummer {{saksnr}} og vil bli vurdert innen {{frist}} virkedager. Du vil bli holdt orientert underveis." },
  { id: "tl2", title: "Behov for mer informasjon", body: "I forbindelse med behandlingen av sak {{saksnr}} trenger vi ytterligere dokumentasjon: {{mangler}}. Vi ber deg laste opp dette i TvellerOS innen {{frist}}, slik at vi kan fortsette vurderingen." },
  { id: "tl3", title: "Godkjent reklamasjon", body: "Etter en samlet vurdering av dokumentasjonen i sak {{saksnr}} er reklamasjonen godkjent. Utbedring vil bli utført av {{leverandør}}, som tar kontakt for å avtale tidspunkt." },
  { id: "tl4", title: "Avvist reklamasjon", body: "Etter en samlet vurdering av sak {{saksnr}} kan vi ikke imøtekomme reklamasjonen. Begrunnelse: {{begrunnelse}}. Du har rett til å bestride avgjørelsen, og kan kontakte oss for nærmere redegjørelse." },
  { id: "tl5", title: "Tidspunkt for befaring", body: "Vi ønsker å gjennomføre en befaring i forbindelse med sak {{saksnr}}. Foreslåtte tidspunkter er sendt i TvellerOS. Befaringen tar normalt 30–60 minutter." },
  { id: "tl6", title: "Ferdigstilt utbedring", body: "Utbedringen i sak {{saksnr}} er meldt ferdigstilt av {{leverandør}}. Vi ber deg bekrefte i TvellerOS at arbeidet er tilfredsstillende utført, eller melde fra dersom problemet består." },
];

const DEADLINE_RULES = [
  { label: "Reklamasjonsperiode (bustadoppføringslova)", value: "5 år fra overtakelse", configurable: true },
  { label: "Intern responsfrist – ny sak", value: "5 virkedager", configurable: true },
  { label: "Intern frist – beslutning etter komplett dokumentasjon", value: "10 virkedager", configurable: true },
  { label: "Varsling ved fristfare", value: "3 dager før frist", configurable: true },
  { label: "Automatisk eskalering ved oversittet frist", value: "Aktivert", configurable: true },
];

export default function JuridiskPage() {
  const { claims, toast } = useStore();
  const [letterPreview, setLetterPreview] = useState<(typeof TEMPLATE_LETTERS)[number] | null>(null);

  const riskQueue = claims
    .filter((c) => OPEN_STATUSES.includes(c.status) && (c.legal_risk_level !== "lav" || c.deadline_risk_level !== "lav"))
    .sort((a, b) => (a.due_at ?? "").localeCompare(b.due_at ?? ""));

  const decisions = claims
    .filter((c) => c.decision)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));

  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Juridisk og compliance</h1>
        <p className="text-sm text-muted-foreground">Reklamasjonsradar, risikokø, malbrev og arkivpakker</p>
      </div>

      <AIDisclaimer />

      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {/* Risikokø */}
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Scale className="h-4 w-4 text-evergreen-700" aria-hidden />
              Risikokø ({riskQueue.length} saker)
            </h2>
            <div className="mt-3 space-y-2">
              {riskQueue.map((c) => {
                const left = c.due_at ? daysUntil(c.due_at) : null;
                return (
                  <Link key={c.id} href={`/utbygger/reklamasjoner/${c.id}`} className="block">
                    <div className="rounded-xl border border-border p-3.5 transition-colors hover:border-evergreen-300">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{c.case_number}</span>
                          <p className="text-sm font-medium">{c.title}</p>
                        </div>
                        <StatusPill status={c.status} />
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{getProject(c.project_id)?.name} · {getUnit(c.unit_id)?.unit_number}</span>
                        <RiskPill level={c.deadline_risk_level} label={`Frist: ${c.deadline_risk_level}`} />
                        <RiskPill level={c.legal_risk_level} label={`Juridisk: ${c.legal_risk_level}`} />
                        {left !== null && (
                          <span className={cn("font-medium", left <= 2 ? "text-red-700" : left <= 5 ? "text-amber-700" : "")}>
                            {left < 0 ? `Frist oversittet med ${-left} dager` : `${left} dager til intern frist`}
                          </span>
                        )}
                        <span>Kompletthet: {c.completeness_score} %</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>

          {/* Beslutningslogg */}
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Gavel className="h-4 w-4 text-evergreen-700" aria-hidden />
              Beslutningslogg
            </h2>
            <div className="mt-3 space-y-2">
              {decisions.map((c) => (
                <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted px-3.5 py-2.5 text-sm">
                  <div>
                    <span className="font-mono text-xs text-muted-foreground">{c.case_number}</span>{" "}
                    <span className="font-medium">{c.title}</span>
                    {c.decision_reason && <p className="mt-0.5 text-xs text-muted-foreground">{c.decision_reason}</p>}
                  </div>
                  <Badge
                    className={
                      c.decision === "approved"
                        ? "bg-evergreen-50 text-evergreen-700"
                        : c.decision === "rejected"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-800"
                    }
                  >
                    {c.decision === "approved" ? "Godkjent" : c.decision === "rejected" ? "Avvist" : c.decision === "inspection_needed" ? "Befaring" : "Mer info"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Malbrev */}
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-4 w-4 text-evergreen-700" aria-hidden />
              Malbrev
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">Flettefelt fylles automatisk fra saken. Alltid redigerbart før utsending.</p>
            <ul className="mt-3 space-y-1.5">
              {TEMPLATE_LETTERS.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setLetterPreview(t)}
                    className="w-full cursor-pointer rounded-lg border border-border px-3 py-2 text-left text-sm font-medium transition-colors hover:border-evergreen-300 hover:bg-accent"
                  >
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          {/* Arkivpakke */}
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Archive className="h-4 w-4 text-evergreen-700" aria-hidden />
              Arkivpakke
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Komplett dokumentasjonspakke for advokat eller forsikring: saksdetaljer, bevis, meldinger, beslutninger,
              arbeidsordre, ferdigrapport og revisjonslogg.
            </p>
            <Button className="mt-3 w-full" onClick={() => toast({ title: "Arkivpakke genereres", description: "Pakken bygges og blir tilgjengelig for nedlasting (demo).", variant: "success" })}>
              <Send aria-hidden />
              Bygg arkivpakke
            </Button>
          </Card>

          {/* Fristregler */}
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Settings2 className="h-4 w-4 text-evergreen-700" aria-hidden />
              Fristregler
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">Demoverdier – konfigurerbart per prosjekt og kontraktstype.</p>
            <dl className="mt-3 space-y-2">
              {DEADLINE_RULES.map((r) => (
                <div key={r.label} className="flex items-center justify-between gap-2 text-sm">
                  <dt className="text-muted-foreground">{r.label}</dt>
                  <dd className="shrink-0 font-medium">{r.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>

      <Dialog open={!!letterPreview} onOpenChange={(open) => !open && setLetterPreview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{letterPreview?.title}</DialogTitle>
          </DialogHeader>
          <Textarea defaultValue={letterPreview?.body} rows={7} aria-label="Brevtekst" />
          <p className="text-xs text-muted-foreground">Flettefelt som {"{{saksnr}}"} og {"{{leverandør}}"} fylles inn automatisk når brevet brukes fra en sak.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLetterPreview(null)}>Lukk</Button>
            <Button
              onClick={() => {
                setLetterPreview(null);
                toast({ title: "Mal lagret", description: "Endringene i malbrevet er lagret for hele organisasjonen.", variant: "success" });
              }}
            >
              Lagre mal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
