import { DataTable } from "@/components/ui/DataTable";

interface ShodanPortsProps {
  shodanData: any;
}

export function ShodanPorts({ shodanData }: ShodanPortsProps) {
  if (!shodanData || !shodanData.ports || shodanData.ports.length === 0) {
    return null;
  }

  // Shodan's open ports are often summarized in `shodanData.data` array which has port, transport, module/service
  const portList = shodanData.data?.map((p: any) => ({
    port: p.port,
    protocol: p.transport,
    service: p._shodan?.module || p.product || 'unknown',
    banner: p.data?.substring(0, 100).replace(/\n/g, ' ') || 'No banner'
  })) || [];

  const columns = [
    { header: "Port", accessorKey: "port", sortable: true },
    { header: "Protocol", accessorKey: "protocol" },
    { header: "Service", accessorKey: "service" },
    { header: "Banner (Truncated)", accessorKey: "banner" },
  ];

  return (
    <div className="bg-bg-card border border-border-dim rounded-xl p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-display font-semibold text-text-primary">Shodan Open Ports</h3>
        <span className="text-xs text-text-secondary">Last scanned: {new Date(shodanData.last_update).toLocaleDateString()}</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
         {shodanData.hostnames?.map((h: string) => (
            <span key={h} className="px-2 py-1 bg-bg-secondary text-text-secondary text-xs font-mono rounded border border-border-dim">{h}</span>
         ))}
         {shodanData.tags?.map((t: string) => (
            <span key={t} className="px-2 py-1 bg-accent-purple/20 text-accent-purple text-xs font-mono rounded border border-accent-purple/50">{t}</span>
         ))}
      </div>

      <DataTable columns={columns} data={portList} mono />
    </div>
  );
}
