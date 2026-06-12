"use client";

import { CheckCheck, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatRelative } from "@/lib/format";
import { useStore } from "@/lib/store";
import { initials } from "@/lib/utils";

export default function BeboerMeldingerPage() {
  const { claims } = useStore();
  const [query, setQuery] = useState("");

  const threads = claims
    .filter((c) => c.resident_user_id === "u-lise")
    .map((c) => {
      const publicMsgs = c.comments.filter((m) => m.visibility === "public");
      return { claim: c, last: publicMsgs[publicMsgs.length - 1], count: publicMsgs.length };
    })
    .filter((t) => t.count > 0 || true)
    .filter((t) => t.claim.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (b.last?.created_at ?? b.claim.updated_at).localeCompare(a.last?.created_at ?? a.claim.updated_at));

  return (
    <div className="space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Meldinger</h1>
        <p className="text-sm text-muted-foreground">Dialog samlet per sak – alltid sporbart</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input placeholder="Søk i samtaler …" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Søk i samtaler" />
      </div>

      {threads.length === 0 ? (
        <EmptyState icon={MessageSquare} title="Ingen samtaler" description="Meldinger knyttet til sakene dine vises her." />
      ) : (
        <div className="space-y-2">
          {threads.map(({ claim, last, count }) => (
            <Link key={claim.id} href={`/beboer/reklamasjoner/${claim.id}`}>
              <Card className="mb-2 flex items-center gap-3 p-3.5 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-evergreen-100 text-xs font-bold text-evergreen-800">
                  {last ? initials(last.author_name) : "NB"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{claim.title}</p>
                    {last && <span className="shrink-0 text-[11px] text-muted-foreground">{formatRelative(last.created_at)}</span>}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {last ? (
                      <>
                        {last.author_role === "beboer" && <CheckCheck className="mr-1 inline h-3 w-3 text-fjord-500" aria-hidden />}
                        {last.author_name.split(" ")[0]}: {last.body}
                      </>
                    ) : (
                      "Ingen meldinger ennå – åpne saken for å skrive."
                    )}
                  </p>
                </div>
                {count > 0 && <Badge className="shrink-0 bg-muted text-muted-foreground">{count}</Badge>}
              </Card>
            </Link>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Systemmeldinger (statusendringer og varsler) finner du i varselsenteret øverst.
      </p>
    </div>
  );
}
