# TvellerOS

**Alt ettermarkedet trenger – på ett sted.**

TvellerOS er en norsk SaaS-plattform for hele ettermarkedet i nyboligprosjekter: reklamasjon,
overtakelse, FDV-dokumenter, kalender og avtaler, underleverandørkoordinering, beboerkommunikasjon,
juridisk dokumentasjon, analyse, tilvalg, markedsplass og sameie – i fire portaler:

- **Beboer** (`/beboer`) – mobil-først boligperm med reklamasjonsveiviser
- **Utbygger** (`/utbygger`) – saksbehandling, kommandosenter, analyse og juridisk radar
- **Underleverandør** (`/leverandor`) – arbeidsordre, tidsforslag, ruteplan og ferdigrapporter
- **Superadmin** (`/admin`) – SaaS-drift, fakturering, GDPR-senter, feature flags og audit

## Kom i gang

```bash
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000). Appen kjører fullt ut i demo-modus med
realistisk norsk demodata og mock-adaptere – **ingen API-nøkler kreves**.

Logg inn på `/login` med en av demo-kontoene (f.eks. `lise@example.com` for beboer eller
`prosjektleder@nordheim.no` for utbygger), eller bruk rollebytteren i appen.

## Dokumentasjon

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** – komplett guide: lokal kjøring, demo-brukere, hele saksflyten,
  tilkobling av Supabase/Postgres, Stripe, e-post, SMS, lagring og AI, deploy og sikkerhetssjekkliste.
- **[db/schema.sql](./db/schema.sql)** – produksjonsklart Postgres-skjema med indekser og RLS-forberedelse.
- **[.env.example](./.env.example)** – alle miljøvariabler med kommentarer.

## Teknologi

Next.js 16 (App Router) · TypeScript · React 19 · Tailwind CSS 4 · Radix UI · Recharts · Zod ·
Lucide · shadcn/ui-mønster. Klient-datalag i `src/lib/store.tsx` med handlings-API som byttes
mot Supabase/server actions ved produksjonssetting.
