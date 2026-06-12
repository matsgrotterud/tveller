"use client";

/**
 * Klient-side datalager for TvellerOS i demo-modus.
 *
 * Fungerer som repository-lag: alle muteringer går gjennom navngitte
 * handlinger som validerer, oppdaterer state, skriver audit-logg og
 * utløser varsler – samme kontrakt som server actions vil ha når
 * Supabase/Postgres kobles til. Bytt implementasjonen, behold API-et.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type {
  AppNotification,
  Appointment,
  AppointmentSlot,
  AuditEvent,
  Claim,
  ClaimComment,
  ClaimStatus,
  CompletionReport,
  EvidenceItem,
  FeatureFlagState,
  GDPRRequest,
  MarketplaceOrder,
  MessageVisibility,
  PortalKey,
  RoleKey,
  RoomType,
  Severity,
  SupportAccessGrant,
  TilvalgOrder,
  TimelineEvent,
  Trade,
  WorkOrder,
} from "./types";
import {
  APPOINTMENTS,
  APPOINTMENT_SLOTS,
  AUDIT_EVENTS,
  CLAIMS,
  COMPLETION_REPORTS,
  FEATURE_FLAGS,
  GDPR_REQUESTS,
  MARKETPLACE_ORDERS,
  NOTIFICATIONS,
  SUPPORT_ACCESS_LOG,
  TILVALG_ORDERS,
  WORK_ORDERS,
  daysFromNow,
  getSupplierByOrg,
  getUnit,
  getUser,
} from "./seed";

interface DynamicState {
  claims: Claim[];
  workOrders: WorkOrder[];
  slots: AppointmentSlot[];
  appointments: Appointment[];
  completionReports: CompletionReport[];
  notifications: AppNotification[];
  auditEvents: AuditEvent[];
  tilvalgOrders: TilvalgOrder[];
  marketplaceOrders: MarketplaceOrder[];
  gdprRequests: GDPRRequest[];
  featureFlags: FeatureFlagState[];
  supportAccessLog: SupportAccessGrant[];
  caseCounter: number;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
}

interface StoreContextValue extends DynamicState {
  role: RoleKey;
  portal: PortalKey;
  setRole: (role: RoleKey) => void;
  toasts: Toast[];
  toast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  resetDemo: () => void;

  /* claims */
  createClaim: (input: {
    room: RoomType;
    title: string;
    description: string;
    category: string;
    trade: Trade;
    severity: Severity;
    evidenceLabels: string[];
    annotationNote?: string;
  }) => Claim;
  setClaimStatus: (claimId: string, status: ClaimStatus, actor: string, label?: string) => void;
  decideClaim: (claimId: string, decision: "approved" | "rejected" | "more_info_needed" | "inspection_needed", reason: string, actor: string) => void;
  assignSupplier: (claimId: string, supplierOrgId: string, actor: string) => void;
  addComment: (claimId: string, body: string, visibility: MessageVisibility, authorName: string, authorRole: RoleKey) => void;
  addEvidence: (claimId: string, label: string, caption: string, uploadedBy: string) => void;
  escalateClaim: (claimId: string, actor: string) => void;
  archiveClaim: (claimId: string, actor: string) => void;

  /* work orders / appointments */
  acceptWorkOrder: (workOrderId: string) => void;
  proposeSlots: (workOrderId: string, starts: Date[], actor: string) => void;
  selectSlot: (slotId: string) => void;
  startWork: (workOrderId: string) => void;
  completeWork: (workOrderId: string, report: { summary: string; materials: string; hours: number }) => void;
  confirmCompletion: (claimId: string) => void;
  reopenClaim: (claimId: string, reason: string) => void;

  /* andre moduler */
  submitTilvalgOrder: (order: Omit<TilvalgOrder, "id" | "tenant_id" | "status" | "submitted_at">) => void;
  setTilvalgOrderStatus: (orderId: string, status: TilvalgOrder["status"]) => void;
  requestMarketplaceService: (serviceId: string, serviceTitle: string, preferredTime: string, note: string) => void;
  createGdprRequest: (type: GDPRRequest["type"]) => void;
  completeGdprRequest: (id: string) => void;
  toggleFeatureFlag: (key: string) => void;
  grantSupportAccess: (tenantName: string, reason: string, mode: "view_only" | "emergency") => void;
  markNotificationsRead: (portal: PortalKey) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const STORAGE_KEY = "tvelleros-demo-v1";

function initialState(): DynamicState {
  return {
    claims: CLAIMS,
    workOrders: WORK_ORDERS,
    slots: APPOINTMENT_SLOTS,
    appointments: APPOINTMENTS,
    completionReports: COMPLETION_REPORTS,
    notifications: NOTIFICATIONS,
    auditEvents: AUDIT_EVENTS,
    tilvalgOrders: TILVALG_ORDERS,
    marketplaceOrders: MARKETPLACE_ORDERS,
    gdprRequests: GDPR_REQUESTS,
    featureFlags: FEATURE_FLAGS,
    supportAccessLog: SUPPORT_ACCESS_LOG,
    caseCounter: 131,
  };
}

let idCounter = 0;
function uid(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

function rolePortal(role: RoleKey): PortalKey {
  if (role === "superadmin" || role === "auditor") return "admin";
  if (role === "beboer" || role === "sameiestyre") return "beboer";
  if (role === "leverandor_admin" || role === "tekniker" || role === "marketplace_partner") return "leverandor";
  return "utbygger";
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DynamicState>(initialState);
  const [role, setRoleState] = useState<RoleKey>("beboer");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        /* Engangs-hydrering fra localStorage etter SSR – bevisst setState her. */
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (parsed.state) setState(parsed.state);
        if (parsed.role) setRoleState(parsed.role);
      }
    } catch {
      /* korrupt lagring – start på nytt */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, role }));
    } catch {
      /* lagring full – ignorer */
    }
  }, [state, role, hydrated]);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = uid("toast");
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const setRole = useCallback((r: RoleKey) => setRoleState(r), []);

  const resetDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState());
    toast({ title: "Demodata tilbakestilt", variant: "info" });
  }, [toast]);

  /* ----- interne hjelpere ----- */

  const audit = useCallback((actor: string, action: string, entityType: string, entityId: string, metadata: string, sensitive = false) => {
    const event: AuditEvent = {
      id: uid("ae"),
      tenant_id: "t1",
      actor,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
      sensitive,
      created_at: new Date().toISOString(),
    };
    setState((s) => ({ ...s, auditEvents: [event, ...s.auditEvents] }));
  }, []);

  const notify = useCallback((portal: PortalKey, type: string, title: string, body: string, entityType: string | null = null, entityId: string | null = null) => {
    const n: AppNotification = {
      id: uid("n"),
      tenant_id: "t1",
      user_role: portal,
      type,
      channel: "in_app",
      title,
      body,
      entity_type: entityType,
      entity_id: entityId,
      read: false,
      created_at: new Date().toISOString(),
    };
    setState((s) => ({ ...s, notifications: [n, ...s.notifications] }));
  }, []);

  const updateClaim = useCallback((claimId: string, fn: (c: Claim) => Claim) => {
    setState((s) => ({
      ...s,
      claims: s.claims.map((c) => (c.id === claimId ? { ...fn(c), updated_at: new Date().toISOString() } : c)),
    }));
  }, []);

  const pushTimeline = useCallback((claimId: string, type: string, label: string, actor: string) => {
    const event: TimelineEvent = { id: uid("tl"), claim_id: claimId, type, label, actor, created_at: new Date().toISOString() };
    updateClaim(claimId, (c) => ({ ...c, timeline: [...c.timeline, event] }));
  }, [updateClaim]);

  /* ----- claims ----- */

  const createClaim = useCallback((input: Parameters<StoreContextValue["createClaim"]>[0]): Claim => {
    const caseNum = `RK-2024-${String(state.caseCounter).padStart(4, "0")}`;
    const nowIso = new Date().toISOString();
    const claimId = uid("c");
    const evidence: EvidenceItem[] = input.evidenceLabels.map((label, i) => ({
      id: uid("ev"),
      claim_id: claimId,
      type: "photo",
      label,
      caption: i === 0 && input.annotationNote ? input.annotationNote : label,
      annotation: i === 0 && input.annotationNote ? [{ x: 45, y: 50, note: input.annotationNote }] : undefined,
      uploaded_by: "Lise Frankum",
      created_at: nowIso,
    }));
    const claim: Claim = {
      id: claimId,
      case_number: caseNum,
      tenant_id: "t1",
      project_id: "p-middelthunet",
      building_id: "b-mid-c",
      unit_id: "unit-c103",
      room_type: input.room,
      component_id: null,
      resident_user_id: "u-lise",
      title: input.title,
      description: input.description,
      category: input.category,
      trade: input.trade,
      severity: input.severity,
      status: "Sendt inn",
      source: "resident",
      legal_risk_level: "lav",
      deadline_risk_level: "lav",
      received_at: nowIso,
      due_at: daysFromNow(14),
      assigned_developer_user_id: null,
      assigned_supplier_org_id: null,
      decision: null,
      decision_reason: null,
      reopened: false,
      similar_case_ids: [],
      completeness_score: Math.min(95, 40 + input.description.length / 4 + input.evidenceLabels.length * 15),
      evidence,
      comments: [],
      timeline: [
        { id: uid("tl"), claim_id: claimId, type: "claim.created", label: "Reklamasjon opprettet av beboer", actor: "Lise Frankum", created_at: nowIso },
        { id: uid("tl"), claim_id: claimId, type: "claim.submitted", label: "Reklamasjon sendt inn", actor: "Lise Frankum", created_at: nowIso },
      ],
      created_at: nowIso,
      updated_at: nowIso,
    };
    setState((s) => ({ ...s, claims: [claim, ...s.claims], caseCounter: s.caseCounter + 1 }));
    audit("Lise Frankum", "claim.submitted", "claim", caseNum, `Rom: ${input.room}, fag: ${input.trade}`);
    notify("utbygger", "claim.submitted", "Ny reklamasjon mottatt", `Ny reklamasjon mottatt fra Lise Frankum: «${input.title}» (C103, Middelthunet).`, "claim", claimId);
    return claim;
  }, [state.caseCounter, audit, notify]);

  const setClaimStatus = useCallback((claimId: string, status: ClaimStatus, actor: string, label?: string) => {
    updateClaim(claimId, (c) => ({ ...c, status }));
    pushTimeline(claimId, "claim.status_changed", label ?? `Status endret til ${status}`, actor);
    audit(actor, "claim.status_changed", "claim", claimId, `Ny status: ${status}`);
  }, [updateClaim, pushTimeline, audit]);

  const decideClaim = useCallback((claimId: string, decision: "approved" | "rejected" | "more_info_needed" | "inspection_needed", reason: string, actor: string) => {
    const statusMap: Record<typeof decision, ClaimStatus> = {
      approved: "Godkjent",
      rejected: "Avvist",
      more_info_needed: "Trenger mer info",
      inspection_needed: "Befaring nødvendig",
    };
    const labelMap: Record<typeof decision, string> = {
      approved: "Reklamasjon godkjent",
      rejected: "Reklamasjon avvist",
      more_info_needed: "Mer informasjon etterspurt",
      inspection_needed: "Befaring bestilt",
    };
    updateClaim(claimId, (c) => ({ ...c, decision, decision_reason: reason, status: statusMap[decision] }));
    pushTimeline(claimId, "claim.decision_made", labelMap[decision], actor);
    audit(actor, "claim.decision_made", "claim", claimId, `Beslutning: ${statusMap[decision]}. ${reason}`);
    const claim = state.claims.find((c) => c.id === claimId);
    const bodyMap: Record<typeof decision, string> = {
      approved: `Reklamasjonen «${claim?.title}» er godkjent. En håndverker blir tildelt for utbedring.`,
      rejected: `Reklamasjonen «${claim?.title}» ble ikke godkjent. Se begrunnelsen i saken.`,
      more_info_needed: `Utbygger trenger mer informasjon om «${claim?.title}». Se meldingen i saken.`,
      inspection_needed: `Utbygger ønsker befaring for «${claim?.title}». Du blir kontaktet for tidspunkt.`,
    };
    notify("beboer", "claim.decision", labelMap[decision], bodyMap[decision], "claim", claimId);
  }, [updateClaim, pushTimeline, audit, notify, state.claims]);

  const assignSupplier = useCallback((claimId: string, supplierOrgId: string, actor: string) => {
    const supplier = getSupplierByOrg(supplierOrgId);
    const claim = state.claims.find((c) => c.id === claimId);
    if (!claim || !supplier) return;
    updateClaim(claimId, (c) => ({ ...c, assigned_supplier_org_id: supplierOrgId, status: "Sendt til underleverandør" }));
    pushTimeline(claimId, "claim.assigned_supplier", `Tildelt ${supplier.name}`, actor);
    const unit = getUnit(claim.unit_id);
    const wo: WorkOrder = {
      id: uid("wo"),
      wo_number: `AO-2024-${String(90 + state.workOrders.length)}`,
      tenant_id: "t1",
      claim_id: claimId,
      supplier_org_id: supplierOrgId,
      assigned_technician_user_id: null,
      title: `${claim.title} – ${unit?.unit_number ?? ""}`,
      description: claim.description,
      status: "Ny",
      priority: claim.severity === "kritisk" || claim.severity === "høy" ? "høy" : "normal",
      scheduled_start: null,
      scheduled_end: null,
      estimated_hours: 2,
      created_at: new Date().toISOString(),
    };
    setState((s) => ({ ...s, workOrders: [wo, ...s.workOrders] }));
    audit(actor, "claim.assigned_supplier", "claim", claim.case_number, `Leverandør: ${supplier.name}`);
    audit(actor, "work_order.created", "work_order", wo.wo_number, `Sak: ${claim.case_number}`);
    notify("leverandor", "work_order.created", "Ny arbeidsordre", `Ny arbeidsordre ${wo.wo_number}: «${wo.title}».`, "work_order", wo.id);
    notify("beboer", "claim.assigned", "Håndverker tildelt", `${supplier.name} har fått saken «${claim.title}» og foreslår snart tidspunkter.`, "claim", claimId);
  }, [state.claims, state.workOrders.length, updateClaim, pushTimeline, audit, notify]);

  const addComment = useCallback((claimId: string, body: string, visibility: MessageVisibility, authorName: string, authorRole: RoleKey) => {
    const comment: ClaimComment = {
      id: uid("cm"),
      claim_id: claimId,
      author_user_id: "demo",
      author_name: authorName,
      author_role: authorRole,
      visibility,
      body,
      created_at: new Date().toISOString(),
    };
    updateClaim(claimId, (c) => ({ ...c, comments: [...c.comments, comment] }));
    const action = visibility === "public" ? "claim.comment_added" : "claim.internal_note_added";
    audit(authorName, action, "claim", claimId, `Synlighet: ${visibility}`);
    if (visibility === "public" && authorRole !== "beboer") {
      const claim = state.claims.find((c) => c.id === claimId);
      notify("beboer", "message", "Ny melding fra utbygger", `Ny melding i saken «${claim?.title}».`, "claim", claimId);
    }
    if (visibility === "public" && authorRole === "beboer") {
      const claim = state.claims.find((c) => c.id === claimId);
      notify("utbygger", "message", "Ny melding fra beboer", `Ny melding i saken «${claim?.title}».`, "claim", claimId);
    }
  }, [updateClaim, audit, notify, state.claims]);

  const addEvidence = useCallback((claimId: string, label: string, caption: string, uploadedBy: string) => {
    const item: EvidenceItem = {
      id: uid("ev"),
      claim_id: claimId,
      type: "photo",
      label,
      caption,
      uploaded_by: uploadedBy,
      created_at: new Date().toISOString(),
    };
    updateClaim(claimId, (c) => ({ ...c, evidence: [...c.evidence, item] }));
    pushTimeline(claimId, "evidence.added", "Ny dokumentasjon lagt til", uploadedBy);
    audit(uploadedBy, "claim.evidence_added", "claim", claimId, label);
  }, [updateClaim, pushTimeline, audit]);

  const escalateClaim = useCallback((claimId: string, actor: string) => {
    updateClaim(claimId, (c) => ({ ...c, status: "Eskalert", legal_risk_level: "høy" }));
    pushTimeline(claimId, "claim.escalated", "Sak eskalert", actor);
    audit(actor, "claim.escalated", "claim", claimId, "Eskalert manuelt");
  }, [updateClaim, pushTimeline, audit]);

  const archiveClaim = useCallback((claimId: string, actor: string) => {
    updateClaim(claimId, (c) => ({ ...c, status: "Arkivert" }));
    pushTimeline(claimId, "claim.archived", "Sak arkivert med komplett historikk", actor);
    audit(actor, "claim.archived", "claim", claimId, "Arkivert");
    notify("beboer", "claim.archived", "Sak arkivert", "Saken er arkivert med komplett historikk.", "claim", claimId);
  }, [updateClaim, pushTimeline, audit, notify]);

  /* ----- arbeidsordre og avtaler ----- */

  const acceptWorkOrder = useCallback((workOrderId: string) => {
    setState((s) => ({
      ...s,
      workOrders: s.workOrders.map((w) => (w.id === workOrderId ? { ...w, status: "Akseptert" } : w)),
    }));
    audit("Leverandør", "work_order.accepted", "work_order", workOrderId, "Arbeidsordre akseptert");
  }, [audit]);

  const proposeSlots = useCallback((workOrderId: string, starts: Date[], actor: string) => {
    const wo = state.workOrders.find((w) => w.id === workOrderId);
    if (!wo) return;
    const newSlots: AppointmentSlot[] = starts.map((d) => ({
      id: uid("slot"),
      tenant_id: "t1",
      work_order_id: workOrderId,
      start_at: d.toISOString(),
      end_at: new Date(d.getTime() + 2 * 3600000).toISOString(),
      status: "proposed",
    }));
    setState((s) => ({
      ...s,
      slots: [...s.slots.filter((sl) => sl.work_order_id !== workOrderId), ...newSlots],
      workOrders: s.workOrders.map((w) => (w.id === workOrderId ? { ...w, status: "Tidspunkt foreslått" } : w)),
    }));
    updateClaim(wo.claim_id, (c) => ({ ...c, status: "Tidspunkt foreslått" }));
    pushTimeline(wo.claim_id, "appointment.proposed", "Tre tidspunkter foreslått", actor);
    audit(actor, "appointment.proposed", "work_order", wo.wo_number, `${starts.length} tidspunkter`);
    notify("beboer", "appointment.proposed", "Tidspunkter foreslått", `${actor} har foreslått tidspunkter. Velg det som passer best.`, "claim", wo.claim_id);
  }, [state.workOrders, updateClaim, pushTimeline, audit, notify]);

  const selectSlot = useCallback((slotId: string) => {
    const slot = state.slots.find((sl) => sl.id === slotId);
    if (!slot) return;
    const wo = state.workOrders.find((w) => w.id === slot.work_order_id);
    if (!wo) return;
    const claim = state.claims.find((c) => c.id === wo.claim_id);
    const unit = claim ? getUnit(claim.unit_id) : undefined;
    const resident = claim ? getUser(claim.resident_user_id) : undefined;
    const appointment: Appointment = {
      id: uid("ap"),
      tenant_id: "t1",
      work_order_id: wo.id,
      claim_id: wo.claim_id,
      resident_user_id: claim?.resident_user_id ?? "",
      supplier_org_id: wo.supplier_org_id,
      technician_user_id: wo.assigned_technician_user_id,
      start_at: slot.start_at,
      end_at: slot.end_at,
      status: "bekreftet",
      location: unit ? `Middelthuns gate 17, leil. ${unit.unit_number}` : "",
      notes: "",
    };
    setState((s) => ({
      ...s,
      slots: s.slots.map((sl) =>
        sl.work_order_id === slot.work_order_id
          ? { ...sl, status: sl.id === slotId ? "selected" : "expired" }
          : sl,
      ),
      appointments: [...s.appointments, appointment],
      workOrders: s.workOrders.map((w) => (w.id === wo.id ? { ...w, status: "Planlagt", scheduled_start: slot.start_at, scheduled_end: slot.end_at } : w)),
    }));
    updateClaim(wo.claim_id, (c) => ({ ...c, status: "Planlagt" }));
    pushTimeline(wo.claim_id, "appointment.selected", "Tidspunkt valgt av beboer", resident?.name ?? "Beboer");
    audit(resident?.name ?? "Beboer", "appointment.selected", "appointment", appointment.id, `Tidspunkt: ${slot.start_at}`);
    notify("leverandor", "appointment.selected", "Tidspunkt valgt", `${resident?.name ?? "Beboer"} har valgt tidspunkt for «${wo.title}». Avtalen ligger i kalenderen.`, "work_order", wo.id);
    notify("utbygger", "appointment.selected", "Tidspunkt valgt", `${resident?.name ?? "Beboer"} har valgt tidspunkt for «${claim?.title}».`, "claim", wo.claim_id);
  }, [state.slots, state.workOrders, state.claims, updateClaim, pushTimeline, audit, notify]);

  const startWork = useCallback((workOrderId: string) => {
    const wo = state.workOrders.find((w) => w.id === workOrderId);
    if (!wo) return;
    setState((s) => ({
      ...s,
      workOrders: s.workOrders.map((w) => (w.id === workOrderId ? { ...w, status: "Pågår" } : w)),
    }));
    updateClaim(wo.claim_id, (c) => ({ ...c, status: "Under utbedring" }));
    pushTimeline(wo.claim_id, "work.started", "Arbeid startet", "Leverandør");
    audit("Leverandør", "work_order.started", "work_order", wo.wo_number, "Arbeid startet");
  }, [state.workOrders, updateClaim, pushTimeline, audit]);

  const completeWork = useCallback((workOrderId: string, report: { summary: string; materials: string; hours: number }) => {
    const wo = state.workOrders.find((w) => w.id === workOrderId);
    if (!wo) return;
    const cr: CompletionReport = {
      id: uid("cr"),
      tenant_id: "t1",
      work_order_id: workOrderId,
      claim_id: wo.claim_id,
      completed_by: "Leverandør",
      completed_at: new Date().toISOString(),
      work_summary: report.summary,
      materials: report.materials,
      hours: report.hours,
      before_photos: 1,
      after_photos: 1,
      resident_confirmation_status: "pending",
    };
    setState((s) => ({
      ...s,
      completionReports: [...s.completionReports, cr],
      workOrders: s.workOrders.map((w) => (w.id === workOrderId ? { ...w, status: "Ferdigstilt" } : w)),
    }));
    updateClaim(wo.claim_id, (c) => ({ ...c, status: "Klar for kontroll" }));
    pushTimeline(wo.claim_id, "completion_report.submitted", "Utbedring meldt ferdig", "Leverandør");
    audit("Leverandør", "completion_report.submitted", "work_order", wo.wo_number, `Timer: ${report.hours}`);
    const claim = state.claims.find((c) => c.id === wo.claim_id);
    notify("beboer", "completion.confirm", "Utbedring meldt ferdig", `«${claim?.title}» er meldt utbedret. Bekreft at alt er i orden.`, "claim", wo.claim_id);
    notify("utbygger", "completion.submitted", "Utbedring ferdigstilt", `Utbedring er markert som ferdigstilt for «${claim?.title}». Venter på bekreftelse fra beboer.`, "claim", wo.claim_id);
  }, [state.workOrders, state.claims, updateClaim, pushTimeline, audit, notify]);

  const confirmCompletion = useCallback((claimId: string) => {
    updateClaim(claimId, (c) => ({ ...c, status: "Bekreftet av beboer" }));
    setState((s) => ({
      ...s,
      completionReports: s.completionReports.map((cr) => (cr.claim_id === claimId ? { ...cr, resident_confirmation_status: "confirmed" } : cr)),
    }));
    pushTimeline(claimId, "resident.confirmed_completion", "Utbedring bekreftet av beboer", "Lise Frankum");
    audit("Beboer", "resident.confirmed_completion", "claim", claimId, "Bekreftet utbedring");
    const claim = state.claims.find((c) => c.id === claimId);
    notify("utbygger", "claim.confirmed", "Utbedring bekreftet", `Beboer har bekreftet utbedringen av «${claim?.title}». Saken kan arkiveres.`, "claim", claimId);
  }, [updateClaim, pushTimeline, audit, notify, state.claims]);

  const reopenClaim = useCallback((claimId: string, reason: string) => {
    updateClaim(claimId, (c) => ({ ...c, status: "Gjenåpnet", reopened: true, deadline_risk_level: "høy" }));
    setState((s) => ({
      ...s,
      completionReports: s.completionReports.map((cr) => (cr.claim_id === claimId ? { ...cr, resident_confirmation_status: "rejected" } : cr)),
    }));
    pushTimeline(claimId, "claim.reopened", "Gjenåpnet av beboer – problemet består", "Beboer");
    audit("Beboer", "claim.reopened", "claim", claimId, `Begrunnelse: ${reason}`);
    const claim = state.claims.find((c) => c.id === claimId);
    notify("utbygger", "claim.reopened", "Sak gjenåpnet", `Beboer har gjenåpnet saken «${claim?.title}». ${reason}`, "claim", claimId);
  }, [updateClaim, pushTimeline, audit, notify, state.claims]);

  /* ----- tilvalg / markedsplass / GDPR / admin ----- */

  const submitTilvalgOrder = useCallback((order: Omit<TilvalgOrder, "id" | "tenant_id" | "status" | "submitted_at">) => {
    const o: TilvalgOrder = { ...order, id: uid("to"), tenant_id: "t1", status: "Sendt inn", submitted_at: new Date().toISOString() };
    setState((s) => ({ ...s, tilvalgOrders: [...s.tilvalgOrders, o] }));
    audit("Beboer", "tilvalg.order_submitted", "tilvalg_order", o.id, `Totalt: ${o.total} kr`);
    notify("utbygger", "tilvalg.submitted", "Ny tilvalgsbestilling", `Lise Frankum har sendt inn tilvalgsbestilling på ${o.total.toLocaleString("nb-NO")} kr.`, "tilvalg_order", o.id);
  }, [audit, notify]);

  const setTilvalgOrderStatus = useCallback((orderId: string, status: TilvalgOrder["status"]) => {
    setState((s) => ({ ...s, tilvalgOrders: s.tilvalgOrders.map((o) => (o.id === orderId ? { ...o, status } : o)) }));
    audit("Utbygger", "tilvalg.status_changed", "tilvalg_order", orderId, `Ny status: ${status}`);
    notify("beboer", "tilvalg.status", "Tilvalgsbestilling oppdatert", `Tilvalgsbestillingen din har fått status «${status}».`, "tilvalg_order", orderId);
  }, [audit, notify]);

  const requestMarketplaceService = useCallback((serviceId: string, serviceTitle: string, preferredTime: string, note: string) => {
    const o: MarketplaceOrder = {
      id: uid("mo"),
      tenant_id: "t1",
      service_id: serviceId,
      service_title: serviceTitle,
      resident_user_id: "u-lise",
      unit_id: "unit-c103",
      status: "Forespurt",
      requested_at: new Date().toISOString(),
      preferred_time: preferredTime,
      note,
      price_estimate: null,
      commission_amount: null,
    };
    setState((s) => ({ ...s, marketplaceOrders: [...s.marketplaceOrders, o] }));
    audit("Beboer", "marketplace.order_requested", "marketplace_order", o.id, serviceTitle);
    notify("utbygger", "marketplace.request", "Ny markedsplassforespørsel", `Ny markedsplassforespørsel mottatt: «${serviceTitle}».`, "marketplace_order", o.id);
  }, [audit, notify]);

  const createGdprRequest = useCallback((type: GDPRRequest["type"]) => {
    const r: GDPRRequest = {
      id: uid("gr"),
      tenant_id: "t1",
      user_name: "Lise Frankum",
      type,
      status: "Mottatt",
      requested_at: new Date().toISOString(),
      completed_at: null,
      handled_by: null,
    };
    setState((s) => ({ ...s, gdprRequests: [r, ...s.gdprRequests] }));
    const label = type === "export" ? "gdpr.export_requested" : type === "deletion" ? "gdpr.deletion_requested" : "gdpr.request_created";
    audit("Lise Frankum", label, "data_request", r.id, `Type: ${type}`, true);
    notify("utbygger", "gdpr.request", "Ny GDPR-forespørsel", `Lise Frankum har bedt om ${type === "export" ? "dataeksport" : type === "deletion" ? "sletting av data" : "innsyn"}.`, "data_request", r.id);
  }, [audit, notify]);

  const completeGdprRequest = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      gdprRequests: s.gdprRequests.map((r) => (r.id === id ? { ...r, status: "Fullført", completed_at: new Date().toISOString(), handled_by: "Kari Nordheim" } : r)),
    }));
    audit("Kari Nordheim", "gdpr.request_completed", "data_request", id, "Eksportpakke generert", true);
    notify("beboer", "gdpr.completed", "GDPR-forespørsel fullført", "Forespørselen din er behandlet. Eksportpakken er klar for nedlasting.", "data_request", id);
  }, [audit, notify]);

  const toggleFeatureFlag = useCallback((key: string) => {
    setState((s) => ({
      ...s,
      featureFlags: s.featureFlags.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f)),
    }));
    audit("Mats Tveller", "feature_flag.updated", "feature_flag", key, "Endret av superadmin");
  }, [audit]);

  const grantSupportAccess = useCallback((tenantName: string, reason: string, mode: "view_only" | "emergency") => {
    const grant: SupportAccessGrant = {
      id: uid("sa"),
      tenant_id: "t1",
      tenant_name: tenantName,
      requested_by: "Mats Tveller",
      reason,
      granted_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 3600000).toISOString(),
      mode,
    };
    setState((s) => ({ ...s, supportAccessLog: [grant, ...s.supportAccessLog] }));
    audit("Mats Tveller", "support.impersonation_started", "tenant", tenantName, `Årsak: ${reason}. Modus: ${mode === "view_only" ? "kun lesetilgang" : "nødtilgang"}.`, true);
    notify("utbygger", "support.access", "Supporttilgang brukt", `Supporttilgang ble brukt av TvellerOS. Årsak: ${reason}.`);
  }, [audit, notify]);

  const markNotificationsRead = useCallback((portal: PortalKey) => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.user_role === portal ? { ...n, read: true } : n)),
    }));
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      ...state,
      role,
      portal: rolePortal(role),
      setRole,
      toasts,
      toast,
      dismissToast,
      resetDemo,
      createClaim,
      setClaimStatus,
      decideClaim,
      assignSupplier,
      addComment,
      addEvidence,
      escalateClaim,
      archiveClaim,
      acceptWorkOrder,
      proposeSlots,
      selectSlot,
      startWork,
      completeWork,
      confirmCompletion,
      reopenClaim,
      submitTilvalgOrder,
      setTilvalgOrderStatus,
      requestMarketplaceService,
      createGdprRequest,
      completeGdprRequest,
      toggleFeatureFlag,
      grantSupportAccess,
      markNotificationsRead,
    }),
    [state, role, setRole, toasts, toast, dismissToast, resetDemo, createClaim, setClaimStatus, decideClaim, assignSupplier, addComment, addEvidence, escalateClaim, archiveClaim, acceptWorkOrder, proposeSlots, selectSlot, startWork, completeWork, confirmCompletion, reopenClaim, submitTilvalgOrder, setTilvalgOrderStatus, requestMarketplaceService, createGdprRequest, completeGdprRequest, toggleFeatureFlag, grantSupportAccess, markNotificationsRead],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore må brukes innenfor StoreProvider");
  return ctx;
}
