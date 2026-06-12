import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export function UsageMeter({
  label,
  used,
  included,
  className,
}: {
  label: string;
  used: number;
  included: number;
  className?: string;
}) {
  const pct = included > 0 ? (used / included) * 100 : 0;
  const over = used > included;
  return (
    <div className={className}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium capitalize">{label}</span>
        <span className={cn("text-xs", over ? "font-medium text-red-700" : "text-muted-foreground")}>
          {formatNumber(used)} av {formatNumber(included)}
          {over && " – over inkludert volum"}
        </span>
      </div>
      <Progress
        value={Math.min(100, pct)}
        className="mt-1.5"
        barClassName={over ? "bg-red-500" : pct > 80 ? "bg-amber-500" : undefined}
      />
    </div>
  );
}
