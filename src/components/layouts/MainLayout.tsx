import { Outlet } from "react-router-dom";
import { Navbar } from "../../components/Navbar";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Outlet />
    </div>
  );
}
