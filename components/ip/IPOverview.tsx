import { InfoCard } from "@/components/ui/InfoCard";
import { CopyButton } from "@/components/ui/CopyButton";

interface IPOverviewProps {
  ip: string;
  geoData: any;
}

export function IPOverview({ ip, geoData }: IPOverviewProps) {
  if (!geoData) return null;

  return (
    <div className="bg-bg-card border border-border-dim rounded-xl p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-sm text-text-secondary uppercase tracking-wider mb-1">Target IP Address</h2>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-mono font-bold text-accent-cyan drop-shadow-glow-cyan">{ip}</span>
            <CopyButton text={ip} />
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 text-xl mb-1">
             <span>{geoData.country}</span>
             <span className="text-2xl" title={geoData.country}>
               {geoData.countryCode ? `fi fi-${geoData.countryCode.toLowerCase()}` : '🌐'}
             </span>
          </div>
          <p className="text-text-secondary text-sm">{geoData.city}, {geoData.regionName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard label="ISP" value={geoData.isp} />
        <InfoCard label="Organization" value={geoData.org} />
        <InfoCard label="ASN" value={geoData.as} mono />
        <InfoCard label="Coordinates" value={`${geoData.lat}, ${geoData.lon}`} mono />
      </div>

      <div className="mt-4 flex gap-2">
         {geoData.hosting && <span className="px-3 py-1 bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/50 rounded-full text-xs font-mono">HOSTING</span>}
         {geoData.proxy && <span className="px-3 py-1 bg-accent-red/20 text-accent-red border border-accent-red/50 rounded-full text-xs font-mono">PROXY/VPN</span>}
      </div>
    </div>
  );
}
