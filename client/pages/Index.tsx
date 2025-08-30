import { useMemo } from "react";
import { CarbonEstimator } from "@/components/estimator/CarbonEstimator";
import { ArrowRight, ShieldCheck, Satellite, Trees, BookOpen, FileSpreadsheet, Users, BarChart3, Cpu, Database } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Index() {
  const milestones = [
    { label: "Profile", value: 20 },
    { label: "Data", value: 55 },
    { label: "Verification", value: 75 },
    { label: "Issued", value: 90 },
  ];
  const overall = useMemo(() => Math.round(milestones.reduce((a, b) => a + b.value, 0) / milestones.length), [milestones]);

  return (
    <div id="top" className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-background to-background">
        <div className="absolute -left-24 top-[-6rem] h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-10rem] top-20 h-[22rem] w-[22rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="container mx-auto grid items-center gap-10 px-4 pb-10 pt-12 md:grid-cols-2 md:pt-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="h-4 w-4" /> Transparent MRV for smallholders
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Scalable MRV for agroforestry and rice-based carbon projects
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              Calculate, verify, and report carbon credits with minimized uncertainty and end-to-end transparency. Built for farmers, NGOs, researchers, and carbon credit organizations.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="#calculator" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-95">
                Estimate credits <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#features" className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
                Explore features
              </a>
            </div>
            <div className="mt-8 rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your project progress</span>
                <span className="font-medium">{overall}%</span>
              </div>
              <Progress value={overall} />
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
                {milestones.map((m) => (
                  <div key={m.label} className="rounded-md bg-muted px-2 py-1">
                    <div className="flex items-center justify-between"><span>{m.label}</span><span className="text-foreground">{m.value}%</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl border bg-card/70 p-4 shadow-lg ring-1 ring-black/5">
              <div className="grid grid-cols-2 gap-3">
                <FeatureMini icon={<Satellite className="h-4 w-4" />} title="Satellite MRV" subtitle="Vegetation, land cover, soil moisture" />
                <FeatureMini icon={<Trees className="h-4 w-4" />} title="Agroforestry" subtitle="Tree growth, biomass, SOC" />
                <FeatureMini icon={<Cpu className="h-4 w-4" />} title="IoT Sensors" subtitle="Soil moisture, weather" />
                <FeatureMini icon={<Database className="h-4 w-4" />} title="Audit Trails" subtitle="Immutable logs" />
              </div>
              <div className="mt-4 rounded-lg bg-gradient-to-br from-primary/10 to-emerald-100/20 p-4 text-sm">
                <div className="font-medium">IPCC-aligned estimation</div>
                <p className="mt-1 text-muted-foreground">Supports standardized protocols and verification readiness for third-party auditors.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={<BarChart3 className="h-5 w-5" />} title="Farmer Dashboard" desc="Track sequestration, estimated credits, land health, and project milestones in one view." />
          <FeatureCard icon={<FileSpreadsheet className="h-5 w-5" />} title="MRV Tools" desc="Data collection forms, carbon estimators, and verification-ready outputs." />
          <FeatureCard icon={<Satellite className="h-5 w-5" />} title="Remote Sensing" desc="Integrates satellite data for vegetation, land cover, and soil moisture monitoring." />
          <FeatureCard icon={<ShieldCheck className="h-5 w-5" />} title="Transparency" desc="Blockchain-ready audit trails and version control for every data change." />
          <FeatureCard icon={<BookOpen className="h-5 w-5" />} title="Education Hub" desc="Tutorials, FAQs, and community forum to support farmers and field teams." />
          <FeatureCard icon={<Users className="h-5 w-5" />} title="Collaborations" desc="Partner portal for startups, researchers, and enterprises to co-build MRV solutions." />
        </div>
      </section>

      <CarbonEstimator />

      <section id="transparency" className="container mx-auto px-4 py-16">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold">Verification & Transparency</h3>
              <p className="mt-2 text-muted-foreground">Immutable records, timestamped logs, and version control ensure data integrity from field to registry. Export complete audit trails for third-party verification.</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>• Blockchain-ready data anchoring</li>
                <li>• Auditor views with change history</li>
                <li>• Role-based permissions for Farmers, Admins, Partners</li>
              </ul>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md bg-muted p-4">
                <div className="text-xs text-muted-foreground">Audit Status</div>
                <div className="text-2xl font-semibold">Ready</div>
              </div>
              <div className="rounded-md bg-muted p-4">
                <div className="text-xs text-muted-foreground">Change Log entries</div>
                <div className="text-2xl font-semibold">1,284</div>
              </div>
              <div className="rounded-md bg-muted p-4">
                <div className="text-xs text-muted-foreground">Data coverage</div>
                <div className="text-2xl font-semibold">98%</div>
              </div>
              <div className="rounded-md bg-muted p-4">
                <div className="text-xs text-muted-foreground">Verification SLA</div>
                <div className="text-2xl font-semibold">14 days</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="education" className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold">Farmer Education Hub</h3>
            <p className="mt-2 text-muted-foreground">Short videos and guides on agroforestry, carbon credits, and sustainable practices. Localized content available for field teams.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="#education" className="rounded-md border px-3 py-2 text-sm hover:bg-muted">Tutorials</a>
              <a href="#education" className="rounded-md border px-3 py-2 text-sm hover:bg-muted">FAQs</a>
              <a href="#education" className="rounded-md border px-3 py-2 text-sm hover:bg-muted">Community Forum</a>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="text-sm text-muted-foreground">Sample Lesson</div>
            <div className="mt-2 rounded-md bg-muted p-4 text-sm">Introduction to Agroforestry MRV — Best practices for data collection and minimizing uncertainty.</div>
          </div>
        </div>
      </section>

      <section id="reports" className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Reports & Compliance</h3>
            <p className="mt-2 text-muted-foreground">Generate customizable PDF/Excel reports with all relevant project data. Built to support global carbon credit standards and verification workflows.</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-muted p-3">Download PDF</div>
              <div className="rounded-md bg-muted p-3">Export Excel</div>
              <div className="rounded-md bg-muted p-3">Verification Checklist</div>
              <div className="rounded-md bg-muted p-3">Registry Submission</div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Collaboration Opportunities</h3>
            <p className="mt-2 text-muted-foreground">Portal for partnerships, funding, and incubator programs for smallholders and agribusinesses.</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-muted p-3">Partnership Portal</div>
              <div className="rounded-md bg-muted p-3">Incubator Programs</div>
              <div className="rounded-md bg-muted p-3">Grants & Funding</div>
              <div className="rounded-md bg-muted p-3">Research Sandbox</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureMini({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-primary">{icon}</span>
        <span className="font-medium">{title}</span>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-primary">{icon}</span>
        <span className="font-semibold">{title}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
