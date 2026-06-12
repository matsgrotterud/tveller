import { Badge } from "@/components/ui/badge";
import {
  CLAIM_STATUS_STYLE,
  RISK_LABEL,
  RISK_STYLE,
  SEVERITY_LABEL,
  SEVERITY_STYLE,
  TILVALG_STATUS_STYLE,
  WORK_ORDER_STATUS_STYLE,
} from "@/lib/status";
import type { ClaimStatus, RiskLevel, Severity, TilvalgOrderStatus, WorkOrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusPill({ status, className }: { status: ClaimStatus; className?: string }) {
  const s = CLAIM_STATUS_STYLE[status];
  return (
    <Badge className={cn(s.bg, s.text, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} aria-hidden />
      {status}
    </Badge>
  );
}

export function WorkOrderStatusPill({ status, className }: { status: WorkOrderStatus; className?: string }) {
  const s = WORK_ORDER_STATUS_STYLE[status];
  return (
    <Badge className={cn(s.bg, s.text, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} aria-hidden />
      {status}
    </Badge>
  );
}

export function TilvalgStatusPill({ status, className }: { status: TilvalgOrderStatus; className?: string }) {
  const s = TILVALG_STATUS_STYLE[status];
  return (
    <Badge className={cn(s.bg, s.text, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} aria-hidden />
      {status}
    </Badge>
  );
}

export function SeverityPill({ severity, className }: { severity: Severity; className?: string }) {
  const s = SEVERITY_STYLE[severity];
  return <Badge className={cn(s.bg, s.text, className)}>{SEVERITY_LABEL[severity]}</Badge>;
}

export function RiskPill({ level, label, className }: { level: RiskLevel; label?: string; className?: string }) {
  const s = RISK_STYLE[level];
  return (
    <Badge className={cn(s.bg, s.text, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} aria-hidden />
      {label ?? RISK_LABEL[level]}
    </Badge>
  );
}

export function AIBadge({ className, children = "AI-forslag" }: { className?: string; children?: React.ReactNode }) {
  return (
    <Badge className={cn("bg-violet-50 text-violet-700 border border-violet-200", className)}>
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      </svg>
      {children}
    </Badge>
  );
}
