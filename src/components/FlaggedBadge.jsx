const SEVERITY_STYLES = {
  info: "bg-slate-800 text-slate-300",
  warning: "bg-amber-500/15 text-amber-400",
  error: "bg-orange-500/15 text-orange-400",
  critical: "bg-rose-500/15 text-rose-400",
};

export function SeverityBadge({ severity }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-xs font-medium uppercase tracking-wide ${
        SEVERITY_STYLES[severity] || SEVERITY_STYLES.info
      }`}
    >
      {severity}
    </span>
  );
}

export function FlaggedBadge({ score }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
      ⚠ Flagged · {Math.round(Number(score) * 100)}%
    </span>
  );
}
