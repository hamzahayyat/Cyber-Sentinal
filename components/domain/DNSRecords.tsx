"use client";
import { DataTable } from "@/components/ui/DataTable";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DNSRecordsProps {
  dnsData: any;
}

export function DNSRecords({ dnsData }: DNSRecordsProps) {
  const [activeTab, setActiveTab] = useState<number>(1); // Default to A records (type 1)

  if (!dnsData || !dnsData.Answer) return null;

  // Type mapping based on standard DNS record types
  const types: Record<number, string> = {
    1: 'A',
    2: 'NS',
    5: 'CNAME',
    15: 'MX',
    16: 'TXT',
    28: 'AAAA'
  };

  const tabs = Object.keys(types).map(k => parseInt(k));
  const activeRecords = dnsData.Answer.filter((r: any) => r.type === activeTab);

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "TTL", accessorKey: "TTL" },
    { header: "Data", accessorKey: "data", cell: (r: any) => {
        let textClass = "";
        if (r.type === 16) {
           if (r.data.includes('v=spf1')) textClass = "text-accent-cyan";
           if (r.data.includes('v=DMARC1')) textClass = "text-accent-green";
        }
        return <span className={textClass}>{r.data}</span>;
    }},
  ];

  return (
    <div className="bg-bg-card border border-border-dim rounded-xl p-6 mt-6">
      <h3 className="text-lg font-display font-semibold text-text-primary mb-4">DNS Records</h3>
      
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
         {tabs.map((typeCode) => (
            <button
               key={typeCode}
               onClick={() => setActiveTab(typeCode)}
               className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-colors border",
                  activeTab === typeCode
                    ? "bg-accent-cyan/20 text-accent-cyan border-accent-cyan/50"
                    : "bg-bg-secondary text-text-secondary border-border-dim hover:text-text-primary"
               )}
            >
               {types[typeCode]}
            </button>
         ))}
      </div>

      <DataTable columns={columns} data={activeRecords} mono />
    </div>
  );
}
