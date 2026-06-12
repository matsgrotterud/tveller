import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Personvernerklæring" };

const SECTIONS = [
  {
    title: "1. Hvem vi er",
    body: "Tveller AS (org.nr 931 000 111) leverer plattformen TvellerOS til utbyggere av nye boliger. Utbyggeren er behandlingsansvarlig for opplysningene om deg som beboer, og Tveller AS er databehandler.",
  },
  {
    title: "2. Hvilke opplysninger vi behandler",
    body: "Vi behandler kontaktinformasjon (navn, e-post, telefon), informasjon om boligen din, reklamasjonssaker med bilder og meldinger, avtaler og dokumenter knyttet til boligen. Vi samler ikke inn mer enn det som er nødvendig for å følge opp boligen din.",
  },
  {
    title: "3. Formål og rettslig grunnlag",
    body: "Opplysningene brukes til å håndtere reklamasjoner, koordinere utbedringer, dele boligdokumentasjon og oppfylle utbyggers forpliktelser etter bustadoppføringslova og avhendingslova. Rettslig grunnlag er avtale og rettslig forpliktelse.",
  },
  {
    title: "4. AI og beslutningsstøtte",
    body: "AI brukes som beslutningsstøtte – for eksempel til å foreslå kategori på en sak – og aldri til å fatte endelige avgjørelser. AI trener ikke på kundedata som standard (AI_DATA_PROCESSING_MODE=no_training).",
  },
  {
    title: "5. Hvem har tilgang",
    body: "Tilgangen er rollebasert: utbygger ser saker i sine prosjekter, underleverandører ser kun arbeidsordre de er tildelt, og interne notater er aldri synlige for andre parter. Support-tilgang fra Tveller AS krever dokumentert begrunnelse og logges alltid.",
  },
  {
    title: "6. Lagring og sletting",
    body: "Saksdokumentasjon lagres så lenge reklamasjonsperioden løper (normalt 5 år) og deretter i henhold til avtalt oppbevaringspolicy. Du kan be om innsyn, eksport, retting eller sletting under Personvern i appen.",
  },
  {
    title: "7. Dine rettigheter",
    body: "Du har rett til innsyn, dataportabilitet, retting og sletting. Forespørsler håndteres i appen under Personvern, og du kan følge status hele veien. Du kan også klage til Datatilsynet.",
  },
];

export default function PersonvernPage() {
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
            <ShieldCheck className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Personvernerklæring</h1>
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
