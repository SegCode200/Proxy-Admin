import { Bell, Menu, Settings, User, X } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card shadow-sm">
      <div className="flex items-center justify-between p-4 md:px-6">
        {/* Mobile menu button */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 text-gray-500 rounded-md lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold md:text-2xl whitespace-nowrap">
            Welcome SUPER ADMIN
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            className="p-2 transition-colors rounded-lg hover:bg-secondary"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-foreground" />
            <span className="absolute w-2 h-2 rounded-full top-1 right-1 bg-primary" />
          </button>
          
          <button 
            className="hidden p-2 transition-colors rounded-lg sm:block hover:bg-secondary"
            aria-label="Settings"
          >
            <Settings size={20} className="text-foreground" />
          </button>
          
          <Link to={"/profile-setting"} className="flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#004cff] text-white hover:bg-[#0039b3] transition-colors">
              <User size={20} />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
