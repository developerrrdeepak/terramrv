import { Menu, Leaf, LineChart, BookOpen, ShieldCheck, Satellite, Users } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#calculator", label: "Calculator" },
  { href: "#transparency", label: "Transparency" },
  { href: "#education", label: "Education" },
  { href: "#reports", label: "Reports" },
  { href: "#collaborate", label: "Collaborate" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-transparent bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="#top" className="flex items-center gap-2 text-primary">
          <Leaf className="h-6 w-6" />
          <span className="font-semibold">TerraMRV</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a href="#calculator" className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-95">
            Estimate Credits
          </a>
        </div>

        <button aria-label="Toggle menu" className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border" onClick={() => setOpen((s) => !s)}>
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className={cn("md:hidden border-t", open ? "block" : "hidden")}> 
        <div className="container mx-auto grid gap-2 px-4 py-3">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="text-sm py-2 text-foreground/90">
              {item.label}
            </a>
          ))}
          <a href="#calculator" className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow">
            Estimate Credits
          </a>
        </div>
      </div>
    </header>
  );
}
