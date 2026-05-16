import { DataTable } from "@/components/ui/DataTable";

interface OTXPulsesProps {
  otxData: any;
}

export function OTXPulses({ otxData }: OTXPulsesProps) {
  if (!otxData || !otxData.pulse_info || otxData.pulse_info.count === 0) {
    return null;
  }

  const pulses = otxData.pulse_info.pulses || [];

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Author", accessorKey: "author_name" },
    { header: "Date", accessorKey: "modified", cell: (p: any) => new Date(p.modified).toLocaleDateString() },
    { header: "Tags", accessorKey: "tags", cell: (p: any) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
            {p.tags.slice(0, 3).map((t: string) => (
                <span key={t} className="px-1.5 py-0.5 bg-bg-secondary text-text-secondary text-[10px] rounded truncate">{t}</span>
            ))}
            {p.tags.length > 3 && <span className="px-1.5 py-0.5 bg-bg-secondary text-text-secondary text-[10px] rounded">+{p.tags.length - 3}</span>}
        </div>
    )},
  ];

  return (
    <div className="bg-bg-card border border-border-dim rounded-xl p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-display font-semibold text-text-primary">AlienVault OTX Pulses</h3>
        <span className="px-2 py-1 bg-bg-secondary text-text-primary text-xs font-mono rounded-full">{otxData.pulse_info.count} Total Pulses</span>
      </div>

      <DataTable columns={columns} data={pulses} />
    </div>
  );
}
