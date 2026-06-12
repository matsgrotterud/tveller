"use client";

import { Download, FileText, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatShortDate } from "@/lib/format";
import { DOCUMENTS, getProject } from "@/lib/seed";
import { useStore } from "@/lib/store";

export default function LeverandorDokumenterPage() {
  const { toast } = useStore();

  /* Leverandøren ser dokumenter de selv har lastet opp + relevante prosjektdokumenter */
  const ownDocs = DOCUMENTS.filter((d) => d.uploaded_by.includes("AS"));

  return (
    <div className="max-w-4xl space-y-4 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dokumenter</h1>
          <p className="text-sm text-muted-foreground">FDV-dokumenter du har levert til prosjektene</p>
        </div>
        <Button onClick={() => toast({ title: "Opplasting startet", description: "FDV-dokumentet kobles til riktig komponent automatisk (demo).", variant: "success" })}>
          <Upload aria-hidden />
          Last opp FDV
        </Button>
      </div>

      <Card className="border-amber-200 bg-amber-50/40 p-4">
        <p className="text-sm text-amber-900">
          <strong>2 komponenter mangler FDV fra dere:</strong> Varmtvannsbereder (OSO 200L) og downlights bad i Middelthunet Bygg C.
          Utbygger har bedt om opplasting innen 14 dager.
        </p>
      </Card>

      <div className="space-y-2">
        {ownDocs.map((d) => (
          <Card key={d.id} className="flex items-center gap-3 p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-fjord-50 text-fjord-700">
              <FileText className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{d.title}</p>
              <p className="text-xs text-muted-foreground">
                {getProject(d.project_id)?.name} · v{d.version} · {formatShortDate(d.created_at)} · {Math.round(d.size_kb / 100) / 10} MB
              </p>
            </div>
            <Badge className="shrink-0 bg-evergreen-50 text-evergreen-700">Publisert</Badge>
            <Button size="icon" variant="ghost" aria-label={`Last ned ${d.title}`} onClick={() => toast({ title: "Laster ned", description: d.title })}>
              <Download aria-hidden />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
