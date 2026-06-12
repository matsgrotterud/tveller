"use client";

import { ArrowLeft, CheckCircle2, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatNOK } from "@/lib/format";
import { TILVALG_OPTIONS } from "@/lib/seed";
import { useStore } from "@/lib/store";

const CART_KEY = "tvelleros-tilvalg-cart";

export default function TilvalgBestillingPage() {
  const { submitTilvalgOrder, toast } = useStore();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

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

  const items = Object.entries(cart)
    .filter(([, q]) => q > 0)
    .map(([id, q]) => {
      const opt = TILVALG_OPTIONS.find((o) => o.id === id)!;
      return { option: opt, quantity: q, total: opt.price * q };
    })
    .filter((i) => i.option);

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const vat = Math.round(subtotal * 0.25);
  const total = subtotal + vat;

  function removeItem(id: string) {
    const next = { ...cart, [id]: 0 };
    setCart(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-10 text-center animate-fade-up">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-evergreen-100 text-evergreen-700">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </span>
        <h1 className="mt-5 text-xl font-semibold">Bestillingen er sendt inn</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Utbygger går gjennom bestillingen og bekrefter den. Du følger status under Tilvalg, og får varsel ved
          endringer.
        </p>
        <Link href="/beboer/tilvalg" className="mt-6 w-full max-w-sm">
          <Button className="w-full" size="lg">Tilbake til Tilvalg</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-up">
      <Link href="/beboer/tilvalg" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Tilvalg
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Din bestilling</h1>
        <p className="text-sm text-muted-foreground">Fjordhagen · Leilighet C103</p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Handlekurven er tom"
          description="Velg tilvalg fra katalogen, så dukker de opp her."
          action={
            <Link href="/beboer/tilvalg">
              <Button>Se tilvalg</Button>
            </Link>
          }
        />
      ) : (
        <>
          <Card className="divide-y divide-border">
            {items.map(({ option, quantity, total: lineTotal }) => (
              <div key={option.id} className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{option.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {quantity} × {formatNOK(option.price)}
                  </p>
                </div>
                <p className="text-sm font-semibold">{formatNOK(lineTotal)}</p>
                <Button variant="ghost" size="icon" onClick={() => removeItem(option.id)} aria-label={`Fjern ${option.title}`}>
                  <Trash2 className="text-muted-foreground" aria-hidden />
                </Button>
              </div>
            ))}
          </Card>

          <Card className="space-y-2 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sum eks. mva</span>
              <span>{formatNOK(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mva (25 %)</span>
              <span>{formatNOK(vat)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <span>Totalt</span>
              <span>{formatNOK(total)}</span>
            </div>
          </Card>

          <p className="text-xs text-muted-foreground">
            Bestillingen er bindende når utbygger har godkjent den. Beløpet faktureres i henhold til kjøpekontrakten.
          </p>

          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              submitTilvalgOrder({
                project_id: "p-fjordhagen",
                unit_id: "unit-c103",
                resident_user_id: "u-lise",
                items: items.map((i) => ({
                  option_id: i.option.id,
                  title: i.option.title,
                  quantity: i.quantity,
                  unit_price: i.option.price,
                  total: i.total,
                })),
                subtotal,
                vat,
                total,
              });
              localStorage.removeItem(CART_KEY);
              toast({ title: "Bestilling sendt inn", description: `Totalt ${formatNOK(total)} inkl. mva.`, variant: "success" });
              setSubmitted(true);
            }}
          >
            Send inn bestilling
          </Button>
        </>
      )}
    </div>
  );
}
