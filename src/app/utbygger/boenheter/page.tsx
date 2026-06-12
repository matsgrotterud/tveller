"use client";

import { Home, Search, Upload, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatShortDate } from "@/lib/format";
import { PROJECTS, UNITS, getProject } from "@/lib/seed";
import { OPEN_STATUSES } from "@/lib/status";
import { useStore } from "@/lib/store";

const HANDOVER_LABEL: Record<string, { label: string; cls: string }> = {
  ikke_planlagt: { label: "Ikke planlagt", cls: "bg-muted text-muted-foreground" },
  planlagt: { label: "Planlagt", cls: "bg-fjord-50 text-fjord-700" },
  gjennomført: { label: "Gjennomført", cls: "bg-amber-50 text-amber-800" },
  signert: { label: "Signert", cls: "bg-evergreen-50 text-evergreen-700" },
};

export default function BoenheterPage() {
  const { claims } = useStore();
  const [query, setQuery] = useState("");
  const [project, setProject] = useState("alle");

  const filtered = UNITS.filter((u) => (project === "alle" || u.project_id === project))
    .filter((u) => !query || `${u.unit_number} ${u.resident_name ?? ""}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Boenheter</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} enheter i demo-utvalget (full import via CSV/Excel)</p>
        </div>
        <div className="flex gap-2">
          <Link href="/utbygger/import">
            <Button variant="outline">
              <Upload aria-hidden />
              Importer enheter
            </Button>
          </Link>
          <Link href="/utbygger/invitasjoner">
            <Button>
              <UserPlus aria-hidden />
              Inviter beboere
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input placeholder="Søk på enhet eller beboer …" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Søk i enheter" />
        </div>
        <Select value={project} onChange={(e) => setProject(e.target.value)} className="w-52" aria-label="Filtrer på prosjekt">
          <option value="alle">Alle prosjekter</option>
          {PROJECTS.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Enhet</TableHead>
            <TableHead>Prosjekt</TableHead>
            <TableHead>Etasje</TableHead>
            <TableHead>Areal</TableHead>
            <TableHead>Soverom</TableHead>
            <TableHead>Beboer</TableHead>
            <TableHead>Overtakelse</TableHead>
            <TableHead>Åpne saker</TableHead>
            <TableHead>Reklamasjonsperiode</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((u) => {
            const openCount = claims.filter((c) => c.unit_id === u.id && OPEN_STATUSES.includes(c.status)).length;
            const h = HANDOVER_LABEL[u.handover_status];
            return (
              <TableRow key={u.id}>
                <TableCell className="font-medium">
                  <span className="inline-flex items-center gap-2">
                    <Home className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                    {u.unit_number}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{getProject(u.project_id)?.name}</TableCell>
                <TableCell>{u.floor}.</TableCell>
                <TableCell>{u.size_m2} m²</TableCell>
                <TableCell>{u.bedrooms}</TableCell>
                <TableCell>{u.resident_name ?? <span className="text-muted-foreground">Ikke tilknyttet</span>}</TableCell>
                <TableCell><Badge className={h.cls}>{h.label}</Badge></TableCell>
                <TableCell>{openCount > 0 ? <Badge className="bg-amber-50 text-amber-800">{openCount}</Badge> : <span className="text-muted-foreground">0</span>}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{u.claim_period_end_date ? `Til ${formatShortDate(u.claim_period_end_date)}` : "–"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
