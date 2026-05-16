import { CVSSBadge } from "@/components/cve/CVSSBadge";

interface CVECardProps {
  cveData: any;
  onClick: (cveId: string) => void;
}

export function CVECard({ cveData, onClick }: CVECardProps) {
  const cve = cveData.cve;
  const id = cve.id;
  const description = cve.descriptions.find((d: any) => d.lang === "en")?.value || "No description available.";
  const published = new Date(cve.published).toLocaleDateString();
  
  let score = null;
  const metrics = cve.metrics;
  if (metrics?.cvssMetricV31) score = metrics.cvssMetricV31[0].cvssData.baseScore;
  else if (metrics?.cvssMetricV30) score = metrics.cvssMetricV30[0].cvssData.baseScore;
  else if (metrics?.cvssMetricV2) score = metrics.cvssMetricV2[0].cvssData.baseScore;

  return (
    <div 
       onClick={() => onClick(id)}
       className="bg-bg-card border border-border-dim rounded-xl p-5 hover:border-accent-cyan hover:shadow-glow-cyan transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-mono font-bold text-accent-cyan text-lg">{id}</h3>
        <CVSSBadge score={score} />
      </div>
      <p className="text-sm text-text-secondary line-clamp-3 mb-4 flex-1">
        {description}
      </p>
      <div className="flex justify-between items-center text-xs text-text-secondary/70 border-t border-border-dim pt-3 mt-auto">
        <span>Published: {published}</span>
        <span className="text-text-primary hover:text-accent-cyan transition-colors">View Details →</span>
      </div>
    </div>
  );
}
