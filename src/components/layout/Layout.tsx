import { Sidebar } from "@/components/static/DashBoradSidebar";
import { Header } from "@/components/static/DashBoradHeader";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-6 space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
