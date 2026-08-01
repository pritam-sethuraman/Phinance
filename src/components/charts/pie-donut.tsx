"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCents } from "@/lib/money";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface PieDonutProps {
  data: { label: string; value: number; color: string }[];
  height?: number;
}

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "0.8125rem",
  color: "hsl(var(--popover-foreground))",
  fontSize: 12,
};

export function PieDonut({ data, height = 280 }: PieDonutProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={2}
          isAnimationActive={!reducedMotion}
        >
          {data.map((entry) => (
            <Cell key={entry.label} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCents(Number(value))} contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
