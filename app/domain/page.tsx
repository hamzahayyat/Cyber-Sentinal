"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SearchInput } from "@/components/ui/SearchInput";
import { LoadingScanner } from "@/components/ui/LoadingScanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { isValidDomain, isValidURL } from "@/lib/validators";
import { VTResults } from "@/components/domain/VTResults";
import { WhoisCard } from "@/components/domain/WhoisCard";
import { DNSRecords } from "@/components/domain/DNSRecords";
import { OTXPulses } from "@/components/ip/OTXPulses"; // Reused since structure is same
import { CopyButton } from "@/components/ui/CopyButton";
import Link from "next/link";

export default function DomainPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const fetchData = async (targetQuery: string) => {
    if (!isValidDomain(targetQuery) && !isValidURL(targetQuery)) {
      setError("Please enter a valid Domain or URL.");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`/api/domain?query=${encodeURIComponent(targetQuery)}`);
      const result = await res.json();
      
      if (!result.success) {
        setError(result.error.message);
      } else {
        setData(result.data);
        
        // Save history
        const historyStr = localStorage.getItem("cybersentinel_history");
        const history = historyStr ? JSON.parse(historyStr) : [];
        
        let threatLevel = 'UNKNOWN';
        if (result.data.vt?.attributes?.last_analysis_stats) {
            const malicious = result.data.vt.attributes.last_analysis_stats.malicious;
            if (malicious > 5) threatLevel = 'MALICIOUS';
            else if (malicious > 0) threatLevel = 'SUSPICIOUS';
            else threatLevel = 'CLEAN';
        }

        const newEntry = { type: 'domain', query: targetQuery, threatLevel, timestamp: new Date().toISOString() };
        localStorage.setItem("cybersentinel_history", JSON.stringify([newEntry, ...history.filter((h: any) => h.query !== targetQuery)].slice(0, 20)));

        // Update stats
        const statsStr = localStorage.getItem("cybersentinel_stats");
        const stats = statsStr ? JSON.parse(statsStr) : { ips: 0, domains: 0, hashes: 0, cves: 0 };
        stats.domains += 1;
        localStorage.setItem("cybersentinel_stats", JSON.stringify(stats));
      }
    } catch (err) {
      setError("Network error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery && (isValidDomain(initialQuery) || isValidURL(initialQuery))) {
      fetchData(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (q: string) => {
    router.push(`/domain?q=${encodeURIComponent(q)}`);
  };

  const domainOnly = query.replace(/^https?:\/\//, '').split('/')[0];

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2 text-text-primary">Domain & URL Scanner</h1>
        <p className="text-text-secondary text-sm mb-6">Investigate domains and URLs for malware, DNS records, and registration details.</p>
        <SearchInput 
           onSearch={handleSearch} 
           defaultValue={query}
           placeholder="Enter Domain or URL (e.g., example.com)" 
        />
      </div>

      {error && (
         <div className="bg-accent-red/10 border border-accent-red/50 text-accent-red p-4 rounded-lg mb-8 text-sm">
           {error}
         </div>
      )}

      {loading && <LoadingScanner text="ANALYZING DOMAIN RECORDS..." className="mt-20" />}

      {!loading && !data && !error && (
         <EmptyState title="Ready to Scan" description="Enter a domain name or full URL above to gather intelligence from VirusTotal, Whois, and AlienVault." />
      )}

      {!loading && data && (
        <div className="space-y-6">
           <div className="flex justify-between items-center bg-bg-secondary p-4 rounded-xl border border-border-dim">
              <div className="flex items-center gap-4">
                  <span className="text-2xl font-mono font-bold text-accent-cyan">{query}</span>
                  <CopyButton text={query} />
              </div>
              <Link href={`/ssl?q=${encodeURIComponent(domainOnly)}`} className="text-xs px-3 py-1.5 border border-accent-cyan text-accent-cyan rounded hover:bg-accent-cyan/10 transition-colors">
                  Inspect SSL
              </Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VTResults vtData={data.vt} />
              <WhoisCard whoisData={data.whois} />
           </div>

           <DNSRecords dnsData={data.dns} />
           <OTXPulses otxData={data.otx} />
        </div>
      )}
    </PageWrapper>
  );
}
