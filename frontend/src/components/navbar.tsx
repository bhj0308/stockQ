"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

export function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="border-b border-[--border] bg-[--background]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-lg tracking-tight">
            StockQ
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            <NavLink href="/market">Market</NavLink>
            <NavLink href="/strategies">Strategies</NavLink>
            <NavLink href="/leaderboard">Leaderboard</NavLink>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-[--muted] border-t-transparent animate-spin" />
          ) : user ? (
            <>
              <span className="text-sm text-[--muted] hidden sm:inline">
                {user.display_name}
              </span>
              <button
                onClick={logout}
                className="text-sm text-[--muted] hover:text-[--foreground] transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-[--accent] hover:bg-[--accent-hover] text-white px-4 py-1.5 rounded-md transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 text-sm text-[--muted] hover:text-[--foreground] transition-colors rounded-md hover:bg-[--card]"
    >
      {children}
    </Link>
  );
}