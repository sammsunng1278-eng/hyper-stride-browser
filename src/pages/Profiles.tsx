import { useEffect } from "react";

export default function Profiles() {
  useEffect(() => {
    document.title = "Hyper AI Browser — Profiles";
  }, []);
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold">Profiles</h1>
      <p className="text-muted-foreground">Coming soon.</p>
    </div>
  );
}
