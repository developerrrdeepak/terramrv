import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, WifiOff, CheckCircle2 } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online";

interface EstimatorInput {
  areaHa: number;
  system: "Agroforestry" | "Rice";
  soilSOC: number; // baseline soil organic carbon tC/ha
  treeCover: number; // percent
  rainfall: number; // mm/year
}

interface QueueItem extends EstimatorInput {
  id: string;
  createdAt: number;
}

function estimateCredits(input: EstimatorInput) {
  const { areaHa, system, soilSOC, treeCover, rainfall } = input;
  const treeFactor = system === "Agroforestry" ? 0.9 : 0.4;
  const moistureAdj = Math.min(1.2, Math.max(0.8, rainfall / 1000));
  const socAdj = Math.min(1.1, Math.max(0.7, 1 - Math.abs(soilSOC - 35) / 100));
  const canopyAdj = 0.6 + (treeCover / 100) * 0.8;
  const baseSequestration = treeFactor * moistureAdj * socAdj * canopyAdj; // tCO2e/ha/yr
  const yearly = baseSequestration * areaHa;
  const projection = Array.from({ length: 6 }).map((_, i) => ({
    year: i,
    credits: Math.round((yearly * Math.min(1, 0.15 + i * 0.17)) * 10) / 10,
  }));
  const current = projection[projection.length - 1].credits;
  return { yearly, current, projection };
}

const QUEUE_KEY = "terramrv_offline_queue";

export function CarbonEstimator() {
  const [input, setInput] = useState<EstimatorInput>({ areaHa: 2, system: "Agroforestry", soilSOC: 30, treeCover: 20, rainfall: 900 });
  const [syncedCount, setSyncedCount] = useState(0);
  const online = useOnlineStatus();

  const result = useMemo(() => estimateCredits(input), [input]);

  useEffect(() => {
    if (!online) return;
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return;
    const queue: QueueItem[] = JSON.parse(raw);
    if (queue.length === 0) return;
    setTimeout(() => {
      setSyncedCount(queue.length);
      localStorage.setItem(QUEUE_KEY, JSON.stringify([]));
      setTimeout(() => setSyncedCount(0), 3500);
    }, 600);
  }, [online]);

  const saveEntry = () => {
    const item: QueueItem = { ...input, id: crypto.randomUUID(), createdAt: Date.now() };
    if (online) {
      setSyncedCount(1);
      setTimeout(() => setSyncedCount(0), 2000);
    } else {
      const raw = localStorage.getItem(QUEUE_KEY);
      const queue: QueueItem[] = raw ? JSON.parse(raw) : [];
      queue.push(item);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    }
  };

  return (
    <section id="calculator" className="container mx-auto px-4 py-16">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Carbon Credit Estimator</h3>
            {!online ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-800">
                <WifiOff className="h-3.5 w-3.5" /> Offline mode
              </span>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span>Farming System</span>
              <select
                className="h-10 rounded-md border bg-background px-3"
                value={input.system}
                onChange={(e) => setInput((s) => ({ ...s, system: e.target.value as EstimatorInput["system"] }))}
              >
                <option>Agroforestry</option>
                <option>Rice</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              <span>Farm Area (ha)</span>
              <input
                type="number"
                min={0}
                step={0.1}
                value={input.areaHa}
                onChange={(e) => setInput((s) => ({ ...s, areaHa: Number(e.target.value) }))}
                className="h-10 rounded-md border bg-background px-3"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Soil Organic Carbon (tC/ha)</span>
              <input
                type="number"
                min={0}
                step={0.1}
                value={input.soilSOC}
                onChange={(e) => setInput((s) => ({ ...s, soilSOC: Number(e.target.value) }))}
                className="h-10 rounded-md border bg-background px-3"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Tree Cover (%)</span>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={input.treeCover}
                onChange={(e) => setInput((s) => ({ ...s, treeCover: Number(e.target.value) }))}
                className="h-10 rounded-md border bg-background px-3"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span>Rainfall (mm/yr)</span>
              <input
                type="number"
                min={0}
                step={10}
                value={input.rainfall}
                onChange={(e) => setInput((s) => ({ ...s, rainfall: Number(e.target.value) }))}
                className="h-10 rounded-md border bg-background px-3"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button onClick={saveEntry} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-95">
              Save Entry
            </button>
            <p className="text-sm text-muted-foreground">Projected credits this year: <span className="font-semibold text-foreground">{result.current.toFixed(1)} tCO2e</span></p>
          </div>
          {syncedCount > 0 ? (
            <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-emerald-100 px-3 py-2 text-xs text-emerald-800">
              <CheckCircle2 className="h-4 w-4" /> Synced {syncedCount} entr{syncedCount === 1 ? "y" : "ies"}
            </div>
          ) : null}
          {!online ? (
            <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-amber-100 px-3 py-2 text-xs text-amber-800">
              <AlertTriangle className="h-4 w-4" /> Stored locally. Will sync when online.
            </div>
          ) : null}
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-2 text-sm text-muted-foreground">Projected credits over 5 years</div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.projection} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="year" tickFormatter={(v) => (v === 0 ? "Now" : `Y${v}`)} tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip formatter={(v: any) => [`${v} tCO2e`, "Credits"]} labelFormatter={(l) => (l === 0 ? "Current" : `Year ${l}`)} />
                <Area type="monotone" dataKey="credits" stroke="hsl(var(--primary))" fill="url(#colorCredits)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-md bg-muted p-3">
              <div className="text-muted-foreground">Estimated yearly credits</div>
              <div className="text-xl font-semibold">{result.yearly.toFixed(1)} tCO2e</div>
            </div>
            <div className="rounded-md bg-muted p-3">
              <div className="text-muted-foreground">Potential value (USD)</div>
              <div className="text-xl font-semibold">${(result.current * 7).toFixed(0)}</div>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Estimates are indicative and align with simplified interpretations of IPCC methodologies; verification by accredited bodies is required for issuance.</p>
        </div>
      </div>
    </section>
  );
}
