import { api } from "@/lib/auth";

const TYPES = [
  "plowing",
  "seeding",
  "harvesting",
  "fertilizer",
  "pesticide",
  "irrigation",
  "machinery",
] as const;

type Log = {
  id: string;
  type: string;
  date: string;
  quantity?: number;
  unit?: string;
  notes?: string;
};

export function ActivityLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [type, setType] = useState<string>("plowing");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [quantity, setQuantity] = useState<number | "">("");
  const [unit, setUnit] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const load = async () => {
    const res = await api<{ logs: any[] }>("/api/logs");
    setLogs(
      res.logs.map((l: any) => ({
        id: String(l._id || l.id),
        type: l.type,
        date: l.date.slice(0, 10),
        quantity: l.quantity ?? undefined,
        unit: l.unit ?? undefined,
        notes: l.notes ?? "",
      })),
    );
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    await api("/api/logs", {
      method: "POST",
      body: JSON.stringify({ type, date, quantity: quantity === "" ? undefined : Number(quantity), unit, notes }),
    });
    setQuantity("");
    setUnit("");
    setNotes("");
    load();
  };

  const remove = async (id: string) => {
    await api(`/api/logs/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-4 text-sm font-medium">Activity Logs</div>
      <div className="mb-4 grid gap-2 md:grid-cols-5">
        <select className="h-10 rounded-md border bg-background px-3" value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input type="date" className="h-10 rounded-md border bg-background px-3" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="number" placeholder="Qty" className="h-10 rounded-md border bg-background px-3" value={quantity} onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))} />
        <input placeholder="Unit" className="h-10 rounded-md border bg-background px-3" value={unit} onChange={(e) => setUnit(e.target.value)} />
        <button className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground" onClick={add}>
          Add
        </button>
      </div>
      <input placeholder="Notes" className="mb-4 h-10 w-full rounded-md border bg-background px-3" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <div className="grid gap-2">
        {logs.map((l) => (
          <div key={l.id} className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="text-sm font-medium">
                {l.type} · {l.date}
              </div>
              <div className="text-xs text-muted-foreground">
                {l.quantity ?? "-"} {l.unit ?? ""} {l.notes ? `· ${l.notes}` : ""}
              </div>
            </div>
            <button className="text-sm text-red-600 hover:underline" onClick={() => remove(l.id)}>
              Delete
            </button>
          </div>
        ))}
        {logs.length === 0 && <div className="text-sm text-muted-foreground">No activity yet</div>}
      </div>
    </div>
  );
}
