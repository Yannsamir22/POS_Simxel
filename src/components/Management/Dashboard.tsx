// src/components/Management/Dashboard.tsx
import React, { useEffect, useState } from "react";
import Loading from "../../loadash/Loading";
import { SalesService } from "../../services/salesService";
import { useT } from "../../hooks/useT";
import StatsHeader, { type Period } from "./stats/StatsHeader";
import StatsOverview from "./stats/StatsOverview";
import StatsChart from "./stats/StatsChart";
import PaymentStats from "./stats/PaymentStats";
import SalesMix from "./stats/SalesMix";
import StatsTops from "./stats/StatsTops";
import NoSales from "./stats/NoSales";

export interface TopEntry {
  name: string;
  revenue: number;
}

interface DashboardData {
  period:       string;
  overview:     { label: string; value: number; unit: string }[];
  payments:     { CASH: number; OM: number; MOMO: number; CARD?: number };
  topServices:  TopEntry[];
  topProducts:  TopEntry[];
  topEmployees: TopEntry[];
  topPackages:  TopEntry[];
  chartData:    { name: string; total: number }[];
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
          setError(err.response?.data?.error ?? "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [period]);

  if (loading) return <Loading message={t("common.loading")} />;

  const isEmpty = !loading && !error && data && (data.overview?.[0]?.value ?? 0) === 0;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">

      {/* Period selector */}
      <StatsHeader period={period} onPeriodChange={setPeriod} loading={loading} />

      {/* Error */}
      {error && (
        <div className="alert alert-error rounded-xl">
          <span className="font-bold text-sm">{error}</span>
        </div>
      )}

      {data && !isEmpty && (
        <>
          {/* 1 — KPI cards */}
          <StatsOverview overview={data.overview ?? []} />

          {/* 2 — Revenue charts (line + bar) */}
          <StatsChart chartData={data.chartData ?? []} period={period} />

          {/* 3 — Payment charts (pie + horizontal bar) */}
          <PaymentStats payments={data.payments} />

          {/* 4 — Sales mix (donut + radial) */}
          <SalesMix
            topServices={data.topServices   ?? []}
            topProducts={data.topProducts   ?? []}
            topPackages={data.topPackages   ?? []}
          />

          {/* 5 — Top performers (products, services, employees, packages) */}
          <StatsTops
            topProducts={data.topProducts   ?? []}
            topServices={data.topServices   ?? []}
            topEmployees={data.topEmployees ?? []}
            topPackages={data.topPackages   ?? []}
          />
        </>
      )}

      {/* Empty state */}
      {isEmpty && <NoSales />}

    </div>
  );
};

export default Dashboard;