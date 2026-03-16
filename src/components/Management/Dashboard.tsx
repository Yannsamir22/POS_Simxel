import React, { useEffect, useState } from "react";
import { SalesService } from "../../services/salesService";
import Loading from "../../loadash/Loading";
import StatsHeader, { type Period } from "./stats/StatsHeader";
import StatsOverview from "./stats/StatsOverview";
import PaymentStats from "./stats/PaymentStats";
import StatsChart from "./stats/StatsChart";
import StatsTops from "./stats/StatsTops";

interface DashboardData {
  period: string;
  overview: { label: string; value: number; unit: string }[];
  payments: { CASH: number; OM: number; MOMO: number; CARD?: number };
  stats: { label: string; value: number }[];
  chartData: { name: string; total: number }[];
}

const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<Period>("Today");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await SalesService.getDashboardStats(period);
        if (!cancelled) {
          setData(res);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err.response?.data?.error ?? "Failed to load dashboard data"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [period]);

  if(loading) {
    return <Loading message="Loading Dashboard..." />
  }
  
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with period selector */}
      <StatsHeader
        period={period}
        onPeriodChange={setPeriod}
        loading={loading}
      />

      {/* Error state */}
      {error && (
        <div className="alert alert-error rounded-xl">
          <span className="font-bold text-sm">{error}</span>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 opacity-50">
          <span className="loading loading-ball loading-lg text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em]">
            Loading Stats…
          </p>
        </div>
      )}

      {/* Data */}
      {!loading && data && (
        <>
          <StatsOverview overview={data.overview} />

          {/* Chart + Payment breakdown side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <StatsChart chartData={data.chartData} period={period} />
            </div>
            <div>
              <PaymentStats payments={data.payments} />
            </div>
          </div>

          {/* Top performers */}
          <StatsTops stats={data.stats} />
        </>
      )}

      {/* Empty state — loaded but no sales */}
      {!loading && !error && data && data.overview[0]?.value === 0 && (
        <div className="flex flex-col items-center justify-center py-16 opacity-20 gap-3">
          <p className="font-black uppercase tracking-widest text-sm">
            No sales recorded for this period
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;