"use client";

import { Building2, CalendarDays, FileText, Megaphone, MessageSquare, Plus, Wrench } from "lucide-react";
import { useState } from "react";
import { StatusPill } from "@/components/shared/pills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import { formatDate, formatRelative, formatTime } from "@/lib/format";
import { COMMON_AREA_CLAIMS, DOCUMENTS, SAMEIE_ANNOUNCEMENTS, SAMEIE_MEETINGS } from "@/lib/seed";
import { useStore } from "@/lib/store";

export default function SameiePage() {
  const { toast } = useStore();
  const [reportOpen, setReportOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [localClaims, setLocalClaims] = useState(COMMON_AREA_CLAIMS);

  const boardDocs = DOCUMENTS.filter((d) => d.category === "Sameie");

  return (
    <div className="space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sameiet Middelthunet</h1>
        <p className="text-sm text-muted-foreground">Fellesarealer, styret og kunngjøringer</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => setReportOpen(true)}>
          <Plus aria-hidden />
          Meld feil i fellesareal
        </Button>
        <Button variant="outline" onClick={() => setContactOpen(true)}>
          <MessageSquare aria-hidden />
          Kontakt styret
        </Button>
      </div>

      {/* Kunngjøringer */}
      <Card className="p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Megaphone className="h-4 w-4 text-evergreen-700" aria-hidden />
          Kunngjøringer
        </h2>
        <div className="mt-3 space-y-3">
          {SAMEIE_ANNOUNCEMENTS.map((a) => (
            <div key={a.id} className="rounded-xl border border-border p-3.5">
              <p className="text-sm font-medium">{a.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{a.body}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">{a.author} · {formatRelative(a.created_at)}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Møter */}
      <Card className="p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <CalendarDays className="h-4 w-4 text-evergreen-700" aria-hidden />
          Møter
        </h2>
        {SAMEIE_MEETINGS.map((m) => (
          <div key={m.id} className="mt-3 rounded-xl border border-evergreen-200 bg-evergreen-50/50 p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{m.title}</p>
              <Badge className="bg-evergreen-100 text-evergreen-800">{formatDate(m.date)}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">kl. {formatTime(m.date)} · {m.location}</p>
            <p className="mt-2 text-xs font-medium text-muted-foreground">Agenda</p>
            <ul className="mt-1 space-y-0.5">
              {m.agenda.map((p) => (
                <li key={p} className="text-xs text-muted-foreground">• {p}</li>
              ))}
            </ul>
          </div>
        ))}
      </Card>

      {/* Fellesareal-saker */}
      <Card className="p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Wrench className="h-4 w-4 text-evergreen-700" aria-hidden />
          Saker i fellesarealer
        </h2>
        <div className="mt-3 space-y-2">
          {localClaims.map((c) => (
            <div key={c.id} className="rounded-xl border border-border p-3.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-snug">{c.title}</p>
                <StatusPill status={c.status} className="shrink-0" />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {c.area} · Meldt av {c.reported_by} · {formatRelative(c.created_at)}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Styredokumenter */}
      <Card className="p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <FileText className="h-4 w-4 text-evergreen-700" aria-hidden />
          Styredokumenter
        </h2>
        <div className="mt-3 space-y-2">
          {boardDocs.map((d) => (
            <button
              key={d.id}
              onClick={() => toast({ title: "Laster ned", description: d.title, variant: "info" })}
              className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left hover:bg-muted/50 cursor-pointer"
            >
              <FileText className="h-4 w-4 shrink-0 text-fjord-700" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{d.title}</span>
                <span className="block text-xs text-muted-foreground">v{d.version} · Kun for beboere og styret</span>
              </span>
            </button>
          ))}
        </div>
      </Card>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <Building2 className="h-3.5 w-3.5" aria-hidden />
        Innholdet her er kun tilgjengelig for beboere og styret i Sameiet Middelthunet.
      </p>

      {/* Meld feil-dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Meld feil i fellesareal</DialogTitle>
            <DialogDescription>Saken går til styret og utbygger, og du kan følge den her.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="area">Hvor er feilen?</Label>
              <Input id="area" placeholder="F.eks. «Trappeoppgang Bygg C»" value={area} onChange={(e) => setArea(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Beskriv feilen</Label>
              <Textarea id="desc" rows={3} placeholder="Hva er galt?" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportOpen(false)}>Avbryt</Button>
            <Button
              disabled={area.trim().length < 3 || description.trim().length < 5}
              onClick={() => {
                setLocalClaims((prev) => [
                  { id: `fc-${Date.now()}`, title: description.trim(), status: "Mottatt" as const, reported_by: "Lise Frankum", created_at: new Date().toISOString(), area: area.trim() },
                  ...prev,
                ]);
                setReportOpen(false);
                setArea("");
                setDescription("");
                toast({ title: "Feil meldt", description: "Styret og utbygger har fått beskjed.", variant: "success" });
              }}
            >
              Send inn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Kontakt styret-dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kontakt styret</DialogTitle>
            <DialogDescription>Meldingen sendes til styret@middelthunet.no.</DialogDescription>
          </DialogHeader>
          <Textarea rows={4} placeholder="Skriv meldingen din …" value={contactMsg} onChange={(e) => setContactMsg(e.target.value)} aria-label="Melding til styret" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactOpen(false)}>Avbryt</Button>
            <Button
              disabled={contactMsg.trim().length < 5}
              onClick={() => {
                setContactOpen(false);
                setContactMsg("");
                toast({ title: "Melding sendt", description: "Styret svarer vanligvis innen et par dager.", variant: "success" });
              }}
            >
              Send melding
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
