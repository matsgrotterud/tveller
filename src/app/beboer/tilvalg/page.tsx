"use client";

import { Minus, Plus, ShoppingCart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TilvalgStatusPill } from "@/components/shared/pills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { daysUntil, formatNOK, formatShortDate } from "@/lib/format";
import { TILVALG_OPTIONS } from "@/lib/seed";
import { useStore } from "@/lib/store";
import type { RoomType } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROOM_TABS: { label: string; value: RoomType }[] = [
  { label: "Kjøkken", value: "kjøkken" },
  { label: "Stue", value: "stue" },
  { label: "Baderom", value: "bad" },
  { label: "Soverom", value: "soverom" },
  { label: "Entré", value: "entré" },
];

const CART_KEY = "tvelleros-tilvalg-cart";

export default function TilvalgPage() {
  const { tilvalgOrders } = useStore();
  const [room, setRoom] = useState<RoomType>("kjøkken");
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      /* Engangs-hydrering av handlekurv etter SSR. */
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setCart(JSON.parse(raw));
    } catch {
      /* ignorer */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const options = TILVALG_OPTIONS.filter((o) => o.status === "published" && o.room_type === room);
  const cartItems = Object.entries(cart).filter(([, q]) => q > 0);
  const cartTotal = cartItems.reduce((sum, [optionId, q]) => {
    const opt = TILVALG_OPTIONS.find((o) => o.id === optionId);
    return sum + (opt?.price ?? 0) * q;
  }, 0);
  const myOrders = tilvalgOrders.filter((o) => o.resident_user_id === "u-lise");

  function setQty(id: string, qty: number) {
    setCart((c) => ({ ...c, [id]: Math.max(0, qty) }));
  }

  return (
    <div className="space-y-4 pb-20 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tilvalg</h1>
        <p className="text-sm text-muted-foreground">Personliggjør boligen din – Fjordhagen, leil. C103</p>
      </div>

      {myOrders.length > 0 && (
        <Card className="p-4">
          <h2 className="text-sm font-semibold">Mine bestillinger</h2>
          <div className="mt-2 space-y-2">
            {myOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{o.items.length} tilvalg · {formatNOK(o.total)}</p>
                  {o.submitted_at && <p className="text-xs text-muted-foreground">Sendt inn {formatShortDate(o.submitted_at)}</p>}
                </div>
                <TilvalgStatusPill status={o.status} />
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Rom">
        {ROOM_TABS.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={room === t.value}
            onClick={() => setRoom(t.value)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer",
              room === t.value ? "bg-evergreen-700 text-white" : "border border-border bg-surface text-muted-foreground hover:bg-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {options.length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">Ingen publiserte tilvalg for dette rommet ennå.</Card>
        )}
        {options.map((o) => {
          const qty = cart[o.id] ?? 0;
          const deadlineDays = daysUntil(o.deadline);
          return (
            <Card key={o.id} className="overflow-hidden">
              <div className="flex aspect-[3/1] items-center justify-center bg-gradient-to-br from-sand-100 to-evergreen-50">
                <Sparkles className="h-7 w-7 text-evergreen-300" aria-hidden />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{o.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{o.description}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold">
                    {o.price === 0 ? "Standard" : formatNOK(o.price)}
                    {o.price > 0 && o.price_type === "per_m2" && <span className="text-xs font-normal text-muted-foreground">/m²</span>}
                    {o.price > 0 && o.price_type === "per_unit" && <span className="text-xs font-normal text-muted-foreground">/stk</span>}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Badge className={cn(deadlineDays <= 14 ? "bg-amber-50 text-amber-800" : "bg-muted text-muted-foreground")}>
                    Frist {formatShortDate(o.deadline)}
                  </Badge>
                  {qty === 0 ? (
                    <Button size="sm" variant="soft" onClick={() => setQty(o.id, 1)} disabled={o.price === 0}>
                      <Plus aria-hidden />
                      {o.price === 0 ? "Inkludert" : "Legg til"}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setQty(o.id, qty - 1)} aria-label="Reduser antall">
                        <Minus aria-hidden />
                      </Button>
                      <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setQty(o.id, qty + 1)} aria-label="Øk antall">
                        <Plus aria-hidden />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Handlekurv-bar */}
      {cartItems.length > 0 && (
        <div className="fixed inset-x-0 bottom-16 z-40 mx-auto max-w-3xl px-4">
          <Link href="/beboer/tilvalg/bestilling">
            <div className="flex items-center justify-between rounded-2xl gradient-brand p-4 text-white shadow-[var(--shadow-pop)]">
              <span className="flex items-center gap-2.5 text-sm font-medium">
                <ShoppingCart className="h-4 w-4" aria-hidden />
                {cartItems.reduce((s, [, q]) => s + q, 0)} tilvalg valgt
              </span>
              <span className="text-sm font-semibold">{formatNOK(cartTotal)} eks. mva →</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
