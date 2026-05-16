import { CVSSBadge } from "@/components/cve/CVSSBadge";
import { CopyButton } from "@/components/ui/CopyButton";
import { InfoCard } from "@/components/ui/InfoCard";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface CVEDetailProps {
  cveData: any;
  onBack: () => void;
}

export function CVEDetail({ cveData, onBack }: CVEDetailProps) {
  const cve = cveData.cve;
  if (!cve) return null;

  const id = cve.id;
  const description = cve.descriptions.find((d: any) => d.lang === "en")?.value || "No description available.";
  const published = new Date(cve.published).toLocaleDateString();
  const modified = new Date(cve.lastModified).toLocaleDateString();

  let cvssData = null;
  const metrics = cve.metrics;
  if (metrics?.cvssMetricV31) cvssData = metrics.cvssMetricV31[0].cvssData;
  else if (metrics?.cvssMetricV30) cvssData = metrics.cvssMetricV30[0].cvssData;

  const weaknesses = cve.weaknesses?.map((w: any) => w.description[0].value) || [];
  const references = cve.references || [];

  return (
    <div className="bg-bg-card border border-border-dim rounded-xl p-6 lg:p-8">
      <button onClick={onBack} className="text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors">
        ← Back to search results
      </button>

      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
         <div className="flex items-center gap-4">
             <h2 className="text-3xl md:text-4xl font-mono font-bold text-accent-cyan drop-shadow-glow-cyan">{id}</h2>
             <CopyButton text={id} className="p-2" />
         </div>
         <CVSSBadge score={cvssData?.baseScore} className="scale-125 origin-left md:origin-right" />
      </div>

      <div className="mb-8">
         <h3 className="text-sm text-text-secondary uppercase tracking-wider mb-2">Description</h3>
         <p className="text-text-primary leading-relaxed text-sm md:text-base">{description}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         <InfoCard label="Published" value={published} />
         <InfoCard label="Last Modified" value={modified} />
         <InfoCard label="CWE" value={weaknesses.join(", ")} />
         <InfoCard label="Base Severity" value={cvssData?.baseSeverity || "N/A"} />
      </div>

      {cvssData && (
         <div className="mb-8">
            <h3 className="text-sm text-text-secondary uppercase tracking-wider mb-4">CVSS Vector</h3>
            <div className="bg-bg-secondary p-4 rounded-lg font-mono text-sm text-text-primary border border-border-dim break-all">
               {cvssData.vectorString}
            </div>
         </div>
      )}

      {references.length > 0 && (
         <div>
            <h3 className="text-sm text-text-secondary uppercase tracking-wider mb-4">References</h3>
            <ul className="space-y-2">
               {references.map((ref: any, i: number) => (
                  <li key={i}>
                     <Link href={ref.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text-primary hover:text-accent-cyan transition-colors">
                        <ExternalLink size={14} className="flex-shrink-0" />
                        <span className="truncate">{ref.url}</span>
                     </Link>
                  </li>
               ))}
            </ul>
         </div>
      )}
    </div>
  );
}
