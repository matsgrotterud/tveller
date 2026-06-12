"use client";

import { Camera, FileText, MapPin, Play } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/format";
import type { EvidenceItem } from "@/lib/types";
import { cn } from "@/lib/utils";

function EvidenceThumb({ item, onClick }: { item: EvidenceItem; onClick: () => void }) {
  const isVideo = item.label.toLowerCase().includes("vid") || item.label.endsWith(".mp4");
  const isDoc = item.label.endsWith(".pdf");
  return (
    <button
      onClick={onClick}
      className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-gradient-to-br from-sand-100 to-evergreen-50 text-left transition-shadow hover:shadow-[var(--shadow-card-hover)] cursor-pointer"
      aria-label={`Åpne ${item.label}`}
    >
      <div className="absolute inset-0 grid place-items-center text-evergreen-300">
        {isVideo ? <Play className="h-8 w-8" aria-hidden /> : isDoc ? <FileText className="h-8 w-8" aria-hidden /> : <Camera className="h-8 w-8" aria-hidden />}
      </div>
      {item.annotation?.map((a, i) => (
        <span
          key={i}
          className="absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red-500 text-white shadow"
          style={{ left: `${a.x}%`, top: `${a.y}%` }}
          aria-hidden
        >
          <MapPin className="h-3.5 w-3.5" />
        </span>
      ))}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-evergreen-950/70 to-transparent p-2 pt-6">
        <p className="truncate text-xs font-medium text-white">{item.label}</p>
      </div>
    </button>
  );
}

export function EvidenceGallery({ items, className }: { items: EvidenceItem[]; className?: string }) {
  const [selected, setSelected] = useState<EvidenceItem | null>(null);
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Ingen dokumentasjon lastet opp ennå.</p>;
  }
  return (
    <>
      <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", className)}>
        {items.map((item) => (
          <EvidenceThumb key={item.id} item={item} onClick={() => setSelected(item)} />
        ))}
      </div>
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.label}</DialogTitle>
              </DialogHeader>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-sand-100 to-evergreen-50">
                <div className="absolute inset-0 grid place-items-center text-evergreen-300">
                  <Camera className="h-14 w-14" aria-hidden />
                </div>
                {selected.annotation?.map((a, i) => (
                  <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${a.x}%`, top: `${a.y}%` }}>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-red-500 text-white shadow-lg" aria-hidden>
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span className="mt-1 block max-w-44 rounded-lg bg-evergreen-950/85 px-2 py-1 text-xs text-white">{a.note}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm">{selected.caption}</p>
              <p className="text-xs text-muted-foreground">
                Lastet opp av {selected.uploaded_by} · {formatDateTime(selected.created_at)}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
