import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const statCardVariants = cva(
  [
    "relative overflow-hidden p-6 rounded-xl",
    "border transition-all duration-200",
    "bg-white/10 dark:bg-black/10 backdrop-blur-lg",
  ],
  {
    variants: {
      variant: {
        default: "border-neutral-200/20 dark:border-neutral-800/30",
        primary: "border-[#B38A2D]/20 dark:border-[#B38A2D]/20",
        secondary: "border-[#E1BE5D]/20 dark:border-[#E1BE5D]/20",
      },
      gradient: {
        none: "",
        subtle:
          "before:absolute before:inset-0 before:opacity-[0.03] before:bg-gradient-to-br before:from-white before:to-transparent dark:before:from-white/10 dark:before:to-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
      gradient: "subtle",
    },
  }
);

export function StatCard({
  className,
  title,
  value,
  icon,
  trend,
  variant,
  gradient,
  children,
}) {
  return (
    <div className={cn(statCardVariants({ variant, gradient }), className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && (
          <div className="w-8 h-8 flex items-center justify-center rounded-full">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div
            className={cn(
              "text-xs font-medium",
              trend.positive ? "text-green-500" : "text-red-500"
            )}
          >
            {trend.positive ? "+" : "-"}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
