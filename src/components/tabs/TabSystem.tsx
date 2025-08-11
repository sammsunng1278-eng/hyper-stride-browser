import { useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/state/appState";
import { useNavigate } from "react-router-dom";

export default function TabSystem() {
  const { state, dispatch } = useAppState();
  const active = useMemo(() => state.tabs.find((t) => t.id === state.activeTabId) ?? state.tabs[0], [state]);

  const addBrowseTab = () => {
    const id = `tab-${Date.now()}`;
    dispatch({ type: "ADD_TAB", payload: { id, title: "New Tab", type: "browse", url: "" } });
  };

  const closeTab = (id: string) => dispatch({ type: "CLOSE_TAB", payload: { id } });

  useEffect(() => {
    document.title = `Hyper AI Browser — ${active?.title ?? "Tabs"}`;
  }, [active?.title]);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b px-2 flex items-center gap-2 overflow-x-auto">
        {state.tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-3 py-2 text-sm rounded-t ${state.activeTabId === tab.id ? "bg-card text-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
            onClick={() => dispatch({ type: "SET_ACTIVE_TAB", payload: { id: tab.id } })}
          >
            {tab.title}
            <span className="ml-2 opacity-70 hover:opacity-100" onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}>×</span>
          </button>
        ))}
        <div className="ml-auto py-2">
          <Button size="sm" variant="hero" onClick={addBrowseTab}>+ Tab</Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        {state.tabs.filter((t) => t.type === "browse").map((tab) => (
          <div key={tab.id} className={state.activeTabId === tab.id ? "absolute inset-0 block" : "absolute inset-0 hidden"}>
            <BrowseTab tabId={tab.id} url={tab.url ?? ""} />
          </div>
        ))}
        {active?.type === "automation" && <AutomationTab automationId={active.automationId!} />}
      </div>
    </div>
  );
}

function BrowseTab({ tabId, url }: { tabId: string; url: string }) {
  const { dispatch } = useAppState();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNavigate = (raw: string) => {
    if (!raw) return;
    let v = raw.trim();
    // Same-origin/internal route detection
    let isInternal = v.startsWith("/");
    try {
      const u = new URL(v, window.location.origin);
      if (u.origin === window.location.origin) {
        // If user typed full same-origin URL
        isInternal = true;
        v = u.pathname + u.search + u.hash;
      }
    } catch {
      // ignore URL parse errors
    }

    if (isInternal) {
      navigate(v);
      return;
    }

    // Ensure protocol for external URLs
    const external = /^https?:\/\//i.test(v) ? v : `https://${v}`;
    dispatch({ type: "UPDATE_TAB_URL", payload: { id: tabId, url: external } });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 flex items-center gap-2 border-b bg-muted/30">
        <Input
          ref={inputRef}
          defaultValue={url}
          placeholder="Enter URL"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleNavigate((e.target as HTMLInputElement).value);
          }}
        />
        <Button
          onClick={() => {
            const v = inputRef.current?.value ?? "";
            handleNavigate(v);
          }}
        >
          Go
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        {url ? (
          <iframe title="browser" src={url} className="w-full h-full" sandbox="allow-scripts allow-forms allow-same-origin allow-popups" />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">Enter a URL to start browsing.</div>
        )}
      </div>
    </div>
  );
}

function AutomationTab({ automationId }: { automationId: string }) {
  const { state, dispatch } = useAppState();
  const auto = state.automations.find((a) => a.id === automationId);

  useEffect(() => {
    const t = setTimeout(() => {
      // Simulate completion
      dispatch({ type: "SET_AUTOMATION_ACTIVITY", payload: Math.max(0, state.automationActivity - 1) });
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  if (!auto) return <div className="p-4">Automation not found.</div>;

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-semibold">Running: {auto.name}</h2>
      <div className="text-sm text-muted-foreground">This is a simulated run. In Electron, Playwright/Puppeteer would execute here with stealth + VPN retry.</div>
      <pre className="text-xs bg-muted/30 rounded p-3 overflow-auto">{auto.code ?? "// No code attached"}</pre>
    </div>
  );
}
