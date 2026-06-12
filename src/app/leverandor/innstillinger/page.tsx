"use client";

import { Bell, Building2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/store";

export default function LeverandorInnstillingerPage() {
  const { toast } = useStore();
  const [notifications, setNotifications] = useState([
    { key: "new_order", label: "Ny arbeidsordre", desc: "Varsle umiddelbart på e-post og SMS", enabled: true },
    { key: "slot_selected", label: "Beboer valgte tidspunkt", desc: "Varsle på e-post", enabled: true },
    { key: "reopened", label: "Sak gjenåpnet", desc: "Varsle på e-post og SMS", enabled: true },
    { key: "weekly", label: "Ukentlig oppsummering", desc: "E-post mandag morgen", enabled: false },
  ]);

  return (
    <div className="max-w-2xl space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Innstillinger</h1>
        <p className="text-sm text-muted-foreground">Bare Rør AS · org.nr. 982 441 220</p>
      </div>

      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Building2 className="h-4 w-4 text-evergreen-700" aria-hidden />
          Firmaprofil
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="s-name">Firmanavn</Label>
            <Input id="s-name" defaultValue="Bare Rør AS" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="s-phone">Telefon</Label>
            <Input id="s-phone" defaultValue="+47 21 09 44 00" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="s-email">E-post</Label>
            <Input id="s-email" type="email" defaultValue="post@bareror.no" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="s-trades">Fagområder</Label>
            <Input id="s-trades" defaultValue="Rørlegger, sanitær, varme" className="mt-1" />
          </div>
        </div>
        <Button className="mt-4" onClick={() => toast({ title: "Profil oppdatert", description: "Endringene er lagret.", variant: "success" })}>
          Lagre endringer
        </Button>
      </Card>

      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Bell className="h-4 w-4 text-evergreen-700" aria-hidden />
          Varsler
        </h2>
        <ul className="mt-4 space-y-3">
          {notifications.map((n) => (
            <li key={n.key} className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{n.label}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <Switch
                checked={n.enabled}
                onCheckedChange={(v) => {
                  setNotifications((prev) => prev.map((x) => (x.key === n.key ? { ...x, enabled: v } : x)));
                  toast({ title: "Varsel oppdatert", description: `«${n.label}» er ${v ? "aktivert" : "deaktivert"}.`, variant: "success" });
                }}
                aria-label={n.label}
              />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
