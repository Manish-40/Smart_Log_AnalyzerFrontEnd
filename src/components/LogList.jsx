import LogRow from "./LogRow.jsx";

export default function LogList({ logs, loading, onSelect }) {
  if (loading) {
    return <div className="text-slate-500 text-sm py-10 text-center">Loading logs...</div>;
  }

  if (!logs.length) {
    return (
      <div className="text-slate-500 text-sm py-16 text-center border border-dashed border-slate-800 rounded-xl">
        No log entries match your filters yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-900 text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="py-2.5 px-3 font-medium">Timestamp</th>
            <th className="py-2.5 px-3 font-medium">Source</th>
            <th className="py-2.5 px-3 font-medium">Event</th>
            <th className="py-2.5 px-3 font-medium">Severity</th>
            <th className="py-2.5 px-3 font-medium">Status</th>
            <th className="py-2.5 px-3 font-medium">Anomaly</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <LogRow key={log.id} log={log} onSelect={onSelect} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
