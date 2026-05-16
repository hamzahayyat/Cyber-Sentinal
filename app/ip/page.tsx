"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SearchInput } from "@/components/ui/SearchInput";
import { LoadingScanner } from "@/components/ui/LoadingScanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { isValidIP } from "@/lib/validators";
import { IPOverview } from "@/components/ip/IPOverview";
import { AbuseScore } from "@/components/ip/AbuseScore";
import { ShodanPorts } from "@/components/ip/ShodanPorts";
import { OTXPulses } from "@/components/ip/OTXPulses";

function IPPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  
  const [ip, setIp] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const fetchData = async (targetIp: string) => {
    if (!isValidIP(targetIp)) {
      setError("Please enter a valid IPv4 or IPv6 address.");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`/api/ip?address=${encodeURIComponent(targetIp)}`);
      const result = await res.json();
      
      if (!result.success) {
        setError(result.error.message);
      } else {
        setData(result.data);
        
        // Save history
        const historyStr = localStorage.getItem("cybersentinel_history");
        const history = historyStr ? JSON.parse(historyStr) : [];
        let threatLevel = 'UNKNOWN';
        if (result.data.abuse && result.data.abuse.abuseConfidenceScore > 75) threatLevel = 'MALICIOUS';
        else if (result.data.abuse && result.data.abuse.abuseConfidenceScore > 25) threatLevel = 'SUSPICIOUS';
        else if (result.data.abuse && result.data.abuse.abuseConfidenceScore === 0) threatLevel = 'CLEAN';

        const newEntry = { type: 'ip', query: targetIp, threatLevel, timestamp: new Date().toISOString() };
        localStorage.setItem("cybersentinel_history", JSON.stringify([newEntry, ...history.filter((h: any) => h.query !== targetIp)].slice(0, 20)));

        // Update stats
        const statsStr = localStorage.getItem("cybersentinel_stats");
        const stats = statsStr ? JSON.parse(statsStr) : { ips: 0, domains: 0, hashes: 0, cves: 0 };
        stats.ips += 1;
        localStorage.setItem("cybersentinel_stats", JSON.stringify(stats));
      }
    } catch (err) {
      setError("Network error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery && isValidIP(initialQuery)) {
      fetchData(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (query: string) => {
    router.push(`/ip?q=${encodeURIComponent(query)}`);
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2 text-text-primary">IP Investigator</h1>
        <p className="text-text-secondary text-sm mb-6">Analyze IP addresses for geolocation, threat intelligence, and open ports.</p>
        <SearchInput 
           onSearch={handleSearch} 
           defaultValue={ip}
           placeholder="Enter IPv4 or IPv6 address (e.g., 8.8.8.8)" 
        />
      </div>

      {error && (
         <div className="bg-accent-red/10 border border-accent-red/50 text-accent-red p-4 rounded-lg mb-8 text-sm">
           {error}
         </div>
      )}

      {loading && <LoadingScanner text="QUERYING GLOBAL INTEL DATABASES..." className="mt-20" />}

      {!loading && !data && !error && (
         <EmptyState title="Ready to Investigate" description="Enter an IP address above to gather intelligence from AbuseIPDB, Shodan, AlienVault OTX, and more." />
      )}

      {!loading && data && (
        <div className="space-y-6">
           <IPOverview ip={ip} geoData={data.geo} />
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AbuseScore abuseData={data.abuse} />
              {/* If we had VirusTotal data for IP we would put it here. Space for future VTResults. */}
           </div>

           <ShodanPorts shodanData={data.shodan} />
           <OTXPulses otxData={data.otx} />
        </div>
      )}
    </PageWrapper>
  );
}

export default function IPPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-text-secondary">Loading...</div>}>
      <IPPageContent />
    </Suspense>
  );
}
