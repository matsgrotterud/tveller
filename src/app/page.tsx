import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  HardHat,
  Home,
  Lock,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FEATURES = [
  { icon: Wrench, title: "Reklamasjon", desc: "Komplett saksflyt fra beboer melder feil til utbedringen er bekreftet og arkivert." },
  { icon: CalendarDays, title: "Kalender", desc: "Tidspunktforslag, avtaler og påminnelser – synkronisert for alle parter." },
  { icon: FileText, title: "FDV", desc: "Strukturert dokumentarkiv koblet til prosjekt, bolig, rom og komponent." },
  { icon: HardHat, title: "Underleverandører", desc: "Arbeidsordre, ferdigrapporter og kvalitetsscore for hvert fag." },
  { icon: Scale, title: "Juridisk oversikt", desc: "Reklamasjonsradar, frister og komplett dokumentasjonspakke for hver sak." },
  { icon: ShoppingBag, title: "Markedsplass", desc: "Kvalitetssikrede tjenester til beboerne – med transparent partnermerking." },
  { icon: Users, title: "Sameie", desc: "Fellesarealer, styredokumenter, kunngjøringer og felles vedlikehold." },
  { icon: Sparkles, title: "Tilvalg", desc: "Digital tilvalgskatalog med frister, mva og godkjenningsflyt." },
];

