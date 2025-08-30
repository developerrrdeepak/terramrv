import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/auth";
import { CarbonEstimator } from "@/components/estimator/CarbonEstimator";
import { BarChart3, Leaf } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{greeting}</div>
          <h2 className="text-2xl font-semibold">Welcome, {user?.name || user?.email}</h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="text-sm text-muted-foreground">Estimated Credits</div>
          <div className="mt-2 text-3xl font-bold">~ 12.4 tCO2e</div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="text-sm text-muted-foreground">Farm Plots</div>
          <div className="mt-2 text-3xl font-bold">3</div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="text-sm text-muted-foreground">Verification Status</div>
          <div className="mt-2 text-3xl font-bold text-emerald-500">Ready</div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium"><BarChart3 className="h-4 w-4" /> Carbon Estimator</div>
          <CarbonEstimator />
        </div>
        <Assistant />
      </div>
    </div>
  );
}
