import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Navbar } from "../../components/Navbar";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";

export function AdminLayout() {
  const { isSignedIn, role } = useAuth();
  const location = useLocation();

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)] w-full">
          <AdminSidebar />
          <main className="flex-1 p-6">
            <div className="mb-4 md:hidden">
              <SidebarTrigger />
            </div>
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
