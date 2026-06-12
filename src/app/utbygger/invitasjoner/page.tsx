"use client";

import { Bell, CheckCircle2, Clock, Mail, Send, Smartphone } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRelative } from "@/lib/format";
import { daysAgo } from "@/lib/seed";
import { useStore } from "@/lib/store";

const INVITES = [
  { name: "Lise Frankum", unit: "C103", channel: "SMS + e-post", sent: daysAgo(160), status: "Akseptert" },
  { name: "Thomas Haug", unit: "B402", channel: "SMS + e-post", sent: daysAgo(150), status: "Akseptert" },
  { name: "Amalie Berg", unit: "A201", channel: "E-post", sent: daysAgo(150), status: "Akseptert" },
  { name: "Eirik Johansen", unit: "A305", channel: "SMS + e-post", sent: daysAgo(20), status: "Ikke akseptert" },
  { name: "Nora Eide", unit: "C201", channel: "SMS", sent: daysAgo(0, 9), status: "Levert" },
];

export default function InvitasjonerPage() {
  const { toast } = useStore();
  const [reminding, setReminding] = useState(false);

  const accepted = INVITES.filter((i) => i.status === "Akseptert").length;

  return (
    <div className="max-w-5xl space-y-5 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Beboerinvitasjoner</h1>
          <p className="text-sm text-muted-foreground">{accepted} av {INVITES.length} invitasjoner akseptert</p>
        </div>
        <Button onClick={() => toast({ title: "Invitasjoner sendt", description: "2 nye invitasjoner er sendt via SMS og e-post (demo).", variant: "success" })}>
          <Send aria-hidden />
          Send til alle nye
        </Button>
      </div>

      <Tabs defaultValue="status">
        <TabsList>
          <TabsTrigger value="status">Leveringsstatus</TabsTrigger>
          <TabsTrigger value="forhandsvisning">Forhåndsvisning</TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Beboer</TableHead>
                <TableHead>Enhet</TableHead>
                <TableHead>Kanal</TableHead>
                <TableHead>Sendt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Handling</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVITES.map((i) => (
                <TableRow key={i.name}>
                  <TableCell className="font-medium">{i.name}</TableCell>
                  <TableCell>{i.unit}</TableCell>
                  <TableCell className="text-muted-foreground">{i.channel}</TableCell>
                  <TableCell className="text-muted-foreground">{formatRelative(i.sent)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        i.status === "Akseptert"
                          ? "bg-evergreen-50 text-evergreen-700"
                          : i.status === "Levert"
                            ? "bg-fjord-50 text-fjord-700"
                            : "bg-amber-50 text-amber-800"
                      }
                    >
                      {i.status === "Akseptert" && <CheckCircle2 className="h-3 w-3" aria-hidden />}
                      {i.status === "Levert" && <Clock className="h-3 w-3" aria-hidden />}
                      {i.status === "Ikke akseptert" && <Bell className="h-3 w-3" aria-hidden />}
                      {i.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {i.status !== "Akseptert" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={reminding}
                        onClick={() => {
                          setReminding(true);
                          setTimeout(() => setReminding(false), 600);
                          toast({ title: "Påminnelse sendt", description: `${i.name} har fått en påminnelse på SMS.`, variant: "success" });
                        }}
                      >
                        Send påminnelse
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="forhandsvisning">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Smartphone className="h-4 w-4 text-evergreen-700" aria-hidden />
                SMS-invitasjon
              </h3>
              <div className="mt-3 rounded-2xl rounded-bl-md bg-muted p-4 text-sm leading-relaxed">
                Nordheim Bolig AS har invitert deg til TvellerOS for Middelthunet, leil. C103. Her kan du se dokumenter,
                melde reklamasjoner og følge avtaler. Åpne invitasjon: tveller.no/i/a8x3k2
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Avsender: TvellerOS · {"{{link}}"} fylles inn automatisk per beboer</p>
            </Card>
            <Card className="p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Mail className="h-4 w-4 text-evergreen-700" aria-hidden />
                E-postinvitasjon
              </h3>
              <div className="mt-3 rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground">Emne:</p>
                <p className="text-sm font-medium">Velkommen til din digitale boligperm – Middelthunet C103</p>
                <div className="mt-3 space-y-2 border-t border-border pt-3 text-sm leading-relaxed">
                  <p>Hei Lise,</p>
                  <p>
                    Gratulerer med ny bolig! Nordheim Bolig AS har invitert deg til TvellerOS, der du finner alle
                    dokumenter for boligen din, kan melde reklamasjoner med foto og følge avtaler med håndverkere.
                  </p>
                  <p className="font-medium text-evergreen-700">→ Aktiver kontoen din</p>
                  <p className="text-xs text-muted-foreground">Lenken er personlig og utløper om 30 dager.</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
