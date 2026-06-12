"use client";

import { CheckSquare, Download, Filter, Search, Square, Tag, UserPlus, Wrench } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { RiskPill, SeverityPill, StatusPill } from "@/components/shared/pills";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { daysUntil, formatShortDate } from "@/lib/format";
import { PROJECTS, SUPPLIERS, getProject, getSupplierByOrg, getUnit, getUser } from "@/lib/seed";
import { CLAIM_STATUSES, OPEN_STATUSES, ROOM_LABEL } from "@/lib/status";
import { useStore } from "@/lib/store";
import type { Claim } from "@/lib/types";
import { cn } from "@/lib/utils";

const SAVED_VIEWS = [
  { key: "nye", label: "Nye saker" },
  { key: "fristfare", label: "Fristfare" },
  { key: "mangler-ansvarlig", label: "Mangler ansvarlig" },
  { key: "eskalerte", label: "Eskalerte saker" },
  { key: "avventer-beboer", label: "Avventer beboer" },
  { key: "avventer-leverandor", label: "Avventer underleverandør" },
  { key: "gjenapnede", label: "Gjenåpnede saker" },
  { key: "arkivering", label: "Klar for arkivering" },
] as const;

type ViewKey = (typeof SAVED_VIEWS)[number]["key"] | "alle";

function viewFilter(view: ViewKey, c: Claim): boolean {
  switch (view) {
    case "nye":
      return c.status === "Sendt inn" || c.status === "Mottatt";
    case "fristfare":
      return c.deadline_risk_level === "høy" && OPEN_STATUSES.includes(c.status);
    case "mangler-ansvarlig":
      return !c.assigned_developer_user_id && OPEN_STATUSES.includes(c.status);
    case "eskalerte":
      return c.status === "Eskalert";
    case "avventer-beboer":
      return c.status === "Trenger mer info" || c.status === "Tidspunkt foreslått" || c.status === "Klar for kontroll";
    case "avventer-leverandor":
      return c.status === "Sendt til underleverandør" || c.status === "Planlagt" || c.status === "Under utbedring";
    case "gjenapnede":
      return c.reopened;
    case "arkivering":
      return c.status === "Bekreftet av beboer" || c.status === "Ferdigstilt";
    default:
      return true;
  }
}

