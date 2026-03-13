import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../components/ui/sidebar";
import { NavLink } from "../../components/NavLink";
import { BookOpen, Users, CalendarCheck, BarChart3 } from "lucide-react";

const adminItems = [
  { title: "Overview", url: "/admin", icon: BarChart3 },
  { title: "Mentors", url: "/admin/mentors", icon: Users },
  { title: "Subjects", url: "/admin/subjects", icon: BookOpen },
  { title: "Manage Bookings", url: "/admin/bookings", icon: CalendarCheck },
];

export function AdminSidebar() {
  return (
    <Sidebar className="border-r border-border/30">
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/60 px-4">
            Administration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-primary/5 transition-all duration-200"
                      activeClassName="bg-primary/10 text-primary border-r-2 border-primary"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
