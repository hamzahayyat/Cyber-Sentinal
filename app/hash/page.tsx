"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SearchInput } from "@/components/ui/SearchInput";
import { LoadingScanner } from "@/components/ui/LoadingScanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { detectInputType } from "@/lib/validators";
import { HashMetadata } from "@/components/hash/HashMetadata";
import { HashVTResult } from "@/components/hash/HashVTResult";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HashPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async (targetQuery: string) => {
    if (detectInputType(targetQuery) !== 'hash') {
      setError("Please enter a valid MD5, SHA-1, or SHA-256 hash.");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`/api/hash?hash=${encodeURIComponent(targetQuery)}`);
      const result = await res.json();
      
      if (!result.success) {
        setError(result.error.message);
      } else {
        setData(result.data);
        
        // Save history
        const historyStr = localStorage.getItem("cybersentinel_history");
        const history = historyStr ? JSON.parse(historyStr) : [];
        
        let threatLevel = 'UNKNOWN';
        if (result.data?.attributes?.last_analysis_stats) {
            const malicious = result.data.attributes.last_analysis_stats.malicious;
            if (malicious > 5) threatLevel = 'MALICIOUS';
            else if (malicious > 0) threatLevel = 'SUSPICIOUS';
            else threatLevel = 'CLEAN';
        }

        const newEntry = { type: 'hash', query: targetQuery, threatLevel, timestamp: new Date().toISOString() };
        localStorage.setItem("cybersentinel_history", JSON.stringify([newEntry, ...history.filter((h: any) => h.query !== targetQuery)].slice(0, 20)));

        // Update stats
        const statsStr = localStorage.getItem("cybersentinel_stats");
        const stats = statsStr ? JSON.parse(statsStr) : { ips: 0, domains: 0, hashes: 0, cves: 0 };
        stats.hashes += 1;
        localStorage.setItem("cybersentinel_stats", JSON.stringify(stats));
      }
    } catch (err) {
      setError("Network error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery && detectInputType(initialQuery) === 'hash') {
      fetchData(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (q: string) => {
    router.push(`/hash?q=${encodeURIComponent(q)}`);
  };

  // Local Hash Computation
  const computeHash = async (file: File) => {
     try {
         setLoading(true);
         const arrayBuffer = await file.arrayBuffer();
         const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
         const hashArray = Array.from(new Uint8Array(hashBuffer));
         const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
         setQuery(hashHex);
         handleSearch(hashHex);
     } catch (err) {
         setError("Failed to compute file hash locally.");
         setLoading(false);
     }
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          computeHash(e.dataTransfer.files[0]);
      }
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2 text-text-primary">File Hash Lookup</h1>
        <p className="text-text-secondary text-sm mb-6">Analyze MD5, SHA-1, or SHA-256 file hashes to detect malware.</p>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
            <SearchInput 
               onSearch={handleSearch} 
               defaultValue={query}
               placeholder="Enter file hash..." 
               wrapperClassName="flex-1"
            />
        </div>

        {/* Drag and Drop Area */}
        <div 
            className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer",
                isDragging ? "border-accent-cyan bg-accent-cyan/10" : "border-border-dim bg-bg-card hover:border-accent-cyan/50 hover:bg-bg-secondary"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <UploadCloud className={cn("mx-auto mb-4 w-12 h-12 transition-colors", isDragging ? "text-accent-cyan" : "text-text-secondary")} />
            <h3 className="font-display font-medium text-text-primary mb-1">Drag & drop a file here</h3>
            <p className="text-sm text-text-secondary">or click to browse. Hash is computed locally in your browser (no upload).</p>
            <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files && computeHash(e.target.files[0])} />
        </div>
      </div>

      {error && (
         <div className="bg-accent-red/10 border border-accent-red/50 text-accent-red p-4 rounded-lg mb-8 text-sm">
           {error}
         </div>
      )}

      {loading && <LoadingScanner text="ANALYZING HASH METADATA..." className="mt-20" />}

      {!loading && !data && !error && (
         <EmptyState title="Ready to Lookup" description="Enter a hash or drop a file to query the VirusTotal database for malware detections." />
      )}

      {!loading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <HashMetadata hashData={data} />
           <HashVTResult hashData={data} />
        </div>
      )}
    </PageWrapper>
  );
}
