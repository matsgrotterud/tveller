# TvellerOS – oppsettsguide

> **Alt ettermarkedet trenger – på ett sted.**
>
> Denne guiden forklarer hvordan du kjører TvellerOS lokalt, hva som er mocket i demo-modus,
> og nøyaktig hvilke nøkler og tjenester som må kobles til før produksjon.

---

## 1. Kjør lokalt

```bash
npm install
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000). **Ingen miljøvariabler kreves** – appen kjører fullt ut
med seedet demodata og mock-adaptere.

- Landingsside: `/`
- Innlogging (demo): `/login`
- Demodata lagres i `localStorage` og kan tilbakestilles fra Superadmin → Innstillinger → «Tilbakestill demodata».

## 2. Demo-brukere

Innlogging er mocket i demo-modus (`DEMO_MODE=true`). Velg en konto på `/login` – passord kreves ikke:

| E-post | Rolle | Portal |
| --- | --- | --- |
| `superadmin@tveller.no` | Superadmin | `/admin` |
| `prosjektleder@nordheim.no` | Utbygger admin | `/utbygger` |
| `kundeservice@nordheim.no` | Kundebehandler | `/utbygger` |
| `juridisk@nordheim.no` | Juridisk ansvarlig | `/utbygger/juridisk` |
| `lise@example.com` | Beboer | `/beboer` |
| `styret@middelthunet.no` | Sameiestyre | `/beboer/sameie` |
| `thomas@bareror.no` | Underleverandør admin | `/leverandor` |
| `tekniker@elektrofix.no` | Tekniker | `/leverandor/arbeidsordre` |

Rollebytteren øverst i appen (kun demo-modus) lar deg hoppe mellom portalene uten å logge inn på nytt.

## 3. Test hele saksflyten

1. Som **Beboer**: `/beboer/reklamasjoner/ny` → opprett sak (rom → foto → markering → beskrivelse → AI-forslag → send inn).
2. Bytt til **Utbygger**: saken ligger i innboksen → åpne kommandosenteret → godkjenn → tildel leverandør.
3. Bytt til **Underleverandør**: aksepter arbeidsordren → foreslå tre tidspunkter.
4. Bytt til **Beboer**: velg tidspunkt i saken/kalenderen.
5. **Underleverandør**: start arbeid → send ferdigrapport.
6. **Beboer**: bekreft utbedring – eller gjenåpne.
7. **Utbygger**: arkiver og eksporter dokumentasjonspakke.

Alle steg oppdaterer delt tilstand, varsler og revisjonslogg i sanntid.

## 4. Miljøvariabler

Kopier malen og fyll inn etter hvert som tjenester kobles til:

```bash
cp .env.example .env.local
```

Se `.env.example` for komplett liste med kommentarer. Påkrevd for produksjon (minimum):
`DATABASE_URL`, `AUTH_SECRET`/`NEXTAUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, samt `DEMO_MODE=false`.

## 5. Database (Supabase/Postgres)

1. Opprett et Supabase-prosjekt (velg region **eu-north-1 / Stockholm** for EU/EØS-lagring).
2. Kjør skjemaet: `db/schema.sql` (SQL-editor i Supabase eller `psql $DATABASE_URL -f db/schema.sql`).
3. Sett `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` og `SUPABASE_SERVICE_ROLE_KEY`.
4. Skjemaet aktiverer Row Level Security på alle tenant-tabeller – fullfør policyene etter mønsteret nederst i filen
   (tenant-isolasjon via JWT-claim, beboer-tilgang via `auth.uid()`).
5. Datalaget i appen ligger i `src/lib/store.tsx` med en tydelig handlings-API (`createClaim`, `decideClaim`,
   `assignSupplier`, `proposeSlots`, osv.). Bytt implementasjonen mot Supabase-kall/server actions – komponentene
   trenger ikke endres.

## 6. Stripe

1. Opprett produkter og månedspriser i Stripe for **Starter**, **Pro**, **Enterprise** og **Portfolio**.
2. Sett `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` og pris-ID-ene
   (`STRIPE_PRICE_STARTER` … `STRIPE_PRICE_PORTFOLIO`).
3. Bruksbasert prising (SMS, AI, lagring, BankID, provisjon) rapporteres som usage records eller faktureringslinjer.

## 7. Stripe webhook

