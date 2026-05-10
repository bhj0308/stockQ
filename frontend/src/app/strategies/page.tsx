"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { statusColor } from "@/lib/utils";

export default function StrategiesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["strategies"],
    queryFn: () => api.getStrategies(),
  });

  const createMutation = useMutation({
    mutationFn: () => api.createStrategy({ name, description: description || null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strategies"] });
      setShowForm(false);
      setName("");
      setDescription("");
    },
  });

  const strategies = data?.strategies ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Strategies</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[--accent] hover:bg-[--accent-hover] text-white text-sm px-4 py-2 rounded-md transition-colors"
        >
          {showForm ? "Cancel" : "New Strategy"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="border border-[--border] rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-3">Create Strategy</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[--muted] block mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Mean Reversion Strategy"
                className="w-full bg-[--card] border border-[--border] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[--accent]"
              />
            </div>
            <div>
              <label className="text-xs text-[--muted] block mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                rows={3}
                className="w-full bg-[--card] border border-[--border] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[--accent] resize-none"
              />
            </div>
            <button
              onClick={() => createMutation.mutate()}
              disabled={!name || createMutation.isPending}
              className="bg-[--accent] hover:bg-[--accent-hover] disabled:opacity-50 text-white text-sm px-4 py-2 rounded-md transition-colors"
            >
              {createMutation.isPending ? "Creating..." : "Create"}
            </button>
            {createMutation.isError && (
              <p className="text-sm text-[--down]">{createMutation.error.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Strategies list */}
      <div className="border border-[--border] rounded-lg overflow-hidden">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Entrypoint</th>
              <th className="hidden sm:table-cell">Created</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center text-[--muted] py-8">Loading...</td>
              </tr>
            ) : strategies.length > 0 ? (
              strategies.map((s) => (
                <tr key={s.id} className="hover:bg-[--card] transition-colors">
                  <td className="font-medium">{s.name}</td>
                  <td>
                    <span className={`text-xs font-medium ${statusColor(s.status)}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="font-mono text-sm text-[--muted]">{s.entrypoint}</td>
                  <td className="text-[--muted] text-sm hidden sm:table-cell">
                    {s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-[--muted] py-8">
                  No strategies yet. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}