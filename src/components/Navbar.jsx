import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap, LayoutDashboard, UserPlus, Home as HomeIcon, Menu, X, MessageCircle } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinks = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/student-form", label: "Student Form", icon: UserPlus },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/conversations", label: "Conversations & Progress", icon: MessageCircle },
  ];
  const links = (mobile = false) => navLinks.map((link) => {
    const Icon = link.icon;
    const active = location.pathname === link.path;
    return <Link key={link.path} to={link.path} onClick={() => mobile && setMobileMenuOpen(false)} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${active ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}><Icon className="w-4 h-4"/>{link.label}</Link>;
  });
  return <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-16">
    <Link to="/" className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center"><GraduationCap className="w-6 h-6"/></div><div><span className="font-bold text-lg text-slate-900">EduRisk AI</span><p className="text-xs text-slate-500 hidden sm:block">Student Retention & Early Intervention</p></div></Link>
    <nav className="hidden md:flex items-center gap-1">{links()}</nav>
    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} type="button" className="p-2 rounded-md text-slate-600 md:hidden" aria-label="Toggle navigation">{mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}</button>
  </div></div>{mobileMenuOpen && <nav className="md:hidden border-t bg-white p-3 space-y-1">{links(true)}</nav>}</header>;
}
