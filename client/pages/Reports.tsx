import { useState, useEffect } from "react";
import { api } from "@/lib/auth";

export default function Reports() {
  const [data, setData] = useState<
    Record<string, { emissions: number; savings: number }>
  >({});
  useEffect(() => {
    api<{ byMonth: any }>("/api/reports/farmer").then((r) =>
      setData(r.byMonth),
    );
  }, []);
  const months = Object.keys(data).sort();
  const totalEmissions = months.reduce(
    (s, m) => s + (data[m]?.emissions || 0),
    0,
  );
  const totalSavings = months.reduce((s, m) => s + (data[m]?.savings || 0), 0);
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold">Reports</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="text-sm text-muted-foreground">Total Emissions</div>
          <div className="mt-2 text-3xl font-bold">
            {totalEmissions.toFixed(2)}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="text-sm text-muted-foreground">Total Savings</div>
          <div className="mt-2 text-3xl font-bold">
            {totalSavings.toFixed(2)}
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-3 text-sm font-medium">Monthly breakdown</div>
        <div className="grid gap-2">
          {months.map((m) => (
            <div
              key={m}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div className="text-sm">{m}</div>
              <div className="text-xs text-muted-foreground">Emissions</div>
              <div className="text-sm font-medium">
                {data[m].emissions.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">Savings</div>
              <div className="text-sm font-medium">
                {data[m].savings.toFixed(2)}
              </div>
            </div>
          ))}
          {months.length === 0 && (
            <div className="text-sm text-muted-foreground">No data yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
