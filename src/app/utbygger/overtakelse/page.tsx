"use client";

import { ArrowRight, CalendarPlus, CheckCircle2, ClipboardCheck, Download, FileSignature, Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDateTime } from "@/lib/format";
import { HANDOVER_PROTOCOLS, PROJECTS, getProject, getUnit } from "@/lib/seed";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<string, string> = {
  planlagt: "bg-fjord-50 text-fjord-700",
  gjennomført: "bg-amber-50 text-amber-800",
  signert: "bg-evergreen-50 text-evergreen-700",
};

const CHECKLIST_TEMPLATE = [
  "Visuell kontroll av alle rom og overflater",
  "Test av vinduer, dører og låser",
  "Kontroll av VVS: kraner, sluk, varmtvann",
  "Test av elektriske punkter og sikringsskap",
  "Avlesing av strømmåler",
  "Utlevering av nøkler og adgangskort",
  "Gjennomgang av FDV og boligperm",
  "Registrering av eventuelle avvik med foto",
  "Signering av protokoll (begge parter)",
];

export default function OvertakelsePage() {
  const { toast } = useStore();

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overtakelse</h1>
          <p className="text-sm text-muted-foreground">Digital protokoll med målerstand, nøkler, avvik og signering</p>
        </div>
        <Button onClick={() => toast({ title: "Overtakelse planlagt", description: "Beboer får varsel med tidspunkt og forberedelser (demo).", variant: "success" })}>
          <CalendarPlus aria-hidden />
          Planlegg overtakelse
        </Button>
      </div>

      {/* Fremdrift per prosjekt */}
      <div className="grid gap-3 md:grid-cols-3">
        {PROJECTS.filter((p) => p.status !== "planning").map((p) => {
          const pct = Math.round((p.handovers_completed / p.units_count) * 100);
          return (
            <Card key={p.id} className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{p.name}</p>
                <span className="text-xs text-muted-foreground">{p.handovers_completed} / {p.units_count}</span>
              </div>
              <Progress value={pct} className="mt-2" />
              <p className="mt-1.5 text-xs text-muted-foreground">{pct} % av enhetene er overtatt</p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        {/* Protokoller */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Protokoller</h2>
          {HANDOVER_PROTOCOLS.map((hp) => {
            const unit = getUnit(hp.unit_id);
            const project = getProject(hp.project_id);
            return (
              <Card key={hp.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{project?.name} · {unit?.unit_number}</p>
                      <Badge className={cn("capitalize", STATUS_STYLE[hp.status])}>{hp.status}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{hp.scheduled_at ? formatDateTime(hp.scheduled_at) : "Ikke planlagt"}</p>
                  </div>
                  {hp.status !== "planlagt" && (
                    <Button size="sm" variant="outline" onClick={() => toast({ title: "Protokoll eksportert", description: "Signert PDF-protokoll lastet ned (demo).", variant: "success" })}>
                      <Download aria-hidden />
                      Eksporter
                    </Button>
                  )}
                </div>

                {hp.status !== "planlagt" && (
                  <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 border-t border-border pt-3 text-sm md:grid-cols-4">
                    <div>
                      <dt className="text-xs text-muted-foreground">Strømmåler</dt>
                      <dd className="font-mono text-xs font-medium">{hp.meter_reading_power ?? "–"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Nøkler / kort</dt>
                      <dd className="flex items-center gap-1 font-medium"><Key className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />{hp.keys_delivered} / {hp.access_cards}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Avvik funnet</dt>
                      <dd className={cn("font-medium", hp.defects_found > 0 && "text-amber-700")}>{hp.defects_found}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Signering</dt>
                      <dd className="flex items-center gap-1.5 text-xs font-medium">
                        <span className={cn("flex items-center gap-0.5", hp.signed_by_developer ? "text-evergreen-700" : "text-muted-foreground")}>
                          <FileSignature className="h-3.5 w-3.5" aria-hidden />Utbygger
                        </span>
                        <span className={cn("flex items-center gap-0.5", hp.signed_by_resident ? "text-evergreen-700" : "text-muted-foreground")}>
                          <FileSignature className="h-3.5 w-3.5" aria-hidden />Beboer
                        </span>
                      </dd>
                    </div>
                  </dl>
                )}

                {hp.defects_found > 0 && hp.status !== "planlagt" && (
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-50/60 px-3 py-2.5">
                    <p className="text-sm text-amber-900">{hp.defects_found} avvik registrert under overtakelsen</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast({ title: "Avvik overført", description: `${hp.defects_found} avvik er konvertert til reklamasjonssaker med protokollen som dokumentasjon.`, variant: "success" })}
                    >
                      Konverter til reklamasjon
                      <ArrowRight aria-hidden />
                    </Button>
                  </div>
                )}

                {hp.status === "gjennomført" && !hp.signed_by_resident && (
                  <p className="mt-3 text-xs text-amber-800">Venter på beboers signatur. Påminnelse sendes automatisk etter 3 dager.</p>
                )}
              </Card>
            );
          })}
        </div>

        {/* Sjekklistemal */}
        <Card className="h-fit p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <ClipboardCheck className="h-4 w-4 text-evergreen-700" aria-hidden />
            Standard sjekkliste
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">Mal brukt ved alle overtakelser. Kan tilpasses per prosjekt.</p>
          <ul className="mt-3 space-y-2">
            {CHECKLIST_TEMPLATE.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-evergreen-600" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="mt-4 w-full" onClick={() => toast({ title: "Mal duplisert", description: "Ny sjekklistemal opprettet og kan redigeres (demo)." })}>
            Tilpass mal
          </Button>
        </Card>
      </div>
    </div>
  );
}
