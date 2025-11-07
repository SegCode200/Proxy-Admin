import { Bell, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center flex-1 gap-4">
          <div className="relative hidden w-full max-w-xs md:flex">
            <h1 className="text-xl font-bold">Welome SUPER ADMIN</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 transition-colors rounded-lg hover:bg-secondary">
            <Bell size={20} className="text-foreground" />
            <span className="absolute w-2 h-2 rounded-full top-1 right-1 bg-primary" />
          </button>
          <button className="p-2 transition-colors rounded-lg hover:bg-secondary">
            <Settings size={20} className="text-foreground" />
          </button>
          <Link to={"/profile-setting"}>
            <button className="w-10 h-10 rounded-lg bg-[#004cff] text-white flex items-center justify-center">
              <User size={20} />
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
