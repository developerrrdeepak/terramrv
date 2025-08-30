import { Assistant } from "./Assistant";
import { useState } from "react";

export function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        aria-label="Open assistant"
        onClick={() => setOpen((s) => !s)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow-lg"
      >
        {open ? "×" : "Ask"}
      </button>
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-[360px] max-w-[90vw] rounded-lg border bg-card shadow-xl">
          <Assistant />
        </div>
      )}
    </>
  );
}
