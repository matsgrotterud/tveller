/**
 * TvellerOS – domenemodell.
 * Alle tenant-tilknyttede entiteter har tenant_id for multi-tenant-isolasjon.
 * Modellen speiler SQL-skjemaet i /db/schema.sql og kan flyttes til
 * Supabase/Postgres uten endringer i resten av applikasjonen.
 */

export type RoleKey =
  | "superadmin"
  | "utbygger_admin"
  | "prosjektleder"
  | "kundebehandler"
  | "juridisk"
  | "teknisk"
  | "beboer"
  | "sameiestyre"
  | "leverandor_admin"
  | "tekniker"
  | "marketplace_partner"
  | "auditor";

export type PortalKey = "beboer" | "utbygger" | "leverandor" | "admin";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  org_number: string;
  billing_email: string;
  plan: "starter" | "pro" | "enterprise" | "portfolio";
  status: "active" | "trial" | "past_due" | "churned";
  mrr: number;
  health_score: number;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  tenant_id: string;
  name: string;
  type: "developer" | "supplier" | "marketplace_partner" | "sameie" | "platform";
  org_number: string;
  address: string;
  contact_email: string;
  contact_phone: string;
}

export interface User {
  id: string;
  tenant_id: string;
  organization_id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  role: RoleKey;
  status: "active" | "invited" | "deactivated";
  last_login_at: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  tenant_id: string;
  developer_org_id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  status: "planning" | "construction" | "handover" | "aftersales" | "completed";
  start_date: string;
  handover_date: string;
  internal_deadline_days: number;
  claim_period_years: number;
  units_count: number;
  handovers_completed: number;
  open_claims: number;
  active_suppliers: number;
  fdv_completeness: number;
  resident_activation: number;
  health_score: number;
  created_at: string;
}

export interface Building {
  id: string;
  tenant_id: string;
  project_id: string;
  name: string;
  address: string;
  floors: number;
}

export interface Unit {
  id: string;
  tenant_id: string;
  project_id: string;
  building_id: string;
  unit_number: string;
  floor: number;
  size_m2: number;
  bedrooms: number;
  resident_user_id: string | null;
  resident_name?: string;
  handover_status: "ikke_planlagt" | "planlagt" | "gjennomført" | "signert";
  takeover_date: string | null;
  claim_period_start_date: string | null;
  claim_period_end_date: string | null;
}

export type RoomType =
  | "bad"
  | "kjøkken"
  | "stue"
  | "soverom"
  | "entré"
  | "balkong"
  | "bod"
  | "fellesareal"
  | "annet";

export interface Room {
  id: string;
  tenant_id: string;
  unit_id: string;
  name: string;
  type: RoomType;
}

export interface Component {
  id: string;
  tenant_id: string;
  room_id: string;
  supplier_org_id: string | null;
  name: string;
  category: string;
  brand: string;
  model: string;
  color: string;
  installation_date: string;
  warranty_info: string;
  fdv_document_ids: string[];
}

export type DocVisibility = "resident" | "developer" | "supplier" | "board" | "internal";

export interface FDVDocument {
  id: string;
  tenant_id: string;
  project_id: string;
  unit_id: string | null;
  room_type: RoomType | null;
  component_id: string | null;
  title: string;
  description: string;
  category: "FDV" | "Overtakelse" | "Garantier" | "Tegninger" | "Sameie" | "Tilvalg";
  file_type: "pdf" | "docx" | "xlsx" | "jpg" | "png";
  version: string;
  uploaded_by: string;
  visibility: DocVisibility;
  size_kb: number;
  created_at: string;
}

export type ClaimStatus =
  | "Utkast"
  | "Sendt inn"
  | "Mottatt"
  | "Trenger mer info"
  | "Under vurdering"
  | "Befaring nødvendig"
  | "Godkjent"
  | "Avvist"
  | "Sendt til underleverandør"
  | "Tidspunkt foreslått"
  | "Planlagt"
  | "Under utbedring"
  | "Klar for kontroll"
  | "Ferdigstilt"
  | "Bekreftet av beboer"
  | "Gjenåpnet"
  | "Eskalert"
  | "Arkivert";

