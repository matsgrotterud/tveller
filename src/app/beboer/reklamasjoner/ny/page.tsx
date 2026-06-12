"use client";

import {
  ArrowLeft,
  ArrowRight,
  Bath,
  Bed,
  Box,
  Camera,
  Check,
  CheckCircle2,
  ChefHat,
  CloudUpload,
  DoorOpen,
  FileQuestion,
  Home,
  MapPin,
  Mic,
  Sofa,
  Sun,
  Trash2,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AIDisclaimer } from "@/components/shared/ai-insight-card";
import { AIBadge, SeverityPill } from "@/components/shared/pills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { aiTriage, type AITriageResult } from "@/lib/ai";
import { ROOM_LABEL } from "@/lib/status";
import { useStore } from "@/lib/store";
import type { RoomType, Severity, Trade } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROOMS: { type: RoomType; icon: typeof Bath }[] = [
  { type: "bad", icon: Bath },
  { type: "kjøkken", icon: ChefHat },
  { type: "stue", icon: Sofa },
  { type: "soverom", icon: Bed },
  { type: "entré", icon: DoorOpen },
  { type: "balkong", icon: Sun },
  { type: "bod", icon: Box },
  { type: "fellesareal", icon: Users },
  { type: "annet", icon: Home },
];

const STEP_LABELS = ["Velg rom", "Fotografer", "Marker", "Beskriv", "AI-forslag", "Send inn"];

const EXAMPLES = [
  "Flisen ved dusjen har sprukket diagonalt …",
  "Det lukter vondt fra sluket, særlig om morgenen …",
  "Stikkontakten ved TV-en sitter løst …",
];

const TRADES: Trade[] = ["Rørlegger", "Elektriker", "Tømrer", "Maler", "Flislegger", "Ventilasjon", "Mur og betong", "Parkett", "Kjøkken", "Annet"];

interface Draft {
  room: RoomType | null;
  photos: string[];
  pin: { x: number; y: number } | null;
  pinNote: string;
  description: string;
}

const DRAFT_KEY = "tvelleros-claim-draft";

