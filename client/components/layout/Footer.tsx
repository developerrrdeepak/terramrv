export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="text-lg font-semibold">TerraMRV</div>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Scalable MRV for agroforestry and rice-based carbon projects. Built for farmers, NGOs, researchers, and carbon registries.
          </p>
        </div>
        <div>
          <div className="text-sm font-medium">Product</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#features" className="hover:text-foreground">Features</a></li>
            <li><a href="#calculator" className="hover:text-foreground">Carbon Calculator</a></li>
            <li><a href="#education" className="hover:text-foreground">Education Hub</a></li>
            <li><a href="#collaborate" className="hover:text-foreground">Collaborations</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium">Contact</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="mailto:hello@terramrv.org" className="hover:text-foreground">hello@terramrv.org</a></li>
            <li>© {new Date().getFullYear()} TerraMRV</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
