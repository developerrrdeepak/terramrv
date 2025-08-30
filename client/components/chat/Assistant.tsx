import { useState } from "react";

const FAQ: Record<string, string> = {
  "what is carbon credit":
    "A carbon credit represents 1 ton of CO2e reduced or removed. TerraMRV helps estimate and verify credits for agroforestry and rice projects.",
  "how to estimate":
    "Open the Carbon Estimator section, fill farm data (area, SOC, tree cover, rainfall), and see 5-year projections.",
  verification:
    "We follow standardized protocols and keep audit trails for third-party verification readiness.",
};

function localAnswer(q: string) {
  const key = q.toLowerCase();
  const hit = Object.entries(FAQ).find(([k]) => key.includes(k));
  if (hit) return hit[1];
  return "I don't have a precise answer locally. Connect an LLM API key for advanced answers.";
}

export function Assistant() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");

  const send = async () => {
    if (!input.trim()) return;
    const q = input.trim();
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    const a = localAnswer(q);
    setMessages((m) => [...m, { role: "assistant", content: a }]);
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-2 text-sm font-medium">AI Assistant</div>
      <div className="h-56 overflow-auto rounded-md border bg-background p-3 text-sm">
        {messages.length === 0 ? (
          <div className="text-muted-foreground">
            Ask about carbon credits, MRV, or how to use the app.
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`mb-2 ${m.role === "user" ? "text-foreground" : "text-emerald-400"}`}
            >
              {m.role === "user" ? "You: " : "Assistant: "}
              {m.content}
            </div>
          ))
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type your question..."
          className="h-10 flex-1 rounded-md border bg-background px-3 text-sm"
        />
        <button
          onClick={send}
          className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
        >
          Send
        </button>
      </div>
    </div>
  );
}
