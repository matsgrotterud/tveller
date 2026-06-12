"use client";

import { Download, Lock, ScrollText, Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { formatDateTime } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function AuditPage() {
  const { auditEvents, toast } = useStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("alle");

  const filtered = auditEvents
    .filter((e) => filter === "alle" || (filter === "sensitive" && e.sensitive))
    .filter((e) => !query || `${e.actor} ${e.action} ${e.entity_id} ${e.metadata}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <div className="max-w-4xl space-y-4 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Audit log</h1>
          <p className="text-sm text-muted-foreground">Uforanderlig hendelseslogg · hver hendelse hashes og kan ikke endres eller slettes</p>
        </div>
        <Button variant="outline" onClick={() => toast({ title: "Eksport startet", description: "Revisjonsloggen eksporteres som signert CSV (demo).", variant: "success" })}>
          <Download aria-hidden />
          Eksporter
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input placeholder="Søk på aktør, handling eller entitet …" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Søk i logg" />
        </div>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-48" aria-label="Filtrer">
          <option value="alle">Alle hendelser</option>
          <option value="sensitive">Kun sensitive</option>
        </Select>
      </div>

      <Card className="divide-y divide-border p-0">
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">Ingen hendelser matcher filteret.</div>
        )}
        {filtered.map((e) => (
          <div key={e.id} className={cn("flex items-start gap-3 p-4", e.sensitive && "bg-red-50/40")}>
            <span className={cn("mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg", e.sensitive ? "bg-red-100 text-red-700" : "bg-muted text-muted-foreground")}>
              {e.sensitive ? <Lock className="h-3.5 w-3.5" aria-hidden /> : <ScrollText className="h-3.5 w-3.5" aria-hidden />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <code className="font-mono text-xs font-semibold">{e.action}</code>
                {e.sensitive && <Badge className="bg-red-50 text-red-700">Sensitiv</Badge>}
              </div>
              <p className="mt-0.5 text-sm">
                <span className="font-medium">{e.actor}</span> · {e.entity_type}: {e.entity_id}
              </p>
              {e.metadata && <p className="mt-0.5 text-xs text-muted-foreground">{e.metadata}</p>}
              <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                {formatDateTime(e.created_at)} · hash: {e.id.slice(-6)}…{e.created_at.slice(20, 23)}f2a
              </p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
