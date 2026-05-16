"use client";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "p-1.5 rounded transition-all duration-200 border",
        copied 
          ? "bg-accent-green/20 text-accent-green border-accent-green/50 shadow-glow-green" 
          : "bg-bg-secondary text-text-secondary border-border-dim hover:text-accent-cyan hover:border-accent-cyan/50 hover:shadow-glow-cyan",
        className
      )}
      title="Copy to clipboard"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}
