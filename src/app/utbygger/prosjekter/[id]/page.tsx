"use client";

import { AlertTriangle, ArrowLeft, Building2, FileText, HardHat, Home, KeyRound, Settings } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusPill } from "@/components/shared/pills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatShortDate } from "@/lib/format";
import { BUILDINGS, DOCUMENTS, SUPPLIERS, UNITS, getProject } from "@/lib/seed";
import { OPEN_STATUSES } from "@/lib/status";
import { useStore } from "@/lib/store";

const HANDOVER_LABEL: Record<string, string> = {
  ikke_planlagt: "Ikke planlagt",
  planlagt: "Planlagt",
  gjennomført: "Gjennomført",
  signert: "Signert",
};

export default function ProsjektDetaljPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { claims } = useStore();
  const project = getProject(id);

  if (!project) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Fant ikke prosjektet"
        description="Prosjektet finnes ikke i porteføljen."
        action={
          <Link href="/utbygger/prosjekter">
            <Button variant="outline">Til prosjektoversikten</Button>
          </Link>
        }
      />
    );
  }

  const units = UNITS.filter((u) => u.project_id === project.id);
  const buildings = BUILDINGS.filter((b) => b.project_id === project.id);
  const projectClaims = claims.filter((c) => c.project_id === project.id);
  const projectDocs = DOCUMENTS.filter((d) => d.project_id === project.id);
  const projectSuppliers = SUPPLIERS.filter((s) => s.project_ids.includes(project.id));

  return (
    <div className="space-y-5 animate-fade-up">
      <Link href="/utbygger/prosjekter" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Prosjekter
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl gradient-brand text-white">
            <Building2 className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
            <p className="text-sm text-muted-foreground">{project.address}, {project.postal_code} {project.city} · Overtakelse fra {formatDate(project.handover_date)}</p>
          </div>
        </div>
        <Badge className="bg-evergreen-50 text-evergreen-700">Helsescore {project.health_score}</Badge>
      </div>

      <Tabs defaultValue="oversikt">
        <TabsList>
          <TabsTrigger value="oversikt">Oversikt</TabsTrigger>
          <TabsTrigger value="bygg">Bygg</TabsTrigger>
          <TabsTrigger value="boenheter">Boenheter</TabsTrigger>
          <TabsTrigger value="reklamasjoner">Reklamasjoner</TabsTrigger>
          <TabsTrigger value="dokumenter">Dokumenter</TabsTrigger>
          <TabsTrigger value="underleverandorer">Underleverandører</TabsTrigger>
          <TabsTrigger value="innstillinger">Innstillinger</TabsTrigger>
        </TabsList>

        <TabsContent value="oversikt">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <MetricCard label="Enheter" value={project.units_count} icon={Home} />
            <MetricCard label="Åpne saker" value={projectClaims.filter((c) => OPEN_STATUSES.includes(c.status)).length || project.open_claims} icon={AlertTriangle} />
            <MetricCard label="Overtakelser" value={`${project.handovers_completed}/${project.units_count}`} icon={KeyRound} />
            <MetricCard label="Aktive leverandører" value={project.active_suppliers} icon={HardHat} />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card className="p-5">
              <h3 className="text-sm font-semibold">Fremdrift overtakelse</h3>
              <Progress value={(project.handovers_completed / project.units_count) * 100} className="mt-3" />
              <p className="mt-2 text-xs text-muted-foreground">{project.handovers_completed} av {project.units_count} enheter overtatt</p>
            </Card>
            <Card className="p-5">
              <h3 className="text-sm font-semibold">FDV-komplettering</h3>
              <Progress value={project.fdv_completeness} className="mt-3" barClassName={project.fdv_completeness < 80 ? "bg-amber-500" : undefined} />
              <p className="mt-2 text-xs text-muted-foreground">{project.fdv_completeness} % av komponentene har komplett FDV</p>
            </Card>
            <Card className="p-5">
              <h3 className="text-sm font-semibold">Beboeraktivering</h3>
              <Progress value={project.resident_activation} className="mt-3" barClassName={project.resident_activation < 50 ? "bg-amber-500" : undefined} />
              <p className="mt-2 text-xs text-muted-foreground">{project.resident_activation} % av beboerne har aktivert kontoen sin</p>
            </Card>
            <Card className="p-5">
              <h3 className="text-sm font-semibold">Reklamasjonsregler</h3>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Reklamasjonsperiode</dt><dd className="font-medium">{project.claim_period_years} år</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Intern svarfrist</dt><dd className="font-medium">{project.internal_deadline_days} dager</dd></div>
              </dl>
              <p className="mt-2 text-xs text-muted-foreground">Konfigurerbart under Innstillinger.</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bygg">
          <div className="grid gap-3 md:grid-cols-3">
            {buildings.map((b) => (
              <Card key={b.id} className="p-4">
                <p className="font-semibold">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.address} · {b.floors} etasjer</p>
                <p className="mt-2 text-sm text-muted-foreground">{UNITS.filter((u) => u.building_id === b.id).length} registrerte enheter i demo</p>
              </Card>
            ))}
            {buildings.length === 0 && <p className="text-sm text-muted-foreground">Ingen bygg registrert ennå.</p>}
          </div>
        </TabsContent>

        <TabsContent value="boenheter">
          {units.length === 0 ? (
            <EmptyState icon={Home} title="Ingen enheter i demoen" description="Bruk Importer enheter for å laste inn enheter fra CSV/Excel." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enhet</TableHead>
                  <TableHead>Etasje</TableHead>
                  <TableHead>Areal</TableHead>
                  <TableHead>Beboer</TableHead>
                  <TableHead>Overtakelse</TableHead>
                  <TableHead>Reklamasjonsperiode</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.unit_number}</TableCell>
                    <TableCell>{u.floor}.</TableCell>
                    <TableCell>{u.size_m2} m²</TableCell>
                    <TableCell>{u.resident_name ?? <span className="text-muted-foreground">Ikke tilknyttet</span>}</TableCell>
                    <TableCell><Badge className="bg-muted text-muted-foreground">{HANDOVER_LABEL[u.handover_status]}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {u.claim_period_end_date ? `Til ${formatShortDate(u.claim_period_end_date)}` : "–"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="reklamasjoner">
          {projectClaims.length === 0 ? (
            <EmptyState icon={FileText} title="Ingen saker" description="Det er ingen reklamasjoner i dette prosjektet ennå." />
          ) : (
            <div className="space-y-2">
              {projectClaims.map((c) => (
                <Link key={c.id} href={`/utbygger/reklamasjoner/${c.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3.5 hover:bg-evergreen-50/40">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.case_number} · {c.trade}</p>
                  </div>
                  <StatusPill status={c.status} className="shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="dokumenter">
          <div className="space-y-2">
            {projectDocs.map((d) => (
              <div key={d.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5">
                <FileText className="h-4 w-4 shrink-0 text-fjord-700" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.title}</p>
                  <p className="text-xs text-muted-foreground">{d.category} · v{d.version} · Synlighet: {d.visibility === "resident" ? "Beboer" : d.visibility === "internal" ? "Internt" : d.visibility === "board" ? "Styret" : d.visibility}</p>
                </div>
              </div>
            ))}
            {projectDocs.length === 0 && <EmptyState icon={FileText} title="Ingen dokumenter" description="Last opp FDV og prosjektdokumenter under Dokumenter." />}
          </div>
        </TabsContent>

        <TabsContent value="underleverandorer">
          <div className="grid gap-3 md:grid-cols-2">
            {projectSuppliers.map((s) => (
              <Card key={s.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.trades.join(", ")} · Kontrakt: {project.name.toUpperCase().slice(0, 4)}-{s.id.slice(-3).toUpperCase()}</p>
                </div>
                <span className="text-sm font-semibold text-evergreen-700">{s.score}</span>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="innstillinger">
          <Card className="max-w-xl p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Settings className="h-4 w-4" aria-hidden />
              Prosjektinnstillinger
            </h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Reklamasjonsperiode</dt><dd className="font-medium">{project.claim_period_years} år (bustadoppføringslova)</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Intern svarfrist</dt><dd className="font-medium">{project.internal_deadline_days} dager</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Branding</dt><dd className="font-medium">Nordheim standard</dd></div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">Frister og regler er konfigurerbare per prosjekt og kontrakt. Demo-verdiene kan endres av administrator.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
