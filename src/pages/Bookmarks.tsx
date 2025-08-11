import { useEffect } from "react";

export default function Bookmarks() {
  useEffect(() => {
    document.title = "Hyper AI Browser — Bookmarks";
  }, []);
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold">Bookmarks</h1>
      <p className="text-muted-foreground">Coming soon.</p>
    </div>
  );
}
