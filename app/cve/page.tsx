"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SearchInput } from "@/components/ui/SearchInput";
import { LoadingScanner } from "@/components/ui/LoadingScanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { isValidCVEId } from "@/lib/validators";
import { CVECard } from "@/components/cve/CVECard";
import { CVEDetail } from "@/components/cve/CVEDetail";
import { cn } from "@/lib/utils";

export default function CVEPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null); // array of cves or single cve object
  const [error, setError] = useState("");
  const [mode, setMode] = useState<'search' | 'detail'>('search');

  const fetchData = async (targetQuery: string) => {
    if (!targetQuery.trim()) return;

    setLoading(true);
    setError("");
    setData(null);

    const isId = isValidCVEId(targetQuery);

    try {
      const endpoint = isId ? `/api/cve?id=${encodeURIComponent(targetQuery)}` : `/api/cve?keyword=${encodeURIComponent(targetQuery)}`;
      const res = await fetch(endpoint);
      const result = await res.json();
      
      if (!result.success) {
        setError(result.error.message);
      } else {
        const vulnerabilities = result.data.vulnerabilities || [];
        
        if (vulnerabilities.length === 0) {
            setError("No vulnerabilities found matching this query.");
        } else {
            if (isId && vulnerabilities.length === 1) {
                setData(vulnerabilities[0]);
                setMode('detail');
            } else {
                setData(vulnerabilities);
                setMode('search');
            }
            
            // Save history
            const historyStr = localStorage.getItem("cybersentinel_history");
            const history = historyStr ? JSON.parse(historyStr) : [];
            const newEntry = { type: 'cve', query: targetQuery, threatLevel: 'UNKNOWN', timestamp: new Date().toISOString() };
            localStorage.setItem("cybersentinel_history", JSON.stringify([newEntry, ...history.filter((h: any) => h.query !== targetQuery)].slice(0, 20)));

            // Update stats
            const statsStr = localStorage.getItem("cybersentinel_stats");
            const stats = statsStr ? JSON.parse(statsStr) : { ips: 0, domains: 0, hashes: 0, cves: 0 };
            stats.cves += isId ? 1 : vulnerabilities.length;
            localStorage.setItem("cybersentinel_stats", JSON.stringify(stats));
        }
      }
    } catch (err) {
      setError("Network error occurred while fetching CVE data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchData(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (q: string) => {
    router.push(`/cve?q=${encodeURIComponent(q)}`);
  };

  const handleCveClick = (id: string) => {
    router.push(`/cve?q=${encodeURIComponent(id)}`);
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2 text-text-primary">CVE Search</h1>
        <p className="text-text-secondary text-sm mb-6">Search the National Vulnerability Database by keyword or CVE ID.</p>
        <SearchInput 
           onSearch={handleSearch} 
           defaultValue={query}
           placeholder="Enter keyword (e.g., Log4j) or ID (e.g., CVE-2021-44228)" 
        />
      </div>

      {error && (
         <div className="bg-accent-red/10 border border-accent-red/50 text-accent-red p-4 rounded-lg mb-8 text-sm">
           {error}
         </div>
      )}

      {loading && <LoadingScanner text="QUERYING NIST NVD DATABASE..." className="mt-20" />}

      {!loading && !data && !error && (
         <EmptyState title="Search Vulnerabilities" description="Enter a software name, vendor, or specific CVE ID above to search the NVD." />
      )}

      {!loading && data && mode === 'search' && Array.isArray(data) && (
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.map((item: any, idx: number) => (
                <CVECard key={idx} cveData={item} onClick={handleCveClick} />
            ))}
         </div>
      )}

      {!loading && data && mode === 'detail' && !Array.isArray(data) && (
         <CVEDetail cveData={data} onBack={() => {
             // Basic back navigation. Ideally we'd maintain the previous keyword search state,
             // but for simplicity we'll just show the search bar empty or let them click browser back.
             // This `onBack` just resets to empty state if no history, or we can just pop state.
             router.back();
         }} />
      )}
    </PageWrapper>
  );
}
