"use client";

import { ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatNOK, formatShortDate } from "@/lib/format";
import { MARKETPLACE_SERVICES } from "@/lib/seed";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Alle", "Elektriker", "Renhold", "Rørlegger", "Forsikring", "Internett", "Småjobber", "Flyttehjelp", "Solskjerming", "Lås og adgang", "Maling"];

export default function MarkedsplassPage() {
  const { marketplaceOrders } = useStore();
  const [category, setCategory] = useState("Alle");

  const services = MARKETPLACE_SERVICES.filter((s) => s.status === "active" && (category === "Alle" || s.category === category));
  const myOrders = marketplaceOrders.filter((o) => o.resident_user_id === "u-lise");

  return (
    <div className="space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Markedsplass</h1>
        <p className="text-sm text-muted-foreground">Kvalitetssikrede tjenester til boligen din. Partnere er tydelig merket.</p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Kategorier">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={category === c}
            onClick={() => setCategory(c)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer",
              category === c ? "bg-evergreen-700 text-white" : "border border-border bg-surface text-muted-foreground hover:bg-muted",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {myOrders.length > 0 && (
        <Card className="p-4">
          <h2 className="text-sm font-semibold">Mine bestillinger</h2>
          <div className="mt-2 space-y-2">
            {myOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{o.service_title}</p>
                  <p className="text-xs text-muted-foreground">Forespurt {formatShortDate(o.requested_at)}</p>
                </div>
                <Badge
                  className={cn(
                    o.status === "Utført" && "bg-evergreen-50 text-evergreen-700",
                    o.status === "Tilbud mottatt" && "bg-amber-50 text-amber-800",
                    o.status === "Forespurt" && "bg-fjord-50 text-fjord-700",
                    o.status === "Bestilt" && "bg-violet-50 text-violet-700",
                    o.status === "Kansellert" && "bg-muted text-muted-foreground",
                  )}
                >
                  {o.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((s) => (
          <Link key={s.id} href={`/beboer/markedsplass/${s.id}`}>
            <Card className="h-full p-4 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
              <div className="flex aspect-[5/2] items-center justify-center rounded-xl bg-gradient-to-br from-evergreen-50 to-fjord-50">
                <ShoppingBag className="h-7 w-7 text-evergreen-300" aria-hidden />
              </div>
              <div className="mt-3 flex items-start justify-between gap-2">
                <p className="text-sm font-semibold leading-snug">{s.title}</p>
                {s.partner_label && <Badge className="shrink-0 bg-fjord-50 text-fjord-700">Partner</Badge>}
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{s.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm font-medium">
                  {s.price_type === "tilbud" ? "Fra " : ""}
                  {formatNOK(s.starting_price)}
                  <span className="text-xs font-normal text-muted-foreground">
                    {s.price_type === "timepris" ? "/t" : s.price_type === "tilbud" ? " (tilbud)" : ""}
                  </span>
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
                  {s.rating.toFixed(1)}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Partnere betaler provisjon til TvellerOS. Personopplysninger selges aldri.
      </p>
    </div>
  );
}
