"use client";

import { AlertTriangle, ChevronDown, Layers, Sparkles, Timer, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";
import { AIBadge } from "@/components/shared/pills";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof Sparkles> = {
  trend: TrendingUp,
  speed: Zap,
  deadline: Timer,
  warning: AlertTriangle,
  cluster: Layers,
};

export function AIInsightCard({
  icon = "trend",
  text,
  detail,
  confidence,
  className,
}: {
  icon?: string;
  text: string;
  detail?: string;
  confidence?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const Icon = ICONS[icon] ?? Sparkles;
  return (
    <div className={cn("rounded-xl border border-violet-100 bg-violet-50/50 p-3", className)}>
      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-violet-100 p-1.5 text-violet-700">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-snug">{text}</p>
          {detail && (
            <button
              onClick={() => setOpen(!open)}
              className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-violet-700 hover:underline cursor-pointer"
            >
              Hvorfor foreslås dette?
              <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} aria-hidden />
            </button>
          )}
          {open && detail && <p className="mt-2 text-xs text-muted-foreground">{detail}</p>}
        </div>
        {confidence !== undefined && (
          <span className="shrink-0 text-xs font-medium text-violet-600">{Math.round(confidence * 100)} %</span>
        )}
      </div>
    </div>
  );
}

export function AIDisclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-center gap-2 text-xs text-muted-foreground", className)}>
      <AIBadge>Beslutningsstøtte</AIBadge>
      Dette er beslutningsstøtte og ikke juridisk rådgivning.
    </p>
  );
}
