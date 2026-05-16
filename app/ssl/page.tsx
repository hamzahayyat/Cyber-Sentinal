"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SearchInput } from "@/components/ui/SearchInput";
import { LoadingScanner } from "@/components/ui/LoadingScanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CertCard } from "@/components/ssl/CertCard";
import { CertHistory } from "@/components/ssl/CertHistory";
import { isValidDomain } from "@/lib/validators";

export default function SSLPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  
  const [domain, setDomain] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState("");

  const fetchData = async (targetDomain: string) => {
    let cleanDomain = targetDomain.replace(/^https?:\/\//, '').split('/')[0];
    
    if (!isValidDomain(cleanDomain)) {
      setError("Please enter a valid domain name.");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`/api/ssl?domain=${encodeURIComponent(cleanDomain)}`);
      const result = await res.json();
      
      if (!result.success) {
        setError(result.error.message);
      } else {
        // crt.sh returns an array of certs sorted chronologically usually. Let's sort descending by issue date.
        const certs = result.data.sort((a: any, b: any) => new Date(b.not_before).getTime() - new Date(a.not_before).getTime());
        setData(certs);
      }
    } catch (err) {
      setError("Network error occurred while fetching SSL data.");
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
    router.push(`/ssl?q=${encodeURIComponent(q)}`);
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2 text-text-primary">SSL Certificate Inspector</h1>
        <p className="text-text-secondary text-sm mb-6">Inspect current and historical SSL/TLS certificates via crt.sh.</p>
        <SearchInput 
           onSearch={handleSearch} 
           defaultValue={domain}
           placeholder="Enter Domain (e.g., example.com)" 
        />
      </div>

      {error && (
         <div className="bg-accent-red/10 border border-accent-red/50 text-accent-red p-4 rounded-lg mb-8 text-sm">
           {error}
         </div>
      )}

      {loading && <LoadingScanner text="QUERYING CERTIFICATE TRANSPARENCY LOGS..." className="mt-20" />}

      {!loading && !data && !error && (
         <EmptyState title="Inspect SSL Certificates" description="Enter a domain name above to retrieve its certificate history." />
      )}

      {!loading && data && data.length > 0 && (
         <div>
            <CertCard cert={data[0]} />
            <CertHistory certs={data} />
         </div>
      )}
      
      {!loading && data && data.length === 0 && (
          <EmptyState title="No Certificates Found" description="Could not find any certificates for this domain in crt.sh." />
      )}
    </PageWrapper>
  );
}
