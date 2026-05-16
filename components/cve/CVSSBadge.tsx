import { cn } from "@/lib/utils";

interface CVSSBadgeProps {
  score: number | null;
  className?: string;
}

export function CVSSBadge({ score, className }: CVSSBadgeProps) {
  if (score === null || score === undefined) {
    return <span className={cn("px-2 py-0.5 bg-bg-secondary text-text-secondary border border-border-dim rounded text-xs font-mono", className)}>N/A</span>;
  }

  let colorClass = "bg-border-dim text-text-secondary border-border-dim";
  let label = "NONE";

  if (score >= 9.0) {
    colorClass = "bg-accent-red/20 text-accent-red border-accent-red/50 shadow-glow-red";
    label = "CRITICAL";
  } else if (score >= 7.0) {
    colorClass = "bg-[#ff7b00]/20 text-[#ff7b00] border-[#ff7b00]/50"; // Orange
    label = "HIGH";
  } else if (score >= 4.0) {
    colorClass = "bg-accent-yellow/20 text-accent-yellow border-accent-yellow/50";
    label = "MEDIUM";
  } else if (score >= 0.1) {
    colorClass = "bg-accent-green/20 text-accent-green border-accent-green/50";
    label = "LOW";
  }

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
       <span className="font-mono font-bold text-sm">{score.toFixed(1)}</span>
       <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border", colorClass)}>
         {label}
       </span>
    </div>
  );
}
