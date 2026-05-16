import { ThreatBadge } from "@/components/ui/ThreatBadge";

interface VTResultsProps {
  vtData: any;
}

export function VTResults({ vtData }: VTResultsProps) {
  if (!vtData || !vtData.attributes) return (
     <div className="bg-bg-card border border-border-dim rounded-xl p-6 h-full flex items-center justify-center min-h-[200px]">
        <span className="text-text-secondary">VirusTotal data unavailable</span>
     </div>
  );

  const stats = vtData.attributes.last_analysis_stats;
  const total = Object.values(stats).reduce((a: any, b: any) => a + b, 0) as number;
  const malicious = stats.malicious || 0;
  
  let verdict: "MALICIOUS" | "CLEAN" | "SUSPICIOUS" | "UNKNOWN" = "UNKNOWN";
  if (malicious > 5) verdict = "MALICIOUS";
  else if (malicious > 0) verdict = "SUSPICIOUS";
  else if (total > 0) verdict = "CLEAN";

  const categories = vtData.attributes.categories || {};

  return (
    <div className="bg-bg-card border border-border-dim rounded-xl p-6 h-full">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-sm text-text-secondary uppercase tracking-wider">VirusTotal Scan</h3>
        <ThreatBadge level={verdict} />
      </div>

      <div className="mb-6 flex flex-col items-center">
         <span className="text-4xl font-mono font-bold text-text-primary mb-1">{malicious} <span className="text-xl text-text-secondary">/ {total}</span></span>
         <span className="text-xs text-text-secondary">Engines Flagged</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden mb-6 flex">
         <div style={{width: `${(malicious/total)*100}%`}} className="h-full bg-accent-red shadow-glow-red"></div>
         <div style={{width: `${(stats.suspicious/total)*100}%`}} className="h-full bg-accent-yellow"></div>
         <div style={{width: `${(stats.harmless/total)*100}%`}} className="h-full bg-accent-green shadow-glow-green"></div>
         <div style={{width: `${(stats.undetected/total)*100}%`}} className="h-full bg-border-dim"></div>
      </div>

      <div>
        <h4 className="text-xs text-text-secondary uppercase mb-2">Categorization</h4>
        <div className="flex flex-wrap gap-2">
           {Object.values(categories).slice(0, 5).map((cat: any, i: number) => (
              <span key={i} className="px-2 py-1 bg-bg-secondary text-text-primary text-[10px] uppercase rounded border border-border-dim">{cat}</span>
           ))}
           {Object.keys(categories).length === 0 && <span className="text-xs text-text-secondary italic">None</span>}
        </div>
      </div>
    </div>
  );
}