const WORKFLOW = [
  { step: "1", title: "Beboer melder feil", desc: "Foto, markering på bilde og AI-forslag til kategori – på under ett minutt." },
  { step: "2", title: "Utbygger vurderer", desc: "Komplett saksbilde med frister, lignende saker og FDV-kobling." },
  { step: "3", title: "Leverandør utbedrer", desc: "Arbeidsordre, tre tidspunktforslag og ferdigrapport med før/etter-bilder." },
  { step: "4", title: "Beboer bekrefter", desc: "Saken arkiveres med komplett, juridisk sporbar historikk." },
];


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex" aria-label="Hovedmeny">
            <a href="#funksjoner" className="hover:text-foreground">Funksjoner</a>
            <a href="#arbeidsflyt" className="hover:text-foreground">Slik virker det</a>
            <a href="#sikkerhet" className="hover:text-foreground">Sikkerhet</a>
            <a href="#priser" className="hover:text-foreground">Priser</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Logg inn</Button>
            </Link>
            <Link href="/login">
              <Button>Book demo</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="gradient-hero">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
          <Badge className="mx-auto bg-evergreen-50 text-evergreen-700 border border-evergreen-200">
            Norsk plattform for ettermarked i nybygg
          </Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            Reklamasjonshåndtering har aldri vært enklere
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            TvellerOS samler reklamasjoner, FDV, kalender, underleverandører og dokumentasjon i én trygg plattform.
            Én bolig. Én tidslinje. Én kilde til sannhet.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/login">
              <Button size="lg">
                Book demo
                <ArrowRight aria-hidden />
              </Button>
            </Link>
            <Link href="/beboer">
              <Button size="lg" variant="outline">Se plattformen</Button>
            </Link>
          </div>

          {/* Produktpanel-mosaikk */}
          <div className="mx-auto mt-16 grid max-w-4xl gap-4 text-left sm:grid-cols-3">
            <Card className="gradient-card p-4 sm:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Reklamasjoner – Middelthunet</p>
                <Badge className="bg-evergreen-50 text-evergreen-700">21 åpne</Badge>
              </div>
              <div className="mt-3 space-y-2">
                {[
                  { t: "Sprukket flis på bad", s: "Tidspunkt foreslått", c: "bg-amber-50 text-amber-800" },
                  { t: "Ventilasjon støyer", s: "Gjenåpnet", c: "bg-red-50 text-red-700" },
                  { t: "Stikkontakt løs i stue", s: "Sendt til underleverandør", c: "bg-violet-50 text-violet-700" },
                ].map((r) => (
                  <div key={r.t} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                    <span className="text-sm">{r.t}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.c}`}>{r.s}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="gradient-card p-4">
              <p className="text-sm font-semibold">Reklamasjonsradar</p>
              <p className="mt-3 text-3xl font-semibold text-evergreen-700">4,6 år</p>
              <p className="text-xs text-muted-foreground">igjen av reklamasjonsperioden</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[8%] rounded-full bg-evergreen-600" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">3 saker nærmer seg intern frist</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 text-center md:grid-cols-4">
          {[
            { v: "12 400+", l: "boenheter på plattformen" },
            { v: "38 %", l: "raskere saksbehandling" },
            { v: "97 %", l: "saker med komplett dokumentasjon" },
            { v: "4,8 / 5", l: "beboertilfredshet" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-3xl font-semibold text-evergreen-700">{s.v}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Funksjoner */}
      <section id="funksjoner" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center text-3xl font-semibold tracking-tight">Alt ettermarkedet trenger – på ett sted</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          TvellerOS er ikke et saksbehandlingssystem. Det er et operativsystem for hele ettermarkedslivssyklusen.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Card key={f.title} className="p-5 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
              <span className="inline-grid h-10 w-10 place-items-center rounded-xl bg-evergreen-50 text-evergreen-700">
                <f.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Arbeidsflyt */}
      <section id="arbeidsflyt" className="border-y border-border bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-semibold tracking-tight">Én sammenhengende flyt</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Fra feilen oppdages til saken er arkivert – alle parter er koordinert hele veien.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {WORKFLOW.map((w) => (
              <div key={w.step} className="relative">
                <span className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-sm font-bold text-white">{w.step}</span>
                <h3 className="mt-4 font-semibold">{w.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Målgrupper */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Building2, title: "For utbygger", points: ["Full kontroll på porteføljen", "Frist- og risikovarsling", "Leverandørscore og benchmark", "Komplett juridisk dokumentasjon"] },
            { icon: Home, title: "For beboer", points: ["Meld feil med foto på ett minutt", "Følg saken steg for steg", "Velg tidspunkt som passer", "Alle boligdokumenter samlet"] },
            { icon: HardHat, title: "For underleverandør", points: ["Tydelige arbeidsordre", "Foreslå tidspunkter digitalt", "Ferdigrapport med før/etter-bilder", "Bygg dokumentert kvalitetsscore"] },
          ].map((g) => (
            <Card key={g.title} className="p-6">
              <span className="inline-grid h-11 w-11 place-items-center rounded-xl gradient-brand text-white">
                <g.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{g.title}</h3>
              <ul className="mt-3 space-y-2">
                {g.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-evergreen-600" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Sikkerhet */}
      <section id="sikkerhet" className="gradient-brand py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <Badge className="bg-white/10 text-white">GDPR og sikkerhet</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">Bygget for tillit og juridisk trygghet</h2>
              <p className="mt-3 text-evergreen-100">
                Personvern er innebygd i hele plattformen – fra rollebasert tilgang og tenant-isolasjon til
                uforanderlige auditlogger og databehandleravtaler.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Rollebasert tilgangskontroll og minst-privilegium",
                  "Komplett auditlogg for alle sensitive handlinger",
                  "Dataeksport og sletting på forespørsel",
                  "AI brukes som beslutningsstøtte og trener ikke på kundedata som standard",
                  "Supporttilgang krever begrunnelse og logges alltid",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-evergreen-300" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <Card className="border-white/10 bg-white/5 p-6 text-white shadow-none">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-evergreen-300" aria-hidden />
                <p className="font-semibold">Audit log</p>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {[
                  { a: "claim.decision_made", d: "Ola Sandvik godkjente RK-2024-0118" },
                  { a: "support.impersonation_started", d: "Supporttilgang med begrunnelse, 60 min, kun lesing" },
                  { a: "gdpr.export_requested", d: "Beboer ba om dataeksport – fullført på 2 dager" },
                ].map((e) => (
                  <div key={e.a} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="font-mono text-xs text-evergreen-300">{e.a}</p>
                    <p className="mt-1 text-evergreen-50">{e.d}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Priser */}
      <section id="priser" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center text-3xl font-semibold tracking-tight">Priser som skalerer med porteføljen</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Fast månedspris pluss pris per aktiv enhet. Alle planer inkluderer ubegrenset antall brukere.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {[
            { name: "Starter", price: "4 900", desc: "For små prosjekter", features: ["Grunnleggende reklamasjon", "FDV-arkiv", "Kalender", "E-postvarsler"] },
            { name: "Pro", price: "14 900", desc: "Mest populær", featured: true, features: ["Full reklamasjonsflyt", "Underleverandørportal", "AI-triage", "Analyse", "SMS"] },
            { name: "Enterprise", price: "39 900", desc: "For store utbyggere", features: ["White-label", "Integrasjoner", "Avansert GDPR", "SLA"] },
            { name: "Portfolio", price: "69 900", desc: "For porteføljer", features: ["Porteføljebenchmark", "Avansert analyse", "API", "Multi-org", "Dedikert suksess"] },
          ].map((p) => (
            <Card key={p.name} className={`p-6 ${p.featured ? "border-evergreen-400 ring-2 ring-evergreen-200" : ""}`}>
              {p.featured && <Badge className="bg-evergreen-600 text-white">Anbefalt</Badge>}
              <h3 className={`text-lg font-semibold ${p.featured ? "mt-3" : ""}`}>{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
              <p className="mt-4 text-3xl font-semibold">
                {p.price} <span className="text-sm font-normal text-muted-foreground">kr/mnd</span>
              </p>
              <ul className="mt-4 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-evergreen-600" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Klar for å samle ettermarkedet?</h2>
          <p className="mt-3 text-muted-foreground">
            Se hvordan TvellerOS gjør beboere tryggere, utbyggere mer effektive og underleverandører bedre organisert.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/login">
              <Button size="lg">
                Book demo
                <ArrowRight aria-hidden />
              </Button>
            </Link>
            <Link href="/utbygger">
              <Button size="lg" variant="outline">Utforsk utbyggerportalen</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-evergreen-950 py-12 text-evergreen-100">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Logo dark />
              <p className="mt-3 text-sm text-evergreen-300">Alt ettermarkedet trenger – på ett sted.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Produkt</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a href="#funksjoner" className="hover:text-white">Funksjoner</a></li>
                <li><a href="#priser" className="hover:text-white">Priser</a></li>
                <li><Link href="/login" className="hover:text-white">Logg inn</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Selskap</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>Tveller AS</li>
                <li>Org.nr 931 000 111</li>
                <li>Universitetsgata 2, 0164 Oslo</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Juridisk</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link href="/personvern" className="hover:text-white">Personvernerklæring</Link></li>
                <li><Link href="/vilkar" className="hover:text-white">Vilkår</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-evergreen-300">
            <p>© 2026 Tveller AS. Alle rettigheter forbeholdt.</p>
            <p className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" aria-hidden />
              Driftsstatus: Alle systemer i normal drift
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
