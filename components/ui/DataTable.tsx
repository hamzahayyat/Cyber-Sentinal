"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  mono?: boolean;
}

export function DataTable<T>({ columns, data, className, mono = false }: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const sortedData = [...data].sort((a: any, b: any) => {
    if (!sortConfig) return 0;
    const aValue = sortConfig.key.split('.').reduce((o, i) => o?.[i], a);
    const bValue = sortConfig.key.split('.').reduce((o, i) => o?.[i], b);

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className={cn("overflow-x-auto border border-border-dim rounded-lg bg-bg-card", className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-dim bg-bg-secondary">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={cn(
                  "p-3 text-xs uppercase tracking-wider text-text-secondary font-medium",
                  col.sortable && "cursor-pointer hover:text-text-primary select-none"
                )}
                onClick={() => col.sortable && handleSort(col.accessorKey as string)}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <span className="text-border-dim hover:text-text-secondary">
                      {sortConfig?.key === col.accessorKey ? (
                        sortConfig.direction === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      ) : (
                        <ArrowUpDown size={14} />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={cn("text-sm", mono && "font-mono")}>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-text-secondary">
                No data available
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-border-dim/50 hover:bg-bg-hover transition-colors"
              >
                {columns.map((col, colIndex) => {
                  const val = col.accessorKey.toString().split('.').reduce((o, i) => o?.[i], row as any);
                  return (
                    <td key={colIndex} className="p-3 text-text-primary">
                      {col.cell ? col.cell(row) : (val !== undefined && val !== null ? String(val) : '-')}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
