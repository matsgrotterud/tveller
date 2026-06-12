"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PROJECTS, TENANTS } from "@/lib/seed";

const PROJECT_STATUS: Record<string, { label: string; cls: string }> = {
  aftermarket: { label: "Ettermarked", cls: "bg-evergreen-50 text-evergreen-700" },
  handover: { label: "Overtakelse", cls: "bg-fjord-50 text-fjord-700" },
  construction: { label: "Under bygging", cls: "bg-amber-50 text-amber-800" },
  planning: { label: "Planlegging", cls: "bg-muted text-muted-foreground" },
};

export default function AdminProsjekterPage() {
  return (
    <div className="space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Prosjekter</h1>
        <p className="text-sm text-muted-foreground">Alle prosjekter på plattformen, gruppert per kunde (kun driftsmetadata)</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prosjekt</TableHead>
            <TableHead>Kunde</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Enheter</TableHead>
            <TableHead className="text-right">Overtakelser</TableHead>
            <TableHead className="text-right">Åpne saker</TableHead>
            <TableHead className="text-right">Aktivering</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PROJECTS.map((p) => {
            const st = PROJECT_STATUS[p.status] ?? PROJECT_STATUS.planning;
            return (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-muted-foreground">{TENANTS[0].name}</TableCell>
                <TableCell><Badge className={st.cls}>{st.label}</Badge></TableCell>
                <TableCell className="text-right">{p.units_count}</TableCell>
                <TableCell className="text-right">{p.handovers_completed}</TableCell>
                <TableCell className="text-right">{p.open_claims}</TableCell>
                <TableCell className="text-right">{p.resident_activation} %</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <p className="text-xs text-muted-foreground">
        Superadmin ser kun driftsmetadata. Innholdet i saker og persondata krever supporttilgang med begrunnelse.
      </p>
    </div>
  );
}
