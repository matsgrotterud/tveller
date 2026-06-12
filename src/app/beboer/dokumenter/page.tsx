"use client";

import { Download, FileText, FolderOpen, Search } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatShortDate } from "@/lib/format";
import { DOCUMENTS } from "@/lib/seed";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Alle", "Overtakelse", "FDV", "Garantier", "Tegninger", "Sameie", "Tilvalg"] as const;

export default function BeboerDokumenterPage() {
  const { toast } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Alle");

  const visible = DOCUMENTS.filter((d) => d.visibility === "resident");
  const relevant = visible.filter((d) => d.unit_id === "unit-c103" || d.room_type !== null);

  const filtered = visible.filter((d) => {
    if (category !== "Alle" && d.category !== category) return false;
    if (query && !`${d.title} ${d.description}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dokumenter</h1>
        <p className="text-sm text-muted-foreground">FDV, garantier og alt som hører til boligen din</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input placeholder="Søk i dokumenter …" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Søk i dokumenter" />
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Dokumentkategorier">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={category === c}
            onClick={() => setCategory(c)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer",
              category === c ? "bg-evergreen-700 text-white" : "border border-border bg-surface text-muted-foreground hover:bg-muted",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {category === "Alle" && !query && (
        <section aria-label="Relevant for din bolig">
          <h2 className="text-sm font-semibold text-muted-foreground">Relevant for din bolig</h2>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {relevant.slice(0, 4).map((d) => (
              <Card key={d.id} className="p-3">
                <FileText className="h-5 w-5 text-fjord-700" aria-hidden />
                <p className="mt-2 line-clamp-2 text-xs font-medium leading-snug">{d.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{d.category}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Ingen dokumenter funnet"
          description="Prøv et annet søkeord eller en annen kategori. Nye dokumenter fra utbygger dukker opp her automatisk."
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((d) => (
            <Card key={d.id} className="flex items-center gap-3 p-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-fjord-50 text-fjord-700">
                <FileText className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{d.title}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                  <span>{d.category}</span>
                  <Badge className="bg-muted text-muted-foreground">v{d.version}</Badge>
                  <span>{formatShortDate(d.created_at)}</span>
                  <span>{d.file_type.toUpperCase()} · {Math.round(d.size_kb / 10) / 100} MB</span>
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Last ned ${d.title}`}
                onClick={() => toast({ title: "Laster ned", description: d.title, variant: "info" })}
              >
                <Download aria-hidden />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