export type Severity = "lav" | "middels" | "høy" | "kritisk";
export type RiskLevel = "lav" | "middels" | "høy";

export type Trade =
  | "Rørlegger"
  | "Elektriker"
  | "Tømrer"
  | "Maler"
  | "Flislegger"
  | "Ventilasjon"
  | "Mur og betong"
  | "Parkett"
  | "Kjøkken"
  | "Annet";

export interface EvidenceItem {
  id: string;
  claim_id: string;
  type: "photo" | "video" | "document" | "annotation" | "audio" | "note";
  label: string;
  caption: string;
  annotation?: { x: number; y: number; note: string }[];
  uploaded_by: string;
  created_at: string;
}

export type MessageVisibility =
  | "public"
  | "developer_internal"
  | "supplier_internal"
  | "legal_internal";

export interface ClaimComment {
  id: string;
  claim_id: string;
  author_user_id: string;
  author_name: string;
  author_role: RoleKey;
  visibility: MessageVisibility;
  body: string;
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  claim_id: string;
  type: string;
  label: string;
  actor: string;
  created_at: string;
}

export interface Claim {
  id: string;
  case_number: string;
  tenant_id: string;
  project_id: string;
  building_id: string;
  unit_id: string;
  room_type: RoomType;
  component_id: string | null;
  resident_user_id: string;
  title: string;
  description: string;
  category: string;
  trade: Trade;
  severity: Severity;
  status: ClaimStatus;
  source: "resident" | "developer" | "handover" | "sameie" | "sensor" | "supplier";
  legal_risk_level: RiskLevel;
  deadline_risk_level: RiskLevel;
  received_at: string | null;
  due_at: string | null;
  assigned_developer_user_id: string | null;
  assigned_supplier_org_id: string | null;
  decision: "approved" | "rejected" | "more_info_needed" | "inspection_needed" | null;
  decision_reason: string | null;
  reopened: boolean;
  similar_case_ids: string[];
  completeness_score: number;
  evidence: EvidenceItem[];
  comments: ClaimComment[];
  timeline: TimelineEvent[];
  created_at: string;
  updated_at: string;
}

export type WorkOrderStatus =
  | "Ny"
  | "Akseptert"
  | "Tidspunkt foreslått"
  | "Planlagt"
  | "Pågår"
  | "Ferdigstilt"
  | "Avvist";

export interface WorkOrder {
  id: string;
  wo_number: string;
  tenant_id: string;
  claim_id: string;
  supplier_org_id: string;
  assigned_technician_user_id: string | null;
  title: string;
  description: string;
  status: WorkOrderStatus;
  priority: "lav" | "normal" | "høy";
  scheduled_start: string | null;
  scheduled_end: string | null;
  estimated_hours: number;
  created_at: string;
}

export interface AppointmentSlot {
  id: string;
  tenant_id: string;
  work_order_id: string;
  start_at: string;
  end_at: string;
  status: "proposed" | "selected" | "expired" | "cancelled";
}

export interface Appointment {
  id: string;
  tenant_id: string;
  work_order_id: string;
  claim_id: string;
  resident_user_id: string;
  supplier_org_id: string;
  technician_user_id: string | null;
  start_at: string;
  end_at: string;
  status: "bekreftet" | "gjennomført" | "avlyst" | "ombooking_ønsket";
  location: string;
  notes: string;
}

export interface CompletionReport {
  id: string;
  tenant_id: string;
  work_order_id: string;
  claim_id: string;
  completed_by: string;
  completed_at: string;
  work_summary: string;
  materials: string;
  hours: number;
  before_photos: number;
  after_photos: number;
  resident_confirmation_status: "pending" | "confirmed" | "rejected";
}

export interface Supplier {
  id: string;
  tenant_id: string;
  organization_id: string;
  name: string;
  trades: Trade[];
  rating: number;
  avg_response_time_hours: number;
  avg_resolution_time_hours: number;
  reopened_rate: number;
  cases_open: number;
  cases_closed: number;
  score: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  project_ids: string[];
}

