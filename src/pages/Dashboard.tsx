import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/state/appState";

const Dashboard = () => {
  const { state } = useAppState();

  useEffect(() => {
    document.title = "Hyper AI Browser — Dashboard";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Dashboard for Hyper AI Browser: tabs, VPN status, and quick actions.");
  }, []);

  return (
    <div className="container mx-auto py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Hyper AI Browser Dashboard</h1>
        <p className="text-muted-foreground">Brave-like, stealth-ready, and automation focused.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover-card">
          <CardHeader>
            <CardTitle>VPN</CardTitle>
            <CardDescription>Manage and connect</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">Current status: {state.vpn.status}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader>
            <CardTitle>Automations</CardTitle>
            <CardDescription>Scripts & runs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">Installed: {state.automations.length}</div>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader>
            <CardTitle>Active Tabs</CardTitle>
            <CardDescription>Browsing + Automations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">Open: {state.tabs.length}</div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