export default function ReklamasjonInboxPage() {
  const { claims, toast } = useStore();
  const [view, setView] = useState<ViewKey>("alle");
  const [query, setQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("alle");
  const [statusFilter, setStatusFilter] = useState("alle");
  const [tradeFilter, setTradeFilter] = useState("alle");
  const [supplierFilter, setSupplierFilter] = useState("alle");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return claims
      .filter((c) => viewFilter(view, c))
      .filter((c) => projectFilter === "alle" || c.project_id === projectFilter)
      .filter((c) => statusFilter === "alle" || c.status === statusFilter)
      .filter((c) => tradeFilter === "alle" || c.trade === tradeFilter)
      .filter((c) => supplierFilter === "alle" || c.assigned_supplier_org_id === supplierFilter)
      .filter((c) => {
        if (!query) return true;
        const unit = getUnit(c.unit_id);
        return `${c.case_number} ${c.title} ${unit?.unit_number ?? ""}`.toLowerCase().includes(query.toLowerCase());
      })
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  }, [claims, view, projectFilter, statusFilter, tradeFilter, supplierFilter, query]);

  function toggleAll() {
    setSelected((s) => (s.size === filtered.length ? new Set() : new Set(filtered.map((c) => c.id))));
  }

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function bulk(action: string) {
    toast({ title: `${action} utført`, description: `${selected.size} saker oppdatert.`, variant: "success" });
    setSelected(new Set());
  }

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reklamasjoner</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} saker · {claims.filter((c) => OPEN_STATUSES.includes(c.status)).length} åpne totalt</p>
        </div>
        <div className="flex gap-2">
          <Link href="/utbygger/reklamasjoner/kanban">
            <Button variant="outline" size="sm">Kanban-visning</Button>
          </Link>
          <Button size="sm" variant="outline" onClick={() => toast({ title: "Eksport startet", description: "Sakslisten eksporteres til Excel (demo).", variant: "info" })}>
            <Download aria-hidden />
            Eksporter
          </Button>
        </div>
      </div>

      {/* Lagrede visninger */}
      <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Lagrede visninger">
        <button
          role="tab"
          aria-selected={view === "alle"}
          onClick={() => setView("alle")}
          className={cn(
            "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer",
            view === "alle" ? "bg-evergreen-700 text-white" : "border border-border bg-surface text-muted-foreground hover:bg-muted",
          )}
        >
          Alle
        </button>
        {SAVED_VIEWS.map((v) => {
          const count = claims.filter((c) => viewFilter(v.key, c)).length;
          return (
            <button
              key={v.key}
              role="tab"
              aria-selected={view === v.key}
              onClick={() => setView(v.key)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                view === v.key ? "bg-evergreen-700 text-white" : "border border-border bg-surface text-muted-foreground hover:bg-muted",
              )}
            >
              {v.label}
              {count > 0 && <span className={cn("ml-1.5 text-xs", view === v.key ? "text-evergreen-200" : "text-muted-foreground")}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Søk og filtre */}
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input placeholder="Søk på saksnr, tittel eller enhet …" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Søk i saker" />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters}>
          <Filter aria-hidden />
          Filtre
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-surface p-3 md:grid-cols-4">
          <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} aria-label="Filtrer på prosjekt">
            <option value="alle">Alle prosjekter</option>
            {PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filtrer på status">
            <option value="alle">Alle statuser</option>
            {CLAIM_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
          <Select value={tradeFilter} onChange={(e) => setTradeFilter(e.target.value)} aria-label="Filtrer på fag">
            <option value="alle">Alle fag</option>
            {["Rørlegger", "Elektriker", "Tømrer", "Flislegger", "Ventilasjon", "Parkett", "Kjøkken"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
          <Select value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)} aria-label="Filtrer på leverandør">
            <option value="alle">Alle leverandører</option>
            {SUPPLIERS.map((s) => (
              <option key={s.id} value={s.organization_id}>{s.name}</option>
            ))}
          </Select>
        </div>
      )}

      {/* Bulkhandlinger */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-evergreen-300 bg-evergreen-50/60 px-3 py-2">
          <p className="text-sm font-medium">{selected.size} valgt</p>
          <div className="flex flex-wrap gap-1.5">
            <Button size="sm" variant="outline" onClick={() => bulk("Tildeling av ansvarlig")}>
              <UserPlus aria-hidden />
              Tildel ansvarlig
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulk("Tildeling av leverandør")}>Tildel leverandør</Button>
            <Button size="sm" variant="outline" onClick={() => bulk("Melding")}>Send melding</Button>
            <Button size="sm" variant="outline" onClick={() => bulk("Statusendring")}>Endre status</Button>
            <Button size="sm" variant="outline" onClick={() => bulk("Eksport")}>
              <Download aria-hidden />
              Eksporter
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulk("Merking")}>
              <Tag aria-hidden />
              Legg til etikett
            </Button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState icon={Wrench} title="Ingen saker i denne visningen" description="Endre filter eller visning for å se flere saker." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <button onClick={toggleAll} aria-label="Velg alle" className="cursor-pointer align-middle text-muted-foreground hover:text-foreground">
                  {selected.size === filtered.length && filtered.length > 0 ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                </button>
              </TableHead>
              <TableHead>Saksnr</TableHead>
              <TableHead>Tittel</TableHead>
              <TableHead>Prosjekt</TableHead>
              <TableHead>Boenhet</TableHead>
              <TableHead>Rom</TableHead>
              <TableHead>Fag</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Alvorlighet</TableHead>
              <TableHead>Leverandør</TableHead>
              <TableHead>Frist</TableHead>
              <TableHead>Mottatt</TableHead>
              <TableHead>Ansvarlig</TableHead>
              <TableHead>Risiko</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => {
              const unit = getUnit(c.unit_id);
              const project = getProject(c.project_id);
              const supplier = getSupplierByOrg(c.assigned_supplier_org_id);
              const responsible = c.assigned_developer_user_id ? getUser(c.assigned_developer_user_id) : null;
              const days = c.due_at ? daysUntil(c.due_at) : null;
              return (
                <TableRow key={c.id}>
                  <TableCell>
                    <button onClick={() => toggle(c.id)} aria-label={`Velg ${c.case_number}`} className="cursor-pointer align-middle text-muted-foreground hover:text-foreground">
                      {selected.has(c.id) ? <CheckSquare className="h-4 w-4 text-evergreen-600" /> : <Square className="h-4 w-4" />}
                    </button>
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-mono text-xs">{c.case_number}</TableCell>
                  <TableCell>
                    <Link href={`/utbygger/reklamasjoner/${c.id}`} className="font-medium text-foreground hover:text-evergreen-700 hover:underline">
                      {c.title}
                    </Link>
                    {c.reopened && <span className="ml-1.5 rounded bg-red-50 px-1 text-[10px] font-semibold text-red-700">GJENÅPNET</span>}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{project?.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{unit?.unit_number}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{ROOM_LABEL[c.room_type]}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{c.trade}</TableCell>
                  <TableCell className="whitespace-nowrap"><StatusPill status={c.status} /></TableCell>
                  <TableCell className="whitespace-nowrap"><SeverityPill severity={c.severity} /></TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{supplier?.name ?? "–"}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {days !== null && OPEN_STATUSES.includes(c.status) ? (
                      <span className={cn("text-xs font-medium", days <= 2 ? "text-red-700" : days <= 5 ? "text-amber-700" : "text-muted-foreground")}>
                        {days < 0 ? "Forfalt" : `${days} d`}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">–</span>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{c.received_at ? formatShortDate(c.received_at) : "–"}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{responsible?.name ?? "Ikke tildelt"}</TableCell>
                  <TableCell className="whitespace-nowrap"><RiskPill level={c.deadline_risk_level} label={c.deadline_risk_level === "lav" ? "Lav" : c.deadline_risk_level === "middels" ? "Middels" : "Høy"} /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
