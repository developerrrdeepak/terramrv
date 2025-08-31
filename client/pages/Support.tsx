import { useState } from "react";
import { api } from "@/lib/auth";

export default function Support() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const submit = async () => {
    setStatus(null);
    await api("/api/support", {
      method: "POST",
      body: JSON.stringify({ email, message }),
    });
    setStatus("Submitted. We'll reach out soon.");
    setEmail("");
    setMessage("");
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold">Support Center</h2>
      <div className="mt-6 grid max-w-xl gap-4">
        <input
          className="h-10 rounded-md border bg-background px-3"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          className="min-h-32 rounded-md border bg-background p-3"
          placeholder="Describe your issue or question"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          onClick={submit}
        >
          Submit
        </button>
        {status && (
          <div className="text-xs text-muted-foreground">{status}</div>
        )}
      </div>
    </div>
  );
}
