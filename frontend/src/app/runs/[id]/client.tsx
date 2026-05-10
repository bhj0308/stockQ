"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";
import { formatPct, formatCurrency, formatDuration, formatNumber, statusColor } from "@/lib/utils";

export function RunDetailsClient({ id }: { id: string }) {
  const [tab, setTab] = useState<"overview" | "logs" | "orders" | "portfolio">("overview");
  const runId = Number(id);

  const { data: run, isLoading: runLoading } = useQuery({
    queryKey: ["run", runId],
    queryFn: () => api.getRun(runId),
  });
  const { data: logs } = useQuery({
    queryKey: ["run-logs", runId],
    queryFn: () => api.getRunLogs(runId),
    enabled: tab === "logs",
  });
  const { data: orders } = useQuery({
    queryKey: ["run-orders", runId],
    queryFn: () => api.getRunOrders(runId),
    enabled: tab === "orders",
  });
  const { data: portfolio } = useQuery({
    queryKey: ["run-portfolio", runId],
    queryFn: () => api.getRunPortfolio(runId),
    enabled: tab === "portfolio",
  });
  const { data: metrics } = useQuery({
    queryKey: ["run-metrics", runId],
    queryFn: () => api.getRunMetrics(runId),
  });

  if (runLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-[--muted] py-12">Loading run details...</div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-[--muted] py-12">Run not found</div>
      </div>
    );
  }

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "logs" as const, label: "Logs" },
    { key: "orders" as const, label: "Orders" },
    { key: "portfolio" as const, label: "Portfolio" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-[--muted] mb-4">
        <Link href="/strategies" className="hover:text-[--foreground]">Strategies</Link>
        <span className="mx-2">/</span>
        <span>Run #{run.id}</span>
      </div>

      {/* Run header */}
      <div className="border border-[--border] rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">Run #{run.id}</h1>
          <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full border border-current ${statusColor(run.status)}`}>
            {run.status}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-[--muted]">Strategy ID</span>
            <p className="font-medium">{run.strategy_id}</p>
          </div>
          <div>
            <span className="text-[--muted]">Dataset ID</span>
            <p className="font-medium">{run.dataset_id}</p>
          </div>
          <div>
            <span className="text-[--muted]">Duration</span>
            <p className="font-medium">{formatDuration(run.runtime_ms)}</p>
          </div>
          <div>
            <span className="text-[--muted]">Exit Code</span>
            <p className={`font-medium ${run.exit_code === 0 ? "text-[--up]" : run.exit_code != null ? "text-[--down]" : ""}`}>
              {run.exit_code != null ? run.exit_code : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              tab === t.key
                ? "bg-[--accent] text-white"
                : "text-[--muted] hover:text-[--foreground] hover:bg-[--card]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Metrics */}
          <div className="border border-[--border] rounded-lg">
            <div className="px-4 py-3 border-b border-[--border]">
              <h2 className="font-semibold">Metrics</h2>
            </div>
            {metrics ? (
              <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                <Metric label="Total Return" value={formatPct(metrics.total_return)} className={metrics.total_return != null && metrics.total_return >= 0 ? "text-[--up]" : "text-[--down]"} />
                <Metric label="Annualized Return" value={formatPct(metrics.annualized_return)} />
                <Metric label="Volatility" value={formatPct(metrics.volatility)} />
                <Metric label="Max Drawdown" value={formatPct(metrics.max_drawdown)} className="text-[--down]" />
                <Metric label="Sharpe-like" value={metrics.sharpe_like?.toFixed(2) ?? "—"} />
                <Metric label="Win Rate" value={formatPct(metrics.win_rate)} />
                <Metric label="Turnover" value={formatPct(metrics.turnover)} />
                <Metric label="Score" value={metrics.score?.toFixed(1) ?? "—"} className="font-bold" />
              </div>
            ) : (
              <div className="p-4 text-sm text-[--muted]">No metrics available yet.</div>
            )}
          </div>

          {/* Timestamps */}
          <div className="border border-[--border] rounded-lg">
            <div className="px-4 py-3 border-b border-[--border]">
              <h2 className="font-semibold">Timeline</h2>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div>
                <span className="text-[--muted]">Started</span>
                <p className="font-medium">{run.started_at ? new Date(run.started_at).toLocaleString() : "—"}</p>
              </div>
              <div>
                <span className="text-[--muted]">Completed</span>
                <p className="font-medium">{run.completed_at ? new Date(run.completed_at).toLocaleString() : "—"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "logs" && (
        <div className="border border-[--border] rounded-lg">
          <div className="px-4 py-3 border-b border-[--border]">
            <h2 className="font-semibold">Execution Logs</h2>
          </div>
          {logs && logs.length > 0 ? (
            <div className="p-4 font-mono text-xs leading-relaxed max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-2">
                  <span className="text-[--muted] shrink-0">{new Date(log.created_at).toISOString().slice(11, 19)}</span>
                  <span className={log.stream === "stderr" ? "text-[--down]" : "text-[--foreground]"}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm text-[--muted]">No logs to display.</div>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div className="border border-[--border] rounded-lg overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Side</th>
                <th>Symbol ID</th>
                <th className="text-right">Quantity</th>
                <th className="text-right">Price</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[--card]">
                    <td className="text-sm">{o.trade_date}</td>
                    <td>
                      <span className={`text-xs font-medium ${o.side === "buy" ? "text-[--up]" : "text-[--down]"}`}>
                        {o.side.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-[--muted]">{o.symbol_id}</td>
                    <td className="text-right font-mono">{formatNumber(o.quantity)}</td>
                    <td className="text-right font-mono">${o.price.toFixed(2)}</td>
                    <td className="text-[--muted] text-sm">{o.reason ?? "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-[--muted] py-8">No orders recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "portfolio" && (
        <div className="border border-[--border] rounded-lg overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th className="text-right">Cash</th>
                <th className="text-right">Exposure</th>
                <th className="text-right">NLV</th>
                <th className="text-right">Drawdown</th>
              </tr>
            </thead>
            <tbody>
              {portfolio && portfolio.length > 0 ? (
                portfolio.map((p) => (
                  <tr key={p.id} className="hover:bg-[--card]">
                    <td className="text-sm">{p.trade_date}</td>
                    <td className="text-right font-mono">{formatCurrency(p.cash)}</td>
                    <td className="text-right font-mono">{formatCurrency(p.gross_exposure)}</td>
                    <td className="text-right font-mono">{formatCurrency(p.net_liquidation_value)}</td>
                    <td className={`text-right font-mono ${p.drawdown != null && p.drawdown < 0 ? "text-[--down]" : ""}`}>
                      {formatPct(p.drawdown)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-[--muted] py-8">No portfolio data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div>
      <span className="text-[--muted] text-xs">{label}</span>
      <p className={`font-mono text-sm ${className}`}>{value}</p>
    </div>
  );
}