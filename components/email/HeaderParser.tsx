"use client";
import { DataTable } from "@/components/ui/DataTable";
import { ParsedHeader } from "@/lib/parsers/emailHeaders";
import { useState } from "react";
import { Search } from "lucide-react";

interface HeaderParserProps {
  headers: ParsedHeader[];
}

export function HeaderParser({ headers }: HeaderParserProps) {
  const [filter, setFilter] = useState("");

  const filteredHeaders = headers.filter(h => 
    h.name.toLowerCase().includes(filter.toLowerCase()) || 
    h.value.toLowerCase().includes(filter.toLowerCase())
  );

  const columns = [
    { header: "Header Name", accessorKey: "name", cell: (r: any) => <span className="font-bold text-accent-cyan">{r.name}</span> },
    { header: "Value", accessorKey: "value", cell: (r: any) => <div className="break-words max-w-2xl">{r.value}</div> }
  ];

  return (
    <div className="bg-bg-card border border-border-dim rounded-xl p-6 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-display font-semibold text-text-primary">Raw Headers</h3>
        
        <div className="relative w-full sm:w-64">
           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
           <input 
              type="text" 
              placeholder="Filter headers..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-bg-secondary border border-border-dim rounded-lg py-1.5 pl-9 pr-3 text-sm focus:border-accent-cyan focus:outline-none"
           />
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
         <DataTable columns={columns} data={filteredHeaders} mono />
      </div>
    </div>
  );
}
