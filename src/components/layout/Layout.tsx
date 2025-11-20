import { useState } from 'react';
import { Sidebar } from "@/components/static/DashBoradSidebar";
import { Header } from "@/components/static/DashBoradHeader";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar 
          isOpen={true} 
          onClose={() => {}} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          isSidebarOpen={sidebarOpen} 
        />
        <main className="flex-1 overflow-y-auto scrollbar-hide bg-gray-50 dark:bg-gray-900">
          <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
