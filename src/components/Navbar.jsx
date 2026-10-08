import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap, LayoutDashboard, UserPlus, Home as HomeIcon, Menu, X } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/student-form", label: "Student Form", icon: UserPlus },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  EduRisk AI
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                  Part 2: MongoDB
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Student Dropout Prediction System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-slate-500"}`} />
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/student-form"
              className="ml-3 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
            >
              Check Student Risk
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-md">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium ${
                  active
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-slate-500"}`} />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              to="/student-form"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              Check Student Risk
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
