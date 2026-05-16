"use client";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const pageNames: Record<string, string> = {
    "/": "Dashboard",
    "/ip": "IP Investigator",
    "/domain": "Domain & URL Scanner",
    "/hash": "File Hash Lookup",
    "/cve": "CVE Search",
    "/email": "Email Analyzer",
    "/ssl": "SSL Inspector",
  };

  const title = pageNames[pathname] || "Dashboard";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    // Simple routing logic based on input structure could be added here
    // For now, redirect to dashboard with query to handle there, or just clear it.
    router.push(`/?q=${encodeURIComponent(search)}`);
    setSearch("");
  };

  return (
    <header className="h-16 border-b border-border-dim bg-bg-primary/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      <h1 className="font-display text-xl font-bold tracking-wide text-text-primary hidden sm:block">
        {title}
      </h1>
      
      <form onSubmit={handleSearch} className="relative w-full sm:w-96 ml-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Quick search IP, domain, hash, or CVE..." 
          className="w-full bg-bg-card border border-border-dim rounded-full py-1.5 pl-9 pr-4 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-cyan focus:shadow-glow-cyan transition-all"
        />
      </form>
    </header>
  );
}
