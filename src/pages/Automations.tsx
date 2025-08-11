import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/state/appState";

export default function Automations() {
  const { state, dispatch } = useAppState();
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    document.title = "Hyper AI Browser — Automations";
  }, []);

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      const text = await file.text();
      addAutomation(file.name.replace(/\.[a-zA-Z0-9]+$/, ""), text);
    }
  }, []);

  const addAutomation = (name: string, code?: string) => {
    const id = `${Date.now()}-${name}`;
    const apiKey = Math.random().toString(36).slice(2);
    dispatch({ type: "ADD_AUTOMATION", payload: { id, name, code, apiKey, createdAt: new Date().toISOString() } });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Automations</h1>
        <p className="text-muted-foreground">Add, delete, run, and generate API endpoints.</p>
      </header>

      <section>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded p-6 text-center ${dragActive ? "border-primary" : "border-border"}`}
        >
          Drag & drop scripts here to add automations
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.automations.map((a) => (
          <Card key={a.id} className="hover-card">
            <CardHeader>
              <CardTitle>{a.name}</CardTitle>
              <CardDescription>API Key: {a.apiKey}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Input readOnly value={`http://localhost:3000/api/automation/${a.id}?key=${a.apiKey}`} />
                <Button onClick={() => navigator.clipboard.writeText(`http://localhost:3000/api/automation/${a.id}?key=${a.apiKey}`)}>Copy</Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="hero" onClick={() => dispatch({ type: "RUN_AUTOMATION", payload: { id: a.id } })}>Run</Button>
                <Button variant="outline" onClick={() => dispatch({ type: "DELETE_AUTOMATION", payload: a.id })}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
