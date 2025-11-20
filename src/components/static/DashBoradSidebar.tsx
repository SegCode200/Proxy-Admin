import { useState } from "react";
import {
  Menu,
  X,
  BarChart3,
  Users,
  ShoppingCart,
  LogOut,
  Motorbike,
  UserRoundCheck,
  ChevronDown,
  FolderOpen,
  Flag,
  Store,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutState } from "@/store/authSlice";
import { persistor } from "@/store/store";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handelLogOut = async () => {
    dispatch(logoutState());
    await persistor.purge();
    navigate("/login");
    console.log("LogOut Successful 😁🥂😉");
  };
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed z-40 p-2 rounded-md lg:hidden top-3 left-3 bg-[#004cff] text-primary-foreground shadow-lg hover:bg-[#0056cc] transition-colors ${
          isOpen ? "hidden" : "block"
        }`}
        aria-label="Open sidebar menu"
      >
        <Menu size={24} />
      </button>
      <aside
        className={`fixed lg:static left-0 top-0 h-screen w-64 bg-white text-sidebar-foreground border-r border-sidebar-border shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out z-40 flex flex-col pb-6 overflow-y-auto scrollbar-hide ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#004cff]">
            <BarChart3 size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold">Admin</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 ml-auto text-gray-600 transition-colors rounded-md lg:hidden hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 ">
          <NavLink icon={BarChart3} label="Dashboard" href="/" />
          <NavLink icon={Users} label="Users" href="/users" />
          <NavLink icon={Motorbike} label="Rides" href="/rides" />
          <NavLink icon={ShoppingCart} label="Listing" href="/listing" />
          <NavLink icon={UserRoundCheck} label="Kyc Verification" href="/kyc" />
          <NavLink icon={Flag} label="Reports" href="/reports" />
          <NavLink
            icon={Store}
            label="Vendor Application"
            href="/vendor-applications"
          />

          {/* Category Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="flex items-center justify-between w-full gap-3 px-4 py-3 text-left transition-colors rounded-lg text-sidebar-foreground hover:bg-[#0066FF] hover:text-white"
            >
              <div className="flex items-center gap-3">
                <FolderOpen size={20} />
                <span>Category</span>
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  categoryDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {categoryDropdownOpen && (
              <div className="ml-6 space-y-1">
                <NavLink
                  icon={() => (
                    <span className="w-2 h-2 bg-current rounded-full" />
                  )}
                  label="All Categories"
                  href="/categories"
                />
                <NavLink
                  icon={() => (
                    <span className="w-2 h-2 bg-current rounded-full" />
                  )}
                  label="Add Category"
                  href="/categories/add"
                />
              </div>
            )}
          </div>

          <div className="mt-auto">
            <button
              onClick={handelLogOut}
              className="flex items-center w-full gap-3 px-4 py-3 transition-colors rounded-lg hover:bg-sidebar-accent text-sidebar-foreground"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
      {isOpen && (
        <div
          className="fixed top-0 bottom-0 left-0 right-0 z-30 lg:hidden bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

interface NavLinkProps {
  icon:
    | React.ComponentType<{ size: number; className?: string }>
    | ((props: any) => React.ReactElement | null);
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

function NavLink({ icon: Icon, label, href, onClick }: NavLinkProps) {
  const location = useLocation();
  const path = location.pathname;
  const isActive = path === href;

  return (
    <Link
      to={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? "bg-[#004ccf] text-[#EAFAFA]"
          : "text-sidebar-foreground hover:bg-[#0066FF] hover:text-white"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
}
