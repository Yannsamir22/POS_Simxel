import React, { useState } from "react";
import { useSyncStore, type SyncStatus } from "../../stores/syncStore";
import { useT } from "../../hooks/useT";

// ─── Config per status ────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  SyncStatus,
  { dot: string; ring: string; label: string; pulse: boolean }
> = {
  online: {
    dot:   "bg-secondary",          // green — your secondary color
    ring:  "ring-secondary/30",
    label: "sync.online",
    pulse: false,
  },
  syncing: {
    dot:   "bg-primary",            // blue — actively syncing
    ring:  "ring-primary/30",
    label: "sync.syncing",
    pulse: true,
  },
  unreachable: {
    dot:   "bg-warning",            // amber — online but server unreachable
    ring:  "ring-warning/30",
    label: "sync.unreachable",
    pulse: false,
  },
  offline: {
    dot:   "bg-error",              // red — no network
    ring:  "ring-error/30",
    label: "sync.offline",
    pulse: false,
  },
};

interface SyncIndicatorProps {
  /** "dot" = compact dot only (for navbar), "badge" = dot + text label */
  variant?: "dot" | "badge";
}

const SyncIndicator: React.FC<SyncIndicatorProps> = ({ variant = "dot" }) => {
  const status   = useSyncStore((s) => s.status);
  const lastSync = useSyncStore((s) => s.lastSync);
  const checkConnection = useSyncStore((s) => s.checkConnection);
  const { t } = useT();

  const [showTooltip, setShowTooltip] = useState(false);

  const cfg = STATUS_CONFIG[status];

  // Format last sync time
  const lastSyncText = lastSync
    ? lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Clickable indicator — clicking forces an immediate check */}
      <button
        onClick={checkConnection}
        className={`flex items-center gap-2 rounded-full transition-all
          ${variant === "badge"
            ? "px-2.5 py-1 bg-base-200 border border-base-300 hover:border-base-content/20"
            : "p-1 hover:opacity-80"
          }`}
        title={t(cfg.label)}
        aria-label={t(cfg.label)}
      >
        {/* The dot */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          {/* Pulsing ring — only when syncing */}
          {cfg.pulse && (
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${cfg.dot}`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 ring-2 ${cfg.dot} ${cfg.ring}`}
          />
        </span>

        {/* Text label — only in badge variant */}
        {variant === "badge" && (
          <span className={`text-[10px] font-black uppercase tracking-widest
            ${status === "online"      ? "text-secondary" :
              status === "syncing"     ? "text-primary"   :
              status === "unreachable" ? "text-warning"   :
                                         "text-error"}`}>
            {t(cfg.label)}
          </span>
        )}
      </button>

      {/* Tooltip — appears on hover, only in dot variant */}
      {variant === "dot" && showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 z-50 pointer-events-none">
          <div className="bg-base-300 text-base-content text-[11px] font-bold
            px-3 py-2 rounded-lg shadow-lg whitespace-nowrap border border-base-200 min-w-max">
            <div className="flex items-center gap-2">
              <span className={`inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />
              <span>{t(cfg.label)}</span>
            </div>
            {lastSyncText && (
              <div className="opacity-50 mt-0.5 text-[10px]">
                {t("sync.lastSync")} {lastSyncText}
              </div>
            )}
            <div className="opacity-40 text-[9px] mt-0.5">
              {t("sync.clickToRetry")}
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full right-3 border-4 border-transparent
              border-t-base-300" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncIndicator;