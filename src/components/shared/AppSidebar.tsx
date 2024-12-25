import {
  Book,
  Briefcase,
  GraduationCap,
  Home,
  Layers,
  LayoutDashboardIcon,
  LogOut,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useAppDispatch } from "@/redux/hook";
import { logout } from "@/redux/features/auth/authSlice";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "About",
    url: "/dashboard/about",
    icon: User,
  },
  {
    title: "Blogs",
    url: "/dashboard/blogs",
    icon: Book,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: Layers,
  },
  {
    title: "Experience",
    url: "/dashboard/experience",
    icon: Briefcase,
  },
  {
    title: "Education",
    url: "/dashboard/education",
    icon: GraduationCap,
  },
];

export function AppSidebar() {
  const dispatch = useAppDispatch();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div
                    onClick={() => dispatch(logout())}
                    className="flex items-center"
                  >
                    {" "}
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
