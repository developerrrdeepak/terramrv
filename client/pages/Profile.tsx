import { useAuth } from "@/context/auth";
import { api } from "@/lib/auth";

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [message, setMessage] = useState<string | null>(null);
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [landSize, setLandSize] = useState<string>("");
  const [crops, setCrops] = useState<string>("");
  const [soilType, setSoilType] = useState<string>("");
  const [practices, setPractices] = useState<string>("");

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-sm text-muted-foreground">
        Please sign in.
      </div>
    );
  }

  const save = async () => {
    setMessage(null);
    try {
      const res = await api<{ user: any }>("/api/profile", {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
      setMessage("Profile saved");
      setName(res.user.name || name);
    } catch (e: any) {
      setMessage(e?.message || "Error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold">Edit Profile</h2>
      <div className="mt-6 grid max-w-xl gap-4">
        <label className="grid gap-1 text-sm">
          <span>Email</span>
          <input
            className="h-10 rounded-md border bg-muted px-3"
            value={email}
            disabled
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span>Name</span>
          <input
            className="h-10 rounded-md border bg-background px-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <button
          className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          onClick={save}
        >
          Save
        </button>
        {message && (
          <div className="text-xs text-muted-foreground">{message}</div>
        )}
      </div>
    </div>
  );
}
