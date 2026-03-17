import {
  BarChart2,
  Download,
  FileSpreadsheet,
  Package,
  Scale,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { useT } from "../../hooks/useT";
import {
  downloadFinancialBalance,
  downloadSalesJournal,
  downloadStaffPerformance,
  downloadStockStatus,
  getSalesSummary,
  getTopItems,
} from "../../services/reportService";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Summary {
  period: { startDate: string; endDate: string };
  totalRevenue: number;
  totalTransactions: number;
  averageTransaction: number;
  paymentBreakdown: Record<string, number>;
}

interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
}

// Small reusable date input 
const DateInput: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">
      {label}
    </span>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input input-bordered input-sm w-40"
    />
  </div>
);

// Export card 
const ExportCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string; // tailwind bg class e.g. "bg-primary/10"
  iconColor: string; // tailwind text class e.g. "text-primary"
  onDownload: () => Promise<void>;
  downloadLabel: string;
  downloadingLabel: string;
  needsDates?: boolean;
  startDate?: string;
  endDate?: string;
}> = ({
  icon,
  title,
  desc,
  color,
  iconColor,
  onDownload,
  downloadLabel,
  downloadingLabel,
  needsDates = true,
  startDate,
  endDate,
}) => {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleClick = async () => {
    if (needsDates && (!startDate || !endDate)) {
      setErr("Please select a date range first.");
      return;
    }
    setErr(null);
    setBusy(true);
    try {
      await onDownload();
    } catch (e: any) {
      setErr(e.response?.data?.error ?? "Download failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-base-200 rounded-xl border border-base-300 p-5 flex items-start gap-4 shadow-sm group">
      <div
        className={`p-3 rounded-xl ${color} ${iconColor} border border-current/20 shrink-0`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black uppercase text-sm tracking-tight">{title}</p>
        <p className="text-[10px] opacity-50 font-bold mt-0.5">{desc}</p>
        {err && <p className="text-error text-xs font-bold mt-1">{err}</p>}
      </div>
      <button
        onClick={handleClick}
        disabled={busy}
        className={`btn btn-sm rounded-lg font-bold gap-2 uppercase text-[10px] tracking-widest shrink-0
          ${ "btn-primary"}`}
      >
        {busy ? (
          <>
            <span className="loading loading-spinner loading-xs" />
            {downloadingLabel}
          </>
        ) : (
          <>
            <Download size={14} />
            {downloadLabel}
          </>
        )}
      </button>
    </div>
  );
};

//  Main component 
const ReportsManagement: React.FC = () => {
  const { t } = useT();

  // Shared date range
  const today = new Date().toISOString().slice(0, 10);
  const firstOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  )
    .toISOString()
    .slice(0, 10);

  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(today);

  // Summary state
  const [summary, setSummary] = useState<Summary | null>(null);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setError(null);
    try {
      const [sumRes, topRes] = await Promise.all([
        getSalesSummary(startDate, endDate),
        getTopItems(startDate, endDate, 8),
      ]);
      setSummary(sumRes.summary ?? null);
      setTopItems(topRes.topItems ?? []);
    } catch (e: any) {
      setError(e.response?.data?.error ?? t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const PAYMENT_COLORS: Record<string, string> = {
    CASH: "bg-success",
    OM: "bg-warning",
    MOMO: "bg-primary",
    CARD: "bg-accent",
  };

  const paymentTotal = summary
    ? Object.values(summary.paymentBreakdown).reduce((s, v) => s + v, 0)
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="border-l-4 border-primary pl-5">
        <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight">
          {t("reports.title")}
        </h2>
        <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-[0.3em]">
          {t("reports.subtitle")}
        </p>
      </div>

      {/* ── Date range + Generate ───────────────────────────────────────── */}
      <div className="bg-base-200 rounded-xl border border-base-300 p-5 flex flex-wrap items-end gap-4">
        <DateInput
          label={t("reports.startDate")}
          value={startDate}
          onChange={setStartDate}
        />
        <DateInput
          label={t("reports.endDate")}
          value={endDate}
          onChange={setEndDate}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn btn-primary rounded-lg font-bold uppercase text-xs tracking-widest gap-2"
        >
          {loading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <BarChart2 size={15} />
          )}
          {loading ? t("common.loading") : t("reports.generate")}
        </button>
      </div>

      {error && (
        <div className="alert alert-error rounded-xl text-sm font-bold">
          {error}
        </div>
      )}

      {/* ── Summary cards ──────────────────────────────────────────────── */}
      {summary && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
            {t("reports.summary.title")}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: t("reports.summary.totalRevenue"),
                value: summary.totalRevenue,
                icon: TrendingUp,
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                label: t("reports.summary.totalTx"),
                value: summary.totalTransactions,
                icon: ShoppingCart,
                color: "text-secondary",
                bg: "bg-secondary/10",
              },
              {
                label: t("reports.summary.avgTx"),
                value: summary.averageTransaction,
                icon: BarChart2,
                color: "text-accent",
                bg: "bg-accent/10",
              },
              {
                label: t("common.currency"),
                value: paymentTotal,
                icon: Scale,
                color: "text-warning",
                bg: "bg-warning/10",
              },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="bg-base-200 rounded-xl border border-base-300 p-5 flex items-center gap-3 shadow-sm"
              >
                <div className={`p-3 rounded-xl ${bg} ${color} shrink-0`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase opacity-50 tracking-widest truncate">
                    {label}
                  </p>
                  <p
                    className={`text-xl font-black leading-none mt-1 ${color}`}
                  >
                    {value.toLocaleString()}
                    <span className="text-xs ml-1 opacity-60">
                      {label === t("reports.summary.totalTx") ? t("common.ticket") : t("common.currency")}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment breakdown */}
          <div className="bg-base-200 rounded-xl border border-base-300 p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-4">
              {t("reports.summary.byPayment")}
            </p>
            <div className="space-y-3">
              {Object.entries(summary.paymentBreakdown).map(
                ([method, amount]) => {
                  const pct =
                    paymentTotal > 0
                      ? Math.round((amount / paymentTotal) * 100)
                      : 0;
                  return (
                    <div key={method}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-black uppercase tracking-wide">
                          {method}
                        </span>
                        <span className="text-sm font-black text-primary">
                          {(amount as number).toLocaleString()}
                          <span className="text-[10px] ml-1 opacity-60">
                            {t("common.currency")}
                          </span>
                          <span className="text-[10px] opacity-40 ml-2">
                            {pct}%
                          </span>
                        </span>
                      </div>
                      <div className="h-1.5 bg-base-300 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${PAYMENT_COLORS[method] ?? "bg-primary"} rounded-full transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>
      )}

      {/*  Top items  */}
      {topItems.length > 0 && (
        <div className="bg-base-200 rounded-xl border border-base-300 p-5 shadow-sm animate-in fade-in duration-300">
          <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-4">
            {t("reports.topItems.title")}
          </p>
          <div className="space-y-2">
            {topItems.map((item, i) => {
              const maxRev = topItems[0]?.revenue ?? 1;
              const pct = Math.round((item.revenue / maxRev) * 100);
              return (
                <div
                  key={`${item.name}-${i}`}
                  className="flex items-center gap-3"
                >
                  <span className="text-[10px] font-black opacity-30 w-4 text-right shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-bold uppercase tracking-tight truncate max-w-[55%]">
                        {item.name}
                      </span>
                      <div className="flex gap-3 text-right shrink-0">
                        <span className="text-[10px] opacity-50">
                          ×{item.quantity} {t("reports.topItems.quantity")}
                        </span>
                        <span className="text-xs font-black text-primary">
                          {item.revenue.toLocaleString()}
                          <span className="text-[10px] opacity-60 ml-1">
                            {t("common.currency")}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-base-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No results */}
      {!loading && summary && summary.totalTransactions === 0 && (
        <div className="flex items-center justify-center py-12 opacity-20">
          <p className="font-black uppercase tracking-widest text-sm">
            {t("reports.noResults")}
          </p>
        </div>
      )}

      {/*  Export section  */}
      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
          {t("reports.exports.title")}
        </p>

        <ExportCard
          icon={<FileSpreadsheet size={22} />}
          title={t("reports.exports.salesJournal")}
          desc={t("reports.exports.salesJournalDesc")}
          color="bg-primary/10"
          iconColor="text-primary"
          downloadLabel={t("reports.download")}
          downloadingLabel={t("reports.downloading")}
          needsDates
          startDate={startDate}
          endDate={endDate}
          onDownload={() => downloadSalesJournal(startDate, endDate)}
        />

        <ExportCard
          icon={<Users size={22} />}
          title={t("reports.exports.staffPerf")}
          desc={t("reports.exports.staffPerfDesc")}
          color="bg-secondary/10"
          iconColor="text-secondary"
          downloadLabel={t("reports.download")}
          downloadingLabel={t("reports.downloading")}
          needsDates
          startDate={startDate}
          endDate={endDate}
          onDownload={() => downloadStaffPerformance(startDate, endDate)}
        />

        <ExportCard
          icon={<Package size={22} />}
          title={t("reports.exports.stockStatus")}
          desc={t("reports.exports.stockStatusDesc")}
          color="bg-warning/10"
          iconColor="text-warning"
          downloadLabel={t("reports.download")}
          downloadingLabel={t("reports.downloading")}
          needsDates={false}
          onDownload={() => downloadStockStatus()}
        />

        <ExportCard
          icon={<Scale size={22} />}
          title={t("reports.exports.financial")}
          desc={t("reports.exports.financialDesc")}
          color="bg-accent/10"
          iconColor="text-accent"
          downloadLabel={t("reports.download")}
          downloadingLabel={t("reports.downloading")}
          needsDates
          startDate={startDate}
          endDate={endDate}
          onDownload={() => downloadFinancialBalance(startDate, endDate)}
        />
      </div>
    </div>
  );
};

export default ReportsManagement;
