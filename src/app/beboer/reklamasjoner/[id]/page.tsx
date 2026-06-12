"use client";

import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Camera,
  CheckCircle2,
  Download,
  FileText,
  Info,
  Send,
} from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { ClaimTimeline } from "@/components/shared/claim-timeline";
import { EmptyState } from "@/components/shared/empty-state";
import { EvidenceGallery } from "@/components/shared/evidence-gallery";
import { StatusPill } from "@/components/shared/pills";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/input";
import { formatDateTime, formatTime, formatWeekday } from "@/lib/format";
import { DOCUMENTS, getSupplierByOrg } from "@/lib/seed";
import { RESIDENT_STATUS_EXPLANATION, ROOM_LABEL } from "@/lib/status";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function BeboerSakDetaljPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { claims, workOrders, slots, appointments, completionReports, selectSlot, confirmCompletion, reopenClaim, addComment, addEvidence, toast } = useStore();
  const [message, setMessage] = useState("");
  const [reopenOpen, setReopenOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState("");

  const claim = claims.find((c) => c.id === id);

  if (!claim) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Fant ikke saken"
        description="Saken finnes ikke eller er ikke tilgjengelig for deg."
        action={
          <Link href="/beboer/reklamasjoner">
            <Button variant="outline">Til sakslisten</Button>
          </Link>
        }
      />
    );
  }

  const workOrder = workOrders.find((w) => w.claim_id === claim.id);
  const proposedSlots = workOrder ? slots.filter((s) => s.work_order_id === workOrder.id && s.status === "proposed") : [];
  const appointment = appointments.find((a) => a.claim_id === claim.id && a.status === "bekreftet");
  const report = completionReports.find((r) => r.claim_id === claim.id);
  const supplier = getSupplierByOrg(claim.assigned_supplier_org_id);
  const publicComments = claim.comments.filter((c) => c.visibility === "public");
  const relatedDocs = DOCUMENTS.filter((d) => d.room_type === claim.room_type && d.visibility === "resident").slice(0, 2);

  const canConfirm = claim.status === "Klar for kontroll" || claim.status === "Ferdigstilt";

  return (
    <div className="space-y-4 animate-fade-up">
      <Link href="/beboer/reklamasjoner" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Alle saker
      </Link>

      {/* Topp */}
      <div>
        <p className="text-xs font-medium text-muted-foreground">
          {claim.case_number} · {ROOM_LABEL[claim.room_type]} · {claim.trade}
        </p>
        <h1 className="mt-1 text-xl font-semibold leading-snug tracking-tight">{claim.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <StatusPill status={claim.status} />
          {supplier && <span className="text-xs text-muted-foreground">Håndverker: {supplier.name}</span>}
        </div>
      </div>

      {/* Statusforklaring */}
      {RESIDENT_STATUS_EXPLANATION[claim.status] && (
        <Card className="flex items-start gap-3 border-fjord-200 bg-fjord-50/50 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-fjord-700" aria-hidden />
          <p className="text-sm text-fjord-900">{RESIDENT_STATUS_EXPLANATION[claim.status]}</p>
        </Card>
      )}

      {/* Velg tidspunkt */}
      {proposedSlots.length > 0 && (
        <Card className="border-evergreen-300 p-4 ring-1 ring-evergreen-100">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="h-4 w-4 text-evergreen-700" aria-hidden />
            Velg tidspunktet som passer best
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{supplier?.name} har foreslått tre tidspunkter for utbedringen.</p>
          <div className="mt-3 space-y-2">
            {proposedSlots.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  selectSlot(s.id);
                  toast({ title: "Tidspunkt bekreftet", description: "Avtalen ligger nå i kalenderen din.", variant: "success" });
                }}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-surface p-3.5 text-left transition-colors hover:border-evergreen-400 hover:bg-evergreen-50/50 cursor-pointer"
              >
                <span>
                  <span className="block text-sm font-medium capitalize">{formatWeekday(s.start_at)}</span>
                  <span className="block text-xs text-muted-foreground">
                    kl. {formatTime(s.start_at)}–{formatTime(s.end_at)}
                  </span>
                </span>
                <span className="rounded-full bg-evergreen-600 px-3 py-1 text-xs font-medium text-white">Velg</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Bekreftet avtale */}
      {appointment && (
        <Card className="flex items-center gap-3 p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-evergreen-50 text-evergreen-700">
            <CalendarDays className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium capitalize">{formatWeekday(appointment.start_at)}</p>
            <p className="text-xs text-muted-foreground">
              kl. {formatTime(appointment.start_at)}–{formatTime(appointment.end_at)} · {supplier?.name}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast({ title: "Ombooking forespurt", description: "Vi gir håndverkeren beskjed om at du ønsker nytt tidspunkt.", variant: "info" })}
          >
            Endre
          </Button>
        </Card>
      )}

      {/* Bekreft / gjenåpne */}
      {canConfirm && (
        <Card className="border-amber-300 bg-amber-50/40 p-4 ring-1 ring-amber-100">
          <p className="text-sm font-semibold text-amber-900">Utbedringen er meldt ferdig. Stemmer dette?</p>
          {report && (
            <div className="mt-2 rounded-xl border border-amber-200 bg-surface p-3 text-sm">
              <p className="font-medium">Rapport fra {report.completed_by}</p>
              <p className="mt-1 text-xs text-muted-foreground">{report.work_summary}</p>
            </div>
          )}
          <div className="mt-3 flex gap-2">
            <Button
              className="flex-1"
              onClick={() => {
                confirmCompletion(claim.id);
                toast({ title: "Takk for bekreftelsen!", description: "Saken er ferdig utbedret og arkiveres med komplett historikk.", variant: "success" });
              }}
            >
              <CheckCircle2 aria-hidden />
              Bekreft utbedring
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setReopenOpen(true)}>
              Problemet består
            </Button>
          </div>
        </Card>
      )}

      {/* Dokumentasjon */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Dokumentasjon</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              addEvidence(claim.id, `IMG_${Math.floor(Math.random() * 9000 + 1000)}.jpg`, "Tilleggsdokumentasjon fra beboer", "Lise Frankum");
              toast({ title: "Dokumentasjon lagt til", description: "Bildet er lagt til i saken.", variant: "success" });
            }}
          >
            <Camera aria-hidden />
            Legg til
          </Button>
        </div>
        <div className="mt-3">
          <EvidenceGallery items={claim.evidence} />
        </div>
      </Card>

      {/* Meldinger */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold">Meldinger</h2>
        <div className="mt-3 space-y-3">
          {publicComments.length === 0 && <p className="text-sm text-muted-foreground">Ingen meldinger ennå. Skriv gjerne hvis du lurer på noe.</p>}
          {publicComments.map((c) => {
            const mine = c.author_role === "beboer";
            return (
              <div key={c.id} className={cn("max-w-[85%]", mine ? "ml-auto" : "")}>
                <div className={cn("rounded-2xl px-3.5 py-2.5 text-sm", mine ? "rounded-br-md bg-evergreen-700 text-white" : "rounded-bl-md bg-muted")}>
                  {c.body}
                </div>
                <p className={cn("mt-1 text-[11px] text-muted-foreground", mine && "text-right")}>
                  {c.author_name} · {formatDateTime(c.created_at)}
                </p>
              </div>
            );
          })}
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!message.trim()) return;
            addComment(claim.id, message.trim(), "public", "Lise Frankum", "beboer");
            setMessage("");
            toast({ title: "Melding sendt", variant: "success" });
          }}
        >
          <Textarea
            rows={1}
            placeholder="Skriv en melding …"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-10 flex-1 resize-none"
            aria-label="Ny melding"
          />
          <Button type="submit" size="icon" aria-label="Send melding" disabled={!message.trim()}>
            <Send aria-hidden />
          </Button>
        </form>
      </Card>

      {/* Relevante dokumenter */}
      {relatedDocs.length > 0 && (
        <Card className="p-4">
          <h2 className="text-sm font-semibold">Relevant for denne saken</h2>
          <div className="mt-3 space-y-2">
            {relatedDocs.map((d) => (
              <Link key={d.id} href="/beboer/dokumenter" className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/50">
                <FileText className="h-4 w-4 shrink-0 text-fjord-700" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-sm">{d.title}</span>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Tidslinje */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold">Hva har skjedd</h2>
        <div className="mt-4">
          <ClaimTimeline events={claim.timeline} />
        </div>
      </Card>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => toast({ title: "Saken lastes ned", description: "PDF med komplett historikk genereres (demo).", variant: "info" })}
      >
        <Download aria-hidden />
        Last ned saken
      </Button>

      {/* Gjenåpne-dialog */}
      <Dialog open={reopenOpen} onOpenChange={setReopenOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Problemet består</DialogTitle>
            <DialogDescription>
              Beskriv kort hva som fortsatt er galt, så går saken tilbake til utbygger for ny vurdering.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            rows={3}
            placeholder="F.eks. «Lyden er fortsatt like kraftig om natten»"
            value={reopenReason}
            onChange={(e) => setReopenReason(e.target.value)}
            aria-label="Begrunnelse for gjenåpning"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReopenOpen(false)}>Avbryt</Button>
            <Button
              variant="destructive"
              disabled={reopenReason.trim().length < 5}
              onClick={() => {
                reopenClaim(claim.id, reopenReason.trim());
                setReopenOpen(false);
                setReopenReason("");
                toast({ title: "Saken er gjenåpnet", description: "Utbygger ser på saken igjen og holder deg oppdatert.", variant: "info" });
              }}
            >
              Gjenåpne saken
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
