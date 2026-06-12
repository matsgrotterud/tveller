"use client";

import { ArrowRight, CheckCircle2, FileSpreadsheet, Upload, UserPlus, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label, Select } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const PREVIEW_ROWS = [
  { enhet: "C201", etasje: "2", areal: "82", soverom: "3", navn: "Nora Eide", epost: "nora.eide@example.com", telefon: "+47 901 11 222", valid: true },
  { enhet: "C202", etasje: "2", areal: "64", soverom: "2", navn: "Magnus Vik", epost: "magnus.vik@example.com", telefon: "+47 902 22 333", valid: true },
  { enhet: "C203", etasje: "2", areal: "71", soverom: "2", navn: "Ida Solberg", epost: "ida.solberg@", telefon: "+47 903 33 444", valid: false, error: "Ugyldig e-postadresse" },
  { enhet: "C204", etasje: "2", areal: "95", soverom: "3", navn: "Jonas Aune", epost: "jonas.aune@example.com", telefon: "", valid: false, error: "Mangler telefonnummer" },
  { enhet: "C205", etasje: "2", areal: "55", soverom: "1", navn: "Emma Strøm", epost: "emma.strom@example.com", telefon: "+47 905 55 666", valid: true },
];

const COLUMNS = ["Enhetsnummer", "Etasje", "Areal (m²)", "Soverom", "Beboernavn", "E-post", "Telefon"];

export default function ImportPage() {
  const { toast } = useStore();
  const [step, setStep] = useState(0);

  return (
    <div className="max-w-4xl space-y-5 animate-fade-up">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Importer enheter</h1>
        <p className="text-sm text-muted-foreground">Last opp CSV eller Excel med enheter og beboere, og send invitasjoner rett etterpå.</p>
      </div>

      {/* Stegindikator */}
      <ol className="flex items-center gap-2 text-sm">
        {["Last opp", "Kolonnetilordning", "Forhåndsvisning", "Resultat"].map((s, i) => (
          <li key={s} className={cn("flex items-center gap-2", i > 0 && "before:mx-2 before:h-px before:w-6 before:bg-border before:content-['']")}>
            <span className={cn("grid h-6 w-6 place-items-center rounded-full text-xs font-bold", i <= step ? "bg-evergreen-600 text-white" : "bg-muted text-muted-foreground")}>
              {i + 1}
            </span>
            <span className={cn(i === step ? "font-medium" : "text-muted-foreground")}>{s}</span>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <button
          onClick={() => setStep(1)}
          className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-evergreen-300 bg-evergreen-50/40 p-12 text-evergreen-700 hover:bg-evergreen-50 cursor-pointer"
        >
          <FileSpreadsheet className="h-10 w-10" aria-hidden />
          <span className="text-sm font-medium">Slipp filen her, eller klikk for å velge</span>
          <span className="text-xs text-muted-foreground">Støtter .csv, .xlsx – i demo-modus lastes eksempelfilen «middelthunet_c2.xlsx»</span>
        </button>
      )}

      {step === 1 && (
        <Card className="p-5">
          <h2 className="text-sm font-semibold">Koble kolonner fra filen til feltene i TvellerOS</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {COLUMNS.map((c) => (
              <div key={c} className="space-y-1.5">
                <Label htmlFor={`col-${c}`}>{c}</Label>
                <Select id={`col-${c}`} defaultValue={c}>
                  {COLUMNS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                  <option>Ignorer kolonne</option>
                </Select>
              </div>
            ))}
          </div>
          <Button className="mt-5" onClick={() => setStep(2)}>
            Forhåndsvis import
            <ArrowRight aria-hidden />
          </Button>
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge className="bg-evergreen-50 text-evergreen-700">3 gyldige rader</Badge>
            <Badge className="bg-red-50 text-red-700">2 rader med feil</Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Enhet</TableHead>
                <TableHead>Etasje</TableHead>
                <TableHead>Areal</TableHead>
                <TableHead>Beboer</TableHead>
                <TableHead>E-post</TableHead>
                <TableHead>Telefon</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PREVIEW_ROWS.map((r) => (
                <TableRow key={r.enhet} className={!r.valid ? "bg-red-50/40" : undefined}>
                  <TableCell>
                    {r.valid ? (
                      <CheckCircle2 className="h-4 w-4 text-evergreen-600" aria-label="Gyldig" />
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-red-700">
                        <XCircle className="h-4 w-4" aria-hidden />
                        {r.error}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{r.enhet}</TableCell>
                  <TableCell>{r.etasje}.</TableCell>
                  <TableCell>{r.areal} m²</TableCell>
                  <TableCell>{r.navn}</TableCell>
                  <TableCell className="text-muted-foreground">{r.epost}</TableCell>
                  <TableCell className="text-muted-foreground">{r.telefon || "–"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>Tilbake</Button>
            <Button
              onClick={() => {
                setStep(3);
                toast({ title: "Import fullført", description: "3 enheter importert. 2 rader hoppet over pga. feil.", variant: "success" });
              }}
            >
              <Upload aria-hidden />
              Importer 3 gyldige rader
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <Card className="p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-evergreen-100 text-evergreen-700">
            <CheckCircle2 className="h-7 w-7" aria-hidden />
          </span>
          <h2 className="mt-4 text-lg font-semibold">3 enheter importert til Middelthunet</h2>
          <p className="mt-1 text-sm text-muted-foreground">C201, C202 og C205 er opprettet. Vil du invitere beboerne med en gang?</p>
          <div className="mt-5 flex justify-center gap-2">
            <Link href="/utbygger/invitasjoner">
              <Button>
                <UserPlus aria-hidden />
                Send invitasjoner
              </Button>
            </Link>
            <Link href="/utbygger/boenheter">
              <Button variant="outline">Se boenheter</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
