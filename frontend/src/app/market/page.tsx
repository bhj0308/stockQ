"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function MarketPage() {
  const { data: symbols, isLoading: symLoading } = useQuery({
    queryKey: ["symbols"],
    queryFn: () => api.getSymbols(),
  });
  const { data: datasets, isLoading: dsLoading } = useQuery({
    queryKey: ["datasets"],
    queryFn: () => api.getDatasets(),
  });
  const { data: watchlist, isLoading: wlLoading } = useQuery({
    queryKey: ["watchlist"],
    queryFn: () => api.getWatchlist(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Market</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Watchlist */}
        <div className="lg:col-span-2 border border-[--border] rounded-lg">
          <div className="px-4 py-3 border-b border-[--border]">
            <h2 className="font-semibold">Watchlist</h2>
          </div>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Name</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Change</th>
                  <th className="text-right hidden sm:table-cell">Volume</th>
                </tr>
              </thead>
              <tbody>
                {wlLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center text-[--muted] py-8">
                      Loading...
                    </td>
                  </tr>
                ) : watchlist && watchlist.length > 0 ? (
                  watchlist.map((item) => (
                    <tr key={item.ticker} className="hover:bg-[--card] transition-colors">
                      <td className="font-medium">{item.ticker}</td>
                      <td className="text-[--muted]">{item.name ?? "—"}</td>
                      <td className="text-right font-mono">${item.close.toFixed(2)}</td>
                      <td className={`text-right font-mono ${item.change >= 0 ? "text-[--up]" : "text-[--down]"}`}>
                        {item.change >= 0 ? "+" : ""}
                        {item.change.toFixed(2)}
                        <span className="text-xs ml-1">
                          ({item.change_pct >= 0 ? "+" : ""}
                          {item.change_pct.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="text-right text-[--muted] hidden sm:table-cell">
                        {item.volume?.toLocaleString() ?? "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-[--muted] py-8">
                      No watchlist data available. Start the backend to load market data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Datasets sidebar */}
        <div className="border border-[--border] rounded-lg">
          <div className="px-4 py-3 border-b border-[--border]">
            <h2 className="font-semibold">Datasets</h2>
          </div>
          <div>
            {dsLoading ? (
              <div className="p-4 text-sm text-[--muted]">Loading...</div>
            ) : datasets && datasets.length > 0 ? (
              datasets.map((ds) => (
                <div key={ds.id} className="px-4 py-3 border-b border-[--border] last:border-0 hover:bg-[--card] transition-colors">
                  <div className="font-medium text-sm">{ds.version}</div>
                  <div className="text-xs text-[--muted] mt-0.5">{ds.start_date} → {ds.end_date}</div>
                  <div className="text-xs text-[--muted]">{ds.status}</div>
                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-[--muted]">
                No datasets loaded yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Symbols table */}
      <div className="border border-[--border] rounded-lg mt-6">
        <div className="px-4 py-3 border-b border-[--border]">
          <h2 className="font-semibold">All Symbols</h2>
        </div>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Name</th>
                <th>Exchange</th>
                <th className="hidden md:table-cell">Sector</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {symLoading ? (
                <tr>
                  <td colSpan={5} className="text-center text-[--muted] py-8">Loading...</td>
                </tr>
              ) : symbols && symbols.length > 0 ? (
                symbols.map((s) => (
                  <tr key={s.id} className="hover:bg-[--card] transition-colors">
                    <td className="font-medium">{s.ticker}</td>
                    <td className="text-[--muted]">{s.name ?? "—"}</td>
                    <td className="text-[--muted]">{s.exchange ?? "—"}</td>
                    <td className="text-[--muted] hidden md:table-cell">{s.sector ?? "—"}</td>
                    <td>
                      <span className={`text-xs font-medium ${s.is_active ? "text-[--up]" : "text-[--muted]"}`}>
                        {s.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-[--muted] py-8">
                    No symbols loaded. Start the backend to see market data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}