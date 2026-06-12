"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNOK } from "@/lib/format";
import { BILLING_PLANS, TENANTS } from "@/lib/seed";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function AbonnementPage() {
  const { toast } = useStore();

  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Abonnement og planer</h1>
        <p className="text-sm text-muted-foreground">Plankatalog og aktive abonnement. Koblet mot Stripe-priser når nøkler er konfigurert.</p>
      </div>

      {/* Plankort */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {BILLING_PLANS.map((p) => {
          const popular = p.slug === "pro";
          return (
            <Card key={p.id} className={cn("flex flex-col p-5", popular && "border-evergreen-400 shadow-[var(--shadow-card-hover)]")}>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{p.name}</p>
                {popular && <Badge className="bg-evergreen-700 text-white">Mest valgt</Badge>}
              </div>
              <p className="mt-2 text-2xl font-semibold">
                {formatNOK(p.monthly_base_price)}
                <span className="text-sm font-normal text-muted-foreground"> /mnd</span>
              </p>
              <p className="text-xs text-muted-foreground">+ {formatNOK(p.unit_price)} per aktiv enhet utover {p.included_units}</p>
              <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              <ul className="mt-3 flex-1 space-y-1.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-evergreen-600" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={popular ? "default" : "outline"}
                size="sm"
                className="mt-4"
                onClick={() => toast({ title: "Stripe checkout (demo)", description: `Checkout for ${p.name} åpnes når Stripe er tilkoblet.` })}
              >
                Rediger plan
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Aktive abonnement */}
      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Aktive abonnement</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kunde</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Stripe-status</TableHead>
              <TableHead className="text-right">MRR</TableHead>
              <TableHead>Fornyes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TENANTS.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="capitalize">{t.plan}</TableCell>
                <TableCell>
                  <Badge className={t.status === "active" ? "bg-evergreen-50 text-evergreen-700" : "bg-fjord-50 text-fjord-700"}>
                    {t.status === "active" ? "active (mock)" : "trialing (mock)"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{t.mrr > 0 ? formatNOK(t.mrr) : "–"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{t.status === "trial" ? "Prøve utløper om 12 dager" : "1. juli 2026"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Webhook-endepunkt:</strong>{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/api/webhooks/stripe</code> håndterer
          checkout.session.completed, customer.subscription.created/updated/deleted, invoice.paid og invoice.payment_failed.
        </p>
      </Card>
    </div>
  );
}
