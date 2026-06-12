"use client";

import { Bell, Download, Eye, FileDown, ShieldCheck, Trash2, UserCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { formatDateTime, formatShortDate } from "@/lib/format";
import { useStore } from "@/lib/store";

const GDPR_TYPE_LABEL = { access: "Innsyn", export: "Dataeksport", deletion: "Sletting", rectification: "Retting" } as const;

export default function PersonvernPage() {
  const { gdprRequests, createGdprRequest, supportAccessLog, toast } = useStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [prefs, setPrefs] = useState({ email: true, sms: true, push: false, marketing: false });

  const myRequests = gdprRequests.filter((r) => r.user_name === "Lise Frankum");

  return (
    <div className="space-y-4 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Personvern</h1>
        <p className="text-sm text-muted-foreground">Du eier dine data. Her styrer du dem.</p>
      </div>

      {/* Mine data */}
      <Card className="p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <UserCheck className="h-4 w-4 text-evergreen-700" aria-hidden />
          Mine data
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          TvellerOS lagrer kontaktinformasjon, informasjon om boligen din, reklamasjonssaker og dokumenter. Vi samler
          ikke inn mer enn det som trengs for å følge opp boligen din.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => {
              createGdprRequest("export");
              toast({ title: "Eksport bestilt", description: "Du får varsel når pakken er klar for nedlasting.", variant: "success" });
            }}
          >
            <Download aria-hidden />
            Last ned mine data
          </Button>
          <Button variant="outline" onClick={() => setDeleteOpen(true)}>
            <Trash2 aria-hidden />
            Be om sletting
          </Button>
        </div>
      </Card>

      {/* Forespørsler */}
      {myRequests.length > 0 && (
        <Card className="p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <FileDown className="h-4 w-4 text-evergreen-700" aria-hidden />
            Mine forespørsler
          </h2>
          <div className="mt-3 space-y-2">
            {myRequests.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{GDPR_TYPE_LABEL[r.type]}</p>
                  <p className="text-xs text-muted-foreground">Forespurt {formatShortDate(r.requested_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      r.status === "Fullført"
                        ? "bg-evergreen-50 text-evergreen-700"
                        : r.status === "Under behandling"
                          ? "bg-amber-50 text-amber-800"
                          : "bg-fjord-50 text-fjord-700"
                    }
                  >
                    {r.status}
                  </Badge>
                  {r.status === "Fullført" && r.type === "export" && (
                    <Button size="sm" variant="soft" onClick={() => toast({ title: "Laster ned eksportpakke", description: "ZIP-arkiv med dine data (demo).", variant: "info" })}>
                      Last ned
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Varslingsinnstillinger */}
      <Card className="p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Bell className="h-4 w-4 text-evergreen-700" aria-hidden />
          Varslinger
        </h2>
        <div className="mt-3 space-y-3">
          {(
            [
              { key: "email", label: "E-post", desc: "Statusendringer og avtaler" },
              { key: "sms", label: "SMS", desc: "Påminnelser om avtaler" },
              { key: "push", label: "Push", desc: "Kommer i mobilappen" },
              { key: "marketing", label: "Tilbud fra markedsplassen", desc: "Relevante tjenester fra partnere" },
            ] as const
          ).map((p) => (
            <div key={p.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{p.label}</p>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
              <Switch
                checked={prefs[p.key]}
                onCheckedChange={(v) => {
                  setPrefs((prev) => ({ ...prev, [p.key]: v }));
                  toast({ title: "Innstilling lagret", variant: "success" });
                }}
                aria-label={`Varsling via ${p.label}`}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Samtykker */}
      <Card className="p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck className="h-4 w-4 text-evergreen-700" aria-hidden />
          Samtykker
        </h2>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <span>Vilkår for bruk</span>
            <Badge className="bg-evergreen-50 text-evergreen-700">Godtatt</Badge>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <span>Personvernerklæring</span>
            <Badge className="bg-evergreen-50 text-evergreen-700">Lest og godtatt</Badge>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Les <Link href="/personvern" className="font-medium text-evergreen-700 underline">personvernerklæringen</Link> og{" "}
          <Link href="/vilkar" className="font-medium text-evergreen-700 underline">vilkårene</Link>. AI brukes som
          beslutningsstøtte og trener ikke på kundedata som standard.
        </p>
      </Card>

      {/* Tilgangslogg */}
      <Card className="p-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Eye className="h-4 w-4 text-evergreen-700" aria-hidden />
          Hvem har sett dataene mine?
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          All supporttilgang fra TvellerOS krever begrunnelse og logges. Du ser loggen her.
        </p>
        <div className="mt-3 space-y-2">
          {supportAccessLog.map((g) => (
            <div key={g.id} className="rounded-xl border border-amber-200 bg-amber-50/40 p-3">
              <p className="text-sm font-medium">Supporttilgang fra TvellerOS</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {g.requested_by} · {formatDateTime(g.granted_at)} · {g.mode === "view_only" ? "Kun lesetilgang" : "Nødtilgang"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Årsak: {g.reason}</p>
            </div>
          ))}
          {supportAccessLog.length === 0 && <p className="text-sm text-muted-foreground">Ingen har hatt supporttilgang til dataene dine.</p>}
        </div>
      </Card>

      {/* Slette-dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Be om sletting av data</DialogTitle>
            <DialogDescription>
              Noe dokumentasjon må beholdes så lenge reklamasjonsperioden løper, av juridiske og forretningsmessige
              grunner. Der det er mulig, anonymiserer vi i stedet for å slette. Utbygger behandler forespørselen, og du
              kan følge status her.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Avbryt</Button>
            <Button
              variant="destructive"
              onClick={() => {
                createGdprRequest("deletion");
                setDeleteOpen(false);
                toast({ title: "Forespørsel sendt", description: "Utbygger behandler slettingsforespørselen din.", variant: "success" });
              }}
            >
              Send forespørsel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
