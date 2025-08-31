import { Menu, Leaf } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/i18n";
import { useAuth } from "@/context/auth";
import { ThemeTabs } from "@/components/ui/theme-tabs";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

const NAV = [
  { href: "/#features", label: "Features" },
  { href: "/#calculator", label: "Calculator" },
  { href: "/#soil-health", label: "Soil Health AI" },
  { href: "/#crop-monitoring", label: "Crop Monitor" },
  { href: "/#transparency", label: "Transparency" },
  { href: "/#education", label: "Education" },
  { href: "/#reports", label: "Reports" },
  { href: "/#collaborate", label: "Collaborate" },
];

export function Header() {
  const [open, setOpen] = useState(true);
  const { lang, setLang, t } = useI18n();
  const { user, signOut } = useAuth();
  return (
    <aside className="sticky top-0 z-40 h-screen w-full border-r bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block">
      <div className="flex h-14 items-center justify-between px-4 md:hidden">
        <a href="#top" className="flex items-center gap-2 text-primary">
          <Leaf className="h-6 w-6" />
          <span className="font-semibold">{t("brand")}</span>
        </a>
        <button
          aria-label="Toggle menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
          onClick={() => setOpen((s) => !s)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className={cn("px-4 pb-6 md:block", open ? "block" : "hidden")}>
        <div className="hidden md:flex items-center gap-2 py-4">
          <a href="#top" className="flex items-center gap-2 text-primary">
            <Leaf className="h-6 w-6" />
            <span className="font-semibold">{t("brand")}</span>
          </a>
        </div>
        <nav className="grid gap-1">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mt-6 grid gap-2">
          <select
            aria-label="Language"
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            className="h-9 rounded-md border bg-background px-2 text-sm"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>

          <ThemeTabs />

          {user && <NotificationCenter />}

          <a
            href="#calculator"
            className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-95"
          >
            {t("cta_estimate")}
          </a>
          {user ? (
            <>
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Dashboard
              </a>
              {user.role === "admin" && (
                <a
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  Admin
                </a>
              )}
              <button
                onClick={signOut}
                className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="#signin"
              className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              {t("signin_farmer")}
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
