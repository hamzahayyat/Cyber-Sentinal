import { cn } from "@/lib/utils";

interface LoadingScannerProps {
  text?: string;
  className?: string;
}

export function LoadingScanner({ text = "SCANNING...", className }: LoadingScannerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <div className="relative w-48 h-1 bg-bg-secondary rounded overflow-hidden mb-4 border border-border-dim">
        <div className="absolute top-0 left-0 h-full w-full bg-accent-cyan/20"></div>
        <div className="absolute top-0 left-0 h-full w-1/3 bg-accent-cyan animate-scan shadow-glow-cyan"></div>
      </div>
      <span className="text-accent-cyan font-mono text-sm tracking-widest animate-pulse">{text}</span>
    </div>
  );
}
