import { ScoreGauge } from "@/components/ui/ScoreGauge";

interface AbuseScoreProps {
  abuseData: any;
}

export function AbuseScore({ abuseData }: AbuseScoreProps) {
  if (!abuseData) return (
    <div className="bg-bg-card border border-border-dim rounded-xl p-6 flex items-center justify-center h-full min-h-[200px]">
       <span className="text-text-secondary">AbuseIPDB data unavailable</span>
    </div>
  );

  return (
    <div className="bg-bg-card border border-border-dim rounded-xl p-6 h-full flex flex-col items-center justify-center text-center">
      <h3 className="text-sm text-text-secondary uppercase tracking-wider mb-6 w-full text-left">Abuse Confidence Score</h3>
      
      <ScoreGauge score={abuseData.abuseConfidenceScore} size={160} />
      
      <div className="mt-6 grid grid-cols-2 gap-4 w-full">
        <div className="bg-bg-secondary p-3 rounded text-center">
          <p className="text-xs text-text-secondary uppercase mb-1">Total Reports</p>
          <p className="text-lg font-mono text-text-primary">{abuseData.totalReports}</p>
        </div>
        <div className="bg-bg-secondary p-3 rounded text-center">
          <p className="text-xs text-text-secondary uppercase mb-1">Last Reported</p>
          <p className="text-sm font-mono text-text-primary">
            {abuseData.lastReportedAt ? new Date(abuseData.lastReportedAt).toLocaleDateString() : 'Never'}
          </p>
        </div>
      </div>
    </div>
  );
}
