import React from "react";
import { Banknote, Smartphone, CreditCard, Phone } from "lucide-react";

interface PaymentBreakdown {
  CASH: number;
  OM: number;
  MOMO: number;
  CARD?: number;
}

interface PaymentStatsProps {
  payments: PaymentBreakdown;
}

const METHOD_CONFIG = [
  {
    key: "CASH" as const,
    label: "Cash",
    icon: Banknote,
    color: "bg-success",
    textColor: "text-success",
  },
  {
    key: "OM" as const,
    label: "Orange Money",
    icon: Phone,
    color: "bg-warning",
    textColor: "text-warning",
  },
  {
    key: "MOMO" as const,
    label: "MTN MoMo",
    icon: Smartphone,
    color: "bg-primary",
    textColor: "text-primary",
  },
  {
    key: "CARD" as const,
    label: "Card",
    icon: CreditCard,
    color: "bg-accent",
    textColor: "text-accent",
  },
];

const PaymentStats: React.FC<PaymentStatsProps> = ({ payments }) => {
  const total = Object.values(payments).reduce((s, v) => s + (v ?? 0), 0);

  return (
    <div className="bg-base-200 rounded-xl border border-base-300 p-6 shadow-sm">
      <p className="text-[10px] font-black uppercase opacity-50 tracking-[0.3em] mb-5">
        Payment Methods
      </p>

      <div className="space-y-4">
        {METHOD_CONFIG.map(({ key, label, icon: Icon, color, textColor }) => {
          const amount = payments[key] ?? 0;
          const pct = total > 0 ? Math.round((amount / total) * 100) : 0;

          return (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <Icon size={14} className={textColor} />
                  <span className="text-xs font-bold uppercase tracking-wide">
                    {label}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-black ${textColor}`}>
                    {amount.toLocaleString()}
                    <span className="text-[10px] ml-1 opacity-70">FCFA</span>
                  </span>
                  <span className="text-[10px] opacity-40 ml-2">{pct}%</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 bg-base-300 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-5 pt-4 border-t border-base-300 flex justify-between items-center">
        <span className="text-xs font-black uppercase opacity-50 tracking-widest">
          Total Collected
        </span>
        <span className="text-lg font-black text-primary">
          {total.toLocaleString()}
          <span className="text-xs ml-1 opacity-70">FCFA</span>
        </span>
      </div>
    </div>
  );
};

export default PaymentStats;