"use client";

import { CalendarDays } from "lucide-react";
import { useMemo } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatTime, formatWeekday } from "@/lib/format";
import { getUser } from "@/lib/seed";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function LeverandorKalenderPage() {
  const { appointments, claims, workOrders } = useStore();

  const days = useMemo(() => {
    const result: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      d.setHours(0, 0, 0, 0);
      result.push(d);
    }
    return result;
  }, []);

  if (appointments.length === 0) {
    return (
      <div className="max-w-3xl animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight">Kalender</h1>
        <EmptyState icon={CalendarDays} title="Ingen avtaler" description="Bekreftede avtaler med beboere vises her." className="mt-4" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kalender</h1>
        <p className="text-sm text-muted-foreground">Uke-visning · {appointments.length} avtaler</p>
      </div>

      <div className="space-y-3">
        {days.map((date) => {
          const dayAppts = appointments
            .filter((a) => new Date(a.start_at).toDateString() === date.toDateString())
            .sort((a, b) => a.start_at.localeCompare(b.start_at));
          const isToday = date.toDateString() === new Date().toDateString();
          if (dayAppts.length === 0 && !isToday) return null;
          return (
            <section key={date.toISOString()} aria-label={formatWeekday(date)}>
              <h2 className={cn("text-sm font-semibold capitalize", isToday ? "text-evergreen-700" : "text-muted-foreground")}>
                {formatWeekday(date)} {isToday && "· i dag"}
              </h2>
              <div className="mt-1.5 space-y-2">
                {dayAppts.length === 0 && <p className="text-sm text-muted-foreground">Ingen avtaler.</p>}
                {dayAppts.map((a) => {
                  const claim = claims.find((c) => c.id === a.claim_id);
                  const wo = workOrders.find((w) => w.id === a.work_order_id);
                  const resident = claim ? getUser(claim.resident_user_id) : undefined;
                  return (
                    <Card key={a.id} className="flex items-center gap-4 p-4">
                      <div className="shrink-0 text-center">
                        <p className="text-sm font-bold">{formatTime(a.start_at)}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(a.end_at)}</p>
                      </div>
                      <div className="h-10 w-px bg-border" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{claim?.title}</p>
                        <p className="text-xs text-muted-foreground">{a.location} · {resident?.name} · {wo?.wo_number}</p>
                      </div>
                      <Badge className={cn("shrink-0", a.status === "bekreftet" ? "bg-evergreen-50 text-evergreen-700" : "bg-amber-50 text-amber-800")}>
                        {a.status === "bekreftet" ? "Bekreftet" : a.status}
                      </Badge>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
