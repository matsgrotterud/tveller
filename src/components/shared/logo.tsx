import { cn } from "@/lib/utils";

export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid h-7 w-7 place-items-center rounded-lg gradient-brand text-white">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 11l9-7 9 7" />
          <path d="M8.5 13.5l2.5 2.5 4.5-4.5" />
        </svg>
      </span>
      <span className={cn("text-lg font-semibold tracking-tight", dark ? "text-white" : "text-foreground")}>
        Tveller<span className={dark ? "text-evergreen-300" : "text-evergreen-600"}>OS</span>
      </span>
    </span>
  );
}
