import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { api } from "@/lib/auth";

export default function Admin() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<{ users: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<{ users: number }>("/api/admin/summary").then((d) => setSummary(d)).catch((e) => setError("Unauthorized"));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
      {error && <div className="mt-4 rounded-md bg-amber-100 p-3 text-amber-800">{error}</div>}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="text-sm text-muted-foreground">Total Users</div>
          <div className="mt-2 text-3xl font-bold">{summary?.users ?? "-"}</div>
        </div>
      </div>
    </div>
  );
}
