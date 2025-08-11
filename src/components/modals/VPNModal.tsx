import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/state/appState";

interface VPNModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VPNModal({ open, onOpenChange }: VPNModalProps) {
  const { state, dispatch } = useAppState();
  const [selectedId, setSelectedId] = useState<string | undefined>(state.vpn.currentConfigId);

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      if (!file.name.endsWith(".ovpn")) continue;
      const content = await file.text();
      dispatch({
        type: "ADD_VPN_CONFIG",
        payload: {
          id: `${Date.now()}-${file.name}`,
          name: file.name.replace(/\.ovpn$/, ""),
          fileName: file.name,
          content,
        },
      });
    }
  };

  const connect = () => {
    if (!selectedId) return;
    dispatch({ type: "CONNECT_VPN", payload: { id: selectedId } });
  };

  const disconnect = () => dispatch({ type: "DISCONNECT_VPN" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>VPN</DialogTitle>
          <DialogDescription>Connect to a saved configuration and manage .ovpn files.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Upload .ovpn configs</label>
            <Input type="file" accept=".ovpn" multiple onChange={(e) => onFiles(e.target.files)} />
          </div>
          <div className="max-h-40 overflow-auto rounded border p-2 space-y-2">
            {state.vpn.configs.length === 0 && (
              <div className="text-sm text-muted-foreground">No VPN configs added yet.</div>
            )}
            {state.vpn.configs.map((cfg) => (
              <div
                key={cfg.id}
                className={`flex items-center justify-between rounded px-2 py-1 ${selectedId === cfg.id ? "bg-muted" : ""}`}
                onClick={() => setSelectedId(cfg.id)}
              >
                <div className="truncate">{cfg.name}</div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: "DELETE_VPN_CONFIG", payload: cfg.id });
                      if (selectedId === cfg.id) setSelectedId(undefined);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="hero" onClick={connect} disabled={!selectedId}>
              Connect
            </Button>
            <Button variant="outline" onClick={disconnect} disabled={state.vpn.status !== "connected"}>
              Disconnect
            </Button>
            <div className="ml-auto text-sm text-muted-foreground">
              Status: <span className={state.vpn.status === "connected" ? "text-primary" : ""}>{state.vpn.status}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
