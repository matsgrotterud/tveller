import { Scale } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Vilkår for bruk" };

const SECTIONS = [
  {
    title: "1. Om tjenesten",
    body: "TvellerOS er en plattform for ettermarked i nybygg, levert av Tveller AS. Tjenesten omfatter reklamasjonshåndtering, dokumentarkiv, kalender, meldinger, tilvalg, markedsplass og tilhørende moduler.",
  },
  {
    title: "2. Brukerkonto",
    body: "Du får tilgang via invitasjon fra utbygger eller sameie. Du er ansvarlig for å holde innloggingsinformasjonen din sikker og for aktivitet på din konto.",
  },
  {
    title: "3. Bruk av plattformen",
    body: "Plattformen skal brukes til formålet: oppfølging av bolig og fellesarealer. Innhold du laster opp (bilder, beskrivelser, meldinger) skal være relevant for saken og ikke krenke andres rettigheter.",
  },
  {
    title: "4. Reklamasjoner og frister",
    body: "TvellerOS hjelper deg å dokumentere og følge opp reklamasjoner, men plattformen gir ikke juridisk rådgivning. Frister og rettigheter følger av kjøpekontrakten og gjeldende lovgivning, blant annet bustadoppføringslova.",
  },
  {
    title: "5. Markedsplass",
    body: "Tjenester på markedsplassen leveres av tredjeparter. Avtale inngås direkte mellom deg og leverandøren. Partnere er tydelig merket, og Tveller AS kan motta provisjon. Personopplysninger selges aldri.",
  },
  {
    title: "6. Ansvar",
    body: "Tjenesten leveres «som den er». Tveller AS er ikke part i avtaleforholdet mellom boligkjøper og utbygger og er ikke ansvarlig for utfallet av reklamasjonssaker.",
  },
  {
    title: "7. Endringer",
    body: "Vi kan oppdatere vilkårene ved behov. Vesentlige endringer varsles i appen i god tid før de trer i kraft.",
  },
];

export default function VilkarPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link href="/" aria-label="Til forsiden">
            <Logo />
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">Logg inn</Button>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-evergreen-50 text-evergreen-700">
            <Scale className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Vilkår for bruk</h1>
            <p className="text-sm text-muted-foreground">Sist oppdatert 1. juni 2026</p>
          </div>
        </div>
        <div className="mt-8 space-y-4">
          {SECTIONS.map((s) => (
            <Card key={s.title} className="p-5">
              <h2 className="font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
