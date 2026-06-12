"use client";

import { Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MetricCard } from "@/components/shared/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";

const CLOSED_PER_MONTH = [
  { month: "Jan", lukket: 6 },
  { month: "Feb", lukket: 9 },
  { month: "Mar", lukket: 7 },
  { month: "Apr", lukket: 11 },
  { month: "Mai", lukket: 10 },
  { month: "Jun", lukket: 8 },
];

const RESPONSE_TREND = [
  { month: "Jan", timer: 14 },
  { month: "Feb", timer: 12 },
  { month: "Mar", timer: 11 },
  { month: "Apr", timer: 10 },
  { month: "Mai", timer: 9 },
  { month: "Jun", timer: 9 },
];

const FEEDBACK = [
  { from: "Nordheim Bolig AS", text: "Rask respons og ryddig dokumentasjon på sak RK-2024-0127. Beboer var svært fornøyd.", date: "Juni 2026" },
  { from: "Nordheim Bolig AS", text: "Husk å laste opp etterbilder samme dag som arbeidet ferdigstilles.", date: "Mai 2026" },
];

export default function RapporterPage() {
  const { toast } = useStore();

  return (
    <div className="max-w-5xl space-y-5 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Rapporter</h1>
          <p className="text-sm text-muted-foreground">Kvalitet, gjennomføring og fakturagrunnlag for Bare Rør AS</p>
        </div>
        <Button variant="outline" onClick={() => toast({ title: "Fakturagrunnlag eksportert", description: "Timer og materiell for juni er eksportert til Excel (demo).", variant: "success" })}>
          <Download aria-hidden />
          Eksporter fakturagrunnlag
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <MetricCard label="Lukkede saker (6 mnd)" value="51" trend="+12 %" trendPositive />
        <MetricCard label="Snitt responstid" value="9 t" trend="-5 t" trendPositive />
        <MetricCard label="Snitt løsningstid" value="60 t" hint="fra aksept til ferdig" />
        <MetricCard label="Gjenåpningsrate" value="4 %" trend="-2 pp" trendPositive />
        <MetricCard label="Beboertilfredshet" value="4,7 / 5" hint="32 vurderinger" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Lukkede saker per måned</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CLOSED_PER_MONTH} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e7e4" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#5c6b64" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#5c6b64" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e7e4", fontSize: 13 }} />
                  <Bar dataKey="lukket" name="Lukkede saker" fill="#2b6655" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Responstid (timer)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={RESPONSE_TREND} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e7e4" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#5c6b64" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#5c6b64" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e7e4", fontSize: 13 }} />
                  <Line type="monotone" dataKey="timer" name="Timer" stroke="#1d748d" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold">Tilbakemeldinger fra utbygger</h2>
        <div className="mt-3 space-y-2.5">
          {FEEDBACK.map((f) => (
            <div key={f.text} className="rounded-xl bg-muted p-3.5">
              <p className="text-sm leading-relaxed">{f.text}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{f.from} · {f.date}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
