"use client";

import { ArrowRight, KeyRound, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/shared/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { DEMO_ACCOUNTS } from "@/lib/seed";
import { useStore } from "@/lib/store";
import type { RoleKey } from "@/lib/types";

const EMAIL_TO_ROLE: Record<string, { role: RoleKey; portal: string }> = {
  "superadmin@tveller.no": { role: "superadmin", portal: "/admin" },
  "prosjektleder@nordheim.no": { role: "utbygger_admin", portal: "/utbygger" },
  "kundeservice@nordheim.no": { role: "kundebehandler", portal: "/utbygger" },
  "juridisk@nordheim.no": { role: "juridisk", portal: "/utbygger/juridisk" },
  "lise@example.com": { role: "beboer", portal: "/beboer" },
  "styret@middelthunet.no": { role: "sameiestyre", portal: "/beboer/sameie" },
  "thomas@bareror.no": { role: "leverandor_admin", portal: "/leverandor" },
  "tekniker@elektrofix.no": { role: "tekniker", portal: "/leverandor/arbeidsordre" },
};

export default function LoginPage() {
  const router = useRouter();
  const { setRole, toast } = useStore();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function login(targetEmail: string) {
    const match = EMAIL_TO_ROLE[targetEmail.toLowerCase().trim()];
    if (!match) {
      setError("Fant ingen demobruker med denne e-postadressen. Velg en av demokontoene under.");
      return;
    }
    setRole(match.role);
    toast({ title: "Innlogget", description: `Velkommen tilbake!`, variant: "success" });
    router.push(match.portal);
  }

  return (
    <div className="gradient-hero flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Link href="/" aria-label="Til forsiden">
        <Logo className="mb-8" />
      </Link>
      <Card className="w-full max-w-md p-7">
        <h1 className="text-xl font-semibold tracking-tight">Logg inn</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Demo-modus er aktiv – autentisering er mocket. I produksjon kobles BankID/Vipps eller e-post-magic-link til her.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            login(email);
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">E-postadresse</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                id="email"
                type="email"
                placeholder="navn@selskap.no"
                className="pl-9"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
              />
            </div>
            {error && <p className="text-xs text-red-700" role="alert">{error}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Passord</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input id="password" type="password" placeholder="••••••••" className="pl-9" defaultValue="demo1234" />
            </div>
            <p className="text-xs text-muted-foreground">I demo-modus godtas alle passord.</p>
          </div>
          <Button className="w-full" size="lg" type="submit">
            Logg inn
            <ArrowRight aria-hidden />
          </Button>
        </form>

        <div className="mt-6 border-t border-border pt-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <KeyRound className="h-3.5 w-3.5" aria-hidden />
            Demokontoer
          </p>
          <div className="mt-3 grid gap-1.5">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.email}
                onClick={() => login(a.email)}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-sm hover:border-evergreen-300 hover:bg-evergreen-50/50 cursor-pointer"
              >
                <span>
                  <span className="block font-medium">{a.name}</span>
                  <span className="block text-xs text-muted-foreground">{a.email}</span>
                </span>
                <Badge className="bg-muted text-muted-foreground">{a.role}</Badge>
              </button>
            ))}
          </div>
        </div>
      </Card>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Har du fått en invitasjon på SMS eller e-post?{" "}
        <Link href="/invitasjon/demo-token" className="font-medium text-evergreen-700 hover:underline">
          Åpne invitasjonen
        </Link>
      </p>
    </div>
  );
}
