"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldAlert, 
  Home, 
  Search, 
  Globe, 
  Hash, 
  Shield, 
  Mail, 
  Lock
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: <Home size={20} /> },
  { name: "IP Investigator", href: "/ip", icon: <Search size={20} /> },
  { name: "Domain & URL Scanner", href: "/domain", icon: <Globe size={20} /> },
  { name: "File Hash Lookup", href: "/hash", icon: <Hash size={20} /> },
  { name: "CVE Search", href: "/cve", icon: <Shield size={20} /> },
  { name: "Email Analyzer", href: "/email", icon: <Mail size={20} /> },
  { name: "SSL Inspector", href: "/ssl", icon: <Lock size={20} /> },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-border-dim bg-bg-secondary z-50">
        <div className="p-6 flex items-center gap-3 border-b border-border-dim">
          <ShieldAlert className="text-accent-cyan" size={28} />
          <span className="font-display font-bold text-lg tracking-wider text-text-primary">CyberSentinel</span>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                  isActive 
                    ? "bg-bg-hover text-accent-cyan border-l-4 border-accent-cyan shadow-[inset_4px_0_0_0_rgba(0,212,255,1)]" 
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                )}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border-dim flex justify-between items-center text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-green shadow-glow-green animate-pulse"></div>
            <span>APIs Online</span>
          </div>
          <span className="font-mono">v1.0.0</span>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-bg-secondary border-t border-border-dim z-50 flex justify-around items-center px-2">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-accent-cyan" : "text-text-secondary"
              )}
            >
              {item.icon}
              <span className="text-[10px] leading-none text-center truncate w-full px-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
