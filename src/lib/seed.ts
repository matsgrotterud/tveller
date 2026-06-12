import type {
  AppNotification,
  Appointment,
  AppointmentSlot,
  AuditEvent,
  BillingPlan,
  Building,
  Claim,
  ClaimComment,
  CompletionReport,
  EvidenceItem,
  FDVDocument,
  FeatureFlagState,
  GDPRRequest,
  HandoverProtocol,
  IntegrationState,
  Invoice,
  MarketplaceOrder,
  MarketplaceService,
  Organization,
  Project,
  SameieAnnouncement,
  SameieMeeting,
  Supplier,
  SupportAccessGrant,
  Tenant,
  TilvalgOption,
  TilvalgOrder,
  TimelineEvent,
  Unit,
  UsageMetric,
  User,
  WorkOrder,
} from "./types";

/* ---------- tidshjelpere (relative datoer gir levende demo) ---------- */

const now = Date.now();
const DAY = 86400000;

export function daysAgo(n: number, hour = 10, minute = 0): string {
  const d = new Date(now - n * DAY);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function daysFromNow(n: number, hour = 10, minute = 0): string {
  const d = new Date(now + n * DAY);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/* ---------------------------- tenants ---------------------------- */

export const TENANTS: Tenant[] = [
  {
    id: "t1",
    name: "Nordheim Bolig AS",
    slug: "nordheim",
    org_number: "987 654 321",
    billing_email: "faktura@nordheim.no",
    plan: "pro",
    status: "active",
    mrr: 24900,
    health_score: 86,
    created_at: daysAgo(420),
    updated_at: daysAgo(1),
  },
  {
    id: "t2",
    name: "Urban Eiendom AS",
    slug: "urban-eiendom",
    org_number: "912 345 678",
    billing_email: "regnskap@urbaneiendom.no",
    plan: "enterprise",
    status: "active",
    mrr: 58500,
    health_score: 92,
    created_at: daysAgo(610),
    updated_at: daysAgo(3),
  },
  {
    id: "t3",
    name: "Fjordbyen Utvikling AS",
    slug: "fjordbyen",
    org_number: "923 456 789",
    billing_email: "okonomi@fjordbyen.no",
    plan: "starter",
    status: "trial",
    mrr: 0,
    health_score: 61,
    created_at: daysAgo(18),
    updated_at: daysAgo(0),
  },
];

export const CURRENT_TENANT = TENANTS[0];

/* -------------------------- organisasjoner -------------------------- */

export const ORGANIZATIONS: Organization[] = [
  { id: "org-nordheim", tenant_id: "t1", name: "Nordheim Bolig AS", type: "developer", org_number: "987 654 321", address: "Drammensveien 145, 0277 Oslo", contact_email: "post@nordheim.no", contact_phone: "+47 22 12 34 56" },
  { id: "org-tveller", tenant_id: "t0", name: "Tveller AS", type: "platform", org_number: "931 000 111", address: "Universitetsgata 2, 0164 Oslo", contact_email: "hei@tveller.no", contact_phone: "+47 21 00 00 00" },
  { id: "org-bareror", tenant_id: "t1", name: "Bare Rør AS", type: "supplier", org_number: "918 222 333", address: "Brobekkveien 80, 0582 Oslo", contact_email: "post@bareror.no", contact_phone: "+47 22 80 80 80" },
  { id: "org-betongmur", tenant_id: "t1", name: "Betong & Mur AS", type: "supplier", org_number: "917 333 444", address: "Alnabruveien 11, 0668 Oslo", contact_email: "post@betongmur.no", contact_phone: "+47 23 17 50 00" },
  { id: "org-plansonn", tenant_id: "t1", name: "Plan & Sønn AS", type: "supplier", org_number: "916 444 555", address: "Østre Aker vei 90, 0596 Oslo", contact_email: "kontakt@plansonn.no", contact_phone: "+47 22 65 43 21" },
  { id: "org-elektrofix", tenant_id: "t1", name: "Elektrofix AS", type: "supplier", org_number: "915 555 666", address: "Ryenstubben 3, 0679 Oslo", contact_email: "service@elektrofix.no", contact_phone: "+47 23 03 60 00" },
  { id: "org-flispartner", tenant_id: "t1", name: "Flispartner Oslo AS", type: "supplier", org_number: "914 666 777", address: "Professor Birkelands vei 24, 1081 Oslo", contact_email: "post@flispartner.no", contact_phone: "+47 22 30 40 50" },
  { id: "org-ventilasjon", tenant_id: "t1", name: "Ventilasjon Norge AS", type: "supplier", org_number: "913 777 888", address: "Karihaugveien 89, 1086 Oslo", contact_email: "post@ventnorge.no", contact_phone: "+47 67 17 80 00" },
  { id: "org-parkett", tenant_id: "t1", name: "Parkettmesteren AS", type: "supplier", org_number: "912 888 999", address: "Sandakerveien 64, 0484 Oslo", contact_email: "post@parkettmesteren.no", contact_phone: "+47 22 22 33 44" },
  { id: "org-hth", tenant_id: "t1", name: "HTH Kjøkkenpartner AS", type: "supplier", org_number: "911 999 000", address: "Skøyen Atrium, 0277 Oslo", contact_email: "oslo@hth.no", contact_phone: "+47 22 55 66 77" },
  { id: "org-sameie-middelthunet", tenant_id: "t1", name: "Sameiet Middelthunet", type: "sameie", org_number: "929 111 222", address: "Middelthuns gate 17, 0368 Oslo", contact_email: "styret@middelthunet.no", contact_phone: "+47 90 12 34 56" },
];

/* ------------------------------ brukere ------------------------------ */

export const USERS: User[] = [
  { id: "u-superadmin", tenant_id: "t0", organization_id: "org-tveller", name: "Mats Tveller", email: "superadmin@tveller.no", phone: "+47 900 00 001", avatar_url: null, role: "superadmin", status: "active", last_login_at: daysAgo(0, 8), created_at: daysAgo(700) },
  { id: "u-pl", tenant_id: "t1", organization_id: "org-nordheim", name: "Kari Nordheim", email: "prosjektleder@nordheim.no", phone: "+47 900 00 002", avatar_url: null, role: "utbygger_admin", status: "active", last_login_at: daysAgo(0, 7, 45), created_at: daysAgo(420) },
  { id: "u-ks", tenant_id: "t1", organization_id: "org-nordheim", name: "Ola Sandvik", email: "kundeservice@nordheim.no", phone: "+47 900 00 003", avatar_url: null, role: "kundebehandler", status: "active", last_login_at: daysAgo(0, 9, 10), created_at: daysAgo(400) },
  { id: "u-jur", tenant_id: "t1", organization_id: "org-nordheim", name: "Ingrid Wold", email: "juridisk@nordheim.no", phone: "+47 900 00 004", avatar_url: null, role: "juridisk", status: "active", last_login_at: daysAgo(1, 14), created_at: daysAgo(380) },
  { id: "u-lise", tenant_id: "t1", organization_id: "org-nordheim", name: "Lise Frankum", email: "lise@example.com", phone: "+47 900 00 005", avatar_url: null, role: "beboer", status: "active", last_login_at: daysAgo(0, 8, 30), created_at: daysAgo(160) },
  { id: "u-thomas-h", tenant_id: "t1", organization_id: "org-nordheim", name: "Thomas Haug", email: "thomas.haug@example.com", phone: "+47 900 00 006", avatar_url: null, role: "beboer", status: "active", last_login_at: daysAgo(2), created_at: daysAgo(150) },
  { id: "u-amalie", tenant_id: "t1", organization_id: "org-nordheim", name: "Amalie Berg", email: "amalie.berg@example.com", phone: "+47 900 00 007", avatar_url: null, role: "beboer", status: "active", last_login_at: daysAgo(4), created_at: daysAgo(150) },
  { id: "u-henrik", tenant_id: "t1", organization_id: "org-nordheim", name: "Henrik Lund", email: "henrik.lund@example.com", phone: "+47 900 00 008", avatar_url: null, role: "beboer", status: "active", last_login_at: daysAgo(7), created_at: daysAgo(140) },
  { id: "u-sara", tenant_id: "t1", organization_id: "org-nordheim", name: "Sara Nguyen", email: "sara.nguyen@example.com", phone: "+47 900 00 009", avatar_url: null, role: "beboer", status: "active", last_login_at: daysAgo(1), created_at: daysAgo(130) },
  { id: "u-eirik", tenant_id: "t1", organization_id: "org-nordheim", name: "Eirik Johansen", email: "eirik.johansen@example.com", phone: "+47 900 00 010", avatar_url: null, role: "beboer", status: "invited", last_login_at: null, created_at: daysAgo(20) },
  { id: "u-styret", tenant_id: "t1", organization_id: "org-sameie-middelthunet", name: "Styret Middelthunet", email: "styret@middelthunet.no", phone: "+47 900 00 011", avatar_url: null, role: "sameiestyre", status: "active", last_login_at: daysAgo(3), created_at: daysAgo(120) },
  { id: "u-thomas-b", tenant_id: "t1", organization_id: "org-bareror", name: "Thomas Bakke", email: "thomas@bareror.no", phone: "+47 900 00 012", avatar_url: null, role: "leverandor_admin", status: "active", last_login_at: daysAgo(0, 7), created_at: daysAgo(300) },
  { id: "u-tekniker", tenant_id: "t1", organization_id: "org-elektrofix", name: "Jonas Pettersen", email: "tekniker@elektrofix.no", phone: "+47 900 00 013", avatar_url: null, role: "tekniker", status: "active", last_login_at: daysAgo(0, 6, 50), created_at: daysAgo(280) },
  { id: "u-tekniker2", tenant_id: "t1", organization_id: "org-bareror", name: "Martin Sletten", email: "martin@bareror.no", phone: "+47 900 00 014", avatar_url: null, role: "tekniker", status: "active", last_login_at: daysAgo(1), created_at: daysAgo(260) },
  { id: "u-tekniker3", tenant_id: "t1", organization_id: "org-bareror", name: "Aisha Khan", email: "aisha@bareror.no", phone: "+47 900 00 015", avatar_url: null, role: "tekniker", status: "active", last_login_at: daysAgo(2), created_at: daysAgo(200) },
];

export const DEMO_ACCOUNTS = [
  { email: "superadmin@tveller.no", role: "Superadmin", portal: "/admin", name: "Mats Tveller" },
  { email: "prosjektleder@nordheim.no", role: "Utbygger admin", portal: "/utbygger", name: "Kari Nordheim" },
  { email: "kundeservice@nordheim.no", role: "Kundebehandler", portal: "/utbygger", name: "Ola Sandvik" },
  { email: "juridisk@nordheim.no", role: "Juridisk ansvarlig", portal: "/utbygger/juridisk", name: "Ingrid Wold" },
  { email: "lise@example.com", role: "Beboer", portal: "/beboer", name: "Lise Frankum" },
  { email: "styret@middelthunet.no", role: "Sameiestyre", portal: "/beboer/sameie", name: "Styret Middelthunet" },
  { email: "thomas@bareror.no", role: "Underleverandør admin", portal: "/leverandor", name: "Thomas Bakke" },
  { email: "tekniker@elektrofix.no", role: "Tekniker", portal: "/leverandor/arbeidsordre", name: "Jonas Pettersen" },
];

/* ----------------------------- prosjekter ----------------------------- */

export const PROJECTS: Project[] = [
  {
    id: "p-middelthunet", tenant_id: "t1", developer_org_id: "org-nordheim",
    name: "Middelthunet", address: "Middelthuns gate 17", city: "Oslo", postal_code: "0368",
    status: "aftersales", start_date: daysAgo(900), handover_date: daysAgo(160),
    internal_deadline_days: 14, claim_period_years: 5,
    units_count: 182, handovers_completed: 92, open_claims: 21, active_suppliers: 8,
    fdv_completeness: 87, resident_activation: 78, health_score: 81, created_at: daysAgo(900),
  },
  {
    id: "p-markveien", tenant_id: "t1", developer_org_id: "org-nordheim",
    name: "Markveien 3", address: "Markveien 3", city: "Oslo", postal_code: "0554",
    status: "handover", start_date: daysAgo(700), handover_date: daysAgo(40),
    internal_deadline_days: 14, claim_period_years: 5,
    units_count: 102, handovers_completed: 50, open_claims: 3, active_suppliers: 5,
    fdv_completeness: 93, resident_activation: 64, health_score: 90, created_at: daysAgo(700),
  },
  {
    id: "p-gronnseter", tenant_id: "t1", developer_org_id: "org-nordheim",
    name: "Grønnseter 13", address: "Grønnseterveien 13", city: "Bærum", postal_code: "1352",
    status: "handover", start_date: daysAgo(540), handover_date: daysAgo(12),
    internal_deadline_days: 10, claim_period_years: 5,
    units_count: 92, handovers_completed: 12, open_claims: 1, active_suppliers: 4,
    fdv_completeness: 71, resident_activation: 22, health_score: 74, created_at: daysAgo(540),
  },
  {
    id: "p-fjordhagen", tenant_id: "t1", developer_org_id: "org-nordheim",
    name: "Fjordhagen", address: "Fjordalléen 8", city: "Oslo", postal_code: "0250",
    status: "construction", start_date: daysAgo(300), handover_date: daysFromNow(220),
    internal_deadline_days: 14, claim_period_years: 5,
    units_count: 64, handovers_completed: 0, open_claims: 0, active_suppliers: 0,
    fdv_completeness: 18, resident_activation: 0, health_score: 88, created_at: daysAgo(300),
  },
  {
    id: "p-solsiden", tenant_id: "t1", developer_org_id: "org-nordheim",
    name: "Solsiden Kvartal", address: "Solsidegata 1", city: "Trondheim", postal_code: "7014",
    status: "planning", start_date: daysFromNow(60), handover_date: daysFromNow(720),
    internal_deadline_days: 14, claim_period_years: 5,
    units_count: 140, handovers_completed: 0, open_claims: 0, active_suppliers: 0,
    fdv_completeness: 0, resident_activation: 0, health_score: 95, created_at: daysAgo(90),
  },
];

export const BUILDINGS: Building[] = [
  { id: "b-mid-a", tenant_id: "t1", project_id: "p-middelthunet", name: "Bygg A", address: "Middelthuns gate 17A", floors: 6 },
  { id: "b-mid-b", tenant_id: "t1", project_id: "p-middelthunet", name: "Bygg B", address: "Middelthuns gate 17B", floors: 6 },
  { id: "b-mid-c", tenant_id: "t1", project_id: "p-middelthunet", name: "Bygg C", address: "Middelthuns gate 17C", floors: 8 },
  { id: "b-mark-a", tenant_id: "t1", project_id: "p-markveien", name: "Bygg A", address: "Markveien 3", floors: 5 },
  { id: "b-gronn-a", tenant_id: "t1", project_id: "p-gronnseter", name: "Hus 1", address: "Grønnseterveien 13", floors: 4 },
  { id: "b-gronn-b", tenant_id: "t1", project_id: "p-gronnseter", name: "Hus 2", address: "Grønnseterveien 15", floors: 4 },
];

export const UNITS: Unit[] = [
  { id: "unit-c103", tenant_id: "t1", project_id: "p-middelthunet", building_id: "b-mid-c", unit_number: "C103", floor: 1, size_m2: 78, bedrooms: 2, resident_user_id: "u-lise", resident_name: "Lise Frankum", handover_status: "signert", takeover_date: daysAgo(145), claim_period_start_date: daysAgo(145), claim_period_end_date: daysFromNow(1680) },
  { id: "unit-b402", tenant_id: "t1", project_id: "p-middelthunet", building_id: "b-mid-b", unit_number: "B402", floor: 4, size_m2: 95, bedrooms: 3, resident_user_id: "u-thomas-h", resident_name: "Thomas Haug", handover_status: "signert", takeover_date: daysAgo(140), claim_period_start_date: daysAgo(140), claim_period_end_date: daysFromNow(1685) },
  { id: "unit-a201", tenant_id: "t1", project_id: "p-middelthunet", building_id: "b-mid-a", unit_number: "A201", floor: 2, size_m2: 64, bedrooms: 2, resident_user_id: "u-amalie", resident_name: "Amalie Berg", handover_status: "signert", takeover_date: daysAgo(138), claim_period_start_date: daysAgo(138), claim_period_end_date: daysFromNow(1687) },
  { id: "unit-d0502", tenant_id: "t1", project_id: "p-markveien", building_id: "b-mark-a", unit_number: "D0502", floor: 5, size_m2: 110, bedrooms: 4, resident_user_id: "u-henrik", resident_name: "Henrik Lund", handover_status: "signert", takeover_date: daysAgo(35), claim_period_start_date: daysAgo(35), claim_period_end_date: daysFromNow(1790) },
  { id: "unit-h0101", tenant_id: "t1", project_id: "p-gronnseter", building_id: "b-gronn-a", unit_number: "H0101", floor: 1, size_m2: 88, bedrooms: 3, resident_user_id: "u-sara", resident_name: "Sara Nguyen", handover_status: "gjennomført", takeover_date: daysAgo(10), claim_period_start_date: daysAgo(10), claim_period_end_date: daysFromNow(1815) },
  { id: "unit-a305", tenant_id: "t1", project_id: "p-middelthunet", building_id: "b-mid-a", unit_number: "A305", floor: 3, size_m2: 71, bedrooms: 2, resident_user_id: "u-eirik", resident_name: "Eirik Johansen", handover_status: "planlagt", takeover_date: null, claim_period_start_date: null, claim_period_end_date: null },
  { id: "unit-b110", tenant_id: "t1", project_id: "p-middelthunet", building_id: "b-mid-b", unit_number: "B110", floor: 1, size_m2: 55, bedrooms: 1, resident_user_id: null, resident_name: undefined, handover_status: "ikke_planlagt", takeover_date: null, claim_period_start_date: null, claim_period_end_date: null },
];

/* --------------------------- leverandører --------------------------- */

export const SUPPLIERS: Supplier[] = [
  { id: "s-bareror", tenant_id: "t1", organization_id: "org-bareror", name: "Bare Rør AS", trades: ["Rørlegger"], rating: 4.7, avg_response_time_hours: 9, avg_resolution_time_hours: 60, reopened_rate: 4, cases_open: 6, cases_closed: 10, score: 91, contact_name: "Thomas Bakke", contact_email: "thomas@bareror.no", contact_phone: "+47 900 00 012", project_ids: ["p-middelthunet", "p-markveien"] },
  { id: "s-betongmur", tenant_id: "t1", organization_id: "org-betongmur", name: "Betong & Mur AS", trades: ["Mur og betong"], rating: 4.1, avg_response_time_hours: 22, avg_resolution_time_hours: 37, reopened_rate: 11, cases_open: 50, cases_closed: 30, score: 72, contact_name: "Geir Olsen", contact_email: "geir@betongmur.no", contact_phone: "+47 911 22 333", project_ids: ["p-middelthunet", "p-gronnseter"] },
  { id: "s-plansonn", tenant_id: "t1", organization_id: "org-plansonn", name: "Plan & Sønn AS", trades: ["Tømrer"], rating: 4.3, avg_response_time_hours: 15, avg_resolution_time_hours: 44, reopened_rate: 7, cases_open: 18, cases_closed: 7, score: 79, contact_name: "Per Plan", contact_email: "per@plansonn.no", contact_phone: "+47 922 33 444", project_ids: ["p-middelthunet", "p-markveien", "p-gronnseter"] },
  { id: "s-elektrofix", tenant_id: "t1", organization_id: "org-elektrofix", name: "Elektrofix AS", trades: ["Elektriker"], rating: 4.8, avg_response_time_hours: 6, avg_resolution_time_hours: 28, reopened_rate: 2, cases_open: 5, cases_closed: 22, score: 95, contact_name: "Nina Voll", contact_email: "nina@elektrofix.no", contact_phone: "+47 933 44 555", project_ids: ["p-middelthunet", "p-markveien"] },
  { id: "s-flispartner", tenant_id: "t1", organization_id: "org-flispartner", name: "Flispartner Oslo AS", trades: ["Flislegger"], rating: 4.4, avg_response_time_hours: 18, avg_resolution_time_hours: 52, reopened_rate: 9, cases_open: 9, cases_closed: 14, score: 80, contact_name: "Samir Aydin", contact_email: "samir@flispartner.no", contact_phone: "+47 944 55 666", project_ids: ["p-middelthunet"] },
  { id: "s-ventilasjon", tenant_id: "t1", organization_id: "org-ventilasjon", name: "Ventilasjon Norge AS", trades: ["Ventilasjon"], rating: 4.0, avg_response_time_hours: 26, avg_resolution_time_hours: 71, reopened_rate: 14, cases_open: 7, cases_closed: 11, score: 66, contact_name: "Bjørn Aas", contact_email: "bjorn@ventnorge.no", contact_phone: "+47 955 66 777", project_ids: ["p-middelthunet", "p-gronnseter"] },
  { id: "s-parkett", tenant_id: "t1", organization_id: "org-parkett", name: "Parkettmesteren AS", trades: ["Parkett"], rating: 4.6, avg_response_time_hours: 12, avg_resolution_time_hours: 40, reopened_rate: 5, cases_open: 4, cases_closed: 9, score: 87, contact_name: "Eva Strand", contact_email: "eva@parkettmesteren.no", contact_phone: "+47 966 77 888", project_ids: ["p-middelthunet", "p-markveien"] },
  { id: "s-hth", tenant_id: "t1", organization_id: "org-hth", name: "HTH Kjøkkenpartner AS", trades: ["Kjøkken"], rating: 4.5, avg_response_time_hours: 20, avg_resolution_time_hours: 65, reopened_rate: 6, cases_open: 3, cases_closed: 8, score: 84, contact_name: "Maria Holm", contact_email: "maria@hth.no", contact_phone: "+47 977 88 999", project_ids: ["p-middelthunet"] },
];

/* --------------------------- reklamasjoner --------------------------- */

function ev(claimId: string, n: number, label: string, caption: string, uploadedBy: string, createdAt: string, annotated = false): EvidenceItem {
  return {
    id: `${claimId}-ev${n}`,
    claim_id: claimId,
    type: "photo",
    label,
    caption,
    annotation: annotated ? [{ x: 42, y: 58, note: caption }] : undefined,
    uploaded_by: uploadedBy,
    created_at: createdAt,
  };
}

function tl(claimId: string, n: number, type: string, label: string, actor: string, createdAt: string): TimelineEvent {
  return { id: `${claimId}-tl${n}`, claim_id: claimId, type, label, actor, created_at: createdAt };
}

function cm(claimId: string, n: number, authorId: string, authorName: string, role: ClaimComment["author_role"], visibility: ClaimComment["visibility"], body: string, createdAt: string): ClaimComment {
  return { id: `${claimId}-cm${n}`, claim_id: claimId, author_user_id: authorId, author_name: authorName, author_role: role, visibility, body, created_at: createdAt };
}

export const CLAIMS: Claim[] = [
  {
    id: "c1", case_number: "RK-2024-0118", tenant_id: "t1", project_id: "p-middelthunet", building_id: "b-mid-c",
    unit_id: "unit-c103", room_type: "bad", component_id: "comp-flis-bad", resident_user_id: "u-lise",
    title: "Sprukket flis på bad", description: "Flisen til venstre for dusjnisjen har fått en tydelig sprekk diagonalt over hele flisen. Sprekken var ikke der ved overtakelse. Det er ikke synlig fukt rundt flisen, men jeg er bekymret for at vann kan trenge inn.",
    category: "Overflater", trade: "Flislegger", severity: "middels", status: "Tidspunkt foreslått", source: "resident",
    legal_risk_level: "lav", deadline_risk_level: "middels",
    received_at: daysAgo(9), due_at: daysFromNow(5),
    assigned_developer_user_id: "u-ks", assigned_supplier_org_id: "org-flispartner",
    decision: "approved", decision_reason: "Sprekk i flis uten ytre påvirkning er en mangel etter bustadoppføringslova. Utbedres av flislegger.",
    reopened: false, similar_case_ids: ["c2", "c15"], completeness_score: 92,
    evidence: [
      ev("c1", 1, "IMG_2841.jpg", "Sprekk diagonalt over flis ved dusjnisje", "Lise Frankum", daysAgo(9), true),
      ev("c1", 2, "IMG_2842.jpg", "Oversiktsbilde av badet", "Lise Frankum", daysAgo(9)),
    ],
    comments: [
      cm("c1", 1, "u-lise", "Lise Frankum", "beboer", "public", "Hei! Jeg oppdaget denne sprekken i går kveld. Den var definitivt ikke der ved overtakelsen.", daysAgo(9)),
      cm("c1", 2, "u-ks", "Ola Sandvik", "kundebehandler", "public", "Hei Lise! Takk for god dokumentasjon. Vi har vurdert saken og godkjent den. Flispartner Oslo tar kontakt for å avtale tidspunkt.", daysAgo(7)),
      cm("c1", 3, "u-ks", "Ola Sandvik", "kundebehandler", "developer_internal", "Sjekket FDV – flisene er fra samme parti som i sak RK-2024-0097. Kan være et partiproblem, følg med på flere saker i Bygg C.", daysAgo(7)),
      cm("c1", 4, "u-thomas-b", "Samir Aydin", "leverandor_admin", "supplier_internal", "Har flis fra samme parti på lager. Regner 2 timer inkl. fuging.", daysAgo(3)),
    ],
    timeline: [
      tl("c1", 1, "claim.created", "Reklamasjon opprettet av beboer", "Lise Frankum", daysAgo(9, 9, 12)),
      tl("c1", 2, "claim.submitted", "Reklamasjon sendt inn", "Lise Frankum", daysAgo(9, 9, 20)),
      tl("c1", 3, "claim.status_changed", "Status endret til Mottatt", "System", daysAgo(9, 9, 21)),
      tl("c1", 4, "claim.decision_made", "Reklamasjon godkjent", "Ola Sandvik", daysAgo(7, 13, 5)),
      tl("c1", 5, "claim.assigned_supplier", "Tildelt Flispartner Oslo AS", "Ola Sandvik", daysAgo(7, 13, 10)),
      tl("c1", 6, "appointment.proposed", "Tre tidspunkter foreslått", "Flispartner Oslo AS", daysAgo(3, 8, 40)),
    ],
    created_at: daysAgo(9), updated_at: daysAgo(3),
  },
  {
    id: "c2", case_number: "RK-2024-0097", tenant_id: "t1", project_id: "p-middelthunet", building_id: "b-mid-b",
    unit_id: "unit-b402", room_type: "bad", component_id: null, resident_user_id: "u-thomas-h",
    title: "Bom i gulvflis", description: "Flere fliser på badegulvet gir hul lyd når man banker på dem. Gjelder området foran servanten, ca. 4–5 fliser.",
    category: "Overflater", trade: "Flislegger", severity: "middels", status: "Under utbedring", source: "resident",
    legal_risk_level: "lav", deadline_risk_level: "lav",
    received_at: daysAgo(21), due_at: daysFromNow(9),
    assigned_developer_user_id: "u-ks", assigned_supplier_org_id: "org-flispartner",
    decision: "approved", decision_reason: "Bom i flis bekreftet ved befaring. Omlegging avtalt.",
    reopened: false, similar_case_ids: ["c1"], completeness_score: 88,
    evidence: [ev("c2", 1, "IMG_1204.jpg", "Området foran servant markert", "Thomas Haug", daysAgo(21), true)],
    comments: [
      cm("c2", 1, "u-ks", "Ola Sandvik", "kundebehandler", "public", "Hei Thomas. Befaring bekreftet bom i flisene. Flispartner legger om gulvet – avtale er bekreftet.", daysAgo(14)),
    ],
    timeline: [
      tl("c2", 1, "claim.submitted", "Reklamasjon sendt inn", "Thomas Haug", daysAgo(21)),
      tl("c2", 2, "claim.decision_made", "Godkjent etter befaring", "Ola Sandvik", daysAgo(15)),
      tl("c2", 3, "appointment.selected", "Tidspunkt valgt av beboer", "Thomas Haug", daysAgo(10)),
      tl("c2", 4, "work.started", "Arbeid startet", "Flispartner Oslo AS", daysAgo(1, 8)),
    ],
    created_at: daysAgo(21), updated_at: daysAgo(1),
  },
  {
    id: "c3", case_number: "RK-2024-0121", tenant_id: "t1", project_id: "p-middelthunet", building_id: "b-mid-a",
    unit_id: "unit-a201", room_type: "stue", component_id: null, resident_user_id: "u-amalie",
    title: "Balkongdør lukker ikke tett", description: "Balkongdøren i stuen lukker ikke ordentlig i underkant. Det trekker merkbart, og i regnvær kommer det litt vann inn på terskelen.",
    category: "Dører og vinduer", trade: "Tømrer", severity: "høy", status: "Eskalert", source: "resident",
    legal_risk_level: "høy", deadline_risk_level: "høy",
    received_at: daysAgo(26), due_at: daysFromNow(1),
    assigned_developer_user_id: "u-pl", assigned_supplier_org_id: "org-plansonn",
    decision: "approved", decision_reason: "Tetthetsproblem ved balkongdør. Prioriteres pga. vanninntrenging.",
    reopened: false, similar_case_ids: ["c10"], completeness_score: 95,
    evidence: [
      ev("c3", 1, "IMG_0871.jpg", "Glippe i underkant av dør", "Amalie Berg", daysAgo(26), true),
      ev("c3", 2, "VID_0034.mp4", "Video som viser trekk med flamme-test", "Amalie Berg", daysAgo(26)),
    ],
    comments: [
      cm("c3", 1, "u-pl", "Kari Nordheim", "utbygger_admin", "developer_internal", "Plan & Sønn har ikke svart på to purringer. Eskalert til daglig leder. Vurder å bytte leverandør hvis ikke svar innen fredag.", daysAgo(4)),
      cm("c3", 2, "u-pl", "Kari Nordheim", "utbygger_admin", "public", "Hei Amalie. Vi beklager at dette har tatt tid. Saken er eskalert internt og hos tømrerfirmaet, og vi følger den tett.", daysAgo(4)),
      cm("c3", 3, "u-jur", "Ingrid Wold", "juridisk", "legal_internal", "Vanninntrenging gir risiko for følgeskader. Dokumentér all kommunikasjon. Intern frist må overholdes – dagbøter kan bli aktuelt mot underleverandør iht. kontrakt.", daysAgo(3)),
    ],
    timeline: [
      tl("c3", 1, "claim.submitted", "Reklamasjon sendt inn", "Amalie Berg", daysAgo(26)),
      tl("c3", 2, "claim.decision_made", "Godkjent", "Kari Nordheim", daysAgo(24)),
      tl("c3", 3, "claim.assigned_supplier", "Tildelt Plan & Sønn AS", "Kari Nordheim", daysAgo(24)),
      tl("c3", 4, "claim.escalated", "Sak eskalert – manglende respons fra leverandør", "Kari Nordheim", daysAgo(4)),
    ],
    created_at: daysAgo(26), updated_at: daysAgo(3),
  },
  {
    id: "c4", case_number: "RK-2024-0125", tenant_id: "t1", project_id: "p-middelthunet", building_id: "b-mid-c",
    unit_id: "unit-c103", room_type: "stue", component_id: "comp-parkett-stue", resident_user_id: "u-lise",
    title: "Ripe i parkett", description: "Det er en ca. 30 cm lang ripe i parketten midt i stuen. Den var tildekket av papp ved overtakelse og ble først synlig da vi fjernet beskyttelsen.",
    category: "Overflater", trade: "Parkett", severity: "lav", status: "Under vurdering", source: "resident",
    legal_risk_level: "middels", deadline_risk_level: "lav",
    received_at: daysAgo(5), due_at: daysFromNow(9),
    assigned_developer_user_id: "u-ks", assigned_supplier_org_id: null,
    decision: null, decision_reason: null,
    reopened: false, similar_case_ids: [], completeness_score: 74,
    evidence: [ev("c4", 1, "IMG_2901.jpg", "Ripe i parkett, ca. 30 cm", "Lise Frankum", daysAgo(5), true)],
    comments: [
      cm("c4", 1, "u-ks", "Ola Sandvik", "kundebehandler", "developer_internal", "Vanskelig sak – riper oppdaget etter overtakelse er ofte vanskelig å vurdere. Var pappen dokumentert ved overtakelse? Sjekk overtakelsesprotokollen.", daysAgo(4)),
    ],
    timeline: [
      tl("c4", 1, "claim.submitted", "Reklamasjon sendt inn", "Lise Frankum", daysAgo(5)),
      tl("c4", 2, "claim.status_changed", "Status endret til Under vurdering", "Ola Sandvik", daysAgo(4)),
    ],
    created_at: daysAgo(5), updated_at: daysAgo(4),
  },
  {
    id: "c5", case_number: "RK-2024-0126", tenant_id: "t1", project_id: "p-middelthunet", building_id: "b-mid-b",
    unit_id: "unit-b402", room_type: "kjøkken", component_id: "comp-kjokken", resident_user_id: "u-thomas-h",
    title: "Manglende fuging ved kjøkkenbenk", description: "Det mangler silikonfuge mellom benkeplate og veggflis bak komfyrtoppen, ca. 80 cm strekk. Vann og matrester kan komme ned bak benken.",
    category: "Kjøkken", trade: "Kjøkken", severity: "lav", status: "Mottatt", source: "resident",
    legal_risk_level: "lav", deadline_risk_level: "lav",
    received_at: daysAgo(2), due_at: daysFromNow(12),
    assigned_developer_user_id: null, assigned_supplier_org_id: null,
    decision: null, decision_reason: null,
    reopened: false, similar_case_ids: ["c15"], completeness_score: 81,
    evidence: [ev("c5", 1, "IMG_4471.jpg", "Manglende fuge bak komfyrtopp", "Thomas Haug", daysAgo(2))],
    comments: [],
    timeline: [
      tl("c5", 1, "claim.submitted", "Reklamasjon sendt inn", "Thomas Haug", daysAgo(2)),
      tl("c5", 2, "claim.status_changed", "Status endret til Mottatt", "System", daysAgo(2)),
    ],
    created_at: daysAgo(2), updated_at: daysAgo(2),
  },
  {
    id: "c6", case_number: "RK-2024-0112", tenant_id: "t1", project_id: "p-middelthunet", building_id: "b-mid-a",
    unit_id: "unit-a201", room_type: "bad", component_id: null, resident_user_id: "u-amalie",
    title: "Vanntrykk lavt på bad", description: "Vanntrykket i dusjen er merkbart lavere enn på kjøkkenet. Det tar lang tid å skylle ut sjampo, og trykket varierer.",
    category: "Rør og sanitær", trade: "Rørlegger", severity: "middels", status: "Planlagt", source: "resident",
    legal_risk_level: "lav", deadline_risk_level: "lav",
    received_at: daysAgo(14), due_at: daysFromNow(7),
    assigned_developer_user_id: "u-ks", assigned_supplier_org_id: "org-bareror",
    decision: "approved", decision_reason: "Lavt trykk indikerer mulig strupt ventil eller filterproblem. Bare Rør kontrollerer.",
    reopened: false, similar_case_ids: [], completeness_score: 85,
    evidence: [ev("c6", 1, "VID_0102.mp4", "Video av vannstråle i dusj", "Amalie Berg", daysAgo(14))],
    comments: [
      cm("c6", 1, "u-thomas-b", "Thomas Bakke", "leverandor_admin", "public", "Hei! Vi kommer som avtalt. Sjekker reduksjonsventil og filter i blandebatteriet.", daysAgo(2)),
    ],
    timeline: [
      tl("c6", 1, "claim.submitted", "Reklamasjon sendt inn", "Amalie Berg", daysAgo(14)),
      tl("c6", 2, "claim.decision_made", "Godkjent", "Ola Sandvik", daysAgo(12)),
      tl("c6", 3, "appointment.selected", "Tidspunkt valgt av beboer", "Amalie Berg", daysAgo(6)),
    ],
    created_at: daysAgo(14), updated_at: daysAgo(6),
  },
  {
    id: "c7", case_number: "RK-2024-0127", tenant_id: "t1", project_id: "p-middelthunet", building_id: "b-mid-b",
    unit_id: "unit-b402", room_type: "stue", component_id: null, resident_user_id: "u-thomas-h",
    title: "Stikkontakt løs i stue", description: "Dobbel stikkontakt ved TV-uttaket sitter løst i veggen og beveger seg når man setter inn eller trekker ut støpsler.",
    category: "Elektro", trade: "Elektriker", severity: "høy", status: "Sendt til underleverandør", source: "resident",
    legal_risk_level: "lav", deadline_risk_level: "middels",
    received_at: daysAgo(6), due_at: daysFromNow(8),
    assigned_developer_user_id: "u-ks", assigned_supplier_org_id: "org-elektrofix",
    decision: "approved", decision_reason: "Løs elektrisk installasjon utbedres umiddelbart av sikkerhetshensyn.",
    reopened: false, similar_case_ids: [], completeness_score: 90,
    evidence: [ev("c7", 1, "IMG_3310.jpg", "Løs stikkontakt ved TV-punkt", "Thomas Haug", daysAgo(6), true)],
    comments: [],
    timeline: [
      tl("c7", 1, "claim.submitted", "Reklamasjon sendt inn", "Thomas Haug", daysAgo(6)),
      tl("c7", 2, "claim.decision_made", "Godkjent", "Ola Sandvik", daysAgo(5)),
      tl("c7", 3, "claim.assigned_supplier", "Tildelt Elektrofix AS", "Ola Sandvik", daysAgo(5)),
    ],
    created_at: daysAgo(6), updated_at: daysAgo(5),
  },
  {
    id: "c8", case_number: "RK-2024-0108", tenant_id: "t1", project_id: "p-middelthunet", building_id: "b-mid-c",
    unit_id: "unit-c103", room_type: "annet", component_id: "comp-ventilasjon", resident_user_id: "u-lise",
    title: "Ventilasjon støyer", description: "Ventilasjonsanlegget lager en lavfrekvent brummelyd, spesielt om natten. Lyden kommer fra aggregatet i boden og er sjenerende på soverommet.",
    category: "Ventilasjon", trade: "Ventilasjon", severity: "middels", status: "Gjenåpnet", source: "resident",
    legal_risk_level: "middels", deadline_risk_level: "høy",
    received_at: daysAgo(34), due_at: daysFromNow(2),
    assigned_developer_user_id: "u-pl", assigned_supplier_org_id: "org-ventilasjon",
    decision: "approved", decision_reason: "Støy over grenseverdi målt ved befaring.",
    reopened: true, similar_case_ids: ["c8b"], completeness_score: 97,
    evidence: [
      ev("c8", 1, "lydmaling.pdf", "Lydmåling utført av Ventilasjon Norge", "Bjørn Aas", daysAgo(20)),
      ev("c8", 2, "IMG_5102.jpg", "Aggregat i bod", "Lise Frankum", daysAgo(34)),
    ],
    comments: [
      cm("c8", 1, "u-lise", "Lise Frankum", "beboer", "public", "Lyden er dessverre tilbake etter utbedringen. Den er like kraftig som før, særlig mellom kl. 23 og 06.", daysAgo(3)),
      cm("c8", 2, "u-pl", "Kari Nordheim", "utbygger_admin", "public", "Takk for beskjed, Lise. Vi har gjenåpnet saken og bedt Ventilasjon Norge om ny gjennomgang med lydmåling.", daysAgo(2)),
      cm("c8", 3, "u-pl", "Kari Nordheim", "utbygger_admin", "developer_internal", "Andre gjenåpning på ventilasjon i Bygg C. Be teknisk om å vurdere om det er et systemproblem med opphenget i sjakt.", daysAgo(2)),
    ],
    timeline: [
      tl("c8", 1, "claim.submitted", "Reklamasjon sendt inn", "Lise Frankum", daysAgo(34)),
      tl("c8", 2, "claim.decision_made", "Godkjent etter lydmåling", "Kari Nordheim", daysAgo(28)),
      tl("c8", 3, "completion_report.submitted", "Utbedring meldt ferdig", "Ventilasjon Norge AS", daysAgo(8)),
      tl("c8", 4, "claim.reopened", "Gjenåpnet av beboer – problemet består", "Lise Frankum", daysAgo(3)),
    ],
    created_at: daysAgo(34), updated_at: daysAgo(2),
  },
  {
    id: "c9", case_number: "RK-2024-0128", tenant_id: "t1", project_id: "p-markveien", building_id: "b-mark-a",
    unit_id: "unit-d0502", room_type: "stue", component_id: null, resident_user_id: "u-henrik",
    title: "Sprekk i listverk", description: "Taklisten i stuen har sprukket i skjøten i hjørnet mot sør. Sprekken er ca. 3 mm bred og har blitt større siden innflytting.",
    category: "Overflater", trade: "Tømrer", severity: "lav", status: "Trenger mer info", source: "resident",
    legal_risk_level: "lav", deadline_risk_level: "lav",
    received_at: daysAgo(8), due_at: daysFromNow(6),
    assigned_developer_user_id: "u-ks", assigned_supplier_org_id: null,
    decision: "more_info_needed", decision_reason: "Trenger bilde av hele veggen og info om innetemperatur/luftfuktighet.",
    reopened: false, similar_case_ids: [], completeness_score: 55,
    evidence: [ev("c9", 1, "IMG_0042.jpg", "Sprekk i taklist, hjørne sør", "Henrik Lund", daysAgo(8))],
    comments: [
      cm("c9", 1, "u-ks", "Ola Sandvik", "kundebehandler", "public", "Hei Henrik! Krymping i listverk første året er vanlig og dekkes normalt av ettårsbefaringen. Kan du sende et oversiktsbilde av hele veggen, så vurderer vi om dette bør tas nå?", daysAgo(6)),
    ],
    timeline: [
      tl("c9", 1, "claim.submitted", "Reklamasjon sendt inn", "Henrik Lund", daysAgo(8)),
      tl("c9", 2, "claim.status_changed", "Mer informasjon etterspurt", "Ola Sandvik", daysAgo(6)),
    ],
    created_at: daysAgo(8), updated_at: daysAgo(6),
  },
  {
    id: "c10", case_number: "RK-2024-0129", tenant_id: "t1", project_id: "p-markveien", building_id: "b-mark-a",
    unit_id: "unit-d0502", room_type: "soverom", component_id: null, resident_user_id: "u-henrik",
    title: "Fuktmerke ved vindu", description: "Det har oppstått et gulaktig fuktmerke i taket rett over vinduet på hovedsoverommet, ca. 15 x 10 cm. Merket vokste etter siste regnvær.",
    category: "Fukt", trade: "Tømrer", severity: "kritisk", status: "Befaring nødvendig", source: "resident",
    legal_risk_level: "høy", deadline_risk_level: "høy",
    received_at: daysAgo(3), due_at: daysFromNow(3),
    assigned_developer_user_id: "u-pl", assigned_supplier_org_id: null,
    decision: "inspection_needed", decision_reason: "Mistanke om lekkasje i beslag. Befaring med fuktmåling bestilt.",
    reopened: false, similar_case_ids: ["c3"], completeness_score: 89,
    evidence: [
      ev("c10", 1, "IMG_7755.jpg", "Fuktmerke i tak over vindu", "Henrik Lund", daysAgo(3), true),
      ev("c10", 2, "IMG_7756.jpg", "Nærbilde av merket", "Henrik Lund", daysAgo(3)),
    ],
    comments: [
      cm("c10", 1, "u-pl", "Kari Nordheim", "utbygger_admin", "public", "Hei Henrik. Dette tar vi på alvor. Vi har bestilt befaring med fuktmåling så raskt som mulig. Ikke mal over merket før vi har vært der.", daysAgo(2)),
      cm("c10", 2, "u-jur", "Ingrid Wold", "juridisk", "legal_internal", "Mulig lekkasje = potensielt følgeskadeansvar. Sørg for at befaringsrapport dokumenteres grundig i saken.", daysAgo(2)),
    ],
    timeline: [
      tl("c10", 1, "claim.submitted", "Reklamasjon sendt inn", "Henrik Lund", daysAgo(3)),
      tl("c10", 2, "claim.status_changed", "Befaring bestilt", "Kari Nordheim", daysAgo(2)),
    ],
    created_at: daysAgo(3), updated_at: daysAgo(2),
  },
  {
    id: "c11", case_number: "RK-2024-0130", tenant_id: "t1", project_id: "p-gronnseter", building_id: "b-gronn-a",
    unit_id: "unit-h0101", room_type: "soverom", component_id: null, resident_user_id: "u-sara",
    title: "Dørvrider løs på soverom", description: "Dørvrideren på soveromsdøren er løs og henger skjevt. Skruene ser ut til å ha løsnet.",
    category: "Dører og vinduer", trade: "Tømrer", severity: "lav", status: "Sendt inn", source: "resident",
    legal_risk_level: "lav", deadline_risk_level: "lav",
    received_at: daysAgo(1), due_at: daysFromNow(9),
    assigned_developer_user_id: null, assigned_supplier_org_id: null,
    decision: null, decision_reason: null,
    reopened: false, similar_case_ids: [], completeness_score: 68,
    evidence: [ev("c11", 1, "IMG_0301.jpg", "Løs dørvrider", "Sara Nguyen", daysAgo(1))],
    comments: [],
    timeline: [tl("c11", 1, "claim.submitted", "Reklamasjon sendt inn", "Sara Nguyen", daysAgo(1))],
    created_at: daysAgo(1), updated_at: daysAgo(1),
  },
  {
    id: "c12", case_number: "RK-2024-0119", tenant_id: "t1", project_id: "p-middelthunet", building_id: "b-mid-a",
    unit_id: "unit-a201", room_type: "entré", component_id: null, resident_user_id: "u-amalie",
    title: "Gulv knirker i entré", description: "Parkettgulvet i entreen knirker tydelig på to steder når man går over. Knirkingen har blitt verre de siste ukene.",
    category: "Overflater", trade: "Parkett", severity: "lav", status: "Klar for kontroll", source: "resident",
    legal_risk_level: "lav", deadline_risk_level: "lav",
    received_at: daysAgo(18), due_at: daysFromNow(10),
    assigned_developer_user_id: "u-ks", assigned_supplier_org_id: "org-parkett",
    decision: "approved", decision_reason: "Knirk skyldes manglende klaring mot terskel. Utbedres.",
    reopened: false, similar_case_ids: [], completeness_score: 86,
    evidence: [
      ev("c12", 1, "VID_0218.mp4", "Video med knirkelyd", "Amalie Berg", daysAgo(18)),
      ev("c12", 2, "IMG_etter_01.jpg", "Etter utbedring – justert klaring", "Eva Strand", daysAgo(1)),
    ],
    comments: [
      cm("c12", 1, "u-ks", "Ola Sandvik", "kundebehandler", "public", "Hei Amalie! Parkettmesteren har meldt arbeidet ferdig. Kan du bekrefte at knirkingen er borte?", daysAgo(1)),
    ],
    timeline: [
      tl("c12", 1, "claim.submitted", "Reklamasjon sendt inn", "Amalie Berg", daysAgo(18)),
      tl("c12", 2, "claim.decision_made", "Godkjent", "Ola Sandvik", daysAgo(16)),
      tl("c12", 3, "completion_report.submitted", "Utbedring meldt ferdig", "Parkettmesteren AS", daysAgo(1)),
    ],
    created_at: daysAgo(18), updated_at: daysAgo(1),
  },
  {
    id: "c13", case_number: "RK-2024-0103", tenant_id: "t1", project_id: "p-middelthunet", building_id: "b-mid-b",
    unit_id: "unit-b402", room_type: "kjøkken", component_id: "comp-kjokken", resident_user_id: "u-thomas-h",
    title: "Kjøkkenskap lukker skjevt", description: "Overskapet til venstre for ventilatoren lukker skjevt og står ca. 5 mm åpent i overkant. Hengslene ser ut til å trenge justering.",
    category: "Kjøkken", trade: "Kjøkken", severity: "lav", status: "Avvist", source: "resident",
    legal_risk_level: "lav", deadline_risk_level: "lav",
    received_at: daysAgo(40), due_at: daysAgo(26),
    assigned_developer_user_id: "u-ks", assigned_supplier_org_id: null,
    decision: "rejected", decision_reason: "Justering av hengsler er normalt vedlikehold som beboer selv utfører. Veiledning for justering finnes i FDV-dokumentet for kjøkkeninnredningen.",
    reopened: false, similar_case_ids: [], completeness_score: 79,
    evidence: [ev("c13", 1, "IMG_8841.jpg", "Skjevt overskap", "Thomas Haug", daysAgo(40))],
    comments: [
      cm("c13", 1, "u-ks", "Ola Sandvik", "kundebehandler", "public", "Hei Thomas. Hengseljustering regnes som ordinært vedlikehold og dekkes ikke av reklamasjonsretten. Vi har lagt ved FDV-veiledningen som viser hvordan du enkelt justerer hengslene selv. Ta kontakt om det ikke løser seg!", daysAgo(36)),
    ],
    timeline: [
      tl("c13", 1, "claim.submitted", "Reklamasjon sendt inn", "Thomas Haug", daysAgo(40)),
      tl("c13", 2, "claim.decision_made", "Avvist – ordinært vedlikehold", "Ola Sandvik", daysAgo(36)),
    ],
    created_at: daysAgo(40), updated_at: daysAgo(36),
  },
  {
    id: "c14", case_number: "RK-2024-0115", tenant_id: "t1", project_id: "p-middelthunet", building_id: "b-mid-c",
    unit_id: "unit-c103", room_type: "bad", component_id: null, resident_user_id: "u-lise",
    title: "Sluk lukter på bad", description: "Det lukter kloakk fra sluket på badet, spesielt om morgenen. Lukten forsvinner en stund etter at vi har skylt med vann, men kommer tilbake.",
    category: "Rør og sanitær", trade: "Rørlegger", severity: "middels", status: "Klar for kontroll", source: "resident",
    legal_risk_level: "lav", deadline_risk_level: "middels",
    received_at: daysAgo(16), due_at: daysFromNow(4),
    assigned_developer_user_id: "u-ks", assigned_supplier_org_id: "org-bareror",
    decision: "approved", decision_reason: "Mistanke om feil ved vannlås. Bare Rør kontrollerer og utbedrer.",
    reopened: false, similar_case_ids: [], completeness_score: 83,
    evidence: [
      ev("c14", 1, "IMG_2999.jpg", "Sluk på bad", "Lise Frankum", daysAgo(16)),
      ev("c14", 2, "IMG_etter_sluk.jpg", "Ny vannlås montert", "Martin Sletten", daysAgo(0, 9)),
    ],
    comments: [
      cm("c14", 1, "u-thomas-b", "Thomas Bakke", "leverandor_admin", "public", "Vi har byttet vannlåsen og kontrollert fallet på avløpet. Lukten skal nå være borte. Gi gjerne beskjed etter et par dager.", daysAgo(0, 9, 30)),
    ],
    timeline: [
      tl("c14", 1, "claim.submitted", "Reklamasjon sendt inn", "Lise Frankum", daysAgo(16)),
      tl("c14", 2, "claim.decision_made", "Godkjent", "Ola Sandvik", daysAgo(14)),
      tl("c14", 3, "appointment.selected", "Tidspunkt valgt av beboer", "Lise Frankum", daysAgo(9)),
      tl("c14", 4, "completion_report.submitted", "Utbedring meldt ferdig", "Bare Rør AS", daysAgo(0, 9, 25)),
    ],
    created_at: daysAgo(16), updated_at: daysAgo(0, 9, 30),
  },
  {
    id: "c15", case_number: "RK-2024-0092", tenant_id: "t1", project_id: "p-middelthunet", building_id: "b-mid-a",
    unit_id: "unit-a201", room_type: "bad", component_id: null, resident_user_id: "u-amalie",
    title: "Manglende silikonfuge ved dusjnisje", description: "Det mangler silikonfuge i overgangen mellom gulv og vegg inne i dusjnisjen, på ca. 40 cm. Vann blir stående i overgangen.",
    category: "Overflater", trade: "Flislegger", severity: "middels", status: "Arkivert", source: "handover",
    legal_risk_level: "lav", deadline_risk_level: "lav",
    received_at: daysAgo(60), due_at: daysAgo(46),
    assigned_developer_user_id: "u-ks", assigned_supplier_org_id: "org-flispartner",
    decision: "approved", decision_reason: "Manglende fuge i våtsone. Utbedret.",
    reopened: false, similar_case_ids: ["c1", "c5"], completeness_score: 100,
    evidence: [
      ev("c15", 1, "IMG_0123.jpg", "Manglende fuge i dusjnisje", "Amalie Berg", daysAgo(60)),
      ev("c15", 2, "IMG_etter_fuge.jpg", "Ny silikonfuge", "Samir Aydin", daysAgo(48)),
    ],
    comments: [
      cm("c15", 1, "u-amalie", "Amalie Berg", "beboer", "public", "Bekrefter at fugen er på plass og ser fin ut. Takk for rask hjelp!", daysAgo(46)),
    ],
    timeline: [
      tl("c15", 1, "claim.submitted", "Funnet ved overtakelse, overført til reklamasjon", "Kari Nordheim", daysAgo(60)),
      tl("c15", 2, "claim.decision_made", "Godkjent", "Ola Sandvik", daysAgo(58)),
      tl("c15", 3, "completion_report.submitted", "Utbedring meldt ferdig", "Flispartner Oslo AS", daysAgo(48)),
      tl("c15", 4, "resident.confirmed_completion", "Bekreftet av beboer", "Amalie Berg", daysAgo(46)),
      tl("c15", 5, "claim.archived", "Sak arkivert med komplett historikk", "Ola Sandvik", daysAgo(45)),
    ],
    created_at: daysAgo(60), updated_at: daysAgo(45),
  },
];

/* --------------------------- arbeidsordre --------------------------- */

export const WORK_ORDERS: WorkOrder[] = [
  { id: "wo1", wo_number: "AO-2024-088", tenant_id: "t1", claim_id: "c1", supplier_org_id: "org-flispartner", assigned_technician_user_id: null, title: "Bytte sprukket flis – bad C103", description: "Bytte én sprukket veggflis ved dusjnisje. Flis fra samme parti finnes på lager. Inkluderer fuging.", status: "Tidspunkt foreslått", priority: "normal", scheduled_start: null, scheduled_end: null, estimated_hours: 2, created_at: daysAgo(7) },
  { id: "wo2", wo_number: "AO-2024-082", tenant_id: "t1", claim_id: "c2", supplier_org_id: "org-flispartner", assigned_technician_user_id: null, title: "Omlegging gulvflis – bad B402", description: "Legge om 4–5 fliser med bom foran servant. Avretting ved behov.", status: "Pågår", priority: "normal", scheduled_start: daysAgo(1, 8), scheduled_end: daysFromNow(1, 16), estimated_hours: 8, created_at: daysAgo(14) },
  { id: "wo3", wo_number: "AO-2024-090", tenant_id: "t1", claim_id: "c6", supplier_org_id: "org-bareror", assigned_technician_user_id: "u-tekniker2", title: "Kontroll vanntrykk – bad A201", description: "Kontrollere reduksjonsventil og filter i blandebatteri. Måle trykk ved tappested.", status: "Planlagt", priority: "normal", scheduled_start: daysFromNow(2, 8), scheduled_end: daysFromNow(2, 10), estimated_hours: 2, created_at: daysAgo(12) },
  { id: "wo4", wo_number: "AO-2024-093", tenant_id: "t1", claim_id: "c7", supplier_org_id: "org-elektrofix", assigned_technician_user_id: "u-tekniker", title: "Feste løs stikkontakt – stue B402", description: "Refeste veggboks og kontrollere tilkobling på dobbel stikkontakt ved TV-punkt.", status: "Ny", priority: "høy", scheduled_start: null, scheduled_end: null, estimated_hours: 1, created_at: daysAgo(5) },
  { id: "wo5", wo_number: "AO-2024-079", tenant_id: "t1", claim_id: "c8", supplier_org_id: "org-ventilasjon", assigned_technician_user_id: null, title: "Ny feilsøking støy ventilasjon – C103", description: "Gjenåpnet sak. Ny lydmåling og kontroll av oppheng/vibrasjon i aggregat og kanaler.", status: "Akseptert", priority: "høy", scheduled_start: null, scheduled_end: null, estimated_hours: 4, created_at: daysAgo(2) },
  { id: "wo6", wo_number: "AO-2024-085", tenant_id: "t1", claim_id: "c12", supplier_org_id: "org-parkett", assigned_technician_user_id: null, title: "Utbedre knirk i entré – A201", description: "Justere klaring mot terskel og feste gulv ved to punkter.", status: "Ferdigstilt", priority: "lav", scheduled_start: daysAgo(1, 8), scheduled_end: daysAgo(1, 11), estimated_hours: 3, created_at: daysAgo(15) },
  { id: "wo7", wo_number: "AO-2024-081", tenant_id: "t1", claim_id: "c14", supplier_org_id: "org-bareror", assigned_technician_user_id: "u-tekniker2", title: "Bytte vannlås sluk – bad C103", description: "Bytte vannlås og kontrollere fall på avløp.", status: "Ferdigstilt", priority: "normal", scheduled_start: daysAgo(0, 8), scheduled_end: daysAgo(0, 10), estimated_hours: 2, created_at: daysAgo(13) },
];

export const APPOINTMENT_SLOTS: AppointmentSlot[] = [
  { id: "slot1", tenant_id: "t1", work_order_id: "wo1", start_at: daysFromNow(2, 8), end_at: daysFromNow(2, 10), status: "proposed" },
  { id: "slot2", tenant_id: "t1", work_order_id: "wo1", start_at: daysFromNow(3, 12), end_at: daysFromNow(3, 14), status: "proposed" },
  { id: "slot3", tenant_id: "t1", work_order_id: "wo1", start_at: daysFromNow(4, 15), end_at: daysFromNow(4, 17), status: "proposed" },
];

export const APPOINTMENTS: Appointment[] = [
  { id: "ap1", tenant_id: "t1", work_order_id: "wo3", claim_id: "c6", resident_user_id: "u-amalie", supplier_org_id: "org-bareror", technician_user_id: "u-tekniker2", start_at: daysFromNow(2, 8), end_at: daysFromNow(2, 10), status: "bekreftet", location: "Middelthuns gate 17A, leil. A201", notes: "Ring på dørtelefon. Beboer er hjemme." },
  { id: "ap2", tenant_id: "t1", work_order_id: "wo2", claim_id: "c2", resident_user_id: "u-thomas-h", supplier_org_id: "org-flispartner", technician_user_id: null, start_at: daysAgo(1, 8), end_at: daysFromNow(1, 16), status: "bekreftet", location: "Middelthuns gate 17B, leil. B402", notes: "Nøkkel hos vaktmester etter avtale." },
];

export const COMPLETION_REPORTS: CompletionReport[] = [
  { id: "cr1", tenant_id: "t1", work_order_id: "wo6", claim_id: "c12", completed_by: "Eva Strand", completed_at: daysAgo(1, 11), work_summary: "Justert klaring mot terskel og festet gulvbord ved to punkter med skjult skruing. Knirk eliminert ved test.", materials: "Parkettskruer, avstandskiler", hours: 2.5, before_photos: 1, after_photos: 2, resident_confirmation_status: "pending" },
  { id: "cr2", tenant_id: "t1", work_order_id: "wo7", claim_id: "c14", completed_by: "Martin Sletten", completed_at: daysAgo(0, 10), work_summary: "Byttet vannlås i sluk og kontrollert fall på avløpsrør. Testet med vann – ingen lukt etter utbedring.", materials: "Vannlås 75mm, pakninger", hours: 1.5, before_photos: 1, after_photos: 1, resident_confirmation_status: "pending" },
];

/* ----------------------------- dokumenter ----------------------------- */

export const DOCUMENTS: FDVDocument[] = [
  { id: "d1", tenant_id: "t1", project_id: "p-middelthunet", unit_id: "unit-c103", room_type: null, component_id: null, title: "Overtakelsesprotokoll C103", description: "Signert protokoll fra overtakelse med målerstand og nøkkelkvittering.", category: "Overtakelse", file_type: "pdf", version: "1.0", uploaded_by: "Kari Nordheim", visibility: "resident", size_kb: 842, created_at: daysAgo(145) },
  { id: "d2", tenant_id: "t1", project_id: "p-middelthunet", unit_id: null, room_type: "bad", component_id: "comp-flis-bad", title: "FDV – Veggflis bad (Marazzi Treverk)", description: "Drift- og vedlikeholdsveiledning for veggflis, inkl. rengjøringsmidler og fugevedlikehold.", category: "FDV", file_type: "pdf", version: "2.1", uploaded_by: "Flispartner Oslo AS", visibility: "resident", size_kb: 1240, created_at: daysAgo(150) },
  { id: "d3", tenant_id: "t1", project_id: "p-middelthunet", unit_id: null, room_type: "stue", component_id: "comp-parkett-stue", title: "FDV – Eikeparkett (Boen Andante)", description: "Vedlikehold, luftfuktighet og reparasjon av lakkert eikeparkett.", category: "FDV", file_type: "pdf", version: "1.3", uploaded_by: "Parkettmesteren AS", visibility: "resident", size_kb: 980, created_at: daysAgo(150) },
  { id: "d4", tenant_id: "t1", project_id: "p-middelthunet", unit_id: null, room_type: "kjøkken", component_id: "comp-kjokken", title: "FDV – HTH kjøkkeninnredning", description: "Justering av hengsler, vedlikehold av fronter og benkeplate.", category: "FDV", file_type: "pdf", version: "1.0", uploaded_by: "HTH Kjøkkenpartner AS", visibility: "resident", size_kb: 2100, created_at: daysAgo(148) },
  { id: "d5", tenant_id: "t1", project_id: "p-middelthunet", unit_id: null, room_type: null, component_id: "comp-ventilasjon", title: "FDV – Balansert ventilasjon (Flexit Nordic S3)", description: "Filterbytte, service og innstilling av ventilasjonsaggregat.", category: "FDV", file_type: "pdf", version: "1.2", uploaded_by: "Ventilasjon Norge AS", visibility: "resident", size_kb: 3400, created_at: daysAgo(147) },
  { id: "d6", tenant_id: "t1", project_id: "p-middelthunet", unit_id: "unit-c103", room_type: null, component_id: null, title: "Plantegning C103", description: "Målsatt plantegning 1:50.", category: "Tegninger", file_type: "pdf", version: "C", uploaded_by: "Kari Nordheim", visibility: "resident", size_kb: 1560, created_at: daysAgo(160) },
  { id: "d7", tenant_id: "t1", project_id: "p-middelthunet", unit_id: null, room_type: null, component_id: null, title: "Garantibevis – Hvitevarer (Siemens)", description: "5 års garanti på integrerte hvitevarer levert i prosjektet.", category: "Garantier", file_type: "pdf", version: "1.0", uploaded_by: "Kari Nordheim", visibility: "resident", size_kb: 320, created_at: daysAgo(140) },
  { id: "d8", tenant_id: "t1", project_id: "p-middelthunet", unit_id: null, room_type: null, component_id: null, title: "Husordensregler Sameiet Middelthunet", description: "Vedtatt på konstituerende årsmøte.", category: "Sameie", file_type: "pdf", version: "1.0", uploaded_by: "Styret Middelthunet", visibility: "board", size_kb: 210, created_at: daysAgo(100) },
  { id: "d9", tenant_id: "t1", project_id: "p-middelthunet", unit_id: null, room_type: null, component_id: null, title: "Driftsavtale heis – internt", description: "Serviceavtale med Otis, gjelder Bygg A–C.", category: "FDV", file_type: "pdf", version: "1.0", uploaded_by: "Kari Nordheim", visibility: "internal", size_kb: 480, created_at: daysAgo(90) },
  { id: "d10", tenant_id: "t1", project_id: "p-markveien", unit_id: "unit-d0502", room_type: null, component_id: null, title: "Overtakelsesprotokoll D0502", description: "Signert protokoll med to anmerkninger overført til reklamasjon.", category: "Overtakelse", file_type: "pdf", version: "1.0", uploaded_by: "Kari Nordheim", visibility: "resident", size_kb: 770, created_at: daysAgo(35) },
  { id: "d11", tenant_id: "t1", project_id: "p-middelthunet", unit_id: "unit-c103", room_type: null, component_id: null, title: "Tilvalgsbekreftelse C103", description: "Bekreftet tilvalgsbestilling med spesifikasjon.", category: "Tilvalg", file_type: "pdf", version: "1.0", uploaded_by: "Kari Nordheim", visibility: "resident", size_kb: 450, created_at: daysAgo(200) },
  { id: "d12", tenant_id: "t1", project_id: "p-gronnseter", unit_id: null, room_type: "bad", component_id: null, title: "FDV – Baderomsinnredning (Vikingbad)", description: "Vedlikehold av servantskap og speilskap.", category: "FDV", file_type: "pdf", version: "1.0", uploaded_by: "Kari Nordheim", visibility: "resident", size_kb: 890, created_at: daysAgo(14) },
];

/* ------------------------------ tilvalg ------------------------------ */

export const TILVALG_OPTIONS: TilvalgOption[] = [
  { id: "tv1", tenant_id: "t1", project_id: "p-fjordhagen", category: "Fliser", room_type: "bad", title: "Grå veggfliser 30x60", description: "Matt grå storformatflis fra Marazzi. Tidløs og lys.", price: 0, price_type: "fixed", supplier_org_id: "org-flispartner", deadline: daysFromNow(45), status: "published" },
  { id: "tv2", tenant_id: "t1", project_id: "p-fjordhagen", category: "Fliser", room_type: "bad", title: "Mørke veggfliser 30x60", description: "Antrasittgrå flis med svak tekstur. Gir dybde og kontrast.", price: 14500, price_type: "fixed", supplier_org_id: "org-flispartner", deadline: daysFromNow(45), status: "published" },
  { id: "tv3", tenant_id: "t1", project_id: "p-fjordhagen", category: "Fliser", room_type: "bad", title: "Grønne veggfliser 7,5x30", description: "Håndlagde, sjøgrønne fliser i halvforband. Premium uttrykk.", price: 24900, price_type: "fixed", supplier_org_id: "org-flispartner", deadline: daysFromNow(45), status: "published" },
  { id: "tv4", tenant_id: "t1", project_id: "p-fjordhagen", category: "Gulv", room_type: "stue", title: "Lys eikeparkett", description: "Boen Andante hvitpigmentert mattlakk, 3-stav. Standard.", price: 0, price_type: "fixed", supplier_org_id: "org-parkett", deadline: daysFromNow(60), status: "published" },
  { id: "tv5", tenant_id: "t1", project_id: "p-fjordhagen", category: "Gulv", room_type: "stue", title: "Mørk eikeparkett", description: "Røkt eik, børstet og oljet, 1-stav plank.", price: 490, price_type: "per_m2", supplier_org_id: "org-parkett", deadline: daysFromNow(60), status: "published" },
  { id: "tv6", tenant_id: "t1", project_id: "p-fjordhagen", category: "Kjøkken", room_type: "kjøkken", title: "Hvit HTH kjøkkenfront", description: "HTH VH-7 grepsfri hvit matt front med push-open.", price: 18900, price_type: "fixed", supplier_org_id: "org-hth", deadline: daysFromNow(30), status: "published" },
  { id: "tv7", tenant_id: "t1", project_id: "p-fjordhagen", category: "Kjøkken", room_type: "kjøkken", title: "Integrert belysning kjøkken", description: "LED-list under overskap med dimmer.", price: 7400, price_type: "fixed", supplier_org_id: "org-elektrofix", deadline: daysFromNow(30), status: "published" },
  { id: "tv8", tenant_id: "t1", project_id: "p-fjordhagen", category: "Elektro", room_type: "entré", title: "Ekstra stikkontakt", description: "Dobbel stikkontakt, plassering etter avtale.", price: 1850, price_type: "per_unit", supplier_org_id: "org-elektrofix", deadline: daysFromNow(30), status: "published" },
  { id: "tv9", tenant_id: "t1", project_id: "p-fjordhagen", category: "Garderobe", room_type: "soverom", title: "Garderobeskap", description: "Skreddersydd garderobe med skyvedører, per løpemeter.", price: 8900, price_type: "per_unit", supplier_org_id: null, deadline: daysFromNow(60), status: "published" },
];

export const TILVALG_ORDERS: TilvalgOrder[] = [
  {
    id: "to1", tenant_id: "t1", project_id: "p-fjordhagen", unit_id: "unit-c103", resident_user_id: "u-lise",
    status: "Godkjent",
    items: [
      { option_id: "tv2", title: "Mørke veggfliser 30x60", quantity: 1, unit_price: 14500, total: 14500 },
      { option_id: "tv7", title: "Integrert belysning kjøkken", quantity: 1, unit_price: 7400, total: 7400 },
    ],
    subtotal: 21900, vat: 5475, total: 27375, submitted_at: daysAgo(80),
  },
];

/* ---------------------------- markedsplass ---------------------------- */

export const MARKETPLACE_SERVICES: MarketplaceService[] = [
  { id: "ms1", tenant_id: "t1", partner_name: "Elektrofix AS", category: "Elektriker", title: "Montering av lamper og spotter", description: "Sertifisert elektriker monterer taklamper, spotter og dimmere. Fastpris per punkt.", price_type: "fastpris", starting_price: 890, rating: 4.8, partner_label: true, status: "active" },
  { id: "ms2", tenant_id: "t1", partner_name: "Oslo Renhold & Miljø", category: "Renhold", title: "Flyttevask og hovedrengjøring", description: "Grundig rengjøring med garanti. Tilpasset nye boliger.", price_type: "tilbud", starting_price: 2900, rating: 4.6, partner_label: true, status: "active" },
  { id: "ms3", tenant_id: "t1", partner_name: "Bare Rør AS", category: "Rørlegger", title: "Montering av oppvaskmaskin", description: "Tilkobling av oppvaskmaskin med lekkasjesikring.", price_type: "fastpris", starting_price: 1490, rating: 4.7, partner_label: true, status: "active" },
  { id: "ms4", tenant_id: "t1", partner_name: "Trygg Forsikring", category: "Forsikring", title: "Innboforsikring nybygg", description: "Skreddersydd innboforsikring for nye boliger, 15 % rabatt første år.", price_type: "tilbud", starting_price: 189, rating: 4.3, partner_label: true, status: "active" },
  { id: "ms5", tenant_id: "t1", partner_name: "Fiber Norge", category: "Internett", title: "Fiber 1000/1000 Mbps", description: "Lynraskt fibernett. Gratis etablering for beboere i Middelthunet.", price_type: "fastpris", starting_price: 549, rating: 4.2, partner_label: true, status: "active" },
  { id: "ms6", tenant_id: "t1", partner_name: "Småjobber AS", category: "Småjobber", title: "Montering av møbler og hyller", description: "Erfarne montører, timepris. Minimum 2 timer.", price_type: "timepris", starting_price: 690, rating: 4.5, partner_label: true, status: "active" },
  { id: "ms7", tenant_id: "t1", partner_name: "Flyttehjelpen Oslo", category: "Flyttehjelp", title: "Flytting med bil og to mann", description: "Profesjonell flyttehjelp med forsikring. Timepris inkl. bil.", price_type: "timepris", starting_price: 1190, rating: 4.4, partner_label: true, status: "active" },
  { id: "ms8", tenant_id: "t1", partner_name: "Solskjerming Norge", category: "Solskjerming", title: "Screens og persienner", description: "Måltilpasset solskjerming med motorstyring. Gratis befaring.", price_type: "tilbud", starting_price: 4900, rating: 4.6, partner_label: true, status: "active" },
  { id: "ms9", tenant_id: "t1", partner_name: "Sikker Lås AS", category: "Lås og adgang", title: "Ekstra nøkler og digital dørlås", description: "Systemnøkler og montering av digital dørlås kompatibel med byggets system.", price_type: "fastpris", starting_price: 2490, rating: 4.7, partner_label: true, status: "active" },
  { id: "ms10", tenant_id: "t1", partner_name: "Malermester Vik", category: "Maling", title: "Maling av aksentvegg", description: "Profesjonell maler, inkl. materialer i valgfri farge.", price_type: "fastpris", starting_price: 3900, rating: 4.8, partner_label: true, status: "active" },
];

export const MARKETPLACE_ORDERS: MarketplaceOrder[] = [
  { id: "mo1", tenant_id: "t1", service_id: "ms1", service_title: "Montering av lamper og spotter", resident_user_id: "u-lise", unit_id: "unit-c103", status: "Utført", requested_at: daysAgo(30), preferred_time: "Ettermiddag etter kl. 16", note: "3 taklamper i stue og soverom.", price_estimate: 2670, commission_amount: 267 },
  { id: "mo2", tenant_id: "t1", service_id: "ms8", service_title: "Screens og persienner", resident_user_id: "u-thomas-h", unit_id: "unit-b402", status: "Tilbud mottatt", requested_at: daysAgo(5), preferred_time: "Formiddag", note: "Screens til 3 vinduer mot sør.", price_estimate: 18400, commission_amount: null },
];

/* --------------------------- varsler --------------------------- */

export const NOTIFICATIONS: AppNotification[] = [
  { id: "n1", tenant_id: "t1", user_role: "utbygger", type: "claim.submitted", channel: "in_app", title: "Ny reklamasjon mottatt", body: "Ny reklamasjon mottatt fra Sara Nguyen: «Dørvrider løs på soverom» (H0101, Grønnseter 13).", entity_type: "claim", entity_id: "c11", read: false, created_at: daysAgo(1) },
  { id: "n2", tenant_id: "t1", user_role: "beboer", type: "appointment.proposed", channel: "in_app", title: "Tidspunkter foreslått", body: "Flispartner Oslo AS har foreslått tre tidspunkter for «Sprukket flis på bad». Velg det som passer best.", entity_type: "claim", entity_id: "c1", read: false, created_at: daysAgo(3) },
  { id: "n3", tenant_id: "t1", user_role: "utbygger", type: "claim.reopened", body: "Lise Frankum har gjenåpnet saken «Ventilasjon støyer». Problemet består etter utbedring.", channel: "in_app", title: "Sak gjenåpnet", entity_type: "claim", entity_id: "c8", read: false, created_at: daysAgo(3) },
  { id: "n4", tenant_id: "t1", user_role: "utbygger", type: "deadline.warning", channel: "in_app", title: "Fristvarsel", body: "3 saker nærmer seg intern frist: RK-2024-0121, RK-2024-0108 og RK-2024-0129.", entity_type: null, entity_id: null, read: false, created_at: daysAgo(0, 7) },
  { id: "n5", tenant_id: "t1", user_role: "beboer", type: "completion.confirm", channel: "in_app", title: "Utbedring meldt ferdig", body: "Bare Rør AS har meldt «Sluk lukter på bad» som utbedret. Bekreft at alt er i orden.", entity_type: "claim", entity_id: "c14", read: false, created_at: daysAgo(0, 10) },
  { id: "n6", tenant_id: "t1", user_role: "leverandor", type: "work_order.created", channel: "in_app", title: "Ny arbeidsordre", body: "Ny arbeidsordre AO-2024-093: «Feste løs stikkontakt – stue B402». Prioritet: høy.", entity_type: "work_order", entity_id: "wo4", read: false, created_at: daysAgo(5) },
  { id: "n7", tenant_id: "t1", user_role: "beboer", type: "document.uploaded", channel: "in_app", title: "Nytt dokument", body: "Nytt FDV-dokument er lastet opp: «FDV – Baderomsinnredning (Vikingbad)».", entity_type: "document", entity_id: "d12", read: true, created_at: daysAgo(14) },
  { id: "n8", tenant_id: "t1", user_role: "utbygger", type: "tilvalg.deadline", channel: "in_app", title: "Tilvalgsfrist nærmer seg", body: "Tilvalgsfrist for kjøkken i Fjordhagen utløper om 30 dager. 41 av 64 enheter har bestilt.", entity_type: null, entity_id: null, read: true, created_at: daysAgo(2) },
  { id: "n9", tenant_id: "t1", user_role: "admin", type: "support.access", channel: "in_app", title: "Supporttilgang brukt", body: "Supporttilgang ble brukt av TvellerOS (Mats Tveller) hos Nordheim Bolig AS. Årsak: Feilsøking av varsler.", entity_type: null, entity_id: null, read: true, created_at: daysAgo(6) },
  { id: "n10", tenant_id: "t1", user_role: "leverandor", type: "appointment.selected", channel: "in_app", title: "Tidspunkt valgt", body: "Amalie Berg har valgt tidspunkt for «Kontroll vanntrykk – bad A201».", entity_type: "work_order", entity_id: "wo3", read: true, created_at: daysAgo(6) },
];

/* ----------------------------- audit log ----------------------------- */

export const AUDIT_EVENTS: AuditEvent[] = [
  { id: "ae1", tenant_id: "t1", actor: "Sara Nguyen", action: "claim.submitted", entity_type: "claim", entity_id: "RK-2024-0130", metadata: "Kanal: app, enhet: H0101", sensitive: false, created_at: daysAgo(1) },
  { id: "ae2", tenant_id: "t1", actor: "Lise Frankum", action: "claim.reopened", entity_type: "claim", entity_id: "RK-2024-0108", metadata: "Begrunnelse: Problemet består", sensitive: false, created_at: daysAgo(3) },
  { id: "ae3", tenant_id: "t1", actor: "Ola Sandvik", action: "claim.decision_made", entity_type: "claim", entity_id: "RK-2024-0118", metadata: "Beslutning: Godkjent", sensitive: false, created_at: daysAgo(7) },
  { id: "ae4", tenant_id: "t1", actor: "Ola Sandvik", action: "claim.assigned_supplier", entity_type: "claim", entity_id: "RK-2024-0118", metadata: "Leverandør: Flispartner Oslo AS", sensitive: false, created_at: daysAgo(7) },
  { id: "ae5", tenant_id: "t0", actor: "Mats Tveller", action: "support.impersonation_started", entity_type: "tenant", entity_id: "Nordheim Bolig AS", metadata: "Årsak: Feilsøking av varsler. Varighet: 60 min. Modus: kun lesetilgang.", sensitive: true, created_at: daysAgo(6) },
  { id: "ae6", tenant_id: "t1", actor: "Kari Nordheim", action: "document.uploaded", entity_type: "document", entity_id: "FDV – Baderomsinnredning (Vikingbad)", metadata: "Synlighet: beboer", sensitive: false, created_at: daysAgo(14) },
  { id: "ae7", tenant_id: "t1", actor: "Kari Nordheim", action: "claim.escalated", entity_type: "claim", entity_id: "RK-2024-0121", metadata: "Årsak: Manglende respons fra leverandør", sensitive: false, created_at: daysAgo(4) },
  { id: "ae8", tenant_id: "t1", actor: "Lise Frankum", action: "gdpr.export_requested", entity_type: "data_request", entity_id: "DR-2024-007", metadata: "Type: dataeksport", sensitive: true, created_at: daysAgo(12) },
  { id: "ae9", tenant_id: "t1", actor: "Ingrid Wold", action: "claim.internal_note_added", entity_type: "claim", entity_id: "RK-2024-0129", metadata: "Synlighet: kun juridisk", sensitive: false, created_at: daysAgo(2) },
  { id: "ae10", tenant_id: "t0", actor: "System", action: "billing.subscription_updated", entity_type: "subscription", entity_id: "Urban Eiendom AS", metadata: "Plan: Enterprise, status: active", sensitive: false, created_at: daysAgo(9) },
];

/* ------------------------------- GDPR ------------------------------- */

export const GDPR_REQUESTS: GDPRRequest[] = [
  { id: "gr1", tenant_id: "t1", user_name: "Lise Frankum", type: "export", status: "Fullført", requested_at: daysAgo(12), completed_at: daysAgo(10), handled_by: "Kari Nordheim" },
  { id: "gr2", tenant_id: "t1", user_name: "Tidligere beboer (B205)", type: "deletion", status: "Under behandling", requested_at: daysAgo(4), completed_at: null, handled_by: "Ingrid Wold" },
];

/* --------------------------- feature flags --------------------------- */

export const FEATURE_FLAGS: FeatureFlagState[] = [
  { key: "ai_triage", label: "AI-triage", description: "AI-forslag til kategori, fag og alvorlighetsgrad ved ny sak.", enabled: true, plan_required: "pro" },
  { key: "ai_drafting", label: "AI-meldingsutkast", description: "Foreslå svar til beboer basert på sakshistorikk.", enabled: true, plan_required: "pro" },
  { key: "marketplace", label: "Markedsplass", description: "Tjenestemarkedsplass for beboere med partnere.", enabled: true, plan_required: "pro" },
  { key: "sameie", label: "Sameie-modul", description: "Fellesarealer, styredokumenter og kunngjøringer.", enabled: true, plan_required: "pro" },
  { key: "tilvalg", label: "Tilvalg", description: "Tilvalgskatalog og bestillingsflyt for beboere.", enabled: true, plan_required: "pro" },
  { key: "handover", label: "Overtakelse", description: "Digital overtakelsesprotokoll med signering.", enabled: true, plan_required: "pro" },
  { key: "advanced_analytics", label: "Avansert analyse", description: "Porteføljebenchmark og rotårsaksanalyse.", enabled: true, plan_required: "portfolio" },
  { key: "white_label", label: "White-label", description: "Egen merkevare i beboerportal og e-post.", enabled: false, plan_required: "enterprise" },
  { key: "api_access", label: "API-tilgang", description: "REST API og webhooks for integrasjoner.", enabled: false, plan_required: "enterprise" },
  { key: "bankid", label: "BankID/Vipps-verifisering", description: "Sterk identitetsverifisering ved invitasjon og signering.", enabled: false, plan_required: "enterprise" },
  { key: "route_optimization", label: "Ruteoptimalisering", description: "Optimaliser teknikerruter for underleverandører.", enabled: false, plan_required: "enterprise" },
  { key: "legal_archive", label: "Juridisk arkivpakke", description: "Komplett eksport av saksdokumentasjon for jurist/forsikring.", enabled: true, plan_required: "pro" },
  { key: "realtime_chat", label: "Sanntidschat", description: "Sanntidsmeldinger mellom parter.", enabled: false, plan_required: "enterprise" },
  { key: "mobile_push", label: "Mobil push", description: "Push-varsler i mobilapp.", enabled: false, plan_required: "pro" },
];

/* ------------------------------ billing ------------------------------ */

export const BILLING_PLANS: BillingPlan[] = [
  { id: "plan-starter", name: "Starter", slug: "starter", monthly_base_price: 4900, unit_price: 29, included_units: 50, included_ai_credits: 0, included_sms: 0, description: "For små prosjekter som vil i gang med digital reklamasjon.", features: ["Grunnleggende reklamasjon", "FDV-arkiv", "Enkel kalender", "E-postvarsler", "Inntil 50 enheter inkludert"] },
  { id: "plan-pro", name: "Pro", slug: "pro", monthly_base_price: 14900, unit_price: 49, included_units: 200, included_ai_credits: 500, included_sms: 1000, description: "Full ettermarkedsflyt med AI, SMS og leverandørportal.", features: ["Full reklamasjonsflyt", "Underleverandørportal", "AI-triage", "Analyse og innsikt", "SMS-varsler", "Tilvalg og markedsplass"] },
  { id: "plan-enterprise", name: "Enterprise", slug: "enterprise", monthly_base_price: 39900, unit_price: 39, included_units: 1000, included_ai_credits: 2000, included_sms: 5000, description: "For store utbyggere med krav til merkevare, sikkerhet og SLA.", features: ["White-label", "Avansert GDPR", "SLA og prioritert support", "API og webhooks", "BankID/Vipps", "Egendefinerte roller"] },
  { id: "plan-portfolio", name: "Portfolio", slug: "portfolio", monthly_base_price: 69900, unit_price: 29, included_units: 5000, included_ai_credits: 10000, included_sms: 20000, description: "Porteføljestyring på tvers av selskaper og prosjekter.", features: ["Porteføljebenchmark", "Avansert analyse", "Leverandørintelligens", "Multi-org", "Dedikert suksessansvarlig", "Dataeksport/API"] },
];

export const INVOICES: Invoice[] = [
  { id: "inv1", tenant_id: "t1", number: "F-2024-1182", amount: 24900, status: "paid", period: "Mai 2026", due_date: daysAgo(28) },
  { id: "inv2", tenant_id: "t1", number: "F-2024-1243", amount: 26350, status: "open", period: "Juni 2026", due_date: daysFromNow(14) },
  { id: "inv3", tenant_id: "t2", number: "F-2024-1244", amount: 58500, status: "paid", period: "Juni 2026", due_date: daysAgo(2) },
  { id: "inv4", tenant_id: "t1", number: "F-2024-1121", amount: 24900, status: "paid", period: "April 2026", due_date: daysAgo(58) },
];

export const USAGE_METRICS: UsageMetric[] = [
  { tenant_id: "t1", type: "sms", used: 642, included: 1000, unit: "SMS" },
  { tenant_id: "t1", type: "ai", used: 318, included: 500, unit: "AI-kreditter" },
  { tenant_id: "t1", type: "email", used: 2840, included: 10000, unit: "e-poster" },
  { tenant_id: "t1", type: "storage", used: 38, included: 100, unit: "GB" },
  { tenant_id: "t1", type: "bankid", used: 0, included: 0, unit: "verifiseringer" },
];

/* ---------------------------- integrasjoner ---------------------------- */

export const INTEGRATIONS: IntegrationState[] = [
  { id: "int1", provider: "Supabase / Postgres", category: "Database", status: "mock", description: "Database, autentisering, lagring og realtime.", last_sync_at: null, env_keys: ["DATABASE_URL", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] },
  { id: "int2", provider: "Stripe", category: "Betaling", status: "mock", description: "Abonnement, fakturering og bruksbasert prising.", last_sync_at: null, env_keys: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"] },
  { id: "int3", provider: "Link Mobility", category: "SMS", status: "mock", description: "SMS-varsler og invitasjoner.", last_sync_at: null, env_keys: ["SMS_PROVIDER", "LINK_MOBILITY_API_KEY"] },
  { id: "int4", provider: "Resend", category: "E-post", status: "mock", description: "Transaksjonell e-post.", last_sync_at: null, env_keys: ["EMAIL_PROVIDER", "RESEND_API_KEY"] },
  { id: "int5", provider: "OpenAI", category: "AI", status: "mock", description: "AI-triage, oppsummeringer og beslutningsstøtte.", last_sync_at: null, env_keys: ["AI_PROVIDER", "OPENAI_API_KEY"] },
  { id: "int6", provider: "BankID / Vipps", category: "Identitet", status: "not_connected", description: "Sterk identitetsverifisering og signering.", last_sync_at: null, env_keys: ["BANKID_CLIENT_ID", "VIPPS_CLIENT_ID"] },
  { id: "int7", provider: "AWS S3", category: "Fillagring", status: "mock", description: "Dokumenter, bilder og vedlegg.", last_sync_at: null, env_keys: ["S3_ACCESS_KEY_ID", "S3_BUCKET"] },
  { id: "int8", provider: "Tripletex", category: "Økonomi", status: "not_connected", description: "Fakturagrunnlag og prosjektregnskap.", last_sync_at: null, env_keys: ["TRIPLETEX_CLIENT_ID"] },
  { id: "int9", provider: "Google Maps", category: "Kart", status: "not_connected", description: "Ruteplanlegging for teknikere.", last_sync_at: null, env_keys: ["MAPS_API_KEY"] },
  { id: "int10", provider: "Slack / Teams", category: "Varsling", status: "not_connected", description: "Interne varsler til kanaler.", last_sync_at: null, env_keys: ["WEBHOOK_SECRET"] },
];

export const SUPPORT_ACCESS_LOG: SupportAccessGrant[] = [
  { id: "sa1", tenant_id: "t1", tenant_name: "Nordheim Bolig AS", requested_by: "Mats Tveller", reason: "Feilsøking av varsler som ikke ble sendt", granted_at: daysAgo(6), expires_at: daysAgo(6, 11), mode: "view_only" },
];

/* ------------------------------ sameie ------------------------------ */

export const SAMEIE_ANNOUNCEMENTS: SameieAnnouncement[] = [
  { id: "sa-an1", tenant_id: "t1", project_id: "p-middelthunet", title: "Vårdugnad lørdag 14. juni", body: "Vi møtes i bakgården kl. 11. Styret stiller med kaffe og boller. Ta gjerne med hagehansker!", author: "Styret Middelthunet", created_at: daysAgo(5) },
  { id: "sa-an2", tenant_id: "t1", project_id: "p-middelthunet", title: "Garasjeporten får ny motor", body: "Garasjeporten vil være ute av drift onsdag mellom kl. 08 og 14 pga. bytte av motor. Bruk porten i Bygg B i mellomtiden.", author: "Styret Middelthunet", created_at: daysAgo(12) },
];

export const SAMEIE_MEETINGS: SameieMeeting[] = [
  { id: "sm1", project_id: "p-middelthunet", title: "Ordinært årsmøte 2026", date: daysFromNow(21, 18), location: "Fellesrommet, Bygg A", agenda: ["Godkjenning av årsregnskap", "Budsjett 2027", "Valg av styremedlemmer", "Innkomne forslag: ladepunkter for el-sykkel"] },
];

export const COMMON_AREA_CLAIMS = [
  { id: "fc1", title: "Belysning i trappeoppgang Bygg C virker ikke", status: "Sendt til underleverandør" as const, reported_by: "Styret Middelthunet", created_at: daysAgo(8), area: "Trappeoppgang Bygg C" },
  { id: "fc2", title: "Sykkelparkering: stativ løsnet fra vegg", status: "Mottatt" as const, reported_by: "Thomas Haug", created_at: daysAgo(2), area: "Sykkelrom" },
];

/* ---------------------------- overtakelse ---------------------------- */

export const HANDOVER_PROTOCOLS: HandoverProtocol[] = [
  { id: "hp1", tenant_id: "t1", project_id: "p-middelthunet", unit_id: "unit-c103", scheduled_at: daysAgo(145), status: "signert", meter_reading_power: "000412,7 kWh", keys_delivered: 3, access_cards: 2, defects_found: 2, signed_by_resident: true, signed_by_developer: true },
  { id: "hp2", tenant_id: "t1", project_id: "p-middelthunet", unit_id: "unit-a305", scheduled_at: daysFromNow(6, 12), status: "planlagt", meter_reading_power: null, keys_delivered: 0, access_cards: 0, defects_found: 0, signed_by_resident: false, signed_by_developer: false },
  { id: "hp3", tenant_id: "t1", project_id: "p-gronnseter", unit_id: "unit-h0101", scheduled_at: daysAgo(10), status: "gjennomført", meter_reading_power: "000089,2 kWh", keys_delivered: 3, access_cards: 1, defects_found: 1, signed_by_resident: false, signed_by_developer: true },
  { id: "hp4", tenant_id: "t1", project_id: "p-middelthunet", unit_id: "unit-b110", scheduled_at: null, status: "ikke_planlagt", meter_reading_power: null, keys_delivered: 0, access_cards: 0, defects_found: 0, signed_by_resident: false, signed_by_developer: false },
];

/* --------------------------- analysedata --------------------------- */

export const CLAIMS_OVER_TIME = [
  { month: "Jan", nye: 14, løste: 9 },
  { month: "Feb", nye: 18, løste: 15 },
  { month: "Mar", nye: 23, løste: 19 },
  { month: "Apr", nye: 17, løste: 21 },
  { month: "Mai", nye: 21, løste: 18 },
  { month: "Jun", nye: 12, løste: 14 },
];

export const CLAIMS_BY_TRADE = [
  { trade: "Flislegger", antall: 23 },
  { trade: "Rørlegger", antall: 16 },
  { trade: "Tømrer", antall: 25 },
  { trade: "Elektriker", antall: 27 },
  { trade: "Ventilasjon", antall: 18 },
  { trade: "Parkett", antall: 13 },
  { trade: "Kjøkken", antall: 11 },
];

export const ROOM_CATEGORY_HEATMAP = [
  { room: "Bad", Overflater: 14, "Rør og sanitær": 9, Elektro: 2, Fukt: 4, Annet: 1 },
  { room: "Kjøkken", Overflater: 6, "Rør og sanitær": 3, Elektro: 4, Fukt: 1, Annet: 5 },
  { room: "Stue", Overflater: 11, "Rør og sanitær": 0, Elektro: 5, Fukt: 2, Annet: 3 },
  { room: "Soverom", Overflater: 7, "Rør og sanitær": 0, Elektro: 2, Fukt: 3, Annet: 2 },
  { room: "Entré", Overflater: 5, "Rør og sanitær": 0, Elektro: 1, Fukt: 0, Annet: 1 },
];

export const MRR_HISTORY = [
  { month: "Jan", mrr: 61200 },
  { month: "Feb", mrr: 64800 },
  { month: "Mar", mrr: 71500 },
  { month: "Apr", mrr: 74100 },
  { month: "Mai", mrr: 79800 },
  { month: "Jun", mrr: 83400 },
];

/* ---------------------------- hjelpefunksjoner ---------------------------- */

export function getProject(id: string) {
  return PROJECTS.find((p) => p.id === id);
}

export function getUnit(id: string) {
  return UNITS.find((u) => u.id === id);
}

export function getUser(id: string) {
  return USERS.find((u) => u.id === id);
}

export function getSupplierByOrg(orgId: string | null) {
  if (!orgId) return undefined;
  return SUPPLIERS.find((s) => s.organization_id === orgId);
}

export function getBuilding(id: string) {
  return BUILDINGS.find((b) => b.id === id);
}
