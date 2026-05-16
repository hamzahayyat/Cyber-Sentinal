import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  title = "No Data Found", 
  description = "There are no results to display for this query.", 
  icon = <AlertCircle size={48} />, 
  className 
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center border border-dashed border-border-dim rounded-xl bg-bg-card/50", className)}>
      <div className="text-text-secondary/50 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-display text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-md">
        {description}
      </p>
    </div>
  );
}