1. Legg til endepunkt i Stripe Dashboard: `https://<din-app>/api/webhooks/stripe`.
2. Abonner på: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`,
   `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`.
3. Sett `STRIPE_WEBHOOK_SECRET`. Ruten ligger i `src/app/api/webhooks/stripe/route.ts` med ferdig hendelsesliste –
   fyll inn håndteringen når databasen er koblet til.
4. Lokal testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.

## 8. E-post

Sett `EMAIL_PROVIDER` til `resend`, `postmark` eller `sendgrid` + tilhørende API-nøkkel og `FROM_EMAIL`.
Inntil da logger mock-adapteren e-poster og viser dem som varsler i appen.

## 9. SMS

Sett `SMS_PROVIDER` til `link_mobility` (anbefalt i Norge) eller `twilio` + nøkler og `SMS_SENDER`.
SMS-maler (invitasjon, tidsforslag, påminnelser) finnes i invitasjons- og varslingsflyten.

## 10. Fillagring

Sett `STORAGE_PROVIDER=s3` (eller `supabase`) + S3-nøkler. Filopplasting (bevis, FDV, ferdigrapporter) er mocket
til da. Husk: filtilgang skal respektere dokumentets `visibility` og brukerens rolle.

## 11. AI

Sett `AI_PROVIDER=openai` og `OPENAI_API_KEY`. Adapteret i `src/lib/ai.ts` (triage, svarforslag, innsikt) byttes da
fra regelbasert mock til ekte modellkall. Behold `AI_DATA_PROCESSING_MODE=no_training` – produktet lover at AI ikke
trener på kundedata, og all AI-output er merket «Beslutningsstøtte».

## 12. Deploy

Anbefalt: **Vercel** (region `arn1`/Stockholm for EU-data).

```bash
vercel
```

Sett alle miljøvariabler i Vercel-prosjektet. Alternativt kjører appen hvor som helst med
`npm run build && npm start`.

## 13. Hva er mocket til nøkler legges inn?

| Funksjon | Demo-modus | Aktiveres av |
| --- | --- | --- |
| Innlogging/auth | Demo-kontovelger | `AUTH_SECRET` + auth-leverandør, `DEMO_MODE=false` |
| Database | `localStorage` + seed | `DATABASE_URL` / Supabase-nøkler |
| Filopplasting | Plassholder-galleri | S3/Supabase Storage-nøkler |
| E-post/SMS | Vises som varsler i appen | E-post/SMS-nøkler |
| AI-triage og forslag | Regelbasert mock | `OPENAI_API_KEY` |
| Stripe (abonnement/faktura) | Statisk demodata | Stripe-nøkler + webhook |
| BankID/Vipps | Kodeverifisering (demo) | BankID/Vipps-nøkler |
| Kart/ruteoptimalisering | Plassholder | `MAPS_API_KEY` |
| ICS-/kalendereksport | Toast (demo) | `CALENDAR_PROVIDER` |

## 14. Sikkerhetssjekkliste før produksjon

- [ ] `DEMO_MODE=false` – fjerner rollebytter og demo-innlogging
- [ ] Ekte autentisering med tofaktor for administratorer
- [ ] RLS-policyer fullført og testet for alle tabeller (ingen kryss-tenant-tilgang)
- [ ] Audit-logg skrives ved alle muterende operasjoner (mønsteret finnes i `store.tsx`)
- [ ] Filtilgang validerer `visibility` + rolle på serversiden
- [ ] Supporttilgang krever begrunnelse, er tidsbegrenset og logges (implementert i Superadmin → Support)
- [ ] Databehandleravtaler signert per kunde; underdatabehandler-listen oppdatert
- [ ] Sletterutiner/anonymisering iht. `retention_policies`
- [ ] `WEBHOOK_SECRET` satt og webhook-signaturer verifiseres
- [ ] Sentry (`SENTRY_DSN`) eller tilsvarende feilovervåking aktivert
- [ ] Rate limiting på API-ruter og innlogging
- [ ] Backup og gjenopprettingsplan for databasen

## 15. Prosjektstruktur

```
src/
  app/            # App Router: / (landing), /login, /beboer, /utbygger, /leverandor, /admin
    api/webhooks/stripe/   # Stripe webhook-plassholder
  components/
    ui/           # Gjenbrukbare primitive komponenter (shadcn-stil)
    shared/       # Domenekomponenter (shell, pills, gallerier, command menu …)
  lib/
    types.ts      # Komplett domenemodell (tenant-scopet)
    seed.ts       # Realistisk norsk demodata (15+ saker, 3 kunder, 5 prosjekter)
    store.tsx     # Klient-datalag med handlings-API – byttes mot Supabase
    ai.ts         # AI-adapter (mock → OpenAI)
    permissions.ts# Rollebasert tilgangskontroll
    format.ts     # nb-NO dato/klokkeslett/NOK
db/schema.sql     # Postgres-skjema med indekser og RLS-forberedelse
```
