import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
// import Dashboard from "./pages/Dashboard";
import Automations from "./pages/Automations";
import Bookmarks from "./pages/Bookmarks";
import Profiles from "./pages/Profiles";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import TabSystem from "./components/tabs/TabSystem";
import { AppStateProvider } from "./state/appState";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppStateProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<TabSystem />} />
              <Route path="/automations" element={<Automations />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/profiles" element={<Profiles />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </AppStateProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
