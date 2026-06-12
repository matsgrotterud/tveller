"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNOK, formatRelative } from "@/lib/format";
import { TENANTS } from "@/lib/seed";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  active: { label: "Aktiv", cls: "bg-evergreen-50 text-evergreen-700" },
  trial: { label: "Prøveperiode", cls: "bg-fjord-50 text-fjord-700" },
  past_due: { label: "Forfalt", cls: "bg-red-50 text-red-700" },
  churned: { label: "Avsluttet", cls: "bg-muted text-muted-foreground" },
};

const TENANT_META: Record<string, { users: number; units: number; claimsPerMonth: number; storage: string; ai: number }> = {
  t1: { users: 14, units: 376, claimsPerMonth: 38, storage: "38 GB", ai: 318 },
  t2: { users: 31, units: 820, claimsPerMonth: 64, storage: "121 GB", ai: 1240 },
  t3: { users: 3, units: 64, claimsPerMonth: 2, storage: "1 GB", ai: 12 },
};

export default function KunderPage() {
  const { toast } = useStore();

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kunder</h1>
          <p className="text-sm text-muted-foreground">{TENANTS.length} kunder · {formatNOK(TENANTS.reduce((s, t) => s + t.mrr, 0))} samlet MRR</p>
        </div>
        <Button onClick={() => toast({ title: "Ny kunde", description: "Onboarding-veiviser for ny kunde startet (demo).", variant: "success" })}>
          <Plus aria-hidden />
          Ny kunde
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kunde</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">MRR</TableHead>
            <TableHead className="text-right">Helse</TableHead>
            <TableHead className="text-right">Brukere</TableHead>
            <TableHead className="text-right">Enheter</TableHead>
            <TableHead className="text-right">Saker/mnd</TableHead>
            <TableHead className="text-right">AI-bruk</TableHead>
            <TableHead>Sist aktiv</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {TENANTS.map((t) => {
            const meta = TENANT_META[t.id];
            const st = STATUS_LABEL[t.status];
            return (
              <TableRow key={t.id}>
                <TableCell>
                  <Link href={`/admin/kunder/${t.id}`} className="font-medium text-evergreen-800 hover:underline">
                    {t.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">org.nr. {t.org_number}</p>
                </TableCell>
                <TableCell className="capitalize">{t.plan}</TableCell>
                <TableCell><Badge className={st.cls}>{st.label}</Badge></TableCell>
                <TableCell className="text-right font-medium">{t.mrr > 0 ? formatNOK(t.mrr) : "–"}</TableCell>
                <TableCell className={cn("text-right font-semibold", t.health_score >= 80 ? "text-evergreen-700" : t.health_score >= 70 ? "text-amber-700" : "text-red-700")}>
                  {t.health_score}
                </TableCell>
                <TableCell className="text-right">{meta.users}</TableCell>
                <TableCell className="text-right">{meta.units}</TableCell>
                <TableCell className="text-right">{meta.claimsPerMonth}</TableCell>
                <TableCell className="text-right">{meta.ai}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatRelative(t.updated_at)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
