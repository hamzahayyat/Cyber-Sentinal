import { cn } from "@/lib/utils";

interface InfoCardProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  mono?: boolean;
}

export function InfoCard({ label, value, className, mono = false }: InfoCardProps) {
  return (
    <div className={cn("flex flex-col bg-bg-secondary p-4 rounded-lg border border-border-dim hover:border-border-glow hover:shadow-glow-cyan transition-all duration-300", className)}>
      <span className="text-xs text-text-secondary uppercase tracking-wider mb-1">{label}</span>
      <span className={cn("text-text-primary text-sm", mono && "font-mono")}>
        {value || <span className="text-text-secondary/50 italic">N/A</span>}
      </span>
    </div>
  );
}
