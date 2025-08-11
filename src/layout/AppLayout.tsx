import { useState } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/state/appState";
import VPNModal from "@/components/modals/VPNModal";
import StatusBar from "@/components/StatusBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [vpnOpen, setVpnOpen] = useState(false);
  const { state } = useAppState();

  const handleShutdown = () => {
    // Best-effort close (works when opened via window.open)
    window.close();
    alert("Shutdown requested. In Electron, the app would exit completely.");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar onOpenVPN={() => setVpnOpen(true)} onShutdown={handleShutdown} />
        <SidebarInset>
          <header className="h-14 flex items-center border-b px-3 gap-2">
            <SidebarTrigger />
            <div className="font-semibold tracking-wide">Hyper AI Browser</div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="hero" size="sm" onClick={() => {}}>
                New Tab
              </Button>
            </div>
          </header>
          <main className="flex-1 min-h-[calc(100vh-3.5rem-2.75rem)]">{children}</main>
          <footer>
            <StatusBar />
          </footer>
        </SidebarInset>
      </div>
      <VPNModal open={vpnOpen} onOpenChange={setVpnOpen} />
    </SidebarProvider>
  );
}
