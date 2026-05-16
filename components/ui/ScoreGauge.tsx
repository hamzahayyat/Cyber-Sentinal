"use client";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: number;
  className?: string;
  invertColors?: boolean; // If true, higher is worse (e.g., abuse score). If false, lower is worse
}

export function ScoreGauge({ score, label, size = 120, className, invertColors = true }: ScoreGaugeProps) {
  const radius = (size - 10) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  let colorClass = "text-accent-green drop-shadow-glow-green";
  if (invertColors) {
    if (score >= 75) colorClass = "text-accent-red drop-shadow-glow-red";
    else if (score >= 25) colorClass = "text-accent-yellow";
  } else {
    if (score <= 25) colorClass = "text-accent-red drop-shadow-glow-red";
    else if (score <= 75) colorClass = "text-accent-yellow";
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-border-dim"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-1000 ease-out", colorClass)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-mono font-bold">{score}</span>
        </div>
      </div>
      {label && <span className="mt-2 text-sm text-text-secondary uppercase tracking-wider">{label}</span>}
    </div>
  );
}
