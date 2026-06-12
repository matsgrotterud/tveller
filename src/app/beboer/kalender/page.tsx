"use client";

import { CalendarDays, CalendarPlus, Clock, MapPin, RefreshCw } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatTime, formatWeekday } from "@/lib/format";
import { getSupplierByOrg } from "@/lib/seed";
import { useStore } from "@/lib/store";

export default function BeboerKalenderPage() {
  const { appointments, slots, workOrders, claims, toast } = useStore();

  const myAppointments = appointments
    .filter((a) => a.resident_user_id === "u-lise" || a.resident_user_id === "u-amalie")
    .filter((a) => a.resident_user_id === "u-lise")
    .sort((a, b) => a.start_at.localeCompare(b.start_at));

  const upcoming = myAppointments.filter((a) => new Date(a.end_at) >= new Date());
  const past = myAppointments.filter((a) => new Date(a.end_at) < new Date());

  /* Foreslåtte tidspunkter som venter på valg */
  const pendingProposals = workOrders
    .map((wo) => ({
      wo,
      claim: claims.find((c) => c.id === wo.claim_id),
      proposals: slots.filter((s) => s.work_order_id === wo.id && s.status === "proposed"),
    }))
    .filter((x) => x.proposals.length > 0 && x.claim?.resident_user_id === "u-lise");

  return (
    <div className="space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kalender</h1>
        <p className="text-sm text-muted-foreground">Avtaler knyttet til boligen din</p>
      </div>

      {pendingProposals.length > 0 && (
        <Card className="border-amber-300 bg-amber-50/40 p-4">
          <p className="text-sm font-semibold text-amber-900">Venter på at du velger tidspunkt</p>
          {pendingProposals.map(({ wo, claim }) => (
            <Link key={wo.id} href={`/beboer/reklamasjoner/${claim?.id}`} className="mt-2 flex items-center justify-between rounded-xl border border-amber-200 bg-surface p-3 hover:border-amber-400">
              <span className="text-sm font-medium">{claim?.title}</span>
              <Badge className="bg-amber-100 text-amber-800">Velg tidspunkt</Badge>
            </Link>
          ))}
        </Card>
      )}

      <section aria-label="Kommende avtaler">
        <h2 className="text-sm font-semibold text-muted-foreground">Kommende</h2>
        {upcoming.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Ingen kommende avtaler"
            description="Når en håndverker har avtalt tid med deg, vises avtalen her."
            className="mt-2"
          />
        ) : (
          <div className="mt-2 space-y-2.5">
            {upcoming.map((a) => {
              const claim = claims.find((c) => c.id === a.claim_id);
              const supplier = getSupplierByOrg(a.supplier_org_id);
              return (
                <Card key={a.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-evergreen-50 text-evergreen-700">
                      <CalendarDays className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold capitalize">{formatWeekday(a.start_at)}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" aria-hidden />
                        kl. {formatTime(a.start_at)}–{formatTime(a.end_at)} · {supplier?.name}
                      </p>
                      {claim && <p className="mt-1 text-xs text-muted-foreground">Gjelder: {claim.title}</p>}
                      {a.location && (
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" aria-hidden />
                          {a.location}
                        </p>
                      )}
                    </div>
                    <Badge className="bg-evergreen-50 text-evergreen-700">Bekreftet</Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => toast({ title: "Lagt til i kalender", description: "ICS-fil generert (demo).", variant: "success" })}
                    >
                      <CalendarPlus aria-hidden />
                      Legg i kalender
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => toast({ title: "Ombooking forespurt", description: "Håndverkeren får beskjed og foreslår nye tidspunkter.", variant: "info" })}
                    >
                      <RefreshCw aria-hidden />
                      Be om nytt tidspunkt
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section aria-label="Tidligere avtaler">
          <h2 className="text-sm font-semibold text-muted-foreground">Tidligere</h2>
          <div className="mt-2 space-y-2">
            {past.map((a) => {
              const claim = claims.find((c) => c.id === a.claim_id);
              const supplier = getSupplierByOrg(a.supplier_org_id);
              return (
                <Card key={a.id} className="flex items-center gap-3 p-3.5 opacity-70">
                  <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm capitalize">{formatWeekday(a.start_at)} · {supplier?.name}</p>
                    {claim && <p className="truncate text-xs text-muted-foreground">{claim.title}</p>}
                  </div>
                  <Badge className="bg-muted text-muted-foreground">Gjennomført</Badge>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
