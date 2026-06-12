/**
 * AI-adapter for TvellerOS.
 *
 * I demo-modus brukes en deterministisk mock. Når AI_PROVIDER / OPENAI_API_KEY
 * er satt, kan `aiAdapter` byttes ut med et ekte kall – grensesnittet er likt.
 *
 * Alle AI-resultater er beslutningsstøtte og presenteres aldri som endelige
 * avgjørelser. AI trener ikke på kundedata som standard
 * (AI_DATA_PROCESSING_MODE=no_training).
 */

import type { RoomType, Severity, Trade } from "./types";

export interface AITriageResult {
  title: string;
  category: string;
  trade: Trade;
  severity: Severity;
  confidence: number;
  reasoning: string;
  missingInfo: string[];
  fdvSuggestion: string | null;
  similarIssues: string[];
}

interface TriageRule {
  keywords: string[];
  category: string;
  trade: Trade;
  severity: Severity;
  fdv: string | null;
  similar: string[];
}

const RULES: TriageRule[] = [
  { keywords: ["flis", "fug", "bom"], category: "Overflater", trade: "Flislegger", severity: "middels", fdv: "FDV – Veggflis bad (Marazzi Treverk)", similar: ["RK-2024-0118 Sprukket flis på bad", "RK-2024-0092 Manglende silikonfuge ved dusjnisje"] },
  { keywords: ["vann", "lekkasje", "sluk", "avløp", "trykk", "rør", "kran"], category: "Rør og sanitær", trade: "Rørlegger", severity: "høy", fdv: null, similar: ["RK-2024-0115 Sluk lukter på bad", "RK-2024-0112 Vanntrykk lavt på bad"] },
  { keywords: ["fukt", "mugg", "kondens"], category: "Fukt", trade: "Tømrer", severity: "kritisk", fdv: null, similar: ["RK-2024-0129 Fuktmerke ved vindu"] },
  { keywords: ["stikkontakt", "strøm", "sikring", "lys", "bryter", "elekt"], category: "Elektro", trade: "Elektriker", severity: "høy", fdv: null, similar: ["RK-2024-0127 Stikkontakt løs i stue"] },
  { keywords: ["ventilasjon", "avtrekk", "støy", "vifte", "brumm"], category: "Ventilasjon", trade: "Ventilasjon", severity: "middels", fdv: "FDV – Balansert ventilasjon (Flexit Nordic S3)", similar: ["RK-2024-0108 Ventilasjon støyer"] },
  { keywords: ["parkett", "gulv", "knirk", "ripe"], category: "Overflater", trade: "Parkett", severity: "lav", fdv: "FDV – Eikeparkett (Boen Andante)", similar: ["RK-2024-0125 Ripe i parkett", "RK-2024-0119 Gulv knirker i entré"] },
  { keywords: ["kjøkken", "skap", "benkeplate", "hengsle", "skuff"], category: "Kjøkken", trade: "Kjøkken", severity: "lav", fdv: "FDV – HTH kjøkkeninnredning", similar: ["RK-2024-0103 Kjøkkenskap lukker skjevt"] },
  { keywords: ["dør", "vindu", "lukker", "trekk", "karm", "list"], category: "Dører og vinduer", trade: "Tømrer", severity: "middels", fdv: null, similar: ["RK-2024-0121 Balkongdør lukker ikke tett"] },
];

const ROOM_TITLES: Record<string, string> = {
  bad: "på bad",
  kjøkken: "på kjøkken",
  stue: "i stue",
  soverom: "på soverom",
  entré: "i entré",
  balkong: "på balkong",
  bod: "i bod",
  fellesareal: "i fellesareal",
  annet: "",
};

export function aiTriage(description: string, room: RoomType): AITriageResult {
  const lower = description.toLowerCase();
  const rule = RULES.find((r) => r.keywords.some((k) => lower.includes(k)));

  const missingInfo: string[] = [];
  if (description.length < 60) missingInfo.push("Beskriv omfanget mer detaljert (størrelse, plassering)");
  if (!lower.includes("når") && !lower.includes("siden") && !lower.includes("overtakelse")) missingInfo.push("Når oppdaget du feilen første gang?");
  if (!lower.match(/\d/)) missingInfo.push("Angi omtrentlige mål eller antall hvis relevant");

  if (!rule) {
    return {
      title: `Feil ${ROOM_TITLES[room] ?? ""}`.trim(),
      category: "Annet",
      trade: "Annet",
      severity: "middels",
      confidence: 0.42,
      reasoning: "Beskrivelsen matcher ingen kjente feilmønstre. Kategorien er satt til «Annet» og bør vurderes manuelt.",
      missingInfo,
      fdvSuggestion: null,
      similarIssues: [],
    };
  }

  const firstSentence = description.split(/[.!?]/)[0]?.trim() ?? description;
  const shortTitle = firstSentence.length > 56 ? `${firstSentence.slice(0, 53)}…` : firstSentence;

  return {
    title: shortTitle || `Feil ${ROOM_TITLES[room] ?? ""}`.trim(),
    category: rule.category,
    trade: rule.trade,
    severity: rule.severity,
    confidence: 0.87,
    reasoning: `Beskrivelsen inneholder nøkkelord knyttet til ${rule.category.toLowerCase()} (${rule.keywords.filter((k) => lower.includes(k)).join(", ")}). Lignende saker i samme prosjekt er kategorisert likt.`,
    missingInfo,
    fdvSuggestion: rule.fdv,
    similarIssues: rule.similar,
  };
}

export function aiSuggestReply(claimTitle: string, status: string): string {
  return `Hei!\n\nTakk for at du meldte inn «${claimTitle}». Vi har gått gjennom dokumentasjonen din, og saken er nå ${status.toLowerCase()}. Vi holder deg oppdatert her i appen, og du får varsel så snart det skjer noe nytt.\n\nGi oss gjerne beskjed om noe endrer seg i mellomtiden.\n\nVennlig hilsen\nNordheim Bolig AS`;
}

export const AI_DASHBOARD_INSIGHTS = [
  { id: "ai1", icon: "trend", text: "Flisrelaterte saker har økt 24 % siste 30 dager.", detail: "12 av 21 nye saker i Middelthunet gjelder flis eller fug. Flere kommer fra samme flisparti i Bygg C – vurder massesak.", confidence: 0.91 },
  { id: "ai2", icon: "speed", text: "Bare Rør AS har raskest gjennomsnittlig responstid.", detail: "9 timer i snitt, mot 16 timer for porteføljen. Vurder å bruke dem på flere prosjekter.", confidence: 0.96 },
  { id: "ai3", icon: "deadline", text: "3 saker nærmer seg intern frist.", detail: "RK-2024-0121 (1 dag), RK-2024-0108 (2 dager) og RK-2024-0129 (3 dager) bør prioriteres i dag.", confidence: 1 },
  { id: "ai4", icon: "warning", text: "Middelthunet har høyere gjenåpningsrate enn porteføljesnittet.", detail: "8,4 % mot 5,1 %. Ventilasjonssaker står for det meste av avviket.", confidence: 0.88 },
  { id: "ai5", icon: "cluster", text: "AI fant 4 lignende saker i samme bygg.", detail: "Flissprekker i Bygg C ser ut til å komme fra samme leveranse. Foreslår felles befaring med Flispartner Oslo.", confidence: 0.84 },
  { id: "ai6", icon: "trend", text: "Ventilasjonssaker tar i snitt 2,4 dager lengre enn andre fag.", detail: "Ventilasjon Norge AS har 26 timers responstid. Vurder å ta det opp i neste leverandørmøte.", confidence: 0.89 },
];
