"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useState } from "react";
import { parseEmailHeaders, EmailAnalysis } from "@/lib/parsers/emailHeaders";
import { AuthResults } from "@/components/email/AuthResults";
import { HopTimeline } from "@/components/email/HopTimeline";
import { HeaderParser } from "@/components/email/HeaderParser";
import { InfoCard } from "@/components/ui/InfoCard";
import { MailOpen } from "lucide-react";

export default function EmailPage() {
  const [rawInput, setRawInput] = useState("");
  const [analysis, setAnalysis] = useState<EmailAnalysis | null>(null);

  const handleAnalyze = () => {
    if (!rawInput.trim()) return;
    const parsed = parseEmailHeaders(rawInput);
    setAnalysis(parsed);
  };

  const handleClear = () => {
    setRawInput("");
    setAnalysis(null);
  };

  return (
    <PageWrapper>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <h1 className="font-display text-3xl font-bold mb-2 text-text-primary">Email Header Analyzer</h1>
           <p className="text-text-secondary text-sm">Detect spoofing, trace routing hops, and check SPF/DKIM/DMARC locally.</p>
        </div>
      </div>

      {!analysis ? (
         <div className="bg-bg-card border border-border-dim rounded-xl p-1 shadow-xl flex flex-col h-[60vh] min-h-[400px]">
            <div className="flex justify-between items-center px-4 py-3 border-b border-border-dim bg-bg-secondary/50">
               <div className="flex items-center gap-2 text-text-secondary text-sm font-mono">
                  <MailOpen size={16} /> Paste Raw Headers
               </div>
               <button 
                  onClick={handleAnalyze}
                  disabled={!rawInput.trim()}
                  className="px-4 py-1.5 bg-accent-cyan text-bg-primary font-bold text-sm rounded hover:bg-accent-cyan/90 disabled:opacity-50 transition-colors"
               >
                  Analyze Headers
               </button>
            </div>
            <textarea 
               value={rawInput}
               onChange={(e) => setRawInput(e.target.value)}
               placeholder="Return-Path: <sender@example.com>&#10;Received: from mail.example.com...&#10;Authentication-Results: mx.google.com; spf=pass..."
               className="flex-1 w-full bg-transparent p-4 text-sm font-mono text-text-primary focus:outline-none resize-none custom-scrollbar placeholder:text-text-secondary/30"
            />
         </div>
      ) : (
         <div className="space-y-6">
            <div className="flex justify-between items-center">
               <h2 className="text-xl font-display font-bold text-accent-cyan">Analysis Complete</h2>
               <button onClick={handleClear} className="text-sm text-text-secondary hover:text-text-primary underline">Analyze Another</button>
            </div>

            <AuthResults auth={analysis.auth} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="space-y-6">
                  <div className="bg-bg-card border border-border-dim rounded-xl p-6">
                     <h3 className="text-lg font-display font-semibold text-text-primary mb-6">Sender Details</h3>
                     <div className="grid grid-cols-1 gap-4">
                        <InfoCard label="From" value={analysis.sender.from} />
                        <InfoCard 
                           label="Reply-To" 
                           value={analysis.sender.replyTo} 
                           className={analysis.sender.replyTo && analysis.sender.replyTo !== analysis.sender.from ? "border-accent-yellow shadow-[0_0_10px_rgba(255,204,0,0.2)]" : ""} 
                        />
                        <InfoCard label="Return-Path" value={analysis.sender.returnPath} />
                        <InfoCard label="Originating IP" value={analysis.sender.originatingIp} mono />
                        <InfoCard label="Message-ID" value={analysis.sender.messageId} mono />
                     </div>
                  </div>
               </div>

               <HopTimeline hops={analysis.hops} />
            </div>

            <HeaderParser headers={analysis.headers} />
         </div>
      )}

    </PageWrapper>
  );
}
