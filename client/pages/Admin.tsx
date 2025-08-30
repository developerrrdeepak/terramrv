import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { api } from "@/lib/auth";

export default function Admin() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<{ users: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [farmers, setFarmers] = useState<
    { id: string; email: string; name?: string; role?: string }[]
  >([]);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");

  const load = async () => {
    try {
      const s = await api<{ users: number }>("/api/admin/summary");
      setSummary(s);
      const f = await api<{ users: any[] }>("/api/admin/farmers");
      setFarmers(f.users);
    } catch (e) {
      setError("Unauthorized");
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8 text-sm text-muted-foreground">
        Admin access required. Please login as admin.
        <div className="mt-3">
          <a href="#signin" className="rounded-md border px-3 py-2">
            Sign in
          </a>
        </div>
      </div>
    );
  }

  const add = async () => {
    await api("/api/admin/farmers", {
      method: "POST",
      body: JSON.stringify({ email: newEmail, name: newName }),
    });
    setNewEmail("");
    setNewName("");
    load();
  };

  const remove = async (id: string) => {
    await api(`/api/admin/farmers/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
      {error && (
        <div className="mt-4 rounded-md bg-amber-100 p-3 text-amber-800">
          {error}
        </div>
      )}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="text-sm text-muted-foreground">Total Users</div>
          <div className="mt-2 text-3xl font-bold">{summary?.users ?? "-"}</div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-3 text-sm font-medium">Add Farmer</div>
          <div className="mb-2 grid gap-2">
            <input
              className="h-10 rounded-md border bg-background px-3"
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input
              className="h-10 rounded-md border bg-background px-3"
              placeholder="Name (optional)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <button
            className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
            onClick={add}
          >
            Add
          </button>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-3 text-sm font-medium">Farmers</div>
          <div className="grid gap-2">
            {farmers.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <div className="text-sm font-medium">{f.name || f.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {f.email} · {f.role}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <RoleSelect
                    id={f.id}
                    current={f.role || "farmer"}
                    onChange={async (role) => {
                      await api(`/api/admin/users/${f.id}/role`, {
                        method: "POST",
                        body: JSON.stringify({ role }),
                      });
                      load();
                    }}
                  />
                  <button
                    className="text-sm text-red-600 hover:underline"
                    onClick={() => remove(f.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {farmers.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No farmers yet
              </div>
            )}
          </div>
        </div>
      </div>

      <Registrations />
    </div>
  );
}

function RoleSelect({ id, current, onChange }: { id: string; current: string; onChange: (r: string) => void }) {
  return (
    <select className="h-9 rounded-md border bg-background px-2 text-sm" value={current} onChange={(e) => onChange(e.target.value)}>
      <option value="farmer">farmer</option>
      <option value="field-officer">field-officer</option>
      <option value="verifier">verifier</option>
      <option value="admin">admin</option>
    </select>
  );
}

function Registrations() {
  const [pending, setPending] = useState<any[]>([]);
  const load = async () => {
    const r = await api<{ users: any[] }>("/api/admin/registrations?status=pending");
    setPending(r.users);
  };
  useEffect(() => {
    load();
  }, []);
  const approve = async (id: string) => {
    await api(`/api/admin/registrations/${id}/approve`, { method: "POST" });
    load();
  };
  return (
    <div className="mt-8 rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-3 text-sm font-medium">Pending Registrations</div>
      <div className="grid gap-2">
        {pending.map((u) => (
          <div key={u.id} className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="text-sm font-medium">{u.name || u.email}</div>
              <div className="text-xs text-muted-foreground">{u.email}</div>
            </div>
            <button className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground" onClick={() => approve(u.id)}>
              Approve
            </button>
          </div>
        ))}
        {pending.length === 0 && (
          <div className="text-sm text-muted-foreground">No pending requests</div>
        )}
      </div>
    </div>
  );
}
