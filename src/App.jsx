import { useEffect, useState, useCallback } from "react";
import { api } from "./api.js";
import Stats from "./components/Stats.jsx";
import Filters from "./components/Filters.jsx";
import LogList from "./components/LogList.jsx";
import LogDetail from "./components/LogDetail.jsx";
import UploadForm from "./components/UploadForm.jsx";

export default function App() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [filters, setFilters] = useState({
    search: "",
    source: "",
    severity: "",
    flagged: false,
  });

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      api.listLogs({ ...filters, page, pageSize }),
      api.getStats(),
    ])
      .then(([logsRes, statsRes]) => {
        setLogs(logsRes.logs);
        setTotal(logsRes.total);
        setStats(statsRes);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters, page]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.source, filters.severity, filters.flagged]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4">
        <h1 className="text-xl font-semibold">Smart Log Analyzer & Anomaly Detector</h1>
        <p className="text-sm text-slate-500">
          Rule-based anomaly detection with AI-generated plain-English explanations.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        <Stats stats={stats} />
        <UploadForm onIngested={refresh} />
        <Filters filters={filters} onChange={setFilters} />

        {error && (
          <div className="text-rose-400 text-sm mb-3 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <LogList logs={logs} loading={loading} onSelect={setSelectedId} />

        {total > 0 && (
          <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
            <span>
              Page {page} of {totalPages} · {total} total
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {selectedId && <LogDetail logId={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
