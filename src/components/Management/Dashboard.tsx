import React, { useEffect, useState } from "react";
import Loading from "../../loadash/Loading";
import { SalesService } from "../../services/salesService";
import PaymentStats from "./stats/PaymentStats";
import StatsChart from "./stats/StatsChart";
import StatsHeader, { type Period } from "./stats/StatsHeader";
import StatsOverview from "./stats/StatsOverview";
import StatsTops from "./stats/StatsTops";
import NoSales from "./stats/NoSales";
import { useT } from "../../hooks/useT";


// separate named arrays instead of one merged flat list.
export interface TopEntry {
  name: string;
  value: number;
}

interface DashboardData {
  period:      string;
  overview:    { label: string; value: number; unit: string }[];
  payments:    { CASH: number; OM: number; MOMO: number; CARD?: number };
  topServices:  TopEntry[];
  topProducts:  TopEntry[];
  topEmployees: TopEntry[];
  topPackages:  TopEntry[];
  chartData:   { name: string; total: number }[];
}

const Dashboard: React.FC = () => {
  const [period,  setPeriod]  = useState<Period>("Today");
  const [data,    setData]    = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const { t } = useT();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await SalesService.getDashboardStats(period);
        if (!cancelled) setData(res);
      } catch (err: any) {
        if (!cancelled)
          setError(err.response?.data?.error ?? t("dashboard.loadError"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [period]);

  if (loading) return <Loading message={t("common.loading")} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <StatsHeader period={period} onPeriodChange={setPeriod} loading={loading} />

      {error && (
        <div className="alert alert-error rounded-xl">
          <span className="font-bold text-sm">{error}</span>
        </div>
      )}

      {!loading && data && (
        <>
          <StatsOverview overview={data.overview} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <StatsChart chartData={data.chartData} period={period} />
            </div>
            <div>
              <PaymentStats payments={data.payments} />
            </div>
          </div>

          {/*  four separate arrays instead of old flat stats[] */}
          <StatsTops
            topServices={data.topServices   ?? []}
            topProducts={data.topProducts   ?? []}
            topEmployees={data.topEmployees ?? []}
            topPackages={data.topPackages   ?? []}
          />
        </>
      )}

      {!loading && !error && data && data.overview[0]?.value === 0 && (
        <NoSales />
      )}
    </div>
  );
};

export default Dashboard;