import React from "react";
import { useT } from "../../../hooks/useT";
import { toCamelCase } from "./StatsHeader";

interface ChartDataPoint {
  name: string;
  total: number;
}

interface StatsChartProps {
  chartData: ChartDataPoint[];
  period: string;
}

const StatsChart: React.FC<StatsChartProps> = ({ chartData, period }) => {
  const {t} = useT();
  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-base-200 rounded-xl border border-base-300 p-6 shadow-sm flex items-center justify-center h-52 opacity-20">
        <p className="font-black uppercase tracking-widest text-sm">
          {t("dashboard.noCharts")}
        </p>
      </div>
    );
  }

  const max = Math.max(...chartData.map((d) => d.total), 1);
  const BAR_HEIGHT = 140;
  const BAR_WIDTH = Math.max(
    20,
    Math.min(40, Math.floor(560 / chartData.length) - 8),
  );
  const GAP = Math.max(4, Math.floor(560 / chartData.length) - BAR_WIDTH);
  const totalWidth = chartData.length * (BAR_WIDTH + GAP) - GAP;
  const SVG_W = totalWidth + 8;
  const SVG_H = BAR_HEIGHT + 40; // bars + x-axis labels

  return (
    <div className="bg-base-200 rounded-xl border border-base-300 p-6 shadow-sm">
      <p className="text-[10px] font-black uppercase opacity-50 tracking-[0.3em] mb-4">
        {t("dashboard.kpi.revenue")} — {t(`dashboard.period.${toCamelCase(period)}`)}
      </p>

      <div className="overflow-x-auto">
        <svg
          width="100%"
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {chartData.map((d, i) => {
            const barH = Math.max(4, Math.round((d.total / max) * BAR_HEIGHT));
            const x = i * (BAR_WIDTH + GAP);
            const y = BAR_HEIGHT - barH;
            const isHighest = d.total === max;

            return (
              <g key={d.name}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={barH}
                  rx={4}
                  className={isHighest ? "fill-primary" : "fill-primary/40"}
                />

                {/* Value label on top of bar (only if bar is tall enough) */}
                {barH > 20 && (
                  <text
                    x={x + BAR_WIDTH / 2}
                    y={y - 4}
                    textAnchor="middle"
                    fontSize={9}
                    className="fill-base-content opacity-60 font-bold"
                  >
                    {d.total >= 1000
                      ? `${(d.total / 1000).toFixed(0)}k`
                      : d.total}
                  </text>
                )}

                {/* X-axis label */}
                <text
                  x={x + BAR_WIDTH / 2}
                  y={BAR_HEIGHT + 18}
                  textAnchor="middle"
                  fontSize={9}
                  className="fill-base-content opacity-40 font-bold uppercase"
                >
                  {d.name.length > 6 ? d.name.slice(0, 5) + "…" : d.name}
                </text>
              </g>
            );
          })}

          {/* Baseline */}
          <line
            x1={0}
            y1={BAR_HEIGHT}
            x2={SVG_W}
            y2={BAR_HEIGHT}
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeWidth={1}
          />
        </svg>
      </div>
    </div>
  );
};

export default StatsChart;