export default function NyReklamasjonPage() {
  const { createClaim, toast } = useStore();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({ room: null, photos: [], pin: null, pinNote: "", description: "" });
  const [draftSaved, setDraftSaved] = useState(false);
  const [ai, setAi] = useState<AITriageResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [edited, setEdited] = useState<{ title: string; category: string; trade: Trade; severity: Severity } | null>(null);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState<{ caseNumber: string; id: string } | null>(null);

  /* Gjenopprett og lagre utkast lokalt (PWA-aktig offline-utkast) */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      /* Engangs-hydrering av lagret utkast etter SSR. */
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setDraft(JSON.parse(raw));
    } catch {
      /* ignorer korrupt utkast */
    }
  }, []);

  useEffect(() => {
    if (draft.room || draft.description || draft.photos.length > 0) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      /* «Utkast lagret»-indikator knyttet til localStorage-skrivingen. */
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraftSaved(true);
      const t = setTimeout(() => setDraftSaved(false), 1500);
      return () => clearTimeout(t);
    }
  }, [draft]);

  const canNext = useMemo(() => {
    if (step === 0) return draft.room !== null;
    if (step === 1) return draft.photos.length > 0;
    if (step === 2) return true; // markering er valgfri
    if (step === 3) return draft.description.trim().length >= 10;
    if (step === 4) return true;
    return consent;
  }, [step, draft, consent]);

  function next() {
    if (step === 3) {
      // Kjør AI-triage før AI-steget vises
      setAiLoading(true);
      setStep(4);
      setTimeout(() => {
        const result = aiTriage(draft.description, draft.room ?? "annet");
        setAi(result);
        setEdited({ title: result.title, category: result.category, trade: result.trade, severity: result.severity });
        setAiLoading(false);
      }, 900);
      return;
    }
    setStep((s) => Math.min(5, s + 1));
  }

  function addPhoto() {
    const n = draft.photos.length + 1;
    setDraft((d) => ({ ...d, photos: [...d.photos, `IMG_${String(2900 + n).padStart(4, "0")}.jpg`] }));
  }

  function submit() {
    if (!draft.room || !edited) return;
    const claim = createClaim({
      room: draft.room,
      title: edited.title,
      description: draft.description,
      category: edited.category,
      trade: edited.trade,
      severity: edited.severity,
      evidenceLabels: draft.photos,
      annotationNote: draft.pin ? draft.pinNote || "Markert feil" : undefined,
    });
    localStorage.removeItem(DRAFT_KEY);
    toast({ title: "Reklamasjon sendt inn", description: `Saksnummer ${claim.case_number}. Vi har mottatt saken din.`, variant: "success" });
    setSubmitted({ caseNumber: claim.case_number, id: claim.id });
  }

  /* Suksesskjerm */
  if (submitted) {
    return (
      <div className="flex flex-col items-center py-10 text-center animate-fade-up">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-evergreen-100 text-evergreen-700">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </span>
        <h1 className="mt-5 text-xl font-semibold">Vi har mottatt saken din</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Saksnummeret ditt er <span className="font-semibold text-foreground">{submitted.caseNumber}</span>. Utbygger
          vurderer dokumentasjonen og svarer normalt innen 14 dager. Du får varsel ved hver endring.
        </p>
        <div className="mt-6 flex w-full max-w-sm flex-col gap-2">
          <Link href={`/beboer/reklamasjoner/${submitted.id}`}>
            <Button className="w-full" size="lg">Se saken</Button>
          </Link>
          <Link href="/beboer">
            <Button className="w-full" variant="outline" size="lg">Til Mitt hjem</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Ny reklamasjon</h1>
          <p className="text-sm text-muted-foreground">Leilighet C103 · Middelthunet</p>
        </div>
        {draftSaved && (
          <Badge className="bg-evergreen-50 text-evergreen-700">
            <Check className="h-3 w-3" aria-hidden />
            Utkast lagret
          </Badge>
        )}
      </div>

      {/* Fremdrift */}
      <div aria-label={`Steg ${step + 1} av 6: ${STEP_LABELS[step]}`}>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{STEP_LABELS[step]}</span>
          <span>Steg {step + 1} av 6</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-evergreen-600 transition-all" style={{ width: `${((step + 1) / 6) * 100}%` }} />
        </div>
      </div>

      {/* Steg 1: Velg rom */}
      {step === 0 && (
        <div className="grid grid-cols-3 gap-2.5">
          {ROOMS.map((r) => (
            <button
              key={r.type}
              onClick={() => setDraft((d) => ({ ...d, room: r.type }))}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border p-4 transition-colors cursor-pointer",
                draft.room === r.type
                  ? "border-evergreen-500 bg-evergreen-50 text-evergreen-800"
                  : "border-border bg-surface hover:bg-muted/60",
              )}
              aria-pressed={draft.room === r.type}
            >
              <r.icon className={cn("h-6 w-6", draft.room === r.type ? "text-evergreen-700" : "text-muted-foreground")} aria-hidden />
              <span className="text-xs font-medium">{ROOM_LABEL[r.type]}</span>
            </button>
          ))}
        </div>
      )}

      {/* Steg 2: Fotografer */}
      {step === 1 && (
        <div className="space-y-3">
          <button
            onClick={addPhoto}
            className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-evergreen-300 bg-evergreen-50/50 p-8 text-evergreen-700 hover:bg-evergreen-50 cursor-pointer"
          >
            <Camera className="h-8 w-8" aria-hidden />
            <span className="text-sm font-medium">Ta bilde eller last opp</span>
            <span className="text-xs text-muted-foreground">I demo-modus legges et eksempelbilde til. Flere bilder gir raskere behandling.</span>
          </button>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={addPhoto}>
              <CloudUpload aria-hidden />
              Last opp fil
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setDraft((d) => ({ ...d, photos: [...d.photos, `VID_${d.photos.length + 1}.mp4`] }))}>
              <Video aria-hidden />
              Kort video
            </Button>
          </div>
          {draft.photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {draft.photos.map((p, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-border bg-gradient-to-br from-sand-100 to-evergreen-50">
                  <div className="absolute inset-0 grid place-items-center text-evergreen-300">
                    <Camera className="h-6 w-6" aria-hidden />
                  </div>
                  <button
                    onClick={() => setDraft((d) => ({ ...d, photos: d.photos.filter((_, j) => j !== i) }))}
                    className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-evergreen-950/60 text-white hover:bg-red-600 cursor-pointer"
                    aria-label={`Fjern ${p}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <p className="absolute inset-x-0 bottom-0 truncate bg-evergreen-950/60 px-2 py-1 text-[10px] text-white">{p}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Steg 3: Marker feilen */}
      {step === 2 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Trykk på bildet der feilen er, så blir det enklere for utbygger og håndverker å finne den.
          </p>
          <div
            className="relative aspect-[4/3] cursor-crosshair overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-sand-100 to-evergreen-50"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setDraft((d) => ({ ...d, pin: { x, y } }));
            }}
            role="button"
            aria-label="Marker feilen på bildet"
          >
            <div className="absolute inset-0 grid place-items-center text-evergreen-300">
              <Camera className="h-12 w-12" aria-hidden />
            </div>
            <p className="absolute left-3 top-3 rounded-full bg-evergreen-950/60 px-2.5 py-1 text-xs text-white">
              {draft.photos[0] ?? "Bilde 1"}
            </p>
            {draft.pin && (
              <span
                className="absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red-500 text-white shadow-lg"
                style={{ left: `${draft.pin.x}%`, top: `${draft.pin.y}%` }}
                aria-hidden
              >
                <MapPin className="h-4 w-4" />
              </span>
            )}
          </div>
          {draft.pin && (
            <div className="space-y-1.5">
              <Label htmlFor="pin-note">Hva viser markøren?</Label>
              <Input
                id="pin-note"
                placeholder="F.eks. «Sprekken starter her»"
                value={draft.pinNote}
                onChange={(e) => setDraft((d) => ({ ...d, pinNote: e.target.value }))}
              />
            </div>
          )}
        </div>
      )}

      {/* Steg 4: Beskriv */}
      {step === 3 && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="description">Beskriv feilen</Label>
            <Textarea
              id="description"
              rows={5}
              placeholder="Hva er galt, hvor er det, og når oppdaget du det?"
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">{draft.description.length < 10 ? "Skriv minst 10 tegn." : `${draft.description.length} tegn – bra!`}</p>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              setDraft((d) => ({
                ...d,
                description: d.description + (d.description ? " " : "") + "Feilen ble oppdaget for noen dager siden og har blitt verre.",
              }))
            }
          >
            <Mic aria-hidden />
            Tale-til-tekst (demo)
          </Button>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Eksempler på gode beskrivelser</p>
            <div className="mt-1.5 space-y-1.5">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setDraft((d) => ({ ...d, description: ex.replace(" …", ". Den var ikke der ved overtakelsen.") }))}
                  className="block w-full rounded-lg border border-border bg-surface px-3 py-2 text-left text-xs text-muted-foreground hover:border-evergreen-300 cursor-pointer"
                >
                  «{ex}»
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Steg 5: AI-forslag */}
      {step === 4 && (
        <div className="space-y-3">
          {aiLoading || !ai || !edited ? (
            <Card className="space-y-3 p-5">
              <div className="flex items-center gap-2">
                <AIBadge />
                <p className="text-sm font-medium">Analyserer saken …</p>
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-9 animate-pulse rounded-lg bg-muted" />
              ))}
            </Card>
          ) : (
            <>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <AIBadge />
                  <span className="text-xs text-muted-foreground">Sikkerhet: {Math.round(ai.confidence * 100)} %</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{ai.reasoning}</p>
                <p className="mt-2 text-xs text-muted-foreground">AI-forslaget kan redigeres før du sender.</p>
                <div className="mt-4 space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="ai-title">Tittel</Label>
                    <Input id="ai-title" value={edited.title} onChange={(e) => setEdited({ ...edited, title: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="ai-category">Kategori</Label>
                      <Input id="ai-category" value={edited.category} onChange={(e) => setEdited({ ...edited, category: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="ai-trade">Fag</Label>
                      <Select id="ai-trade" value={edited.trade} onChange={(e) => setEdited({ ...edited, trade: e.target.value as Trade })}>
                        {TRADES.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ai-severity">Alvorlighetsgrad</Label>
                    <Select id="ai-severity" value={edited.severity} onChange={(e) => setEdited({ ...edited, severity: e.target.value as Severity })}>
                      <option value="lav">Lav</option>
                      <option value="middels">Middels</option>
                      <option value="høy">Høy</option>
                      <option value="kritisk">Kritisk</option>
                    </Select>
                  </div>
                </div>
              </Card>

              {ai.missingInfo.length > 0 && (
                <Card className="border-amber-200 bg-amber-50/50 p-4">
                  <p className="flex items-center gap-2 text-sm font-medium text-amber-900">
                    <FileQuestion className="h-4 w-4" aria-hidden />
                    Dette kan gjøre saken sterkere
                  </p>
                  <ul className="mt-2 space-y-1">
                    {ai.missingInfo.map((m) => (
                      <li key={m} className="text-xs text-amber-800">• {m}</li>
                    ))}
                  </ul>
                </Card>
              )}

              {ai.fdvSuggestion && (
                <Card className="p-4">
                  <p className="text-sm font-medium">Relevant FDV-dokument</p>
                  <p className="mt-1 text-xs text-muted-foreground">{ai.fdvSuggestion}</p>
                </Card>
              )}

              {ai.similarIssues.length > 0 && (
                <Card className="p-4">
                  <p className="text-sm font-medium">Lignende kjente saker</p>
                  <ul className="mt-2 space-y-1">
                    {ai.similarIssues.map((s) => (
                      <li key={s} className="text-xs text-muted-foreground">• {s}</li>
                    ))}
                  </ul>
                </Card>
              )}
              <AIDisclaimer />
            </>
          )}
        </div>
      )}

      {/* Steg 6: Send inn */}
      {step === 5 && edited && draft.room && (
        <div className="space-y-3">
          <Card className="divide-y divide-border">
            <SummaryRow label="Rom" value={ROOM_LABEL[draft.room]} />
            <SummaryRow label="Tittel" value={edited.title} />
            <SummaryRow label="Kategori" value={edited.category} />
            <SummaryRow label="Fag" value={edited.trade} />
            <div className="flex items-center justify-between p-3.5">
              <span className="text-sm text-muted-foreground">Alvorlighetsgrad</span>
              <SeverityPill severity={edited.severity} />
            </div>
            <SummaryRow label="Dokumentasjon" value={`${draft.photos.length} fil(er)${draft.pin ? " + markering" : ""}`} />
            <div className="p-3.5">
              <p className="text-sm text-muted-foreground">Beskrivelse</p>
              <p className="mt-1 text-sm">{draft.description}</p>
            </div>
          </Card>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface p-3.5 hover:bg-muted/40">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-evergreen-600" />
            <span className="text-sm">
              Jeg bekrefter at opplysningene er riktige, og at bildene kan deles med utbygger og håndverker som skal
              utbedre feilen.
            </span>
          </label>
        </div>
      )}

      {/* Navigasjon */}
      <div className="flex gap-2 pt-2">
        {step > 0 ? (
          <Button variant="outline" className="flex-1" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft aria-hidden />
            Tilbake
          </Button>
        ) : (
          <Link href="/beboer/reklamasjoner" className="flex-1">
            <Button variant="outline" className="w-full">Avbryt</Button>
          </Link>
        )}
        {step < 5 ? (
          <Button className="flex-1" disabled={!canNext} onClick={next}>
            Neste
            <ArrowRight aria-hidden />
          </Button>
        ) : (
          <Button className="flex-1" disabled={!canNext} onClick={submit}>
            Send inn
            <CheckCircle2 aria-hidden />
          </Button>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 p-3.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}
