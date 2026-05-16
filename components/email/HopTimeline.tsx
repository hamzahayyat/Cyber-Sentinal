import { Hop } from "@/lib/parsers/emailHeaders";
import { Server, ArrowDown } from "lucide-react";

interface HopTimelineProps {
  hops: Hop[];
}

export function HopTimeline({ hops }: HopTimelineProps) {
  if (!hops || hops.length === 0) return null;

  return (
    <div className="bg-bg-card border border-border-dim rounded-xl p-6 h-full">
      <h3 className="text-lg font-display font-semibold text-text-primary mb-6">Hop Timeline</h3>
      
      <div className="space-y-0 pl-2">
        {hops.map((hop, index) => (
          <div key={index} className="relative pl-8 pb-8 last:pb-0">
            {/* Connecting Line */}
            {index !== hops.length - 1 && (
               <div className="absolute left-3.5 top-8 bottom-0 w-px bg-border-dim"></div>
            )}
            
            {/* Node Icon */}
            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-bg-secondary border border-border-dim flex items-center justify-center text-text-secondary z-10">
               <Server size={14} />
            </div>

            <div className="bg-bg-secondary border border-border-dim rounded-lg p-4 ml-4">
               <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                  <div className="font-mono text-sm text-text-primary break-all">
                     <span className="text-text-secondary uppercase text-xs mr-2">From</span> 
                     {hop.from}
                  </div>
                  <div className="text-xs text-text-secondary whitespace-nowrap">{hop.date}</div>
               </div>
               
               <div className="flex items-center gap-2 text-text-secondary my-2 pl-4">
                  <ArrowDown size={14} className="text-accent-cyan" />
               </div>

               <div className="font-mono text-sm text-text-primary break-all">
                  <span className="text-text-secondary uppercase text-xs mr-2">By</span> 
                  {hop.by}
               </div>

               <div className="mt-3 pt-3 border-t border-border-dim/50 text-xs text-text-secondary font-mono truncate">
                  <span className="uppercase mr-2">With</span> {hop.with}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
