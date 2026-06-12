"use client";

import { ArrowLeft, CheckCircle2, ShieldCheck, ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label, Select, Textarea } from "@/components/ui/input";
import { formatNOK } from "@/lib/format";
import { MARKETPLACE_SERVICES } from "@/lib/seed";
import { useStore } from "@/lib/store";

export default function MarkedsplassTjenestePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { requestMarketplaceService, toast } = useStore();
  const [preferredTime, setPreferredTime] = useState("Formiddag (08–12)");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const service = MARKETPLACE_SERVICES.find((s) => s.id === id);

  if (!service) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Fant ikke tjenesten"
        description="Tjenesten er ikke lenger tilgjengelig."
        action={
          <Link href="/beboer/markedsplass">
            <Button variant="outline">Til markedsplassen</Button>
          </Link>
        }
      />
    );
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center py-10 text-center animate-fade-up">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-evergreen-100 text-evergreen-700">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </span>
        <h1 className="mt-5 text-xl font-semibold">Forespørsel sendt!</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {service.partner_name} tar kontakt med et tilbud, vanligvis innen 1–2 virkedager. Du følger status under «Mine
          bestillinger» på markedsplassen.
        </p>
        <Link href="/beboer/markedsplass" className="mt-6 w-full max-w-sm">
          <Button className="w-full" size="lg">Tilbake til markedsplassen</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-up">
      <Link href="/beboer/markedsplass" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Markedsplass
      </Link>

      <div className="flex aspect-[5/2] items-center justify-center rounded-2xl bg-gradient-to-br from-evergreen-50 to-fjord-50">
        <ShoppingBag className="h-10 w-10 text-evergreen-300" aria-hidden />
      </div>

      <div>
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-tight">{service.title}</h1>
          {service.partner_label && <Badge className="shrink-0 bg-fjord-50 text-fjord-700">Partner</Badge>}
        </div>
        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          {service.partner_name}
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
            {service.rating.toFixed(1)}
          </span>
        </p>
        <p className="mt-3 text-sm">{service.description}</p>
        <p className="mt-3 text-lg font-semibold">
          {service.price_type === "tilbud" ? "Fra " : ""}
          {formatNOK(service.starting_price)}
          <span className="text-sm font-normal text-muted-foreground">
            {service.price_type === "timepris" ? " per time" : service.price_type === "tilbud" ? " – endelig pris i tilbud" : " fastpris"}
          </span>
        </p>
      </div>

      <Card className="space-y-4 p-4">
        <h2 className="text-sm font-semibold">Be om tilbud</h2>
        <div className="space-y-1.5">
          <Label htmlFor="time">Når passer det best?</Label>
          <Select id="time" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)}>
            <option>Formiddag (08–12)</option>
            <option>Ettermiddag (12–16)</option>
            <option>Kveld (16–20)</option>
            <option>Helg</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="note">Beskriv hva du trenger</Label>
          <Textarea
            id="note"
            rows={3}
            placeholder="F.eks. «Tre taklamper skal monteres i stue og soverom»"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <Button
          className="w-full"
          size="lg"
          disabled={note.trim().length < 5}
          onClick={() => {
            requestMarketplaceService(service.id, service.title, preferredTime, note.trim());
            toast({ title: "Forespørsel sendt", description: `${service.partner_name} svarer normalt innen 1–2 virkedager.`, variant: "success" });
            setSent(true);
          }}
        >
          Send forespørsel
        </Button>
        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-evergreen-600" aria-hidden />
          Avtalen inngås direkte med {service.partner_name}. Kontaktinformasjonen din deles kun når du sender
          forespørselen.
        </p>
      </Card>
    </div>
  );
}
