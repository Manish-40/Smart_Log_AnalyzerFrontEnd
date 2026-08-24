const SEVERITIES = ["", "info", "warning", "error", "critical"];

export default function Filters({ filters, onChange }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="flex flex-wrap gap-3 mb-4 items-center">
      <input
        type="text"
        placeholder="Search event type or message..."
        value={filters.search}
        onChange={set("search")}
        className="flex-1 min-w-[200px] bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <input
        type="text"
        placeholder="Filter by source/IP"
        value={filters.source}
        onChange={set("source")}
        className="w-48 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <select
        value={filters.severity}
        onChange={set("severity")}
        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        {SEVERITIES.map((s) => (
          <option key={s} value={s}>
            {s ? s[0].toUpperCase() + s.slice(1) : "All severities"}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 text-sm text-slate-300 select-none cursor-pointer">
        <input
          type="checkbox"
          checked={filters.flagged}
          onChange={(e) => onChange({ ...filters, flagged: e.target.checked })}
          className="accent-amber-500"
        />
        Flagged only
      </label>
    </div>
  );
}
