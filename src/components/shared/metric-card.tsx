import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  trendPositive,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  className?: string;
}) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon && (
          <span className="rounded-lg bg-evergreen-50 p-1.5 text-evergreen-700">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        )}
      </div>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      <div className="mt-1 flex items-center gap-2 min-h-4">
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              trendPositive ? "text-evergreen-700" : "text-red-700",
            )}
          >
            {trendPositive ? <TrendingUp className="h-3 w-3" aria-hidden /> : <TrendingDown className="h-3 w-3" aria-hidden />}
            {trend}
          </span>
        )}
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
    </Card>
  );
}
