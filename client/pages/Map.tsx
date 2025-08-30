import { useAuth } from "@/context/auth";

export default function MapPage() {
  const { user } = useAuth();
  const lat = parseFloat((user as any)?.lat || "20.5937");
  const lng = parseFloat((user as any)?.lng || "78.9629");
  const zoom = 8;
  const bbox = `${lng - 1},${lat - 1},${lng + 1},${lat + 1}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(lat + "," + lng)}`;
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold">Field Map</h2>
      <div className="mt-4 aspect-video w-full overflow-hidden rounded-md border">
        <iframe title="map" className="h-full w-full" src={src} />
      </div>
      <div className="mt-2 text-xs text-muted-foreground">Center: {lat.toFixed(4)}, {lng.toFixed(4)}</div>
    </div>
  );
}
