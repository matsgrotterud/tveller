"use client";

import { Command } from "cmdk";
import { Building2, FileText, FolderOpen, HardHat, Home, Plus, Search, Upload, UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DOCUMENTS, PROJECTS, SUPPLIERS, UNITS, USERS } from "@/lib/seed";
import { useStore } from "@/lib/store";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { claims, toast } = useStore();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm text-muted-foreground shadow-sm hover:bg-muted md:inline-flex cursor-pointer"
        aria-label="Åpne søk"
      >
        <Search className="h-3.5 w-3.5" aria-hidden />
        <span>Søk…</span>
        <kbd className="ml-4 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
      </button>
      <button
        onClick={() => setOpen(true)}
        className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface shadow-sm hover:bg-muted md:hidden cursor-pointer"
        aria-label="Åpne søk"
      >
        <Search className="h-4 w-4" aria-hidden />
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] bg-evergreen-950/40 backdrop-blur-[2px]" onClick={() => setOpen(false)}>
          <div className="mx-auto mt-[12vh] w-[calc(100vw-2rem)] max-w-xl" onClick={(e) => e.stopPropagation()}>
            <Command className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-pop)]" label="Globalt søk">
              <div className="flex items-center gap-2 border-b border-border px-4">
                <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
                <Command.Input
                  autoFocus
                  placeholder="Søk i saker, prosjekter, enheter, dokumenter…"
                  className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-sm text-muted-foreground">Ingen treff.</Command.Empty>

                <Command.Group heading="Hurtighandlinger" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground">
                  <CommandItem icon={Plus} label="Ny reklamasjon" onSelect={() => go("/beboer/reklamasjoner/ny")} />
                  <CommandItem icon={Upload} label="Last opp FDV" onSelect={() => go("/utbygger/dokumenter")} />
                  <CommandItem icon={UserPlus} label="Inviter beboer" onSelect={() => go("/utbygger/invitasjoner")} />
                  <CommandItem icon={HardHat} label="Tildel leverandør" onSelect={() => go("/utbygger/reklamasjoner")} />
                  <CommandItem
                    icon={FileText}
                    label="Eksporter rapport"
                    onSelect={() => {
                      setOpen(false);
                      toast({ title: "Rapport eksportert", description: "Porteføljerapport (PDF) er generert.", variant: "success" });
                    }}
                  />
                </Command.Group>

                <Command.Group heading="Reklamasjoner" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground">
                  {claims.slice(0, 8).map((c) => (
                    <CommandItem key={c.id} icon={FolderOpen} label={`${c.case_number} – ${c.title}`} onSelect={() => go(`/utbygger/reklamasjoner/${c.id}`)} />
                  ))}
                </Command.Group>

                <Command.Group heading="Prosjekter" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground">
                  {PROJECTS.map((p) => (
                    <CommandItem key={p.id} icon={Building2} label={p.name} onSelect={() => go(`/utbygger/prosjekter/${p.id}`)} />
                  ))}
                </Command.Group>

                <Command.Group heading="Boenheter" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground">
                  {UNITS.map((u) => (
                    <CommandItem key={u.id} icon={Home} label={`${u.unit_number}${u.resident_name ? ` – ${u.resident_name}` : ""}`} onSelect={() => go("/utbygger/boenheter")} />
                  ))}
                </Command.Group>

                <Command.Group heading="Dokumenter" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground">
                  {DOCUMENTS.slice(0, 5).map((d) => (
                    <CommandItem key={d.id} icon={FileText} label={d.title} onSelect={() => go("/utbygger/dokumenter")} />
                  ))}
                </Command.Group>

                <Command.Group heading="Leverandører og beboere" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground">
                  {SUPPLIERS.slice(0, 4).map((s) => (
                    <CommandItem key={s.id} icon={HardHat} label={s.name} onSelect={() => go("/utbygger/underleverandorer")} />
                  ))}
                  {USERS.filter((u) => u.role === "beboer").slice(0, 4).map((u) => (
                    <CommandItem key={u.id} icon={Users} label={u.name} onSelect={() => go("/utbygger/boenheter")} />
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}

function CommandItem({ icon: Icon, label, onSelect }: { icon: typeof Search; label: string; onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm data-[selected=true]:bg-evergreen-50"
    >
      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
      {label}
    </Command.Item>
  );
}
