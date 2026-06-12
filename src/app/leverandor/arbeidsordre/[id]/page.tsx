"use client";

import {
  ArrowLeft,
  CalendarPlus,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Hammer,
  MapPin,
  Send,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { EvidenceGallery } from "@/components/shared/evidence-gallery";
import { WorkOrderStatusPill } from "@/components/shared/pills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import { daysFromNow } from "@/lib/seed";
import { formatDateTime, formatTime, formatWeekday } from "@/lib/format";
import { DOCUMENTS, getProject, getUnit, getUser } from "@/lib/seed";
import { ROOM_LABEL } from "@/lib/status";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const CHECKLIST = ["Befart og bekreftet omfang", "Materiell klargjort", "Arbeid utført iht. beskrivelse", "Ryddet og kontrollert etter arbeid"];

export default function ArbeidsordreDetalj() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { workOrders, claims, slots, appointments, completionReports, acceptWorkOrder, proposeSlots, startWork, completeWork, addComment, toast } = useStore();

  const wo = workOrders.find((w) => w.id === params.id);
  const claim = wo ? claims.find((c) => c.id === wo.claim_id) : undefined;

  const [proposeOpen, setProposeOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [materials, setMaterials] = useState("");
  const [hours, setHours] = useState("2");
  const [message, setMessage] = useState("");
  const [slotChoices, setSlotChoices] = useState<number[]>([2, 3, 4]);

  if (!wo || !claim) {
    return (
      <div className="grid place-items-center py-20 text-center">
        <p className="text-sm text-muted-foreground">Fant ikke arbeidsordren.</p>
        <Button variant="outline" className="mt-3" onClick={() => router.push("/leverandor/arbeidsordre")}>Tilbake til listen</Button>
      </div>
    );
  }

  const unit = getUnit(claim.unit_id);
  const project = getProject(claim.project_id);
  const resident = getUser(claim.resident_user_id);
  const technician = wo.assigned_technician_user_id ? getUser(wo.assigned_technician_user_id) : null;
  const woSlots = slots.filter((s) => s.work_order_id === wo.id);
  const appointment = appointments.find((a) => a.work_order_id === wo.id);
  const report = completionReports.find((r) => r.work_order_id === wo.id);
  const fdvDocs = DOCUMENTS.filter((d) => d.room_type === claim.room_type || d.component_id === claim.component_id).slice(0, 3);
  const supplierMessages = claim.comments.filter((c) => c.visibility === "public" || c.visibility === "supplier_internal");

  const canPropose = ["Akseptert", "Tidspunkt foreslått"].includes(wo.status);

  return (
    <div className="max-w-5xl space-y-4 animate-fade-up">
      <Link href="/leverandor/arbeidsordre" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Alle arbeidsordre
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground">{wo.wo_number}</span>
            <WorkOrderStatusPill status={wo.status} />
            {wo.priority === "høy" && <Badge className="bg-red-50 text-red-700">Høy prioritet</Badge>}
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{wo.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {wo.status === "Ny" && (
            <Button onClick={() => { acceptWorkOrder(wo.id); toast({ title: "Arbeidsordre akseptert", description: "Foreslå tidspunkter til beboer som neste steg.", variant: "success" }); }}>
              <Check aria-hidden />
              Aksepter ordre
            </Button>
          )}
          {canPropose && (
            <Button onClick={() => setProposeOpen(true)}>
              <CalendarPlus aria-hidden />
              Foreslå tidspunkter
            </Button>
          )}
          {wo.status === "Planlagt" && (
            <Button onClick={() => { startWork(wo.id); toast({ title: "Arbeid startet", description: "Saken er oppdatert til «Under utbedring».", variant: "success" }); }}>
              <Hammer aria-hidden />
              Start arbeid
            </Button>
          )}
          {wo.status === "Pågår" && (
            <Button onClick={() => setCompleteOpen(true)}>
              <CheckCircle2 aria-hidden />
              Meld ferdig
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {/* Beskrivelse */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold">Arbeidsbeskrivelse</h2>
            <p className="mt-2 text-sm leading-relaxed">{wo.description}</p>
            <div className="mt-3 rounded-xl bg-muted p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Beboers beskrivelse</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{claim.description}</p>
            </div>
          </Card>

          {/* Dokumentasjon */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold">Dokumentasjon fra beboer</h2>
            <EvidenceGallery items={claim.evidence} className="mt-3" />
          </Card>

          {/* Meldinger */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold">Meldinger</h2>
            <div className="mt-3 space-y-2.5">
              {supplierMessages.length === 0 && <p className="text-sm text-muted-foreground">Ingen meldinger ennå.</p>}
              {supplierMessages.map((m) => (
                <div key={m.id} className={cn("rounded-xl p-3.5", m.author_role === "beboer" ? "bg-muted" : "bg-evergreen-50/60")}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold">{m.author_name}</p>
                    <span className="text-[11px] text-muted-foreground">{formatDateTime(m.created_at)}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed">{m.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2 border-t border-border pt-3">
              <Input
                placeholder="Skriv melding til utbygger og beboer …"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                aria-label="Ny melding"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && message.trim()) {
                    addComment(claim.id, message.trim(), "public", "Thomas Bakke", "leverandor_admin");
                    setMessage("");
                  }
                }}
              />
              <Button
                size="icon"
                disabled={!message.trim()}
                aria-label="Send melding"
                onClick={() => {
                  addComment(claim.id, message.trim(), "public", "Thomas Bakke", "leverandor_admin");
                  setMessage("");
                }}
              >
                <Send aria-hidden />
              </Button>
            </div>
          </Card>

          {/* Ferdigrapport */}
          {report && (
            <Card className="border-evergreen-200 p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4 text-evergreen-700" aria-hidden />
                Ferdigrapport
              </h2>
              <p className="mt-2 text-sm leading-relaxed">{report.work_summary}</p>
              <dl className="mt-3 grid grid-cols-3 gap-3 border-t border-border pt-3 text-sm">
                <div><dt className="text-xs text-muted-foreground">Materiell</dt><dd className="font-medium">{report.materials}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Timer</dt><dd className="font-medium">{report.hours} t</dd></div>
                <div><dt className="text-xs text-muted-foreground">Foto</dt><dd className="font-medium">{report.before_photos} før / {report.after_photos} etter</dd></div>
              </dl>
              <p className="mt-2 text-xs text-muted-foreground">
                {report.resident_confirmation_status === "pending" ? "Venter på beboers bekreftelse." : "Bekreftet av beboer."}
              </p>
            </Card>
          )}
        </div>

        {/* Sidekolonne */}
        <div className="space-y-4">
          {/* Adresse og tilgang */}
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-evergreen-700" aria-hidden />
              Adresse og tilgang
            </h2>
            <p className="mt-2 text-sm font-medium">{project?.name} · {unit?.unit_number}</p>
            <p className="text-sm text-muted-foreground">{project?.address}, {project?.postal_code} {project?.city}</p>
            <p className="mt-2 text-sm text-muted-foreground">Rom: <span className="font-medium capitalize text-foreground">{ROOM_LABEL[claim.room_type]}</span></p>
            {appointment?.notes && <p className="mt-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-900">{appointment.notes}</p>}
            <div className="mt-3 border-t border-border pt-3">
              <p className="flex items-center gap-1.5 text-sm"><User className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />{resident?.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{resident?.phone}</p>
            </div>
          </Card>

          {/* Avtale / tidsforslag */}
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4 text-evergreen-700" aria-hidden />
              Avtale
            </h2>
            {appointment ? (
              <div className="mt-2 rounded-xl bg-evergreen-50/60 p-3.5">
                <p className="text-sm font-semibold capitalize">{formatWeekday(appointment.start_at)}</p>
                <p className="text-sm">{formatTime(appointment.start_at)}–{formatTime(appointment.end_at)}</p>
                <Badge className="mt-1.5 bg-evergreen-100 text-evergreen-800">Bekreftet av beboer</Badge>
              </div>
            ) : woSlots.length > 0 ? (
              <div className="mt-2 space-y-1.5">
                <p className="text-xs text-muted-foreground">Foreslåtte tidspunkter – venter på beboers valg:</p>
                {woSlots.map((s) => (
                  <div key={s.id} className="rounded-lg border border-border px-3 py-2 text-sm">
                    <span className="capitalize">{formatWeekday(s.start_at)}</span> · {formatTime(s.start_at)}–{formatTime(s.end_at)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Ingen avtale ennå. Foreslå tre tidspunkter til beboer.</p>
            )}
          </Card>

          {/* Tekniker */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold">Tildelt tekniker</h2>
            {technician ? (
              <p className="mt-2 text-sm">{technician.name}</p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Ikke tildelt. Tildel fra <Link href="/leverandor/team" className="font-medium text-evergreen-700 hover:underline">Team</Link>.</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">Estimert {wo.estimated_hours} timer</p>
          </Card>

          {/* Sjekkliste */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold">Sjekkliste</h2>
            <ul className="mt-2 space-y-2">
              {CHECKLIST.map((item) => {
                const isChecked = checked.includes(item);
                return (
                  <li key={item}>
                    <button
                      onClick={() => setChecked((prev) => (isChecked ? prev.filter((x) => x !== item) : [...prev, item]))}
                      className="flex w-full cursor-pointer items-start gap-2 text-left text-sm"
                    >
                      <span className={cn("mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded border", isChecked ? "border-evergreen-600 bg-evergreen-600 text-white" : "border-border bg-surface")} aria-hidden>
                        {isChecked && <Check className="h-3 w-3" />}
                      </span>
                      <span className={cn(isChecked && "text-muted-foreground line-through")}>{item}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* FDV */}
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-4 w-4 text-evergreen-700" aria-hidden />
              Relevante FDV-dokumenter
            </h2>
            <ul className="mt-2 space-y-1.5">
              {fdvDocs.length === 0 && <p className="text-sm text-muted-foreground">Ingen koblede dokumenter.</p>}
              {fdvDocs.map((d) => (
                <li key={d.id} className="rounded-lg bg-muted px-3 py-2 text-sm">{d.title}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Foreslå tidspunkter */}
      <Dialog open={proposeOpen} onOpenChange={setProposeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Foreslå tre tidspunkter</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Beboer velger ett av tidspunktene. Alle varsles automatisk når valget er gjort.</p>
          <div className="space-y-2">
            {[2, 3, 4, 5, 6].map((offset) => {
              const date = new Date(daysFromNow(offset, 8));
              const selected = slotChoices.includes(offset);
              return (
                <button
                  key={offset}
                  onClick={() =>
                    setSlotChoices((prev) =>
                      selected ? prev.filter((x) => x !== offset) : prev.length < 3 ? [...prev, offset] : prev,
                    )
                  }
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors",
                    selected ? "border-evergreen-600 bg-evergreen-50" : "border-border hover:border-evergreen-300",
                  )}
                  aria-pressed={selected}
                >
                  <span className="capitalize">{formatWeekday(date)} · 08:00–10:00</span>
                  {selected && <Check className="h-4 w-4 text-evergreen-700" aria-hidden />}
                </button>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProposeOpen(false)}>Avbryt</Button>
            <Button
              disabled={slotChoices.length !== 3}
              onClick={() => {
                proposeSlots(wo.id, slotChoices.map((o) => new Date(daysFromNow(o, 8))), "Bare Rør AS");
                setProposeOpen(false);
                toast({ title: "Tidspunkter sendt", description: "Beboer har fått varsel og velger tidspunktet som passer best.", variant: "success" });
              }}
            >
              Send til beboer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ferdigrapport */}
      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ferdigrapport</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="cr-summary">Hva ble gjort?</Label>
              <Textarea id="cr-summary" rows={3} placeholder="Beskriv utført arbeid …" value={summary} onChange={(e) => setSummary(e.target.value)} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="cr-materials">Materiell brukt</Label>
                <Input id="cr-materials" placeholder="F.eks. vannlås, pakninger" value={materials} onChange={(e) => setMaterials(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="cr-hours">Timer</Label>
                <Input id="cr-hours" type="number" min="0.5" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className="mt-1" />
              </div>
            </div>
            <div className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              Før-/etterbilder lastes opp her (demo: 1 før + 2 etter er lagt ved automatisk)
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteOpen(false)}>Avbryt</Button>
            <Button
              disabled={!summary.trim()}
              onClick={() => {
                completeWork(wo.id, { summary: summary.trim(), materials: materials.trim() || "Ingen", hours: parseFloat(hours) || 1 });
                setCompleteOpen(false);
                toast({ title: "Arbeid meldt ferdig", description: "Beboer er bedt om å bekrefte at utbedringen er i orden.", variant: "success" });
              }}
            >
              Send ferdigrapport
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
