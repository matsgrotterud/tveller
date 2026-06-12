import { CheckCircle2 } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { TimelineEvent } from "@/lib/types";

export function ClaimTimeline({ events }: { events: TimelineEvent[] }) {
  const sorted = [...events].sort((a, b) => a.created_at.localeCompare(b.created_at));
  return (
    <ol className="relative space-y-0">
      {sorted.map((e, i) => (
        <li key={e.id} className="relative flex gap-3 pb-5 last:pb-0">
          {i < sorted.length - 1 && (
            <span className="absolute left-[9px] top-6 h-[calc(100%-12px)] w-px bg-border" aria-hidden />
          )}
          <span className="relative z-10 mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-evergreen-50 text-evergreen-600 ring-1 ring-evergreen-200">
            <CheckCircle2 className="h-3 w-3" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium leading-tight">{e.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {e.actor} · {formatDateTime(e.created_at)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
