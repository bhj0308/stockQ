"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { formatPct, formatNumber } from "@/lib/utils";

export default function LeaderboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => api.getLeaderboard(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-[--muted] text-sm mt-1">
          Strategies ranked by composite score
        </p>
      </div>

      <div className="border border-[--border] rounded-lg overflow-hidden">
        <table>
          <thead>
            <tr>
              <th className="w-12 text-center">#</th>
              <th>Strategy</th>
              <th className="text-right">Return</th>
              <th className="text-right hidden md:table-cell">Max DD</th>
              <th className="text-right">Score</th>
              <th className="text-right hidden sm:table-cell">Trades</th>
              <th className="hidden sm:table-cell">Dataset</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center text-[--muted] py-12">
                  Loading...
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((entry) => (
                <tr key={entry.rank} className="hover:bg-[--card] transition-colors">
                  <td className="text-center">
                    {entry.rank <= 3 ? (
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        entry.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                        entry.rank === 2 ? "bg-gray-400/20 text-gray-300" :
                        "bg-orange-500/20 text-orange-400"
                      }`}>
                        {entry.rank}
                      </span>
                    ) : (
                      <span className="text-[--muted]">{entry.rank}</span>
                    )}
                  </td>
                  <td className="font-medium">{entry.strategy_name}</td>
                  <td className={`text-right font-mono ${entry.total_return != null && entry.total_return >= 0 ? "text-[--up]" : "text-[--down]"}`}>
                    {formatPct(entry.total_return)}
                  </td>
                  <td className="text-right font-mono text-[--down] hidden md:table-cell">
                    {formatPct(entry.max_drawdown)}
                  </td>
                  <td className="text-right font-mono font-bold">
                    {entry.score?.toFixed(1) ?? "—"}
                  </td>
                  <td className="text-right font-mono text-[--muted] hidden sm:table-cell">
                    {formatNumber(entry.trade_count)}
                  </td>
                  <td className="text-[--muted] text-sm hidden sm:table-cell">
                    {entry.dataset_version}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center text-[--muted] py-12">
                  No results yet. Run a strategy to see it on the leaderboard.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}