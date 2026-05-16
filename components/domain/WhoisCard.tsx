import { InfoCard } from "@/components/ui/InfoCard";

interface WhoisCardProps {
  whoisData: any;
}

export function WhoisCard({ whoisData }: WhoisCardProps) {
  if (!whoisData || !whoisData.domain) return null;

  return (
    <div className="bg-bg-card border border-border-dim rounded-xl p-6 h-full">
      <h3 className="text-lg font-display font-semibold text-text-primary mb-6">Whois Registration</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard label="Registrar" value={whoisData.registrar?.name} />
        <InfoCard label="Created Date" value={whoisData.domain?.created_date ? new Date(whoisData.domain.created_date).toLocaleDateString() : 'N/A'} />
        <InfoCard label="Expiry Date" value={whoisData.domain?.expiration_date ? new Date(whoisData.domain.expiration_date).toLocaleDateString() : 'N/A'} />
        <InfoCard label="Registrant Country" value={whoisData.registrant?.country || 'Redacted'} />
      </div>

      <div className="mt-4">
        <h4 className="text-xs text-text-secondary uppercase mb-2">Name Servers</h4>
        <div className="bg-bg-secondary p-3 rounded-lg text-sm font-mono text-text-primary">
          {whoisData.domain?.name_servers?.join(', ') || 'N/A'}
        </div>
      </div>
    </div>
  );
}
