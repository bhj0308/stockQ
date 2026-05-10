"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, displayName, password);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
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
          <label className="text-xs text-[--muted] block mb-1">Display Name</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
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
            minLength={6}
            className="w-full bg-[--card] border border-[--border] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[--accent]"
          />
        </div>
        {error && <p className="text-sm text-[--down]">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[--accent] hover:bg-[--accent-hover] disabled:opacity-50 text-white py-2 rounded-md text-sm transition-colors"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="text-center text-sm text-[--muted] mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-[--accent] hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}