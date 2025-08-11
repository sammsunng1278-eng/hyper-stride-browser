import { LayoutDashboard, ShieldCheck, Workflow, Bookmark, Users, Settings as SettingsIcon, Power } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AppSidebarProps {
  onOpenVPN: () => void;
  onShutdown: () => void;
  pinned: boolean;
}

export function AppSidebar({ onOpenVPN, onShutdown, pinned }: AppSidebarProps) {
  const { state, setOpen } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const navLinkCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar collapsible="icon" onMouseEnter={() => { if (!pinned) setOpen(true); }} onMouseLeave={() => { if (!pinned) setOpen(false); }}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Hyper AI</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <NavLink to="/" end className={navLinkCls}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton onClick={onOpenVPN} tooltip="VPN">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      {!collapsed && <span>VPN</span>}
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right">VPN</TooltipContent>
                </Tooltip>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Automations">
                  <NavLink to="/automations" className={navLinkCls}>
                    <Workflow className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Automations</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Bookmarks">
                  <NavLink to="/bookmarks" className={navLinkCls}>
                    <Bookmark className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Bookmarks</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Profiles">
                  <NavLink to="/profiles" className={navLinkCls}>
                    <Users className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Profiles</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <NavLink to="/settings" className={navLinkCls}>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Shutdown" onClick={onShutdown}>
                  <Power className="mr-2 h-4 w-4" />
                  {!collapsed && <span>Shutdown</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
