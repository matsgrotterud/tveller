"use client";

import { AlertTriangle, FileText, Search, Upload } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatShortDate } from "@/lib/format";
import { DOCUMENTS, PROJECTS, getProject } from "@/lib/seed";
import { ROOM_LABEL } from "@/lib/status";
import { useStore } from "@/lib/store";

const VISIBILITY_LABEL: Record<string, { label: string; cls: string }> = {
  resident: { label: "Beboer", cls: "bg-evergreen-50 text-evergreen-700" },
  developer: { label: "Utbygger", cls: "bg-fjord-50 text-fjord-700" },
  supplier: { label: "Leverandør", cls: "bg-violet-50 text-violet-700" },
  board: { label: "Styret", cls: "bg-amber-50 text-amber-800" },
  internal: { label: "Internt", cls: "bg-muted text-muted-foreground" },
};

const MISSING_FDV = [
  { component: "Varmtvannsbereder (OSO 200L)", building: "Bygg C", trade: "Rørlegger" },
  { component: "Downlights bad", building: "Bygg C", trade: "Elektriker" },
  { component: "Vinduer (NorDan N-Tech)", building: "Bygg A", trade: "Tømrer" },
];

export default function DokumenterAdminPage() {
  const { toast } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("alle");
  const [project, setProject] = useState("alle");
  const [visibility, setVisibility] = useState("alle");

  const filtered = DOCUMENTS.filter((d) => category === "alle" || d.category === category)
    .filter((d) => project === "alle" || d.project_id === project)
    .filter((d) => visibility === "alle" || d.visibility === visibility)
    .filter((d) => !query || `${d.title} ${d.description}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dokumenter / FDV</h1>
          <p className="text-sm text-muted-foreground">{DOCUMENTS.length} dokumenter · versjonert og koblet til prosjekt, enhet, rom og komponent</p>
        </div>
        <Button onClick={() => toast({ title: "Opplasting startet", description: "Dokumentet lastes opp og kategoriseres (demo).", variant: "success" })}>
          <Upload aria-hidden />
          Last opp dokumenter
        </Button>
      </div>

      {/* Manglende FDV */}
      <Card className="border-amber-200 bg-amber-50/40 p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-amber-900">
          <AlertTriangle className="h-4 w-4" aria-hidden />
          Manglende FDV ({MISSING_FDV.length} komponenter)
        </h2>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {MISSING_FDV.map((m) => (
            <div key={m.component} className="rounded-xl border border-amber-200 bg-surface p-3">
              <p className="text-sm font-medium">{m.component}</p>
              <p className="text-xs text-muted-foreground">{m.building} · Ansvarlig fag: {m.trade}</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => toast({ title: "Purring sendt", description: `Leverandør er bedt om å laste opp FDV for ${m.component}.`, variant: "success" })}>
                Purr leverandør
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Filtre */}
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input placeholder="Søk på tittel, komponent eller beskrivelse …" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Søk i dokumenter" />
        </div>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-40" aria-label="Kategori">
          <option value="alle">Alle kategorier</option>
          {["FDV", "Overtakelse", "Garantier", "Tegninger", "Sameie", "Tilvalg"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
        <Select value={project} onChange={(e) => setProject(e.target.value)} className="w-44" aria-label="Prosjekt">
          <option value="alle">Alle prosjekter</option>
          {PROJECTS.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
        <Select value={visibility} onChange={(e) => setVisibility(e.target.value)} className="w-36" aria-label="Synlighet">
          <option value="alle">All synlighet</option>
          <option value="resident">Beboer</option>
          <option value="supplier">Leverandør</option>
          <option value="board">Styret</option>
          <option value="internal">Internt</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="Ingen dokumenter funnet" description="Endre filter eller last opp nye dokumenter." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tittel</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Prosjekt</TableHead>
              <TableHead>Kobling</TableHead>
              <TableHead>Versjon</TableHead>
              <TableHead>Synlighet</TableHead>
              <TableHead>Lastet opp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((d) => {
              const v = VISIBILITY_LABEL[d.visibility];
              return (
                <TableRow key={d.id}>
                  <TableCell>
                    <span className="flex items-center gap-2 font-medium">
                      <FileText className="h-4 w-4 shrink-0 text-fjord-700" aria-hidden />
                      {d.title}
                    </span>
                  </TableCell>
                  <TableCell><Badge className="bg-muted text-muted-foreground">{d.category}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{getProject(d.project_id)?.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {d.unit_id ? "Enhet" : d.component_id ? "Komponent" : d.room_type ? `Rom: ${ROOM_LABEL[d.room_type]}` : "Prosjekt"}
                  </TableCell>
                  <TableCell className="font-mono text-xs">v{d.version}</TableCell>
                  <TableCell><Badge className={v.cls}>{v.label}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatShortDate(d.created_at)} · {d.uploaded_by}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
