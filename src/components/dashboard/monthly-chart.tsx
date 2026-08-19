"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { formatBRL } from "@/lib/utils";

type Point = { label: string; gastos: number; ganhos: number };

// Tons que funcionam em light e dark (esmeralda x carmim).
const GANHOS = "#10b981";
const GASTOS = "#f43f5e";

export function MonthlyChart({ data }: { data: Point[] }) {
  const hasData = data.some((d) => d.gastos > 0 || d.ganhos > 0);

  return (
    <div>
      <div className="mb-3 flex items-center gap-4 text-xs font-medium">
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-sm"
            style={{ background: GANHOS }}
          />
          Ganhos
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-sm"
            style={{ background: GASTOS }}
          />
          Gastos
        </span>
      </div>

      {!hasData ? (
        <div className="grid h-44 place-items-center rounded-lg text-sm text-muted-foreground">
          Sem dados suficientes ainda.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} barGap={4} margin={{ top: 8 }}>
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              dy={4}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              content={<ChartTooltip />}
            />
            <Bar dataKey="ganhos" radius={[4, 4, 0, 0]} maxBarSize={22}>
              {data.map((_, i) => (
                <Cell key={i} fill={GANHOS} />
              ))}
            </Bar>
            <Bar dataKey="gastos" radius={[4, 4, 0, 0]} maxBarSize={22}>
              {data.map((_, i) => (
                <Cell key={i} fill={GASTOS} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-semibold capitalize">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-1.5 font-numeric">
          <span
            className="size-2 rounded-sm"
            style={{ background: p.color }}
          />
          <span className="capitalize text-muted-foreground">{p.name}:</span>
          {formatBRL(p.value)}
        </p>
      ))}
    </div>
  );
}
