import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

export type ThemeMode = "light" | "dark";

export interface AppSettings {
  saveCookies: boolean;
  stealthMode: boolean;
  defaultWidth: number;
  defaultHeight: number;
  theme: ThemeMode;
}

export interface VPNConfig {
  id: string;
  name: string;
  fileName: string;
  content?: string; // stored as text
}

export interface VPNState {
  status: "disconnected" | "connecting" | "connected";
  currentConfigId?: string;
  configs: VPNConfig[];
}

export interface Automation {
  id: string;
  name: string;
  code?: string;
  apiKey: string;
  createdAt: string;
  lastRun?: string;
}

export interface Tab {
  id: string;
  title: string;
  type: "browse" | "automation";
  url?: string;
  automationId?: string;
}

export interface AppState {
  settings: AppSettings;
  vpn: VPNState;
  automations: Automation[];
  bookmarks: string[];
  profiles: string[];
  tabs: Tab[];
  activeTabId?: string;
  automationActivity: number;
}

type Action =
  | { type: "SET_SETTINGS"; payload: Partial<AppSettings> }
  | { type: "ADD_VPN_CONFIG"; payload: VPNConfig }
  | { type: "DELETE_VPN_CONFIG"; payload: string }
  | { type: "CONNECT_VPN"; payload: { id: string } }
  | { type: "DISCONNECT_VPN" }
  | { type: "ADD_AUTOMATION"; payload: Automation }
  | { type: "DELETE_AUTOMATION"; payload: string }
  | { type: "RUN_AUTOMATION"; payload: { id: string } }
  | { type: "ADD_TAB"; payload: Tab }
  | { type: "CLOSE_TAB"; payload: { id: string } }
  | { type: "SET_ACTIVE_TAB"; payload: { id: string } }
  | { type: "UPDATE_TAB_URL"; payload: { id: string; url: string } }
  | { type: "SET_AUTOMATION_ACTIVITY"; payload: number };

const LOCAL_KEY = "hyper-ai-state";

const defaultState: AppState = {
  settings: {
    saveCookies: false,
    stealthMode: true,
    defaultWidth: 1280,
    defaultHeight: 800,
    theme: "dark",
  },
  vpn: {
    status: "disconnected",
    currentConfigId: undefined,
    configs: [],
  },
  automations: [],
  bookmarks: [],
  profiles: [],
  tabs: [
    { id: "tab-home", title: "New Tab", type: "browse", url: "" },
  ],
  activeTabId: "tab-home",
  automationActivity: 0,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_SETTINGS": {
      const next = { ...state, settings: { ...state.settings, ...action.payload } };
      return next;
    }
    case "ADD_VPN_CONFIG":
      return { ...state, vpn: { ...state.vpn, configs: [...state.vpn.configs, action.payload] } };
    case "DELETE_VPN_CONFIG": {
      const configs = state.vpn.configs.filter((c) => c.id !== action.payload);
      const disconnect = state.vpn.currentConfigId === action.payload;
      return {
        ...state,
        vpn: {
          ...state.vpn,
          configs,
          status: disconnect ? "disconnected" : state.vpn.status,
          currentConfigId: disconnect ? undefined : state.vpn.currentConfigId,
        },
      };
    }
    case "CONNECT_VPN":
      return { ...state, vpn: { ...state.vpn, status: "connected", currentConfigId: action.payload.id } };
    case "DISCONNECT_VPN":
      return { ...state, vpn: { ...state.vpn, status: "disconnected", currentConfigId: undefined } };
    case "ADD_AUTOMATION":
      return { ...state, automations: [...state.automations, action.payload] };
    case "DELETE_AUTOMATION":
      return { ...state, automations: state.automations.filter((a) => a.id !== action.payload) };
    case "RUN_AUTOMATION": {
      const auto = state.automations.find((a) => a.id === action.payload.id);
      if (!auto) return state;
      const newTab: Tab = {
        id: `auto-${auto.id}-${Date.now()}`,
        title: `Automation: ${auto.name}`,
        type: "automation",
        automationId: auto.id,
      };
      return {
        ...state,
        tabs: [...state.tabs, newTab],
        activeTabId: newTab.id,
        automationActivity: state.automationActivity + 1,
      };
    }
    case "ADD_TAB":
      return { ...state, tabs: [...state.tabs, action.payload], activeTabId: action.payload.id };
    case "CLOSE_TAB": {
      const tabs = state.tabs.filter((t) => t.id !== action.payload.id);
      let activeTabId = state.activeTabId;
      if (state.activeTabId === action.payload.id) {
        activeTabId = tabs.length ? tabs[tabs.length - 1].id : undefined;
      }
      return { ...state, tabs, activeTabId };
    }
    case "SET_ACTIVE_TAB":
      return { ...state, activeTabId: action.payload.id };
    case "UPDATE_TAB_URL": {
      const tabs = state.tabs.map((t) => (t.id === action.payload.id ? { ...t, url: action.payload.url } : t));
      return { ...state, tabs };
    }
    case "SET_AUTOMATION_ACTIVITY":
      return { ...state, automationActivity: action.payload };
    default:
      return state;
  }
}

const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({ state: defaultState, dispatch: () => {} });

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as AppState) : defaultState;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  }, [state]);

  // Theme toggle (apply html class)
  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [state.settings.theme]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
