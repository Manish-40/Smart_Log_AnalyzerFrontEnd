import { useEffect, useState } from "react";
import { api } from "../api.js";
import { SeverityBadge, FlaggedBadge } from "./FlaggedBadge.jsx";

export default function LogDetail({ logId, onClose }) {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .getLog(logId)
      .then((data) => !cancelled && setLog(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [logId]);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      const updated = await api.retryExplanation(logId);
      setLog(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-end z-50" onClick={onClose}>
      <div
        className="h-full w-full max-w-lg bg-slate-950 border-l border-slate-800 overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">Log detail</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {loading && <div className="text-slate-500 text-sm">Loading...</div>}
        {error && <div className="text-rose-400 text-sm">{error}</div>}

        {log && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Timestamp" value={new Date(log.timestamp).toLocaleString()} />
              <Field label="Source" value={log.source} />
              <Field label="Event type" value={log.event_type} />
              <Field label="Status code" value={log.status_code ?? "—"} />
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Severity</div>
                <SeverityBadge severity={log.severity} />
              </div>
              {log.message && <Field label="Message" value={log.message} full />}
            </div>

            {log.score != null ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-amber-400">Anomaly detection</h3>
                  <FlaggedBadge score={log.score} />
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                    Triggered rules
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(log.reasons || []).map((r) => (
                      <span
                        key={r}
                        className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                    Rule summary
                  </div>
                  <p className="text-sm text-slate-300">{log.reason_summary}</p>
                </div>

                <div className="border-t border-amber-500/20 pt-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      AI explanation
                    </div>
                    {log.ai_status === "failed" && (
                      <button
                        onClick={handleRetry}
                        disabled={retrying}
                        className="text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                      >
                        {retrying ? "Retrying..." : "Retry"}
                      </button>
                    )}
                  </div>

                  {log.ai_status === "ok" && (
                    <>
                      <p className="text-sm text-slate-200 mb-2">{log.ai_explanation}</p>
                      <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                        Likely root cause / next step
                      </div>
                      <p className="text-sm text-slate-300">{log.ai_root_cause}</p>
                    </>
                  )}
                  {log.ai_status === "pending" && (
                    <p className="text-sm text-slate-500 italic">Generating explanation...</p>
                  )}
                  {log.ai_status === "failed" && (
                    <p className="text-sm text-rose-400">
                      AI explanation failed to generate. Try again.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-500 italic">
                This entry was not flagged as anomalous.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, full }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">{label}</div>
      <div className="text-slate-200 break-words">{value}</div>
    </div>
  );
}
