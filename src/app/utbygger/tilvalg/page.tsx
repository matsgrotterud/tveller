"use client";

import { CheckCircle2, Download, Plus, ShoppingBag, XCircle } from "lucide-react";
import { useState } from "react";
import { TilvalgStatusPill } from "@/components/shared/pills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Label, Select } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNOK, formatShortDate } from "@/lib/format";
import { TILVALG_OPTIONS, getSupplierByOrg, getUnit, getUser } from "@/lib/seed";
import { ROOM_LABEL } from "@/lib/status";
import { useStore } from "@/lib/store";

const PRICE_TYPE_LABEL: Record<string, string> = { fixed: "Fastpris", per_m2: "Per m²", per_unit: "Per stk" };

export default function TilvalgAdminPage() {
  const { tilvalgOrders, setTilvalgOrderStatus, toast } = useStore();
  const [newOpen, setNewOpen] = useState(false);

  const submitted = tilvalgOrders.filter((o) => o.status === "Sendt inn" || o.status === "Under behandling");
  const totalValue = tilvalgOrders.filter((o) => o.status === "Godkjent").reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tilvalg</h1>
          <p className="text-sm text-muted-foreground">
            {TILVALG_OPTIONS.length} publiserte tilvalg i Fjordhagen · {formatNOK(totalValue)} godkjent ordresum
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast({ title: "Eksport klar", description: "Ordresammendrag eksportert til Excel (demo).", variant: "success" })}>
            <Download aria-hidden />
            Eksporter ordrer
          </Button>
          <Button onClick={() => setNewOpen(true)}>
            <Plus aria-hidden />
            Nytt tilvalg
          </Button>
        </div>
      </div>

      <Tabs defaultValue="ordrer">
        <TabsList>
          <TabsTrigger value="ordrer">Bestillinger {submitted.length > 0 && <Badge className="ml-1.5 bg-evergreen-700 text-white">{submitted.length}</Badge>}</TabsTrigger>
          <TabsTrigger value="katalog">Katalog</TabsTrigger>
        </TabsList>

        <TabsContent value="ordrer">
          {tilvalgOrders.length === 0 ? (
            <Card className="grid place-items-center p-10 text-center">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" aria-hidden />
              <p className="mt-2 text-sm text-muted-foreground">Ingen bestillinger ennå.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {tilvalgOrders.map((o) => {
                const resident = getUser(o.resident_user_id);
                const unit = getUnit(o.unit_id);
                const pending = o.status === "Sendt inn" || o.status === "Under behandling";
                return (
                  <Card key={o.id} className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{resident?.name} · {unit?.unit_number}</p>
                          <TilvalgStatusPill status={o.status} />
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {o.submitted_at ? `Sendt inn ${formatShortDate(o.submitted_at)}` : "Utkast"}
                        </p>
                      </div>
                      <p className="text-lg font-semibold">{formatNOK(o.total)}</p>
                    </div>
                    <ul className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
                      {o.items.map((it) => (
                        <li key={it.option_id} className="flex justify-between">
                          <span>{it.quantity} × {it.title}</span>
                          <span className="text-muted-foreground">{formatNOK(it.total)}</span>
                        </li>
                      ))}
                      <li className="flex justify-between text-xs text-muted-foreground">
                        <span>Herav mva. (25 %)</span>
                        <span>{formatNOK(o.vat)}</span>
                      </li>
                    </ul>
                    {pending && (
                      <div className="mt-3 flex gap-2 border-t border-border pt-3">
                        <Button size="sm" onClick={() => setTilvalgOrderStatus(o.id, "Godkjent")}>
                          <CheckCircle2 aria-hidden />
                          Godkjenn
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setTilvalgOrderStatus(o.id, "Avvist")}>
                          <XCircle aria-hidden />
                          Avvis
                        </Button>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="katalog">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tilvalg</TableHead>
                <TableHead>Rom</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Pris</TableHead>
                <TableHead>Pristype</TableHead>
                <TableHead>Leverandør</TableHead>
                <TableHead>Frist</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TILVALG_OPTIONS.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <p className="font-medium">{o.title}</p>
                    <p className="text-xs text-muted-foreground">{o.description}</p>
                  </TableCell>
                  <TableCell className="capitalize">{ROOM_LABEL[o.room_type] ?? o.room_type}</TableCell>
                  <TableCell><Badge className="bg-muted text-muted-foreground">{o.category}</Badge></TableCell>
                  <TableCell className="font-medium">{o.price === 0 ? "Standard" : formatNOK(o.price)}</TableCell>
                  <TableCell className="text-muted-foreground">{PRICE_TYPE_LABEL[o.price_type]}</TableCell>
                  <TableCell className="text-muted-foreground">{getSupplierByOrg(o.supplier_org_id)?.name ?? "–"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatShortDate(o.deadline)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nytt tilvalg</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="tv-title">Tittel</Label>
              <Input id="tv-title" placeholder="F.eks. Mørk eikeparkett" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="tv-price">Pris (eks. mva.)</Label>
                <Input id="tv-price" type="number" placeholder="14 500" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="tv-type">Pristype</Label>
                <Select id="tv-type" className="mt-1">
                  <option>Fastpris</option>
                  <option>Per m²</option>
                  <option>Per stk</option>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="tv-room">Rom</Label>
              <Select id="tv-room" className="mt-1">
                {["Bad", "Kjøkken", "Stue", "Soverom", "Entré"].map((r) => <option key={r}>{r}</option>)}
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)}>Avbryt</Button>
            <Button
              onClick={() => {
                setNewOpen(false);
                toast({ title: "Tilvalg opprettet", description: "Tilvalget er lagret som utkast og kan publiseres til beboere.", variant: "success" });
              }}
            >
              Lagre tilvalg
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
