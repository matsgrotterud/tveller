"use client";

import { ArrowRight, Building2, CheckCircle2, FileText, Home, MessageSquare, ShieldCheck, Smartphone, Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const STEPS = ["Verifiser", "Vilkår", "Din bolig", "Velkommen"];

export default function InvitationPage() {
  const router = useRouter();
  const { setRole, toast } = useStore();
  const [step, setStep] = useState(0);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  return (
    <div className="gradient-hero flex min-h-screen flex-col items-center px-4 py-10">
      <Logo className="mb-6" />

      {/* SMS-forhåndsvisning */}
      {step === 0 && (
        <div className="mb-6 w-full max-w-md rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Smartphone className="h-3.5 w-3.5" aria-hidden />
            SMS-invitasjon
          </p>
          <p className="mt-2 rounded-xl bg-muted p-3 text-sm leading-relaxed">
            Nordheim Bolig AS har invitert deg til TvellerOS for Middelthunet, leil. C103. Her kan du se dokumenter,
            melde reklamasjoner og følge avtaler. Åpne invitasjon: tveller.no/i/demo
          </p>
        </div>
      )}

      <Card className="w-full max-w-md p-7">
        {/* Stegindikator */}
        <ol className="flex items-center gap-2" aria-label="Fremdrift">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full text-xs font-bold",
                  i < step ? "bg-evergreen-600 text-white" : i === step ? "bg-evergreen-100 text-evergreen-800 ring-2 ring-evergreen-400" : "bg-muted text-muted-foreground",
                )}
              >
                {i < step ? <CheckCircle2 className="h-4 w-4" aria-hidden /> : i + 1}
              </span>
              <span className={cn("text-[11px]", i === step ? "font-medium text-foreground" : "text-muted-foreground")}>{s}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6">
          {step === 0 && (
            <div>
              <h1 className="text-lg font-semibold">Hei, Lise!</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Bekreft at det er deg ved å taste inn koden vi har sendt til +47 900 00 005.
              </p>
              <div className="mt-5 space-y-1.5">
                <Label htmlFor="code">Engangskode</Label>
                <Input
                  id="code"
                  inputMode="numeric"
                  placeholder="6-sifret kode"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setCodeError(null);
                  }}
                  className="text-center text-lg tracking-[0.4em]"
                />
                {codeError && <p className="text-xs text-red-700" role="alert">{codeError}</p>}
                <p className="text-xs text-muted-foreground">I demo-modus er koden 123456. BankID/Vipps kobles til i produksjon.</p>
              </div>
              <Button
                className="mt-5 w-full"
                size="lg"
                onClick={() => {
                  if (code.trim() === "123456") setStep(1);
                  else setCodeError("Feil kode. Prøv 123456 i demo-modus.");
                }}
              >
                Verifiser
                <ArrowRight aria-hidden />
              </Button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-lg font-semibold">Vilkår og personvern</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Vi behandler kun opplysningene som trengs for å følge opp boligen din. Du kan når som helst be om innsyn, eksport eller sletting.
              </p>
              <div className="mt-5 space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 hover:bg-muted/50">
                  <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-0.5 h-4 w-4 accent-evergreen-600" />
                  <span className="text-sm">
                    Jeg godtar <Link href="/vilkar" className="font-medium text-evergreen-700 underline">vilkårene for bruk</Link>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 hover:bg-muted/50">
                  <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} className="mt-0.5 h-4 w-4 accent-evergreen-600" />
                  <span className="text-sm">
                    Jeg har lest <Link href="/personvern" className="font-medium text-evergreen-700 underline">personvernerklæringen</Link>
                  </span>
                </label>
              </div>
              <Button className="mt-5 w-full" size="lg" disabled={!terms || !privacy} onClick={() => setStep(2)}>
                Fortsett
                <ArrowRight aria-hidden />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-lg font-semibold">Din bolig</h1>
              <p className="mt-1 text-sm text-muted-foreground">Du kobles nå til boligen din i TvellerOS.</p>
              <div className="mt-5 rounded-2xl border border-evergreen-200 bg-evergreen-50/60 p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl gradient-brand text-white">
                    <Home className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold">Leilighet C103 · Middelthunet</p>
                    <p className="text-sm text-muted-foreground">Middelthuns gate 17C, 0368 Oslo</p>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-surface p-2">
                    <dt className="text-[11px] text-muted-foreground">Areal</dt>
                    <dd className="text-sm font-semibold">78 m²</dd>
                  </div>
                  <div className="rounded-lg bg-surface p-2">
                    <dt className="text-[11px] text-muted-foreground">Soverom</dt>
                    <dd className="text-sm font-semibold">2</dd>
                  </div>
                  <div className="rounded-lg bg-surface p-2">
                    <dt className="text-[11px] text-muted-foreground">Etasje</dt>
                    <dd className="text-sm font-semibold">1.</dd>
                  </div>
                </dl>
              </div>
              <Button className="mt-5 w-full" size="lg" onClick={() => setStep(3)}>
                Det stemmer – koble meg til
                <ArrowRight aria-hidden />
              </Button>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-evergreen-100 text-evergreen-700">
                <CheckCircle2 className="h-7 w-7" aria-hidden />
              </div>
              <h1 className="mt-4 text-center text-lg font-semibold">Velkommen til TvellerOS, Lise!</h1>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                TvellerOS er din digitale boligperm. Her er det viktigste du kan gjøre:
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  { icon: Wrench, text: "Meld reklamasjoner med foto og følg saken steg for steg" },
                  { icon: FileText, text: "Finn FDV-dokumenter, garantier og tegninger for boligen" },
                  { icon: MessageSquare, text: "Hold dialogen med utbygger samlet på ett sted" },
                  { icon: ShieldCheck, text: "Du eier dine data – be om innsyn eller sletting når som helst" },
                ].map((p) => (
                  <li key={p.text} className="flex items-start gap-3 text-sm">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-evergreen-50 text-evergreen-700">
                      <p.icon className="h-4 w-4" aria-hidden />
                    </span>
                    {p.text}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={() => {
                  setRole("beboer");
                  toast({ title: "Konto aktivert", description: "Velkommen til Mitt hjem!", variant: "success" });
                  router.push("/beboer");
                }}
              >
                Gå til Mitt hjem
                <ArrowRight aria-hidden />
              </Button>
            </div>
          )}
        </div>
      </Card>

      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Building2 className="h-3.5 w-3.5" aria-hidden />
        Invitert av Nordheim Bolig AS
        <Badge className="bg-muted text-muted-foreground">Demo</Badge>
      </div>
    </div>
  );
}
