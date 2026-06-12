"use client";

import { CreditCard, Download, ExternalLink } from "lucide-react";
import { MetricCard } from "@/components/shared/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNOK, formatShortDate } from "@/lib/format";
import { INVOICES, TENANTS } from "@/lib/seed";
import { useStore } from "@/lib/store";

const USAGE_LINES = [
  { label: "Abonnement (basis)", amount: 83300 },
  { label: "Aktive enheter utover inkludert", amount: 8624 },
  { label: "SMS-forbruk", amount: 2110 },
  { label: "AI-kreditter utover inkludert", amount: 0 },
  { label: "Markedsplass-provisjon", amount: 18400 },
  { label: "Lagring utover inkludert", amount: 940 },
];

export default function FaktureringPage() {
  const { toast } = useStore();
  const mrr = TENANTS.reduce((s, t) => s + t.mrr, 0);

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Fakturering</h1>
          <p className="text-sm text-muted-foreground">Inntekter, fakturaer og bruksbasert prising</p>
        </div>
        <Button variant="outline" onClick={() => toast({ title: "Rapport eksportert", description: "Inntektsrapport for juni er lastet ned (demo).", variant: "success" })}>
          <Download aria-hidden />
          Eksporter rapport
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="MRR" value={formatNOK(mrr)} trend="+8,2 %" trendPositive />
        <MetricCard label="Bruksinntekter (juni)" value={formatNOK(30074)} hint="SMS, AI, provisjon m.m." />
        <MetricCard label="Utestående" value={formatNOK(26350)} hint="1 åpen faktura" />
        <MetricCard label="Netto churn" value="0 %" trend="12 mnd" trendPositive />
      </div>

      <Card className="border-fjord-200 bg-fjord-50/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-fjord-700" aria-hidden />
            <div>
              <p className="text-sm font-semibold">Stripe: demo-modus</p>
              <p className="text-xs text-muted-foreground">
                Legg inn STRIPE_SECRET_KEY og STRIPE_WEBHOOK_SECRET for ekte abonnement, checkout og kundeportal.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Stripe-oppsett", description: "Se SETUP_GUIDE.md punkt 6–7 for produkter, priser og webhook." })}>
            <ExternalLink aria-hidden />
            Koble til Stripe
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Fakturaer</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faktura</TableHead>
                <TableHead>Kunde</TableHead>
                <TableHead className="text-right">Beløp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Forfall</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.number}</TableCell>
                  <TableCell className="text-sm">{TENANTS.find((t) => t.id === i.tenant_id)?.name}</TableCell>
                  <TableCell className="text-right font-medium">{formatNOK(i.amount)}</TableCell>
                  <TableCell>
                    <Badge className={i.status === "paid" ? "bg-evergreen-50 text-evergreen-700" : "bg-amber-50 text-amber-800"}>
                      {i.status === "paid" ? "Betalt" : "Åpen"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatShortDate(i.due_date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Inntektslinjer juni 2026</h2>
          <Card className="p-5">
            <dl className="space-y-2.5">
              {USAGE_LINES.map((l) => (
                <div key={l.label} className="flex items-center justify-between text-sm">
                  <dt className="text-muted-foreground">{l.label}</dt>
                  <dd className="font-medium">{formatNOK(l.amount)}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-border pt-2.5 text-sm font-semibold">
                <dt>Totalt</dt>
                <dd>{formatNOK(USAGE_LINES.reduce((s, l) => s + l.amount, 0))}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
