import { cn } from "@/lib/utils";

type ThreatLevel = "MALICIOUS" | "CLEAN" | "SUSPICIOUS" | "UNKNOWN";

interface ThreatBadgeProps {
  level: ThreatLevel;
  className?: string;
}

export function ThreatBadge({ level, className }: ThreatBadgeProps) {
  const styles = {
    MALICIOUS: "bg-accent-red/20 text-accent-red border-accent-red/50 shadow-glow-red",
    CLEAN: "bg-accent-green/20 text-accent-green border-accent-green/50 shadow-glow-green",
    SUSPICIOUS: "bg-accent-yellow/20 text-accent-yellow border-accent-yellow/50",
    UNKNOWN: "bg-text-secondary/20 text-text-secondary border-text-secondary/50",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border",
        styles[level],
        className
      )}
    >
      {level}
    </span>
  );
}
