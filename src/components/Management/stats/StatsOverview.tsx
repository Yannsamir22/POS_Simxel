import React from "react";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  BarChart2,
} from "lucide-react";

interface OverviewItem {
  label: string;
  value: number;
  unit: string;
}

interface StatsOverviewProps {
  overview: OverviewItem[];
}

const ICONS = [TrendingUp, ShoppingCart, Users, BarChart2];

const COLORS = [
  { bg: "bg-primary/10",  text: "text-primary",  border: "border-primary/20" },
  { bg: "bg-success/10", text: "text-success", border: "border-success/20" },
  { bg: "bg-accent/10",  text: "text-accent",  border: "border-accent/20" },
  { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20" },
];

const StatsOverview: React.FC<StatsOverviewProps> = ({ overview }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {overview.map((item, i) => {
        const Icon = ICONS[i % ICONS.length];
        const color = COLORS[i % COLORS.length];

        return (
          <div
            key={item.label}
            className="bg-base-200 rounded-xl border border-base-300 p-5 flex items-center gap-4 shadow-sm"
          >
            <div
              className={`p-3 rounded-xl ${color.bg} ${color.text} border ${color.border} shrink-0`}
            >
              <Icon size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase opacity-50 tracking-[0.2em] truncate">
                {item.label}
              </p>
              <p className={`text-xl font-black leading-none mt-1 ${color.text}`}>
                {item.value.toLocaleString()}
                <span className="text-xs ml-1 opacity-70">{item.unit}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;