export interface AppNotification {
  id: string;
  tenant_id: string;
  user_role: PortalKey;
  type: string;
  channel: "in_app" | "email" | "sms" | "push";
  title: string;
  body: string;
  entity_type: string | null;
  entity_id: string | null;
  read: boolean;
  created_at: string;
}

export interface AuditEvent {
  id: string;
  tenant_id: string;
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: string;
  sensitive: boolean;
  created_at: string;
}

export interface TilvalgOption {
  id: string;
  tenant_id: string;
  project_id: string;
  category: string;
  room_type: RoomType;
  title: string;
  description: string;
  price: number;
  price_type: "fixed" | "per_m2" | "per_unit";
  supplier_org_id: string | null;
  deadline: string;
  status: "published" | "draft";
}

export type TilvalgOrderStatus =
  | "Utkast"
  | "Sendt inn"
  | "Under behandling"
  | "Godkjent"
  | "Avvist"
  | "Fakturert"
  | "Ferdigstilt";

export interface TilvalgOrderItem {
  option_id: string;
  title: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface TilvalgOrder {
  id: string;
  tenant_id: string;
  project_id: string;
  unit_id: string;
  resident_user_id: string;
  status: TilvalgOrderStatus;
  items: TilvalgOrderItem[];
  subtotal: number;
  vat: number;
  total: number;
  submitted_at: string | null;
}

export interface MarketplaceService {
  id: string;
  tenant_id: string;
  partner_name: string;
  category: string;
  title: string;
  description: string;
  price_type: "fastpris" | "timepris" | "tilbud";
  starting_price: number;
  rating: number;
  partner_label: boolean;
  status: "active" | "paused";
}

export interface MarketplaceOrder {
  id: string;
  tenant_id: string;
  service_id: string;
  service_title: string;
  resident_user_id: string;
  unit_id: string;
  status: "Forespurt" | "Tilbud mottatt" | "Bestilt" | "Utført" | "Kansellert";
  requested_at: string;
  preferred_time: string;
  note: string;
  price_estimate: number | null;
  commission_amount: number | null;
}

export interface GDPRRequest {
  id: string;
  tenant_id: string;
  user_name: string;
  type: "access" | "export" | "deletion" | "rectification";
  status: "Mottatt" | "Under behandling" | "Fullført" | "Avvist";
  requested_at: string;
  completed_at: string | null;
  handled_by: string | null;
}

export interface FeatureFlagState {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  plan_required: "starter" | "pro" | "enterprise" | "portfolio";
}

export interface BillingPlan {
  id: string;
  name: string;
  slug: string;
  monthly_base_price: number;
  unit_price: number;
  included_units: number;
  included_ai_credits: number;
  included_sms: number;
  description: string;
  features: string[];
}

export interface Invoice {
  id: string;
  tenant_id: string;
  number: string;
  amount: number;
  status: "paid" | "open" | "past_due";
  period: string;
  due_date: string;
}

export interface UsageMetric {
  tenant_id: string;
  type: "sms" | "email" | "ai" | "storage" | "bankid";
  used: number;
  included: number;
  unit: string;
}

export interface IntegrationState {
  id: string;
  provider: string;
  category: string;
  status: "connected" | "not_connected" | "error" | "mock";
  description: string;
  last_sync_at: string | null;
  env_keys: string[];
}

export interface SupportAccessGrant {
  id: string;
  tenant_id: string;
  tenant_name: string;
  requested_by: string;
  reason: string;
  granted_at: string;
  expires_at: string;
  mode: "view_only" | "emergency";
}

export interface SameieAnnouncement {
  id: string;
  tenant_id: string;
  project_id: string;
  title: string;
  body: string;
  author: string;
  created_at: string;
}

export interface SameieMeeting {
  id: string;
  project_id: string;
  title: string;
  date: string;
  location: string;
  agenda: string[];
}

export interface HandoverProtocol {
  id: string;
  tenant_id: string;
  project_id: string;
  unit_id: string;
  scheduled_at: string | null;
  status: "ikke_planlagt" | "planlagt" | "gjennomført" | "signert";
  meter_reading_power: string | null;
  keys_delivered: number;
  access_cards: number;
  defects_found: number;
  signed_by_resident: boolean;
  signed_by_developer: boolean;
}
