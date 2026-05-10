"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-[--muted] block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[--card] border border-[--border] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[--accent]"
          />
        </div>
        <div>
          <label className="text-xs text-[--muted] block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[--card] border border-[--border] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[--accent]"
          />
        </div>
        {error && <p className="text-sm text-[--down]">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[--accent] hover:bg-[--accent-hover] disabled:opacity-50 text-white py-2 rounded-md text-sm transition-colors"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="text-center text-sm text-[--muted] mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[--accent] hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}