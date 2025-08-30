export default function LearningHub() {
  const resources = [
    { title: "Sustainable Agriculture 101", url: "https://www.fao.org/sustainability/en/" },
    { title: "Soil Health Basics", url: "https://www.nrcs.usda.gov/soil-health" },
    { title: "Cover Cropping Guide", url: "https://www.sare.org/resources/cover-crops/" },
    { title: "Agroforestry Practices", url: "https://www.agroforestry.org/" },
  ];
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold">Learning Hub</h2>
      <div className="mt-6 grid gap-3">
        {resources.map((r) => (
          <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="rounded-md border p-3 hover:bg-muted">
            <div className="text-sm font-medium">{r.title}</div>
            <div className="text-xs text-muted-foreground">{r.url}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
