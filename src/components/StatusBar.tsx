import { useAppState } from "@/state/appState";

export default function StatusBar() {
  const { state } = useAppState();
  const vpnLabel = state.vpn.status === "connected" ? "Connected" : "Disconnected";
  const profile = state.profiles[0] ?? "Default";

  return (
    <div className="h-11 border-t flex items-center justify-between px-3 text-sm bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">VPN:</span>
        <span className={state.vpn.status === "connected" ? "text-primary" : "text-muted-foreground"}>{vpnLabel}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">Automations:</span>
        <span>{state.automationActivity}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">Profile:</span>
        <span>{profile}</span>
      </div>
    </div>
  );
}
