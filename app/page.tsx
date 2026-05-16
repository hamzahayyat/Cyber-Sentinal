"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SearchInput } from "@/components/ui/SearchInput";
import { StatCard } from "@/components/ui/StatCard";
import { Search, Globe, Hash, Shield, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { detectInputType } from "@/lib/validators";
import { useState, useEffect } from "react";
import { ThreatBadge } from "@/components/ui/ThreatBadge";

const toolLinks = [
  { name: "IP Investigator", href: "/ip", icon: <Search className="w-8 h-8 mb-4 text-accent-cyan" />, desc: "Geo, ASN, AbuseScore, Shodan, OTX" },
  { name: "Domain Scanner", href: "/domain", icon: <Globe className="w-8 h-8 mb-4 text-accent-cyan" />, desc: "VirusTotal, Whois, DNS, OTX" },
  { name: "File Hash Lookup", href: "/hash", icon: <Hash className="w-8 h-8 mb-4 text-accent-cyan" />, desc: "MD5, SHA1, SHA256 Analysis" },
  { name: "CVE Search", href: "/cve", icon: <Shield className="w-8 h-8 mb-4 text-accent-cyan" />, desc: "Search NIST vulnerability database" },
  { name: "Email Analyzer", href: "/email", icon: <Mail className="w-8 h-8 mb-4 text-accent-cyan" />, desc: "Parse headers, SPF/DKIM/DMARC" },
  { name: "SSL Inspector", href: "/ssl", icon: <Lock className="w-8 h-8 mb-4 text-accent-cyan" />, desc: "Inspect certificates via crt.sh" },
];

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ ips: 0, domains: 0, hashes: 0, cves: 0 });
  const [recentLookups, setRecentLookups] = useState<any[]>([]);

  useEffect(() => {
    // Load stats and history from localStorage
    const savedStats = localStorage.getItem("cybersentinel_stats");
    if (savedStats) setStats(JSON.parse(savedStats));

    const history = localStorage.getItem("cybersentinel_history");
    if (history) setRecentLookups(JSON.parse(history));
  }, []);

  const handleSearch = (query: string) => {
    if (!query) return;
    const type = detectInputType(query);
    
    // Auto-redirect logic
    switch(type) {
        case 'ip': router.push(`/ip?q=${encodeURIComponent(query)}`); break;
        case 'domain':
        case 'url': router.push(`/domain?q=${encodeURIComponent(query)}`); break;
        case 'hash': router.push(`/hash?q=${encodeURIComponent(query)}`); break;
        case 'cve': router.push(`/cve?q=${encodeURIComponent(query)}`); break;
        default: router.push(`/domain?q=${encodeURIComponent(query)}`); // Fallback to domain search
    }
  };

  return (
    <PageWrapper>
      {/* Hero Search */}
      <div className="max-w-3xl mx-auto text-center mb-16 mt-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          <span className="text-text-primary">Investigate. </span>
          <span className="text-accent-cyan drop-shadow-glow-cyan">Analyze. </span>
          <span className="text-text-primary">Defend.</span>
        </h1>
        <p className="text-text-secondary mb-8 max-w-xl mx-auto">
          Unified threat intelligence dashboard. Paste an IP, domain, URL, hash, or CVE to begin.
        </p>
        <div className="bg-bg-secondary p-2 rounded-xl border border-border-dim shadow-xl">
           <SearchInput 
              onSearch={handleSearch} 
              placeholder="Enter 1.1.1.1, example.com, CVE-2021-44228..."
              className="bg-bg-primary border-none text-lg py-4"
              wrapperClassName="rounded-lg overflow-hidden"
           />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard title="IPs Investigated" value={stats.ips} />
        <StatCard title="Domains Scanned" value={stats.domains} />
        <StatCard title="Hashes Checked" value={stats.hashes} />
        <StatCard title="CVEs Found" value={stats.cves} />
      </div>

      {/* Quick Tools */}
      <div className="mb-12">
        <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-accent-cyan rounded-full shadow-glow-cyan inline-block"></span>
          Quick Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {toolLinks.map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <div className="bg-bg-card border border-border-dim rounded-xl p-6 hover:border-accent-cyan hover:shadow-glow-cyan transition-all duration-300 group cursor-pointer h-full">
                {tool.icon}
                <h3 className="font-display font-semibold text-lg text-text-primary mb-2 group-hover:text-accent-cyan transition-colors">{tool.name}</h3>
                <p className="text-text-secondary text-sm">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Lookups */}
      {recentLookups.length > 0 && (
         <div>
            <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent-purple rounded-full inline-block"></span>
              Recent Lookups
            </h2>
            <div className="bg-bg-card border border-border-dim rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                   <thead className="bg-bg-secondary border-b border-border-dim text-text-secondary uppercase tracking-wider text-xs">
                      <tr>
                         <th className="p-4 font-medium">Query</th>
                         <th className="p-4 font-medium">Type</th>
                         <th className="p-4 font-medium">Threat Level</th>
                         <th className="p-4 font-medium text-right">Time</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border-dim/50">
                      {recentLookups.slice(0, 10).map((lookup, i) => (
                         <tr key={i} className="hover:bg-bg-hover transition-colors">
                            <td className="p-4 font-mono text-text-primary">
                                <Link href={`/${lookup.type}?q=${encodeURIComponent(lookup.query)}`} className="hover:text-accent-cyan hover:underline">
                                    {lookup.query}
                                </Link>
                            </td>
                            <td className="p-4 uppercase text-xs">{lookup.type}</td>
                            <td className="p-4"><ThreatBadge level={lookup.threatLevel || 'UNKNOWN'} /></td>
                            <td className="p-4 text-right text-text-secondary">
                                {new Date(lookup.timestamp).toLocaleTimeString()}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
            </div>
         </div>
      )}

    </PageWrapper>
  );
}
