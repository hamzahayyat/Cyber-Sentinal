import { EmailAuthResults } from "@/lib/parsers/emailHeaders";
import { cn } from "@/lib/utils";
import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";

interface AuthResultsProps {
  auth: EmailAuthResults;
}

export function AuthResults({ auth }: AuthResultsProps) {
  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'PASS':
        return { color: 'text-accent-green bg-accent-green/10 border-accent-green/50 shadow-glow-green', icon: <ShieldCheck size={32} /> };
      case 'FAIL':
      case 'SOFTFAIL':
        return { color: 'text-accent-red bg-accent-red/10 border-accent-red/50 shadow-glow-red', icon: <ShieldAlert size={32} /> };
      default:
        return { color: 'text-text-secondary bg-bg-secondary border-border-dim', icon: <Shield size={32} /> };
    }
  };

  const spf = getStatusDisplay(auth.spf);
  const dkim = getStatusDisplay(auth.dkim);
  const dmarc = getStatusDisplay(auth.dmarc);

  return (
    <div className="bg-bg-card border border-border-dim rounded-xl p-6 mb-6">
      <h3 className="text-lg font-display font-semibold text-text-primary mb-6">Authentication Results</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* SPF */}
         <div className={cn("border rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all", spf.color)}>
            <div className="mb-4">{spf.icon}</div>
            <h4 className="font-display font-bold text-xl mb-1">SPF</h4>
            <span className="font-mono font-bold tracking-widest">{auth.spf}</span>
            <p className="text-xs mt-3 opacity-80 max-w-[200px]">Sender Policy Framework verifies the sender IP is authorized.</p>
         </div>

         {/* DKIM */}
         <div className={cn("border rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all", dkim.color)}>
            <div className="mb-4">{dkim.icon}</div>
            <h4 className="font-display font-bold text-xl mb-1">DKIM</h4>
            <span className="font-mono font-bold tracking-widest">{auth.dkim}</span>
            <p className="text-xs mt-3 opacity-80 max-w-[200px]">DomainKeys Identified Mail ensures content hasn&apos;t been tampered with.</p>
         </div>

         {/* DMARC */}
         <div className={cn("border rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all", dmarc.color)}>
            <div className="mb-4">{dmarc.icon}</div>
            <h4 className="font-display font-bold text-xl mb-1">DMARC</h4>
            <span className="font-mono font-bold tracking-widest">{auth.dmarc}</span>
            <p className="text-xs mt-3 opacity-80 max-w-[200px]">Uses SPF and DKIM to provide strict domain level protection.</p>
         </div>
      </div>
    </div>
  );
}
