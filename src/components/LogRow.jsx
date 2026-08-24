import { SeverityBadge, FlaggedBadge } from "./FlaggedBadge.jsx";

export default function LogRow({ log, onSelect }) {
  const isFlagged = log.score != null;

  return (
    <tr
      onClick={() => onSelect(log.id)}
      className={`cursor-pointer border-b border-slate-800/70 hover:bg-slate-900/70 transition-colors ${
        isFlagged ? "bg-amber-500/5" : ""
      }`}
    >
      <td className="py-2.5 px-3 text-sm text-slate-400 whitespace-nowrap">
        {new Date(log.timestamp).toLocaleString()}
      </td>
      <td className="py-2.5 px-3 text-sm text-slate-300 whitespace-nowrap">{log.source}</td>
      <td className="py-2.5 px-3 text-sm text-slate-200">{log.event_type}</td>
      <td className="py-2.5 px-3">
        <SeverityBadge severity={log.severity} />
      </td>
      <td className="py-2.5 px-3 text-sm text-slate-400">{log.status_code ?? "—"}</td>
      <td className="py-2.5 px-3">{isFlagged && <FlaggedBadge score={log.score} />}</td>
    </tr>
  );
}
