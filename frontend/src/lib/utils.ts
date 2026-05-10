export function formatPct(n: number | null | undefined): string {
  if (n == null) return "—";
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

export function formatCurrency(n: number | null | undefined): string {
  if (n == null) return "—";
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null) return "—";
  return n.toLocaleString();
}

export function formatDuration(ms: number | null | undefined): string {
  if (ms == null) return "—";
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

export function statusColor(status: string): string {
  switch (status) {
    case "completed":
      return "text-[--up]";
    case "running":
    case "pending":
      return "text-yellow-400";
    case "failed":
      return "text-[--down]";
    case "validated":
      return "text-[--accent]";
    default:
      return "text-[--muted]";
  }
}