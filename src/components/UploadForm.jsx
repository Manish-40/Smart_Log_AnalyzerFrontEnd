import { useState } from "react";
import { api } from "../api.js";

const PLACEHOLDER = `Paste a JSON array of log entries, e.g.
[
  { "timestamp": "2026-08-20T09:14:02Z", "source": "192.168.1.14", "event_type": "GET /api/users", "status_code": 200 },
  { "timestamp": "2026-08-20T09:15:10Z", "source": "10.0.0.55", "event_type": "POST /api/payment", "status_code": 500 }
]`;

export default function UploadForm({ onIngested }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
  };

  const submit = async () => {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      let payload;
      if (file) {
        const content = await file.text();
        payload = JSON.parse(content);
      } else {
        if (!text.trim()) throw new Error("Paste some JSON log entries first, or choose a file.");
        payload = JSON.parse(text);
      }
      const res = await api.ingestLogs(payload);
      setResult(res);
      setText("");
      setFile(null);
      onIngested?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 mb-6">
      <h3 className="text-sm font-semibold text-slate-200 mb-2">Ingest logs</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={5}
        disabled={!!file}
        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
      />
      <div className="flex flex-wrap items-center gap-3 mt-3">
        <input
          type="file"
          accept="application/json"
          onChange={handleFile}
          className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-800 file:text-slate-300 file:text-xs hover:file:bg-slate-700"
        />
        <button
          onClick={submit}
          disabled={busy}
          className="ml-auto bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {busy ? "Ingesting..." : "Ingest"}
        </button>
      </div>

      {error && <p className="text-rose-400 text-xs mt-2">{error}</p>}
      {result && (
        <p className="text-emerald-400 text-xs mt-2">
          Inserted {result.insertedCount}, flagged {result.flaggedCount}, rejected{" "}
          {result.rejectedCount} (invalid entries).
        </p>
      )}
    </div>
  );
}
