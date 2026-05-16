"use client";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (value: string) => void;
  className?: string;
  wrapperClassName?: string;
}

export function SearchInput({ onSearch, className, wrapperClassName, ...props }: SearchInputProps) {
  const [value, setValue] = useState(props.defaultValue?.toString() || "");
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(value);
    }
  };

  return (
    <div className={cn("relative flex items-center w-full group", wrapperClassName)}>
      <Search 
        className={cn(
          "absolute left-4 w-5 h-5 transition-colors duration-300", 
          isFocused ? "text-accent-cyan" : "text-text-secondary"
        )} 
      />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "w-full bg-bg-card border-b-2 border-border-dim text-text-primary pl-12 pr-4 py-3",
          "focus:outline-none focus:border-accent-cyan focus:shadow-[0_4px_14px_0_rgba(0,212,255,0.1)] focus:bg-bg-hover",
          "font-mono transition-all duration-300 placeholder:text-text-secondary/50",
          className
        )}
        {...props}
      />
      {isFocused && (
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-accent-cyan animate-pulse"></div>
      )}
    </div>
  );
}
