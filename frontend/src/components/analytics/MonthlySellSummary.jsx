import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useThemeContext } from "../theme/ThemeProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function MonthlySellSummary({
  type,
  data,
  title,
  className,
  description,
}) {
  const { primaryColor } = useThemeContext();

  const { theme } = useTheme();

  const isDark = theme === "dark";

  // Common chart styles
  const textColor = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fill: textColor }} />
              <YAxis tick={{ fill: textColor }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark
                    ? "rgba(0, 0, 0, 0.8)"
                    : "rgba(255, 255, 255, 0.8)",
                  borderColor: gridColor,
                  color: !isDark
                    ? "rgba(0, 0, 0, 0.8)"
                    : "rgba(255, 255, 255, 0.8)",
                }}
              />
              <Bar dataKey="sell" fill={primaryColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card
      className={cn(
        "border-neutral-200/20 dark:border-neutral-800/30",
        "bg-white/10 dark:bg-black/10 backdrop-blur-lg overflow-hidden",
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
}
