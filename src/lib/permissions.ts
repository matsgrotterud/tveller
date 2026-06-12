import type { RoleKey } from "./types";

export type Permission =
  | "claim:create"
  | "claim:read"
  | "claim:update"
  | "claim:decide"
  | "claim:assign_supplier"
  | "claim:archive"
  | "claim:export"
  | "claim:internal_notes"
  | "claim:confirm"
  | "claim:reopen"
  | "document:upload"
  | "document:read"
  | "document:delete"
  | "project:manage"
  | "unit:manage"
  | "supplier:manage"
  | "tilvalg:manage"
  | "tilvalg:order"
  | "marketplace:manage"
  | "marketplace:order"
  | "workorder:manage"
  | "appointment:propose"
  | "appointment:select"
  | "billing:manage"
  | "gdpr:manage"
  | "support:impersonate"
  | "audit:read"
  | "feature_flags:manage"
  | "sameie:manage";

const ROLE_PERMISSIONS: Record<RoleKey, Permission[]> = {
  superadmin: ["billing:manage", "gdpr:manage", "support:impersonate", "audit:read", "feature_flags:manage", "marketplace:manage"],
  utbygger_admin: ["claim:read", "claim:update", "claim:decide", "claim:assign_supplier", "claim:archive", "claim:export", "claim:internal_notes", "document:upload", "document:read", "document:delete", "project:manage", "unit:manage", "supplier:manage", "tilvalg:manage", "marketplace:manage", "gdpr:manage", "audit:read", "sameie:manage", "billing:manage"],
  prosjektleder: ["claim:read", "claim:update", "claim:decide", "claim:assign_supplier", "claim:archive", "claim:export", "claim:internal_notes", "document:upload", "document:read", "project:manage", "unit:manage", "supplier:manage", "sameie:manage"],
  kundebehandler: ["claim:read", "claim:update", "claim:decide", "claim:assign_supplier", "claim:internal_notes", "claim:export", "document:upload", "document:read"],
  juridisk: ["claim:read", "claim:internal_notes", "claim:export", "claim:archive", "audit:read", "document:read", "gdpr:manage"],
  teknisk: ["claim:read", "claim:update", "document:upload", "document:read"],
  beboer: ["claim:create", "claim:read", "claim:confirm", "claim:reopen", "appointment:select", "document:read", "tilvalg:order", "marketplace:order"],
  sameiestyre: ["claim:create", "claim:read", "document:read", "sameie:manage"],
  leverandor_admin: ["claim:read", "workorder:manage", "appointment:propose", "document:read"],
  tekniker: ["claim:read", "workorder:manage", "document:read"],
  marketplace_partner: ["marketplace:manage"],
  auditor: ["claim:read", "document:read", "audit:read"],
};

export function hasPermission(role: RoleKey, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export const ROLE_LABEL: Record<RoleKey, string> = {
  superadmin: "Superadmin",
  utbygger_admin: "Utbygger admin",
  prosjektleder: "Prosjektleder",
  kundebehandler: "Kundebehandler",
  juridisk: "Juridisk ansvarlig",
  teknisk: "Teknisk ansvarlig",
  beboer: "Beboer",
  sameiestyre: "Sameiestyre",
  leverandor_admin: "Underleverandør admin",
  tekniker: "Tekniker",
  marketplace_partner: "Markedsplass-partner",
  auditor: "Auditor (lesetilgang)",
};
