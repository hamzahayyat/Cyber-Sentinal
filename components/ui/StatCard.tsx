"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, icon, className }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalMilSecDur = 1000;
    let incrementTime = (totalMilSecDur / end) * 2;
    
    // limit max increments to avoid performance hit
    const step = Math.max(1, Math.floor(end / 60));

    let timer = setInterval(() => {
      start += step;
      if (start > end) start = end;
      setDisplayValue(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-bg-card border border-border-dim rounded-xl p-6 relative overflow-hidden group hover:border-border-glow hover:shadow-glow-cyan transition-all duration-300", className)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-text-secondary text-sm font-medium tracking-wide">{title}</h3>
        {icon && <div className="text-accent-cyan opacity-50 group-hover:opacity-100 transition-opacity">{icon}</div>}
      </div>
      <div className="text-4xl font-display font-bold text-text-primary">
        {displayValue.toLocaleString()}
      </div>
      <div className="absolute bottom-0 left-0 h-1 bg-accent-cyan/20 w-full">
        <div className="h-full bg-accent-cyan" style={{ width: '100%', opacity: 0.5 }}></div>
      </div>
    </motion.div>
  );
}
