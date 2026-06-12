"use client";

import { Car, MapPin, Route, Sparkles } from "lucide-react";
import { useState } from "react";
import { AIBadge } from "@/components/shared/pills";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatTime } from "@/lib/format";
import { getUnit, getUser } from "@/lib/seed";
import { useStore } from "@/lib/store";

export default function RuteplanPage() {
  const { appointments, claims, toast } = useStore();
  const [optimized, setOptimized] = useState(false);

  const stops = [...appointments]
    .sort((a, b) => a.start_at.localeCompare(b.start_at))
    .map((a, i) => {
      const claim = claims.find((c) => c.id === a.claim_id);
      return {
        appointment: a,
        claim,
        resident: claim ? getUser(claim.resident_user_id) : undefined,
        unit: claim ? getUnit(claim.unit_id) : undefined,
        travelMinutes: i === 0 ? 18 : 12 + i * 4,
      };
    });

  return (
    <div className="max-w-4xl space-y-4 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ruteplan</h1>
          <p className="text-sm text-muted-foreground">{stops.length} stopp · estimert {stops.reduce((s, x) => s + x.travelMinutes, 0)} min kjøring totalt</p>
        </div>
        <Button
          onClick={() => {
            setOptimized(true);
            toast({ title: "Rute optimalisert", description: "Rekkefølgen er justert og sparer ca. 22 minutter kjøretid (demo).", variant: "success" });
          }}
        >
          <Route aria-hidden />
          Optimaliser rute
        </Button>
      </div>

      {optimized && (
        <Card className="flex items-center gap-3 border-violet-200 bg-violet-50/50 p-4">
          <Sparkles className="h-4 w-4 shrink-0 text-violet-700" aria-hidden />
          <p className="text-sm">Ruten er optimalisert etter avstand og avtaletider. Estimert besparelse: 22 minutter.</p>
          <AIBadge className="ml-auto shrink-0" />
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        {/* Stoppliste */}
        <div className="space-y-0">
          {stops.length === 0 && <Card className="p-6 text-center text-sm text-muted-foreground">Ingen planlagte stopp. Avtaler vises her når beboere har valgt tidspunkt.</Card>}
          {stops.map(({ appointment, claim, resident, travelMinutes }, i) => (
            <div key={appointment.id} className="relative pl-8">
              {i < stops.length - 1 && <span className="absolute left-[13px] top-8 h-full w-0.5 bg-border" aria-hidden />}
              <span className="absolute left-0 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-evergreen-700 text-xs font-bold text-white" aria-hidden>
                {i + 1}
              </span>
              <div className="pb-4">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Car className="h-3.5 w-3.5" aria-hidden />
                  {travelMinutes} min kjøring
                </p>
                <Card className="mt-1.5 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{claim?.title}</p>
                    <span className="shrink-0 text-sm font-semibold">{formatTime(appointment.start_at)}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{appointment.location} · {resident?.name}</p>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Kart-plassholder */}
        <Card className="grid h-72 place-items-center bg-gradient-to-br from-fjord-50 to-evergreen-50 lg:h-auto">
          <div className="text-center">
            <MapPin className="mx-auto h-8 w-8 text-fjord-400" aria-hidden />
            <p className="mt-2 text-sm font-medium text-muted-foreground">Kartvisning</p>
            <p className="mx-auto mt-1 max-w-48 text-xs text-muted-foreground">Aktiveres når MAPS_API_KEY er konfigurert</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
