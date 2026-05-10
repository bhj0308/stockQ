"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";

export default function Home() {
  const { data: health } = useQuery({
    queryKey: ["health"],
    queryFn: () => api.health(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">StockQ</h1>
        <p className="text-[--muted] text-lg">
          Quantitative trading strategy evaluation platform
        </p>
        {health && (
          <p className="text-sm text-[--muted] mt-1">
            API: {health.status} (v{health.version})
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card href="/market" title="Market" description="Browse symbols, view candles, and explore datasets" />
        <Card href="/strategies" title="Strategies" description="Upload and manage your trading strategies" />
        <Card href="/leaderboard" title="Leaderboard" description="See how strategies rank against each other" />
        <Card href="/login" title="Account" description="Sign in or register to get started" />
      </div>
    </div>
  );
}

function Card({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="block border border-[--border] rounded-lg p-6 hover:bg-[--card] hover:border-[--accent] transition-colors"
    >
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-sm text-[--muted]">{description}</p>
    </Link>
  );
}