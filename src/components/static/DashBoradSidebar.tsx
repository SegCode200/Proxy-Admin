"use client";

import { useState } from "react";
import {
  Menu,
  X,
  BarChart3,
  Settings,
  Users,
  ShoppingCart,
  LogOut,
  Motorbike,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 p-2 rounded-lg lg:hidden top-4 left-4 bg-primary text-primary-foreground"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed lg:static left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#004cff]">
              <BarChart3 size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold">Admin</h1>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <NavLink icon={BarChart3} label="Dashboard" href="/" active={false} />
          <NavLink icon={Users} label="Users" href="/users" />
          <NavLink icon={Motorbike} label="Rides" href="/rides" />
          <NavLink icon={ShoppingCart} label="Listing" href="/listing" />
          <NavLink icon={Settings} label="Settings" href="#" />
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button className="flex items-center w-full gap-3 px-4 py-3 transition-colors rounded-lg hover:bg-sidebar-accent text-sidebar-foreground">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

interface NavLinkProps {
  icon: any;
  label: string;
  href: string;
  active?: boolean;
}

function NavLink({ icon: Icon, label, href, active }: NavLinkProps) {
  const location = useLocation();
  const path = location.pathname;
  active = path === href ? true : false;
  return (
    <Link
      to={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? "bg-[#004ccf] text-[#EAFAFA]"
          : "text-sidebar-foreground hover:bg-[#0066FF] hover:text-white"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
}
