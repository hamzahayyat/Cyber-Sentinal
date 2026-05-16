import { InfoCard } from "@/components/ui/InfoCard";
import { cn } from "@/lib/utils";

interface CertCardProps {
  cert: any;
}

export function CertCard({ cert }: CertCardProps) {
  if (!cert) return null;

  const validFrom = new Date(cert.not_before);
  const validTo = new Date(cert.not_after);
  const now = new Date();
  
  const daysRemaining = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 3600 * 24));
  
  let status = "VALID";
  let statusColor = "text-accent-green bg-accent-green/20 border-accent-green/50 shadow-glow-green";
  
  if (daysRemaining < 0) {
     status = "EXPIRED";
     statusColor = "text-accent-red bg-accent-red/20 border-accent-red/50 shadow-glow-red";
  } else if (daysRemaining < 30) {
     status = "EXPIRING SOON";
     statusColor = "text-accent-yellow bg-accent-yellow/20 border-accent-yellow/50";
  }

  const sans = cert.name_value ? cert.name_value.split('\n') : [];

  return (
    <div className="bg-bg-card border border-border-dim rounded-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
         <div>
            <h3 className="text-sm text-text-secondary uppercase tracking-wider mb-1">Subject Common Name</h3>
            <div className="text-2xl font-mono font-bold text-text-primary">{cert.common_name}</div>
         </div>
         <div className={cn("px-3 py-1 rounded-full text-xs font-bold tracking-wider border", statusColor)}>
            {status} ({daysRemaining} days left)
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
         <InfoCard label="Issuer" value={cert.issuer_name.split(',').find((s:string) => s.includes('O='))?.replace('O=', '') || cert.issuer_name} />
         <InfoCard label="Valid From" value={validFrom.toLocaleDateString()} />
         <InfoCard label="Valid To" value={validTo.toLocaleDateString()} />
         <InfoCard label="Serial Number" value={cert.serial_number} mono />
      </div>

      <div>
         <h4 className="text-xs text-text-secondary uppercase mb-2">Subject Alternative Names (SANs)</h4>
         <div className="flex flex-wrap gap-2">
            {sans.map((san: string, i: number) => {
               const isWildcard = san.startsWith('*.');
               return (
                  <span 
                     key={i} 
                     className={cn(
                        "px-2 py-1 text-[10px] font-mono rounded border",
                        isWildcard ? "bg-accent-purple/20 text-accent-purple border-accent-purple/50" : "bg-bg-secondary text-text-primary border-border-dim"
                     )}
                  >
                     {san}
                  </span>
               )
            })}
         </div>
      </div>
    </div>
  );
}
