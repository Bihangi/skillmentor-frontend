import { Routes, Route } from "react-router-dom";
import SelectRolePage from "./pages/SelectRolePage";
import DashboardPage from "./pages/DashboardPage";
import { AdminLayout } from "./components/layouts/AdminLayout";
import SignInPage from "./pages/SignInPage";
import { MainLayout } from "./components/layouts/MainLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<SelectRolePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin/*" element={<AdminLayout />} />
      </Route>
    </Routes>
  );
}