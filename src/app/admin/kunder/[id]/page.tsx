"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { UsageMeter } from "@/components/shared/usage-meter";
import { MetricCard } from "@/components/shared/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNOK, formatRelative, formatShortDate } from "@/lib/format";
import { ROLE_LABEL } from "@/lib/permissions";
import { INVOICES, PROJECTS, TENANTS, USAGE_METRICS, USERS } from "@/lib/seed";
import { useStore } from "@/lib/store";

export default function KundeDetalj() {
  const params = useParams<{ id: string }>();
  const { featureFlags, toggleFeatureFlag, supportAccessLog } = useStore();

  const tenant = TENANTS.find((t) => t.id === params.id);
  if (!tenant) {
    return (
      <div className="grid place-items-center py-20 text-center">
        <p className="text-sm text-muted-foreground">Fant ikke kunden.</p>
        <Button asChild variant="outline" className="mt-3"><Link href="/admin/kunder">Tilbake</Link></Button>
      </div>
    );
  }

  const tenantUsers = USERS.filter((u) => u.tenant_id === tenant.id && u.role !== "beboer").slice(0, 8);
  const tenantInvoices = INVOICES.filter((i) => i.tenant_id === tenant.id);
  const tenantUsage = USAGE_METRICS.filter((m) => m.tenant_id === tenant.id && m.included > 0);
  const tenantAccess = supportAccessLog.filter((s) => s.tenant_id === tenant.id);

  return (
    <div className="space-y-4 animate-fade-up">
      <Link href="/admin/kunder" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Alle kunder
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{tenant.name}</h1>
          <p className="text-sm text-muted-foreground">org.nr. {tenant.org_number} · kunde siden {formatShortDate(tenant.created_at)}</p>
        </div>
        <Badge className="bg-evergreen-50 capitalize text-evergreen-700">{tenant.plan}-plan</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="MRR" value={tenant.mrr > 0 ? formatNOK(tenant.mrr) : "Prøveperiode"} />
        <MetricCard label="Helsescore" value={tenant.health_score} trend={tenant.health_score >= 80 ? "god" : "følg opp"} trendPositive={tenant.health_score >= 80} />
        <MetricCard label="Status" value={tenant.status === "active" ? "Aktiv" : tenant.status === "trial" ? "Prøve" : tenant.status} />
        <MetricCard label="Sist aktiv" value={formatRelative(tenant.updated_at)} />
      </div>

      <Tabs defaultValue="oversikt">
        <TabsList>
          <TabsTrigger value="oversikt">Oversikt</TabsTrigger>
          <TabsTrigger value="brukere">Brukere</TabsTrigger>
          <TabsTrigger value="fakturering">Fakturering</TabsTrigger>
          <TabsTrigger value="moduler">Moduler</TabsTrigger>
          <TabsTrigger value="support">Supporttilgang</TabsTrigger>
        </TabsList>

        <TabsContent value="oversikt">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-5">
              <h2 className="text-sm font-semibold">Prosjekter</h2>
              <ul className="mt-3 space-y-2">
                {(tenant.id === "t1" ? PROJECTS : PROJECTS.slice(0, 1)).map((p) => (
                  <li key={p.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.units_count} enheter · {p.open_claims} åpne saker</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-5">
              <h2 className="text-sm font-semibold">Forbruk denne måneden</h2>
              <div className="mt-3 space-y-3">
                {tenantUsage.length === 0 && <p className="text-sm text-muted-foreground">Ingen målt bruk ennå.</p>}
                {tenantUsage.map((m) => (
                  <UsageMeter key={m.type} label={m.unit} used={m.used} included={m.included} />
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="brukere">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>E-post</TableHead>
                <TableHead>Rolle</TableHead>
                <TableHead>Sist innlogget</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenantUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell><Badge className="bg-fjord-50 text-fjord-700">{ROLE_LABEL[u.role]}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{u.last_login_at ? formatRelative(u.last_login_at) : "Aldri"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-2 text-xs text-muted-foreground">Beboerkontoer vises ikke her av personvernhensyn. Bruk supporttilgang ved behov.</p>
        </TabsContent>

        <TabsContent value="fakturering">
          {tenantInvoices.length === 0 ? (
            <Card className="p-6 text-center text-sm text-muted-foreground">Ingen fakturaer ennå.</Card>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faktura</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead className="text-right">Beløp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Forfall</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenantInvoices.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-mono text-xs">{i.number}</TableCell>
                    <TableCell>{i.period}</TableCell>
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
          )}
        </TabsContent>

        <TabsContent value="moduler">
          <Card className="p-5">
            <p className="text-sm text-muted-foreground">Aktiver eller deaktiver moduler for {tenant.name}. Endringer trer i kraft umiddelbart og logges.</p>
            <ul className="mt-4 space-y-3">
              {featureFlags.map((f) => (
                <li key={f.key} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{f.label}</p>
                    <p className="text-xs text-muted-foreground">{f.description} · Krever {f.plan_required}-plan</p>
                  </div>
                  <Switch checked={f.enabled} onCheckedChange={() => toggleFeatureFlag(f.key)} aria-label={f.label} />
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-evergreen-700" aria-hidden />
              Supporttilgang
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              All tilgang til kundedata krever begrunnelse, er tidsbegrenset og logges i revisjonsloggen – synlig også for kunden.
            </p>
            {tenantAccess.length > 0 && (
              <ul className="mt-3 space-y-2">
                {tenantAccess.map((a) => (
                  <li key={a.id} className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 text-sm">
                    <p className="font-medium">{a.requested_by} · {a.mode === "view_only" ? "kun lesetilgang" : "nødstilgang"}</p>
                    <p className="mt-0.5 text-muted-foreground">Årsak: {a.reason}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatRelative(a.granted_at)}</p>
                  </li>
                ))}
              </ul>
            )}
            <Button asChild className="mt-4">
              <Link href="/admin/support">Be om supporttilgang</Link>
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
