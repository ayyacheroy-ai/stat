"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { formatCurrencyEur } from "@/lib/format";
import { appConfig } from "@/config/app-config";
import type { MarketValuePoint } from "@/types/profile";

// Recharts renders these as raw SVG attributes, which don't reliably resolve
// CSS custom properties — mirror the design tokens as literal values instead.
// Accent comes from config (the single source of truth); the rest are the
// fixed dark-theme neutrals from globals.css.
const GRID_COLOR = "#242430";
const MUTED_COLOR = "#9a9aa6";
const SURFACE_2_COLOR = "#1b1b22";
const BORDER_COLOR = "#2a2a33";

export function MarketValueChart({ history }: { history: MarketValuePoint[] }) {
  const current = history[history.length - 1]?.valueEur ?? 0;
  const highest = Math.max(...history.map((point) => point.valueEur));
  const data = history.map((point) => ({ month: point.month.slice(5), value: point.valueEur }));
  const accent = appConfig.brand.accentColor;

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <StatTile label="Current Value" value={formatCurrencyEur(current)} emphasis />
        <StatTile label="Highest Value" value={formatCurrencyEur(highest)} />
      </div>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="marketValueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity={0.35} />
                <stop offset="100%" stopColor={accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={GRID_COLOR} vertical={false} />
            <XAxis dataKey="month" stroke={MUTED_COLOR} fontSize={11} tickLine={false} axisLine={false} />
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <Tooltip
              formatter={(value) => [formatCurrencyEur(Number(value)), "Value"]}
              contentStyle={{
                background: SURFACE_2_COLOR,
                border: `1px solid ${BORDER_COLOR}`,
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: MUTED_COLOR }}
            />
            <Area type="monotone" dataKey="value" stroke={accent} strokeWidth={2} fill="url(#marketValueFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
