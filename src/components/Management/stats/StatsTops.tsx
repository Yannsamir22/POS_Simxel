import React from "react";
import { Medal, ShoppingBag, HeartHandshake, Users, Package } from "lucide-react";
import { useT } from "../../../hooks/useT";
import type { TopEntry } from "../Dashboard";

interface StatsTopsProps {
  topServices:  TopEntry[];
  topProducts:  TopEntry[];
  topEmployees: TopEntry[];
  topPackages:  TopEntry[];
}

// Single leaderboard section 
const Leaderboard: React.FC<{
  title: string;
  icon: React.ReactNode;
  items: TopEntry[];
  barColor: string;   
  textColor: string;  
}> = ({ title, icon, items, barColor, textColor }) => {
  const active = items.filter((s) => s.value > 0);

  if (active.length === 0) return null;

  const max = active[0]?.value ?? 1;

  const MEDAL = ["text-yellow-400", "text-gray-400", "text-orange-400"];

  return (
    <div className="bg-base-200 rounded-xl border border-base-300 p-5 shadow-sm">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <span className={textColor}>{icon}</span>
        <p className={`text-[10px] font-black uppercase tracking-widest ${textColor}`}>
          {title}
        </p>
      </div>

      <div className="space-y-3">
        {active.slice(0, 5).map((item, i) => {
          const pct = Math.round((item.value / max) * 100);
          return (
            <div key={`${item.name}-${i}`} className="flex items-center gap-3">
              <div className="w-6 shrink-0 flex justify-center">
                {i < 3 ? (
                  <Medal size={16} className={MEDAL[i]} />
                ) : (
                  <span className="text-[10px] font-black opacity-30">{i + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold uppercase tracking-tight truncate max-w-[65%]">
                    {item.name}
                  </span>
                  <span className={`text-xs font-black shrink-0 ${textColor}`}>
                    {item.value.toLocaleString()}
                    <span className="text-[10px] ml-1 opacity-50">FCFA</span>
                  </span>
                </div>
                <div className="h-1.5 bg-base-300 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
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

// Main component 
const StatsTops: React.FC<StatsTopsProps> = ({
  topServices,
  topProducts,
  topEmployees,
  topPackages,
}) => {
  const { t } = useT();

  const hasAny =
    topServices.some((s) => s.value > 0) ||
    topProducts.some((s) => s.value > 0) ||
    topEmployees.some((s) => s.value > 0) ||
    topPackages.some((s) => s.value > 0);

  if (!hasAny) {
    return (
      <div className="bg-base-200 rounded-xl border border-base-300 p-6 shadow-sm flex items-center justify-center h-40 opacity-20">
        <p className="font-black uppercase tracking-widest text-sm">No data</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[10px] font-black uppercase opacity-50 tracking-[0.3em] mb-4">
        {t("dashboard.topPerformers")}
      </p>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Leaderboard
          title={t("services.title")}
          icon={<HeartHandshake size={14} />}
          items={topServices}
          barColor="bg-secondary"
          textColor="text-secondary"
        />
        <Leaderboard
          title={t("products.title")}
          icon={<ShoppingBag size={14} />}
          items={topProducts}
          barColor="bg-primary"
          textColor="text-primary"
        />
        <Leaderboard
          title={t("employees.title")}
          icon={<Users size={14} />}
          items={topEmployees}
          barColor="bg-warning"
          textColor="text-warning"
        />
        <Leaderboard
          title={t("packages.title")}
          icon={<Package size={14} />}
          items={topPackages}
          barColor="bg-accent"
          textColor="text-accent"
        />
      </div>
    </div>
  );
};

export default StatsTops;