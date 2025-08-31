import { useState, useEffect } from "react";
import { api } from "@/lib/auth";

export default function Credits() {
  const [balance, setBalance] = useState<number>(0);
  const [monthly, setMonthly] = useState<Record<string, number>>({});
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    const r = await api<{ balance: number; monthly: Record<string, number> }>(
      "/api/credits",
    );
    setBalance(r.balance);
    setMonthly(r.monthly);
  };
  useEffect(() => {
    load();
  }, []);

  const request = async () => {
    setMessage(null);
    await api("/api/credits/payouts", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
    setMessage("Payout requested");
    setAmount("");
    load();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold">Carbon Credits</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="text-sm text-muted-foreground">Balance</div>
          <div className="mt-2 text-3xl font-bold">
            {balance.toFixed(2)} tCO2e
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-3 text-sm font-medium">Monthly history</div>
        <div className="grid gap-2">
          {Object.entries(monthly)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([m, v]) => (
              <div
                key={m}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="text-sm">{m}</div>
                <div className="text-sm font-medium">{v.toFixed(2)} tCO2e</div>
              </div>
            ))}
          {Object.keys(monthly).length === 0 && (
            <div className="text-sm text-muted-foreground">No data yet</div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-3 text-sm font-medium">Request payout</div>
        <div className="flex gap-2">
          <input
            className="h-10 w-48 rounded-md border bg-background px-3"
            placeholder="Amount (tCO2e)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
            onClick={request}
          >
            Request
          </button>
        </div>
        {message && (
          <div className="mt-2 text-xs text-muted-foreground">{message}</div>
        )}
      </div>
    </div>
  );
}
