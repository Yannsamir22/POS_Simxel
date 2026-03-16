import React from "react";
import { Medal } from "lucide-react";

interface StatItem {
  label: string;
  value: number;
}

interface StatsTopsProps {
  stats: StatItem[];
}

// Split the flat stats array back into sections by position
// Backend returns: topServices[], topProducts[], topEmployees[], topPackages[] merged
// We show them all in a single ranked list — works for any mix
const StatsTops: React.FC<StatsTopsProps> = ({ stats }) => {
  if (!stats || stats.length === 0) {
    return (
      <div className="bg-base-200 rounded-xl border border-base-300 p-6 shadow-sm flex items-center justify-center h-40 opacity-20">
        <p className="font-black uppercase tracking-widest text-sm">No data</p>
      </div>
    );
  }

  const sorted = [...stats]
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const max = sorted[0]?.value ?? 1;

  const MEDAL_COLORS = [
    "text-yellow-400",
    "text-gray-400",
    "text-orange-400",
  ];

  return (
    <div className="bg-base-200 rounded-xl border border-base-300 p-6 shadow-sm">
      <p className="text-[10px] font-black uppercase opacity-50 tracking-[0.3em] mb-5">
        Top Performers
      </p>

      <div className="space-y-3">
        {sorted.map((item, i) => {
          const pct = Math.round((item.value / max) * 100);

          return (
            <div key={`${item.label}-${i}`} className="flex items-center gap-3">
              {/* Rank / Medal */}
              <div className="w-6 shrink-0 flex justify-center">
                {i < 3 ? (
                  <Medal size={16} className={MEDAL_COLORS[i]} />
                ) : (
                  <span className="text-[10px] font-black opacity-30">
                    {i + 1}
                  </span>
                )}
              </div>

              {/* Bar + Label */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold uppercase tracking-tight truncate max-w-[65%]">
                    {item.label}
                  </span>
                  <span className="text-xs font-black text-primary shrink-0">
                    {item.value.toLocaleString()}
                    <span className="text-[10px] ml-1 opacity-50">FCFA</span>
                  </span>
                </div>
                <div className="h-1.5 bg-base-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/60 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsTops;