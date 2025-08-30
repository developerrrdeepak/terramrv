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
  const [usingLLM, setUsingLLM] = useState(false);
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const onPickImage = async (file: File | null) => {
    if (!file) return setImageB64(null);
    const buf = await file.arrayBuffer();
    const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
    setImageB64(b64);
  };

  const toggleRecord = async () => {
    if (recording) {
      mediaRef.current?.stop();
      setRecording(false);
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    mediaRef.current = rec;
    chunksRef.current = [];
    rec.ondataavailable = (e) => e.data && chunksRef.current.push(e.data);
    rec.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const res = await fetch("/api/assistant/stt", { method: "POST", headers: { "Content-Type": blob.type }, body: blob });
      const data = await res.json();
      if (data?.text) setInput((v) => (v ? v + " " : "") + data.text);
      stream.getTracks().forEach((t) => t.stop());
    };
    rec.start();
    setRecording(true);
  };

  const send = async () => {
    if (!input.trim() && !imageB64) return;
    const q = input.trim();
    setMessages((m) => (q ? [...m, { role: "user", content: q }] : m));
    setInput("");

    try {
      setUsingLLM(true);
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: (q ? [{ role: "user", content: q }] : []).concat(messages), imageBase64: imageB64 }),
      });
      setImageB64(null);
      if (res.ok) {
        const data = await res.json();
        const content = data.content || localAnswer(q);
        setMessages((m) => [...m, { role: "assistant", content }]);
      } else {
        const a = localAnswer(q);
        setMessages((m) => [...m, { role: "assistant", content: a }]);
      }
    } catch {
      const a = localAnswer(q);
      setMessages((m) => [...m, { role: "assistant", content: a }]);
    } finally {
      setUsingLLM(false);
    }
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
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type your question..."
          className="h-10 min-w-[200px] flex-1 rounded-md border bg-background px-3 text-sm"
        />
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickImage(e.target.files?.[0] || null)} />
          Image
        </label>
        <button onClick={toggleRecord} className="rounded-md border px-3 py-2 text-sm">
          {recording ? "Stop" : "Mic"}
        </button>
        <button
          onClick={send}
          className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-60"
          disabled={usingLLM}
        >
          {usingLLM ? "Thinking…" : "Send"}
        </button>
      </div>
      {imageB64 && (
        <div className="mt-2 text-xs text-muted-foreground">Image attached</div>
      )}
    </div>
  );
}
