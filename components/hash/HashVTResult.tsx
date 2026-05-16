"use client";
import { ThreatBadge } from "@/components/ui/ThreatBadge";
import { DataTable } from "@/components/ui/DataTable";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface HashVTResultProps {
  hashData: any;
}

export function HashVTResult({ hashData }: HashVTResultProps) {
  const [filter, setFilter] = useState<'ALL' | 'MALICIOUS' | 'CLEAN' | 'UNDETECTED'>('ALL');

  if (!hashData || !hashData.attributes) return (
     <div className="bg-bg-card border border-border-dim rounded-xl p-6 h-full flex items-center justify-center min-h-[200px]">
        <span className="text-text-secondary">VirusTotal data unavailable</span>
     </div>
  );

  const stats = hashData.attributes.last_analysis_stats;
  const total = Object.values(stats).reduce((a: any, b: any) => a + b, 0) as number;
  const malicious = stats.malicious || 0;
  
  let verdict: "MALICIOUS" | "CLEAN" | "SUSPICIOUS" | "UNKNOWN" = "UNKNOWN";
  if (malicious > 5) verdict = "MALICIOUS";
  else if (malicious > 0) verdict = "SUSPICIOUS";
  else if (total > 0) verdict = "CLEAN";

  const results = hashData.attributes.last_analysis_results || {};
  const enginesList = Object.keys(results).map(engineName => ({
      engine: engineName,
      category: results[engineName].category,
      result: results[engineName].result || 'Clean',
  }));

  const filteredList = enginesList.filter(e => {
      if (filter === 'MALICIOUS') return e.category === 'malicious';
      if (filter === 'CLEAN') return e.category === 'harmless';
      if (filter === 'UNDETECTED') return e.category === 'undetected';
      return true;
  });

  const columns = [
      { header: "Engine", accessorKey: "engine", sortable: true },
      { header: "Category", accessorKey: "category" },
      { header: "Result", accessorKey: "result", cell: (r: any) => (
          <span className={cn(r.category === 'malicious' ? 'text-accent-red' : r.category === 'harmless' ? 'text-accent-green' : 'text-text-secondary')}>
              {r.result}
          </span>
      )}
  ];

  return (
    <div className="bg-bg-card border border-border-dim rounded-xl p-6 h-full">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-display font-semibold text-text-primary">Detection Breakdown</h3>
        <ThreatBadge level={verdict} />
      </div>

      <div className="mb-6 flex items-center gap-6">
         <div className="flex flex-col items-center">
            <span className="text-4xl font-mono font-bold text-accent-red drop-shadow-glow-red mb-1">{malicious}</span>
            <span className="text-xs text-text-secondary text-center uppercase">Malicious<br/>Engines</span>
         </div>
         <div className="w-full h-3 bg-bg-secondary rounded-full overflow-hidden flex">
            <div style={{width: `${(malicious/total)*100}%`}} className="h-full bg-accent-red shadow-glow-red"></div>
            <div style={{width: `${(stats.suspicious/total)*100}%`}} className="h-full bg-accent-yellow"></div>
            <div style={{width: `${(stats.harmless/total)*100}%`}} className="h-full bg-accent-green"></div>
            <div style={{width: `${(stats.undetected/total)*100}%`}} className="h-full bg-border-dim"></div>
         </div>
      </div>

      <div className="mb-4 flex gap-2">
         {['ALL', 'MALICIOUS', 'CLEAN', 'UNDETECTED'].map(f => (
             <button 
                 key={f}
                 onClick={() => setFilter(f as any)}
                 className={cn(
                     "px-3 py-1 text-xs font-mono rounded border transition-colors",
                     filter === f ? "bg-accent-cyan/20 border-accent-cyan text-accent-cyan" : "bg-bg-secondary border-border-dim text-text-secondary hover:text-text-primary"
                 )}
             >
                 {f}
             </button>
         ))}
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
         <DataTable columns={columns} data={filteredList} mono />
      </div>
    </div>
  );
}
