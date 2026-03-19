import { Download, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { useUpdater } from "../hooks/useUpdater";
 
export default function UpdateBanner() {
  const { updateAvailable, updateReady, version, progress, install } =
    useUpdater();
  const [dismissed, setDismissed] = useState(false);
 
  // Nothing to show
  if (dismissed || (!updateAvailable && !updateReady)) return null;
 
  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-[9999]
        flex items-center justify-between gap-3
        px-4 py-2 text-sm font-medium
        ${updateReady
          ? "bg-success text-success-content"
          : "bg-info text-info-content"
        }
        shadow-md
      `}
    >
      {/* Left: icon + message */}
      <div className="flex items-center gap-2">
        {updateReady ? (
          <RefreshCw size={16} className="shrink-0" />
        ) : (
          <Download size={16} className="shrink-0 animate-bounce" />
        )}
 
        {updateReady ? (
          <span>
            Simxel <strong>v{version}</strong> is ready — restart to apply the
            update.
          </span>
        ) : (
          <span>
            Downloading Simxel <strong>v{version}</strong>
            {progress !== null && ` — ${progress}%`}…
          </span>
        )}
      </div>
 
      {/* Right: action buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {updateReady && (
          <button
            onClick={install}
            className="btn btn-xs btn-success-content border border-current"
          >
            Restart now
          </button>
        )}
 
        {/* Progress bar (while downloading) */}
        {!updateReady && progress !== null && (
          <progress
            className="progress progress-info w-24 h-1.5"
            value={progress}
            max={100}
          />
        )}
 
        {/* Dismiss (only while still downloading) */}
        {!updateReady && (
          <button
            onClick={() => setDismissed(true)}
            className="btn btn-ghost btn-xs btn-circle"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}