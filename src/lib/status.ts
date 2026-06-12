import type { ClaimStatus, RiskLevel, Severity, TilvalgOrderStatus, WorkOrderStatus } from "./types";

export const CLAIM_STATUSES: ClaimStatus[] = [
  "Utkast",
  "Sendt inn",
  "Mottatt",
  "Trenger mer info",
  "Under vurdering",
  "Befaring nødvendig",
  "Godkjent",
  "Avvist",
  "Sendt til underleverandør",
  "Tidspunkt foreslått",
  "Planlagt",
  "Under utbedring",
  "Klar for kontroll",
  "Ferdigstilt",
  "Bekreftet av beboer",
  "Gjenåpnet",
  "Eskalert",
  "Arkivert",
];

type StatusStyle = { bg: string; text: string; dot: string };

const styles = {
  neutral: { bg: "bg-sand-100", text: "text-muted-foreground", dot: "bg-sand-300" },
  blue: { bg: "bg-fjord-50", text: "text-fjord-700", dot: "bg-fjord-500" },
  green: { bg: "bg-evergreen-50", text: "text-evergreen-700", dot: "bg-evergreen-500" },
  amber: { bg: "bg-amber-50", text: "text-amber-800", dot: "bg-amber-500" },
  red: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  purple: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
} satisfies Record<string, StatusStyle>;

export const CLAIM_STATUS_STYLE: Record<ClaimStatus, StatusStyle> = {
  Utkast: styles.neutral,
  "Sendt inn": styles.blue,
  Mottatt: styles.blue,
  "Trenger mer info": styles.amber,
  "Under vurdering": styles.blue,
  "Befaring nødvendig": styles.purple,
  Godkjent: styles.green,
  Avvist: styles.red,
  "Sendt til underleverandør": styles.purple,
  "Tidspunkt foreslått": styles.amber,
  Planlagt: styles.blue,
  "Under utbedring": styles.blue,
  "Klar for kontroll": styles.amber,
  Ferdigstilt: styles.green,
  "Bekreftet av beboer": styles.green,
  Gjenåpnet: styles.red,
  Eskalert: styles.red,
  Arkivert: styles.neutral,
};

export const WORK_ORDER_STATUS_STYLE: Record<WorkOrderStatus, StatusStyle> = {
  Ny: styles.blue,
  Akseptert: styles.blue,
  "Tidspunkt foreslått": styles.amber,
  Planlagt: styles.blue,
  Pågår: styles.purple,
  Ferdigstilt: styles.green,
  Avvist: styles.red,
};

export const TILVALG_STATUS_STYLE: Record<TilvalgOrderStatus, StatusStyle> = {
  Utkast: styles.neutral,
  "Sendt inn": styles.blue,
  "Under behandling": styles.amber,
  Godkjent: styles.green,
  Avvist: styles.red,
  Fakturert: styles.purple,
  Ferdigstilt: styles.green,
};

export const SEVERITY_STYLE: Record<Severity, StatusStyle> = {
  lav: styles.neutral,
  middels: styles.blue,
  høy: styles.amber,
  kritisk: styles.red,
};

export const RISK_STYLE: Record<RiskLevel, StatusStyle> = {
  lav: styles.green,
  middels: styles.amber,
  høy: styles.red,
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  lav: "Lav",
  middels: "Middels",
  høy: "Høy",
  kritisk: "Kritisk",
};

export const RISK_LABEL: Record<RiskLevel, string> = {
  lav: "Lav risiko",
  middels: "Middels risiko",
  høy: "Høy risiko",
};

/** Vennlig forklaring av status, vist til beboer. */
export const RESIDENT_STATUS_EXPLANATION: Partial<Record<ClaimStatus, string>> = {
  Utkast: "Saken er lagret som utkast og er ikke sendt inn ennå.",
  "Sendt inn": "Vi har mottatt saken din. Utbygger ser på den så snart som mulig.",
  Mottatt: "Vi har mottatt saken din. Utbygger vurderer dokumentasjonen.",
  "Trenger mer info": "Utbygger trenger mer informasjon fra deg for å vurdere saken.",
  "Under vurdering": "Utbygger vurderer dokumentasjonen.",
  "Befaring nødvendig": "Utbygger ønsker å se på saken fysisk før den vurderes videre.",
  Godkjent: "Saken er godkjent. En håndverker blir tildelt for å utbedre feilen.",
  Avvist: "Saken ble dessverre ikke godkjent. Se begrunnelsen i meldingene.",
  "Sendt til underleverandør": "En håndverker har fått saken og foreslår snart tidspunkter.",
  "Tidspunkt foreslått": "Håndverkeren har foreslått tidspunkter. Velg det som passer best.",
  Planlagt: "Avtalen er bekreftet. Du finner den i kalenderen din.",
  "Under utbedring": "Arbeidet med å utbedre feilen er i gang.",
  "Klar for kontroll": "Utbedringen er meldt ferdig. Stemmer dette?",
  Ferdigstilt: "Utbedringen er meldt ferdig. Bekreft at alt er i orden.",
  "Bekreftet av beboer": "Du har bekreftet utbedringen. Takk!",
  Gjenåpnet: "Du har meldt at problemet består. Utbygger ser på saken igjen.",
  Arkivert: "Saken er arkivert med komplett historikk.",
};

/** Statuser som teller som "åpne" saker. */
export const OPEN_STATUSES: ClaimStatus[] = [
  "Sendt inn",
  "Mottatt",
  "Trenger mer info",
  "Under vurdering",
  "Befaring nødvendig",
  "Godkjent",
  "Sendt til underleverandør",
  "Tidspunkt foreslått",
  "Planlagt",
  "Under utbedring",
  "Klar for kontroll",
  "Gjenåpnet",
  "Eskalert",
];

export const KANBAN_COLUMNS: ClaimStatus[] = [
  "Mottatt",
  "Under vurdering",
  "Trenger mer info",
  "Godkjent",
  "Sendt til underleverandør",
  "Planlagt",
  "Klar for kontroll",
  "Ferdigstilt",
  "Gjenåpnet",
];

export const ROOM_LABEL: Record<string, string> = {
  bad: "Bad",
  kjøkken: "Kjøkken",
  stue: "Stue",
  soverom: "Soverom",
  entré: "Entré",
  balkong: "Balkong",
  bod: "Bod",
  fellesareal: "Fellesareal",
  annet: "Annet",
};
