import { InfoCard } from "@/components/ui/InfoCard";
import { CopyButton } from "@/components/ui/CopyButton";

interface HashMetadataProps {
  hashData: any;
}

export function HashMetadata({ hashData }: HashMetadataProps) {
  if (!hashData || !hashData.attributes) return null;

  const attr = hashData.attributes;

  return (
    <div className="bg-bg-card border border-border-dim rounded-xl p-6 h-full">
      <h3 className="text-lg font-display font-semibold text-text-primary mb-6">File Identity</h3>
      
      <div className="space-y-4 mb-6">
         <div>
            <div className="flex justify-between items-center mb-1">
               <span className="text-xs text-text-secondary uppercase">MD5</span>
               <CopyButton text={attr.md5} className="p-1" />
            </div>
            <div className="bg-bg-secondary p-2 rounded text-xs font-mono text-text-primary truncate">{attr.md5}</div>
         </div>
         <div>
            <div className="flex justify-between items-center mb-1">
               <span className="text-xs text-text-secondary uppercase">SHA-1</span>
               <CopyButton text={attr.sha1} className="p-1" />
            </div>
            <div className="bg-bg-secondary p-2 rounded text-xs font-mono text-text-primary truncate">{attr.sha1}</div>
         </div>
         <div>
            <div className="flex justify-between items-center mb-1">
               <span className="text-xs text-text-secondary uppercase">SHA-256</span>
               <CopyButton text={attr.sha256} className="p-1" />
            </div>
            <div className="bg-bg-secondary p-2 rounded text-xs font-mono text-text-primary truncate">{attr.sha256}</div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <InfoCard label="File Type" value={attr.type_description || attr.magic} />
        <InfoCard label="File Size" value={`${(attr.size / 1024).toFixed(2)} KB`} />
        <InfoCard label="First Seen" value={attr.first_submission_date ? new Date(attr.first_submission_date * 1000).toLocaleDateString() : 'N/A'} />
        <InfoCard label="Last Seen" value={attr.last_submission_date ? new Date(attr.last_submission_date * 1000).toLocaleDateString() : 'N/A'} />
      </div>

      {attr.names && attr.names.length > 0 && (
         <div>
            <h4 className="text-xs text-text-secondary uppercase mb-2">Known File Names</h4>
            <div className="flex flex-wrap gap-2">
               {attr.names.slice(0, 8).map((name: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-bg-secondary text-text-primary text-[10px] font-mono rounded border border-border-dim truncate max-w-full">{name}</span>
               ))}
               {attr.names.length > 8 && <span className="px-2 py-1 text-[10px] text-text-secondary border border-transparent">+{attr.names.length - 8} more</span>}
            </div>
         </div>
      )}
    </div>
  );
}
