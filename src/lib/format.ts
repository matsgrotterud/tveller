const dateFmt = new Intl.DateTimeFormat("nb-NO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortDateFmt = new Intl.DateTimeFormat("nb-NO", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFmt = new Intl.DateTimeFormat("nb-NO", {
  hour: "2-digit",
  minute: "2-digit",
});

const dateTimeFmt = new Intl.DateTimeFormat("nb-NO", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const weekdayFmt = new Intl.DateTimeFormat("nb-NO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const nokFmt = new Intl.NumberFormat("nb-NO", {
  style: "currency",
  currency: "NOK",
  maximumFractionDigits: 0,
});

const nokFmtDecimals = new Intl.NumberFormat("nb-NO", {
  style: "currency",
  currency: "NOK",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numFmt = new Intl.NumberFormat("nb-NO");

export function formatDate(d: string | Date): string {
  return dateFmt.format(typeof d === "string" ? new Date(d) : d);
}

export function formatShortDate(d: string | Date): string {
  return shortDateFmt.format(typeof d === "string" ? new Date(d) : d);
}

export function formatTime(d: string | Date): string {
  return timeFmt.format(typeof d === "string" ? new Date(d) : d);
}

export function formatDateTime(d: string | Date): string {
  return dateTimeFmt.format(typeof d === "string" ? new Date(d) : d);
}

export function formatWeekday(d: string | Date): string {
  return weekdayFmt.format(typeof d === "string" ? new Date(d) : d);
}

export function formatNOK(amount: number): string {
  return nokFmt.format(amount);
}

export function formatNOKDecimals(amount: number): string {
  return nokFmtDecimals.format(amount);
}

export function formatNumber(n: number): string {
  return numFmt.format(n);
}

export function formatRelative(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const diffMs = Date.now() - date.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "nå nettopp";
  if (mins < 60) return `${mins} min siden`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} t siden`;
  const days = Math.round(hours / 24);
  if (days === 1) return "i går";
  if (days < 7) return `${days} dager siden`;
  return formatShortDate(date);
}

export function daysUntil(d: string | Date): number {
  const date = typeof d === "string" ? new Date(d) : d;
  return Math.ceil((date.getTime() - Date.now()) / 86400000);
}

export function daysBetween(a: string | Date, b: string | Date): number {
  const da = typeof a === "string" ? new Date(a) : a;
  const db = typeof b === "string" ? new Date(b) : b;
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}
