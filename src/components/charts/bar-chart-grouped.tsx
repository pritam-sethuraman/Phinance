"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCents } from "@/lib/money";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface BarChartGroupedProps {
  data: { label: string; budget: number; actual: number }[];
  height?: number;
}

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "0.8125rem",
  color: "hsl(var(--popover-foreground))",
  fontSize: 12,
};

export function BarChartGrouped({ data, height = 280 }: BarChartGroupedProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          tickFormatter={(v) => formatCents(Number(v))}
          width={64}
        />
        <Tooltip formatter={(value) => formatCents(Number(value))} contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }} />
        <Bar
          dataKey="budget"
          name="Budget"
          fill="hsl(var(--muted-foreground) / 0.35)"
          radius={[4, 4, 0, 0]}
          isAnimationActive={!reducedMotion}
        />
        <Bar
          dataKey="actual"
          name="Actual"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
          isAnimationActive={!reducedMotion}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
