import { useState } from "react";
import { api, saveToken, clearToken, getToken } from "@/lib/auth";
import { useAuth } from "@/context/auth";

export function SignInForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { setToken } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body: any = { email, password };
      if (mode === "register") body.name = name;
      const data = await api<{ token: string; user: { id: string; email: string; name: string } }>(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });
      saveToken(data.token);
      setToken(data.token);
      setMessage(`Welcome ${data.user.name}`);
    } catch (err: any) {
      setMessage(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    clearToken();
    setMessage("Signed out");
  };

  const loggedIn = Boolean(getToken());

  if (loggedIn)
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="text-sm">You are signed in.</div>
        <div className="mt-3 flex gap-2">
          <a href="/dashboard" className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">Go to Dashboard</a>
          <button onClick={signOut} className="rounded-md border px-3 py-2 text-sm hover:bg-muted">Sign out</button>
        </div>
      </div>
    );

  return (
    <form onSubmit={onSubmit} className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-3 text-sm">
        <button type="button" className={`rounded-md border px-3 py-1 ${mode === "login" ? "bg-muted" : ""}`} onClick={() => setMode("login")}>Login</button>
        <button type="button" className={`rounded-md border px-3 py-1 ${mode === "register" ? "bg-muted" : ""}`} onClick={() => setMode("register")}>Register</button>
      </div>
      {mode === "register" && (
        <label className="mb-3 grid gap-1 text-sm">
          <span>Name</span>
          <input className="h-10 rounded-md border bg-background px-3" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      )}
      <label className="mb-3 grid gap-1 text-sm">
        <span>Email</span>
        <input type="email" className="h-10 rounded-md border bg-background px-3" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="mb-4 grid gap-1 text-sm">
        <span>Password</span>
        <input type="password" className="h-10 rounded-md border bg-background px-3" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button disabled={loading} className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60">
        {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </button>
      {message && <div className="mt-3 text-xs text-muted-foreground">{message}</div>}
    </form>
  );
}
