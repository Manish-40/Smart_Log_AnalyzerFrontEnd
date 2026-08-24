export default function Stats({ stats }) {
  if (!stats) return null;

  const cards = [
    { label: "Total logs", value: stats.total_logs, color: "text-slate-100" },
    { label: "Flagged anomalies", value: stats.total_flagged, color: "text-amber-400" },
    { label: "Rejected (invalid)", value: stats.total_rejected, color: "text-rose-400" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">{c.label}</div>
          <div className={`text-3xl font-semibold mt-1 ${c.color}`}>{c.value ?? 0}</div>
        </div>
      ))}
    </div>
  );
}
