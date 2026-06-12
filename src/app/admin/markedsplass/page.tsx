"use client";

import { Download, ShoppingBag, Star } from "lucide-react";
import { MetricCard } from "@/components/shared/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNOK, formatRelative } from "@/lib/format";
import { MARKETPLACE_SERVICES, getUnit, getUser } from "@/lib/seed";
import { useStore } from "@/lib/store";

const PARTNERS = [
  { name: "Elektrofix AS", categories: ["Elektriker"], commission: 10, status: "Aktiv", orders: 14 },
  { name: "Oslo Renhold & Miljø", categories: ["Renhold"], commission: 12, status: "Aktiv", orders: 9 },
  { name: "Bare Rør AS", categories: ["Rørlegger"], commission: 10, status: "Aktiv", orders: 7 },
  { name: "Solskjerming Norge", categories: ["Solskjerming"], commission: 8, status: "Aktiv", orders: 5 },
  { name: "Trygg Forsikring", categories: ["Forsikring"], commission: 15, status: "Under onboarding", orders: 0 },
];

export default function MarkedsplassAdminPage() {
  const { marketplaceOrders, toast } = useStore();

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Markedsplass</h1>
          <p className="text-sm text-muted-foreground">Partnere, tjenester, ordrer og provisjon</p>
        </div>
        <Button variant="outline" onClick={() => toast({ title: "Utbetalingsrapport eksportert", description: "Provisjonsgrunnlag for juni er lastet ned (demo).", variant: "success" })}>
          <Download aria-hidden />
          Utbetalingsrapport
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="GMV (12 mnd)" value={formatNOK(184000)} trend="+14 %" trendPositive />
        <MetricCard label="Provisjon (12 mnd)" value={formatNOK(18400)} hint="snitt 10 %" />
        <MetricCard label="Aktive partnere" value={PARTNERS.filter((p) => p.status === "Aktiv").length} icon={ShoppingBag} />
        <MetricCard label="Tjenester publisert" value={MARKETPLACE_SERVICES.length} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Partnere */}
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Partnere</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Provisjon</TableHead>
                <TableHead className="text-right">Ordrer</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PARTNERS.map((p) => (
                <TableRow key={p.name}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.categories.join(", ")}</TableCell>
                  <TableCell className="text-right">{p.commission} %</TableCell>
                  <TableCell className="text-right">{p.orders}</TableCell>
                  <TableCell>
                    <Badge className={p.status === "Aktiv" ? "bg-evergreen-50 text-evergreen-700" : "bg-amber-50 text-amber-800"}>{p.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Ordrer */}
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Siste ordrer</h2>
          <div className="space-y-2">
            {marketplaceOrders.map((o) => {
              const resident = getUser(o.resident_user_id);
              const unit = getUnit(o.unit_id);
              return (
                <Card key={o.id} className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">{o.service_title}</p>
                    <Badge className={o.status === "Utført" ? "bg-evergreen-50 text-evergreen-700" : "bg-fjord-50 text-fjord-700"}>{o.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {resident?.name} · {unit?.unit_number} · {formatRelative(o.requested_at)}
                    {o.price_estimate && ` · estimat ${formatNOK(o.price_estimate)}`}
                    {o.commission_amount && ` · provisjon ${formatNOK(o.commission_amount)}`}
                  </p>
                </Card>
              );
            })}
          </div>

          <Card className="mt-3 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Star className="h-4 w-4 text-amber-500" aria-hidden />
              Fremhevet plassering
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Partnere kan kjøpe fremhevet plassering – alltid merket «Partner» i beboerportalen. Persondata selges aldri.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
