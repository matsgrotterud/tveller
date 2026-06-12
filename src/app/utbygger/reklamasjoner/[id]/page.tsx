"use client";

import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  Eye,
  EyeOff,
  FileText,
  HardHat,
  Home,
  Lock,
  Mail,
  MapPin,
  Phone,
  Printer,
  Scale,
  Send,
  Sparkles,
  Timer,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { ClaimTimeline } from "@/components/shared/claim-timeline";
import { EmptyState } from "@/components/shared/empty-state";
import { EvidenceGallery } from "@/components/shared/evidence-gallery";
import { AIDisclaimer } from "@/components/shared/ai-insight-card";
import { AIBadge, RiskPill, SeverityPill, StatusPill, WorkOrderStatusPill } from "@/components/shared/pills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, Textarea } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { aiSuggestReply } from "@/lib/ai";
import { daysUntil, formatDate, formatDateTime, formatShortDate, formatTime, formatWeekday } from "@/lib/format";
import { DOCUMENTS, SUPPLIERS, getProject, getSupplierByOrg, getUnit, getUser } from "@/lib/seed";
import { ROOM_LABEL } from "@/lib/status";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function ClaimCommandCenterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const store = useStore();
  const {
    claims, workOrders, slots, appointments, completionReports, auditEvents,
    decideClaim, assignSupplier, addComment, escalateClaim, archiveClaim, toast,
  } = store;

  const [messageBody, setMessageBody] = useState("");
  const [messageVisibility, setMessageVisibility] = useState<"public" | "developer_internal" | "legal_internal">("public");
  const [decisionDialog, setDecisionDialog] = useState<null | "approved" | "rejected" | "more_info_needed" | "inspection_needed">(null);
  const [decisionReason, setDecisionReason] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [exportOpen, setExportOpen] = useState(false);

  const claim = claims.find((c) => c.id === id);

  if (!claim) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Fant ikke saken"
        description="Saken finnes ikke i denne porteføljen."
        action={
          <Link href="/utbygger/reklamasjoner">
            <Button variant="outline">Til saksoversikten</Button>
          </Link>
        }
      />
    );
  }

  const unit = getUnit(claim.unit_id);
  const project = getProject(claim.project_id);
  const resident = getUser(claim.resident_user_id);
  const supplier = getSupplierByOrg(claim.assigned_supplier_org_id);
  const workOrder = workOrders.find((w) => w.claim_id === claim.id);
  const proposedSlots = workOrder ? slots.filter((s) => s.work_order_id === workOrder.id && s.status === "proposed") : [];
  const appointment = appointments.find((a) => a.claim_id === claim.id && a.status === "bekreftet");
  const report = completionReports.find((r) => r.claim_id === claim.id);
  const claimAudit = auditEvents.filter((e) => e.entity_id === claim.id || e.entity_id === claim.case_number).slice(0, 6);
  const linkedDocs = DOCUMENTS.filter((d) => d.room_type === claim.room_type || (claim.component_id && d.component_id === claim.component_id)).slice(0, 3);
  const similarClaims = claim.similar_case_ids.map((sid) => claims.find((c) => c.id === sid)).filter(Boolean);
  const relevantSuppliers = SUPPLIERS.filter((s) => s.trades.includes(claim.trade));
  const recommendedSupplier = relevantSuppliers.sort((a, b) => b.score - a.score)[0];

  /* Reklamasjonsradar */
  const claimPeriodEnd = unit?.claim_period_end_date;
  const claimPeriodStart = unit?.claim_period_start_date;
  const periodDaysLeft = claimPeriodEnd ? daysUntil(claimPeriodEnd) : null;
  const periodTotal = claimPeriodStart && claimPeriodEnd ? Math.round((new Date(claimPeriodEnd).getTime() - new Date(claimPeriodStart).getTime()) / 86400000) : null;
  const internalDays = claim.due_at ? daysUntil(claim.due_at) : null;

  const canDecide = ["Sendt inn", "Mottatt", "Under vurdering", "Trenger mer info", "Befaring nødvendig", "Gjenåpnet", "Eskalert"].includes(claim.status);
  const canAssign = claim.status === "Godkjent" || (claim.status === "Gjenåpnet" && !workOrder);

  function submitDecision() {
    if (!decisionDialog || !claim) return;
    decideClaim(claim.id, decisionDialog, decisionReason.trim(), "Kari Nordheim");
    const labels = { approved: "Reklamasjonen er godkjent", rejected: "Reklamasjonen er avvist", more_info_needed: "Beboer er bedt om mer informasjon", inspection_needed: "Befaring er bestilt" };
    toast({ title: labels[decisionDialog], description: "Beboer har fått varsel.", variant: "success" });
    setDecisionDialog(null);
    setDecisionReason("");
  }

  return (
    <div className="space-y-4 animate-fade-up">
      <Link href="/utbygger/reklamasjoner" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Saksoversikt
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-muted-foreground">{claim.case_number}</p>
          <h1 className="mt-0.5 text-2xl font-semibold tracking-tight">{claim.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusPill status={claim.status} />
            <SeverityPill severity={claim.severity} />
            <Badge className="bg-muted text-muted-foreground">{claim.trade}</Badge>
            {claim.reopened && <Badge className="bg-red-50 text-red-700">Gjenåpnet</Badge>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {canDecide && (
            <>
              <Button size="sm" onClick={() => setDecisionDialog("approved")}>
                <CheckCircle2 aria-hidden />
                Godkjenn
              </Button>
              <Button size="sm" variant="outline" onClick={() => setDecisionDialog("rejected")}>
                <XCircle aria-hidden />
                Avvis
              </Button>
              <Button size="sm" variant="outline" onClick={() => setDecisionDialog("more_info_needed")}>Be om mer info</Button>
              <Button size="sm" variant="outline" onClick={() => setDecisionDialog("inspection_needed")}>Send til befaring</Button>
            </>
          )}
          {canAssign && (
            <Button size="sm" variant="secondary" onClick={() => setAssignDialogOpen(true)}>
              <HardHat aria-hidden />
              Tildel underleverandør
            </Button>
          )}
          {claim.status !== "Eskalert" && claim.status !== "Arkivert" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                escalateClaim(claim.id, "Kari Nordheim");
                toast({ title: "Sak eskalert", description: "Saken er flagget med høy juridisk risiko.", variant: "info" });
              }}
            >
              Eskaler
            </Button>
          )}
          {(claim.status === "Bekreftet av beboer" || claim.status === "Ferdigstilt") && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                archiveClaim(claim.id, "Kari Nordheim");
                toast({ title: "Sak arkivert", description: "Saken er arkivert med komplett historikk.", variant: "success" });
              }}
            >
              <Archive aria-hidden />
              Arkiver
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => setExportOpen(true)}>
            <Download aria-hidden />
            Eksporter dokumentasjon
          </Button>
        </div>
      </div>

      {/* 3-kolonners kommandosenter */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* VENSTRE: dokumentasjon og kontekst */}
        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="text-sm font-semibold">Beboers beskrivelse</h2>
            <p className="mt-2 text-sm leading-relaxed">{claim.description}</p>
            <p className="mt-2 text-xs text-muted-foreground">Mottatt {claim.received_at ? formatDateTime(claim.received_at) : "–"} · Kilde: {claim.source === "resident" ? "Beboer" : claim.source === "handover" ? "Overtakelse" : claim.source}</p>
          </Card>

          <Card className="p-4">
            <h2 className="text-sm font-semibold">Dokumentasjon ({claim.evidence.length})</h2>
            <div className="mt-3">
              <EvidenceGallery items={claim.evidence} />
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <User className="h-4 w-4 text-evergreen-700" aria-hidden />
              Beboer
            </h2>
            <p className="mt-2 text-sm font-medium">{resident?.name}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" aria-hidden />
              {resident?.email}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" aria-hidden />
              {resident?.phone}
            </p>
          </Card>

          <Card className="p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Home className="h-4 w-4 text-evergreen-700" aria-hidden />
              Boligprofil
            </h2>
            <dl className="mt-2 space-y-1.5 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Prosjekt</dt><dd className="font-medium">{project?.name}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Enhet</dt><dd className="font-medium">{unit?.unit_number}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Rom</dt><dd className="font-medium">{ROOM_LABEL[claim.room_type]}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Areal</dt><dd className="font-medium">{unit?.size_m2} m²</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Overtatt</dt><dd className="font-medium">{unit?.takeover_date ? formatShortDate(unit.takeover_date) : "–"}</dd></div>
            </dl>
          </Card>

          {linkedDocs.length > 0 && (
            <Card className="p-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4 text-evergreen-700" aria-hidden />
                FDV for rom/komponent
              </h2>
              <div className="mt-2 space-y-1.5">
                {linkedDocs.map((d) => (
                  <Link key={d.id} href="/utbygger/dokumenter" className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-sm hover:bg-muted/50">
                    <FileText className="h-3.5 w-3.5 shrink-0 text-fjord-700" aria-hidden />
                    <span className="min-w-0 flex-1 truncate">{d.title}</span>
                    <span className="text-xs text-muted-foreground">v{d.version}</span>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* MIDTEN: tidslinje, meldinger, beslutninger */}
        <div className="space-y-4">
          {/* Meldinger og notater */}
          <Card className="p-4">
            <h2 className="text-sm font-semibold">Meldinger og notater</h2>
            <div className="mt-3 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
              {claim.comments.length === 0 && <p className="text-sm text-muted-foreground">Ingen meldinger ennå.</p>}
              {claim.comments.map((c) => (
                <div
                  key={c.id}
                  className={cn(
                    "rounded-xl border p-3",
                    c.visibility === "public" && "border-border bg-surface",
                    c.visibility === "developer_internal" && "border-amber-200 bg-amber-50/60",
                    c.visibility === "legal_internal" && "border-violet-200 bg-violet-50/60",
                    c.visibility === "supplier_internal" && "border-fjord-200 bg-fjord-50/60",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold">{c.author_name}</p>
                    {c.visibility === "public" && (
                      <Badge className="bg-evergreen-50 text-evergreen-700">
                        <Eye className="h-3 w-3" aria-hidden />
                        Synlig for beboer
                      </Badge>
                    )}
                    {c.visibility === "developer_internal" && (
                      <Badge className="bg-amber-100 text-amber-800">
                        <EyeOff className="h-3 w-3" aria-hidden />
                        Kun synlig internt
                      </Badge>
                    )}
                    {c.visibility === "legal_internal" && (
                      <Badge className="bg-violet-100 text-violet-800">
                        <Scale className="h-3 w-3" aria-hidden />
                        Kun juridisk
                      </Badge>
                    )}
                    {c.visibility === "supplier_internal" && (
                      <Badge className="bg-fjord-100 text-fjord-800">
                        <HardHat className="h-3 w-3" aria-hidden />
                        Leverandør
                      </Badge>
                    )}
                    <span className="ml-auto text-[11px] text-muted-foreground">{formatDateTime(c.created_at)}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>

            {/* Skriv melding */}
            <form
              className="mt-3 space-y-2 border-t border-border pt-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!messageBody.trim()) return;
                addComment(claim.id, messageBody.trim(), messageVisibility, messageVisibility === "legal_internal" ? "Ingrid Wold" : "Kari Nordheim", messageVisibility === "legal_internal" ? "juridisk" : "utbygger_admin");
                toast({
                  title: messageVisibility === "public" ? "Melding sendt til beboer" : "Internt notat lagret",
                  description: messageVisibility === "public" ? "Beboer har fått varsel." : "Dette notatet er kun synlig internt.",
                  variant: "success",
                });
                setMessageBody("");
              }}
            >
              <div className="flex gap-2">
                <Select value={messageVisibility} onChange={(e) => setMessageVisibility(e.target.value as typeof messageVisibility)} className="w-56" aria-label="Synlighet">
                  <option value="public">Synlig for beboer</option>
                  <option value="developer_internal">Internt notat</option>
                  <option value="legal_internal">Juridisk notat</option>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={() => setMessageBody(aiSuggestReply(claim.title, claim.status))}
                >
                  <Sparkles className="text-violet-600" aria-hidden />
                  Foreslå svar
                </Button>
              </div>
              <Textarea
                rows={3}
                placeholder={messageVisibility === "public" ? "Skriv melding til beboer …" : "Skriv internt notat – aldri synlig for beboer …"}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                aria-label="Meldingstekst"
              />
              {messageBody.startsWith("Hei!") && (
                <p className="text-xs text-muted-foreground">AI-forslaget kan redigeres før du sender.</p>
              )}
              <Button type="submit" size="sm" disabled={!messageBody.trim()}>
                <Send aria-hidden />
                {messageVisibility === "public" ? "Send til beboer" : "Lagre notat"}
              </Button>
            </form>
          </Card>

          {/* Beslutning */}
          {claim.decision && (
            <Card className={cn("p-4", claim.decision === "rejected" ? "border-red-200" : "border-evergreen-200")}>
              <h2 className="text-sm font-semibold">Beslutning</h2>
              <div className="mt-2 flex items-center gap-2">
                {claim.decision === "approved" && <Badge className="bg-evergreen-50 text-evergreen-700">Godkjent</Badge>}
                {claim.decision === "rejected" && <Badge className="bg-red-50 text-red-700">Avvist</Badge>}
                {claim.decision === "more_info_needed" && <Badge className="bg-amber-50 text-amber-800">Mer info nødvendig</Badge>}
                {claim.decision === "inspection_needed" && <Badge className="bg-violet-50 text-violet-700">Befaring</Badge>}
              </div>
              {claim.decision_reason && <p className="mt-2 text-sm text-muted-foreground">{claim.decision_reason}</p>}
            </Card>
          )}

          {/* Tidslinje */}
          <Card className="p-4">
            <h2 className="text-sm font-semibold">Tidslinje</h2>
            <div className="mt-4">
              <ClaimTimeline events={claim.timeline} />
            </div>
          </Card>

          {/* Audit */}
          <Card className="p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Lock className="h-4 w-4 text-muted-foreground" aria-hidden />
              Auditlogg (uforanderlig)
            </h2>
            <div className="mt-2 space-y-1.5">
              {claimAudit.length === 0 && <p className="text-sm text-muted-foreground">Ingen loggførte hendelser for denne saken ennå.</p>}
              {claimAudit.map((e) => (
                <div key={e.id} className="rounded-lg bg-muted/60 px-3 py-2">
                  <p className="font-mono text-xs text-evergreen-800">{e.action}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{e.actor} · {formatDateTime(e.created_at)} · {e.metadata}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* HØYRE: AI / juridisk / handling */}
        <div className="space-y-4">
          {/* Reklamasjonsradar */}
          <Card className="p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Scale className="h-4 w-4 text-evergreen-700" aria-hidden />
              Reklamasjonsradar
            </h2>
            {periodDaysLeft !== null && periodTotal !== null && (
              <div className="mt-3">
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-semibold text-evergreen-700">{(periodDaysLeft / 365).toFixed(1)} år</p>
                  <p className="text-xs text-muted-foreground">igjen av {project?.claim_period_years} års periode</p>
                </div>
                <Progress value={((periodTotal - periodDaysLeft) / periodTotal) * 100} className="mt-2" />
                <p className="mt-1.5 text-xs text-muted-foreground">Utløper {claimPeriodEnd ? formatDate(claimPeriodEnd) : "–"} (konfigurerbart per prosjekt)</p>
              </div>
            )}
            <div className="mt-3 space-y-2 border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-sm">
                  <Timer className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                  Intern svarfrist
                </p>
                <RiskPill
                  level={internalDays !== null && internalDays <= 2 ? "høy" : internalDays !== null && internalDays <= 5 ? "middels" : "lav"}
                  label={internalDays !== null ? (internalDays < 0 ? "Forfalt" : `${internalDays} dager`) : "–"}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Juridisk risiko</p>
                <RiskPill level={claim.legal_risk_level} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Sakskomplett</p>
                <span className="text-sm font-semibold">{Math.round(claim.completeness_score)} %</span>
              </div>
              <Progress value={claim.completeness_score} barClassName={claim.completeness_score < 70 ? "bg-amber-500" : undefined} />
              {claim.completeness_score < 80 && (
                <p className="text-xs text-amber-800">Mangler: tidspunkt for når feilen oppstod og oversiktsbilde.</p>
              )}
            </div>
            <AIDisclaimer className="mt-3" />
          </Card>

          {/* AI-vurdering */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">AI-vurdering</h2>
              <AIBadge />
            </div>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Kategori</dt><dd className="font-medium">{claim.category}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Fag</dt><dd className="font-medium">{claim.trade}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-muted-foreground">Alvorlighet</dt><dd><SeverityPill severity={claim.severity} /></dd></div>
            </dl>
            <p className="mt-3 rounded-lg bg-violet-50/60 p-2.5 text-xs text-violet-900">
              Oppsummering: {claim.description.length > 130 ? `${claim.description.slice(0, 130)}…` : claim.description} Anbefalt fag: {claim.trade}.
            </p>
          </Card>

          {/* Lignende saker */}
          {similarClaims.length > 0 && (
            <Card className="p-4">
              <h2 className="text-sm font-semibold">Lignende saker ({similarClaims.length})</h2>
              <div className="mt-2 space-y-1.5">
                {similarClaims.map((s) => s && (
                  <Link key={s.id} href={`/utbygger/reklamasjoner/${s.id}`} className="flex items-center justify-between gap-2 rounded-lg border border-border p-2.5 text-sm hover:bg-muted/50">
                    <span className="min-w-0 truncate">{s.title}</span>
                    <StatusPill status={s.status} className="shrink-0" />
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Leverandør / arbeidsordre */}
          <Card className="p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <HardHat className="h-4 w-4 text-evergreen-700" aria-hidden />
              Underleverandør
            </h2>
            {supplier ? (
              <div className="mt-2">
                <p className="text-sm font-medium">{supplier.name}</p>
                <p className="text-xs text-muted-foreground">{supplier.contact_name} · {supplier.contact_phone}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Score: <span className="font-semibold text-evergreen-700">{supplier.score}</span></span>
                  <span>Responstid: {supplier.avg_response_time_hours} t</span>
                </div>
              </div>
            ) : canAssign ? (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Ingen leverandør tildelt ennå.</p>
                {recommendedSupplier && (
                  <div className="mt-2 rounded-xl border border-violet-200 bg-violet-50/50 p-3">
                    <div className="flex items-center gap-2">
                      <AIBadge>AI-anbefaling</AIBadge>
                    </div>
                    <p className="mt-1.5 text-sm font-medium">{recommendedSupplier.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Best score ({recommendedSupplier.score}) for {claim.trade.toLowerCase()} · {recommendedSupplier.avg_response_time_hours} t responstid
                    </p>
                  </div>
                )}
                <Button className="mt-3 w-full" size="sm" onClick={() => setAssignDialogOpen(true)}>
                  Tildel underleverandør
                </Button>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Tildeles etter at saken er godkjent.</p>
            )}

            {workOrder && (
              <div className="mt-3 rounded-xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs text-muted-foreground">{workOrder.wo_number}</p>
                  <WorkOrderStatusPill status={workOrder.status} />
                </div>
                <p className="mt-1 text-sm font-medium">{workOrder.title}</p>
              </div>
            )}
          </Card>

          {/* Avtale */}
          {(proposedSlots.length > 0 || appointment) && (
            <Card className="p-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <CalendarDays className="h-4 w-4 text-evergreen-700" aria-hidden />
                Avtale
              </h2>
              {appointment ? (
                <div className="mt-2">
                  <p className="text-sm font-medium capitalize">{formatWeekday(appointment.start_at)}</p>
                  <p className="text-xs text-muted-foreground">kl. {formatTime(appointment.start_at)}–{formatTime(appointment.end_at)}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" aria-hidden />
                    {appointment.location}
                  </p>
                </div>
              ) : (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">{proposedSlots.length} tidspunkter foreslått – venter på at beboer velger.</p>
                  <ul className="mt-2 space-y-1">
                    {proposedSlots.map((s) => (
                      <li key={s.id} className="rounded-lg bg-muted px-2.5 py-1.5 text-xs capitalize">
                        {formatWeekday(s.start_at)} kl. {formatTime(s.start_at)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}

          {/* Ferdigrapport */}
          {report && (
            <Card className="p-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <ClipboardList className="h-4 w-4 text-evergreen-700" aria-hidden />
                Ferdigrapport
              </h2>
              <p className="mt-2 text-sm">{report.work_summary}</p>
              <dl className="mt-2 space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between"><dt>Utført av</dt><dd>{report.completed_by}</dd></div>
                <div className="flex justify-between"><dt>Timer</dt><dd>{report.hours} t</dd></div>
                <div className="flex justify-between"><dt>Materialer</dt><dd>{report.materials}</dd></div>
                <div className="flex justify-between"><dt>Bilder</dt><dd>{report.before_photos} før / {report.after_photos} etter</dd></div>
                <div className="flex justify-between">
                  <dt>Beboerbekreftelse</dt>
                  <dd className={report.resident_confirmation_status === "confirmed" ? "text-evergreen-700 font-medium" : report.resident_confirmation_status === "rejected" ? "text-red-700 font-medium" : ""}>
                    {report.resident_confirmation_status === "confirmed" ? "Bekreftet" : report.resident_confirmation_status === "rejected" ? "Avvist – gjenåpnet" : "Venter"}
                  </dd>
                </div>
              </dl>
            </Card>
          )}
        </div>
      </div>

      {/* Beslutningsdialog */}
      <Dialog open={decisionDialog !== null} onOpenChange={(o) => !o && setDecisionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {decisionDialog === "approved" && "Godkjenn reklamasjon"}
              {decisionDialog === "rejected" && "Avvis reklamasjon"}
              {decisionDialog === "more_info_needed" && "Be om mer informasjon"}
              {decisionDialog === "inspection_needed" && "Send til befaring"}
            </DialogTitle>
            <DialogDescription>
              Begrunnelsen lagres i beslutningsloggen og deles med beboer. Dette er beslutningsstøtte og ikke juridisk
              rådgivning.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            rows={4}
            placeholder={
              decisionDialog === "rejected"
                ? "F.eks. «Justering av hengsler er ordinært vedlikehold …»"
                : decisionDialog === "approved"
                  ? "F.eks. «Mangel etter bustadoppføringslova § 25. Utbedres av fagleverandør.»"
                  : "Hva trenger du fra beboer / hvorfor befaring?"
            }
            value={decisionReason}
            onChange={(e) => setDecisionReason(e.target.value)}
            aria-label="Begrunnelse"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDecisionDialog(null)}>Avbryt</Button>
            <Button variant={decisionDialog === "rejected" ? "destructive" : "default"} disabled={decisionReason.trim().length < 10} onClick={submitDecision}>
              Bekreft beslutning
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tildel leverandør-dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tildel underleverandør</DialogTitle>
            <DialogDescription>Leverandøren får en arbeidsordre og foreslår tidspunkter til beboer.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {relevantSuppliers.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSupplier(s.organization_id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors cursor-pointer",
                  selectedSupplier === s.organization_id ? "border-evergreen-500 bg-evergreen-50" : "border-border hover:bg-muted/50",
                )}
                aria-pressed={selectedSupplier === s.organization_id}
              >
                <span>
                  <span className="block text-sm font-medium">{s.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {s.cases_open} åpne · {s.avg_response_time_hours} t responstid · {s.reopened_rate} % gjenåpning
                  </span>
                </span>
                <span className={cn("text-sm font-semibold", s.score >= 85 ? "text-evergreen-700" : "text-amber-700")}>{s.score}</span>
              </button>
            ))}
            {relevantSuppliers.length === 0 && <p className="text-sm text-muted-foreground">Ingen leverandører med faget {claim.trade} i porteføljen.</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Avbryt</Button>
            <Button
              disabled={!selectedSupplier}
              onClick={() => {
                assignSupplier(claim.id, selectedSupplier, "Kari Nordheim");
                const s = getSupplierByOrg(selectedSupplier);
                toast({ title: "Leverandør tildelt", description: `${s?.name} har fått arbeidsordren og foreslår tidspunkter.`, variant: "success" });
                setAssignDialogOpen(false);
                setSelectedSupplier("");
              }}
            >
              Tildel og send arbeidsordre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Eksportdialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eksporter dokumentasjonspakke</DialogTitle>
            <DialogDescription>
              Komplett arkivpakke for {claim.case_number} – egnet for jurist, forsikring eller arkiv.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-1.5 text-sm">
            {[
              "Saksdetaljer og beslutningshistorikk",
              `Dokumentasjon (${claim.evidence.length} filer med markeringer)`,
              `Meldinger (${claim.comments.filter((c) => c.visibility === "public").length} offentlige) og interne notater`,
              workOrder ? `Arbeidsordre ${workOrder.wo_number} med avtalehistorikk` : "Ingen arbeidsordre",
              report ? "Ferdigrapport med før/etter-bilder og signaturer" : "Ferdigrapport (ikke levert ennå)",
              "Komplett auditlogg og FDV-referanser",
            ].map((i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-evergreen-600" aria-hidden />
                {i}
              </li>
            ))}
          </ul>
          <DialogFooter className="flex-wrap">
            <Button variant="outline" onClick={() => { toast({ title: "PDF eksportert", description: "Sammendrag generert (demo).", variant: "success" }); setExportOpen(false); }}>
              <FileText aria-hidden />
              Eksporter PDF
            </Button>
            <Button variant="outline" onClick={() => { toast({ title: "ZIP lastes ned", description: "Komplett arkivpakke (demo).", variant: "success" }); setExportOpen(false); }}>
              <Download aria-hidden />
              Last ned ZIP
            </Button>
            <Button variant="outline" onClick={() => { toast({ title: "Sendt til juridisk", description: "Ingrid Wold har fått pakken.", variant: "success" }); setExportOpen(false); }}>
              <Scale aria-hidden />
              Send til juridisk
            </Button>
            <Button variant="outline" onClick={() => { toast({ title: "Skriver ut", variant: "info" }); setExportOpen(false); }}>
              <Printer aria-hidden />
              Skriv ut
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
