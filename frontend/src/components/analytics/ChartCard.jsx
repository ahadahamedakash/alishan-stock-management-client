import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemeContext } from "../theme/ThemeProvider";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function ChartCard({ title, description, data, type, className }) {
  const { primaryColor, secondaryColor } = useThemeContext();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Common chart styles
  const textColor = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  const COLORS = [primaryColor, secondaryColor, "#555", "#888", "#aaa"];

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
              <XAxis dataKey="name" tick={{ fill: textColor }} />
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
              <Bar dataKey="value" fill={primaryColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: textColor }} />
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
              <Line
                type="monotone"
                dataKey="value"
                stroke={primaryColor}
                strokeWidth={2}
                dot={{ fill: primaryColor, r: 4 }}
                activeDot={{ r: 6, fill: secondaryColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
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
              <Legend />
            </PieChart>
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
