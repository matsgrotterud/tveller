"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismissToast } = useStore();
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-20 right-4 z-[100] flex flex-col gap-2 md:bottom-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "animate-toast-in pointer-events-auto flex w-80 items-start gap-3 rounded-xl border bg-surface p-4 shadow-[var(--shadow-pop)]",
            t.variant === "success" && "border-evergreen-200",
            t.variant === "error" && "border-red-200",
            (t.variant === "info" || !t.variant) && "border-fjord-200",
          )}
        >
          {t.variant === "success" && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-evergreen-600" aria-hidden />}
          {t.variant === "error" && <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />}
          {(t.variant === "info" || !t.variant) && <Info className="mt-0.5 h-5 w-5 shrink-0 text-fjord-600" aria-hidden />}
          <div className="flex-1">
            <p className="text-sm font-semibold">{t.title}</p>
            {t.description && <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>}
          </div>
          <button onClick={() => dismissToast(t.id)} className="rounded p-0.5 text-muted-foreground hover:bg-muted cursor-pointer" aria-label="Lukk varsel">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
