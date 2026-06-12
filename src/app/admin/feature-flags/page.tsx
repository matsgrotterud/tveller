"use client";

import { Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TENANTS } from "@/lib/seed";
import { useStore } from "@/lib/store";

const PLAN_BADGE: Record<string, string> = {
  starter: "bg-muted text-muted-foreground",
  pro: "bg-fjord-50 text-fjord-700",
  enterprise: "bg-violet-50 text-violet-700",
  portfolio: "bg-evergreen-50 text-evergreen-700",
};

export default function FeatureFlagsPage() {
  const { featureFlags, toggleFeatureFlag } = useStore();

  return (
    <div className="max-w-3xl space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Feature flags</h1>
        <p className="text-sm text-muted-foreground">Aktiver moduler per kunde. Alle endringer logges i revisjonsloggen.</p>
      </div>

      <div className="flex items-center gap-2">
        <Flag className="h-4 w-4 text-muted-foreground" aria-hidden />
        <Select defaultValue={TENANTS[0].name} className="w-64" aria-label="Velg kunde">
          {TENANTS.map((t) => <option key={t.id}>{t.name}</option>)}
        </Select>
      </div>

      <Card className="divide-y divide-border p-0">
        {featureFlags.map((f) => (
          <div key={f.key} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">{f.label}</p>
                <Badge className={PLAN_BADGE[f.plan_required]}>Krever {f.plan_required}</Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{f.description}</p>
            </div>
            <Switch checked={f.enabled} onCheckedChange={() => toggleFeatureFlag(f.key)} aria-label={f.label} />
          </div>
        ))}
      </Card>
    </div>
  );
}
