"use client";
import { DataTable } from "@/components/ui/DataTable";
import { useState } from "react";

interface CertHistoryProps {
  certs: any[];
}

export function CertHistory({ certs }: CertHistoryProps) {
  const [page, setPage] = useState(0);
  const pageSize = 25;
  
  if (!certs || certs.length === 0) return null;

  const totalPages = Math.ceil(certs.length / pageSize);
  const paginatedCerts = certs.slice(page * pageSize, (page + 1) * pageSize);

  const columns = [
    { header: "Logged Date", accessorKey: "entry_timestamp", cell: (r: any) => new Date(r.entry_timestamp).toLocaleDateString() },
    { header: "Not Before", accessorKey: "not_before", cell: (r: any) => new Date(r.not_before).toLocaleDateString() },
    { header: "Not After", accessorKey: "not_after", cell: (r: any) => new Date(r.not_after).toLocaleDateString() },
    { header: "Issuer", accessorKey: "issuer_name", cell: (r: any) => {
        const org = r.issuer_name.split(',').find((s:string) => s.includes('O='))?.replace('O=', '');
        return org || "Unknown CA";
    }},
    { header: "Common Name", accessorKey: "common_name" },
  ];

  return (
    <div className="bg-bg-card border border-border-dim rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-display font-semibold text-text-primary">Certificate History</h3>
        <span className="text-xs text-text-secondary">{certs.length} records found</span>
      </div>

      <DataTable columns={columns} data={paginatedCerts} />

      {totalPages > 1 && (
         <div className="mt-4 flex justify-between items-center border-t border-border-dim pt-4">
            <button 
               disabled={page === 0}
               onClick={() => setPage(p => p - 1)}
               className="px-3 py-1 bg-bg-secondary text-text-primary border border-border-dim rounded disabled:opacity-50 text-sm"
            >
               Previous
            </button>
            <span className="text-xs text-text-secondary">Page {page + 1} of {totalPages}</span>
            <button 
               disabled={page >= totalPages - 1}
               onClick={() => setPage(p => p + 1)}
               className="px-3 py-1 bg-bg-secondary text-text-primary border border-border-dim rounded disabled:opacity-50 text-sm"
            >
               Next
            </button>
         </div>
      )}
    </div>
  );
}
