import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/state/appState";

export default function Settings() {
  const { state, dispatch } = useAppState();

  useEffect(() => {
    document.title = "Hyper AI Browser — Settings";
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Settings</h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Basic preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="cookies">Login & Save Cookies</Label>
              <Switch id="cookies" checked={state.settings.saveCookies} onCheckedChange={(v) => dispatch({ type: "SET_SETTINGS", payload: { saveCookies: v } })} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="stealth">Enable Stealth Mode</Label>
              <Switch id="stealth" checked={state.settings.stealthMode} onCheckedChange={(v) => dispatch({ type: "SET_SETTINGS", payload: { stealthMode: v } })} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Dark Mode</Label>
              <Switch id="theme" checked={state.settings.theme === "dark"} onCheckedChange={(v) => dispatch({ type: "SET_SETTINGS", payload: { theme: v ? "dark" : "light" } })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Window</CardTitle>
            <CardDescription>Default size</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label>Width</Label>
                <Input type="number" value={state.settings.defaultWidth} onChange={(e) => dispatch({ type: "SET_SETTINGS", payload: { defaultWidth: Number(e.target.value || 0) } })} />
              </div>
              <div className="flex-1">
                <Label>Height</Label>
                <Input type="number" value={state.settings.defaultHeight} onChange={(e) => dispatch({ type: "SET_SETTINGS", payload: { defaultHeight: Number(e.target.value || 0) } })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => console.log("Clear cache requested")}>Clear Cache</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
