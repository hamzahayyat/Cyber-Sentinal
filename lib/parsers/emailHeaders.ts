export interface ParsedHeader {
  name: string;
  value: string;
}

export interface EmailAuthResults {
  spf: 'PASS' | 'FAIL' | 'NONE' | 'SOFTFAIL' | 'NEUTRAL';
  dkim: 'PASS' | 'FAIL' | 'NONE';
  dmarc: 'PASS' | 'FAIL' | 'NONE';
}

export interface Hop {
  from: string;
  by: string;
  with: string;
  date: string;
  delayMs?: number;
}

export interface EmailAnalysis {
  headers: ParsedHeader[];
  auth: EmailAuthResults;
  hops: Hop[];
  sender: {
    from: string;
    replyTo: string;
    returnPath: string;
    messageId: string;
    originatingIp: string;
  };
}

export function parseEmailHeaders(rawHeaders: string): EmailAnalysis {
  const lines = rawHeaders.split(/\r?\n/);
  const headers: ParsedHeader[] = [];
  
  let currentHeader: ParsedHeader | null = null;

  for (const line of lines) {
    if (line.match(/^\s+/) && currentHeader) {
      // Continuation line
      currentHeader.value += ' ' + line.trim();
    } else {
      const match = line.match(/^([a-zA-Z0-9-]+):\s*(.*)$/);
      if (match) {
        if (currentHeader) headers.push(currentHeader);
        currentHeader = { name: match[1], value: match[2] };
      }
    }
  }
  if (currentHeader) headers.push(currentHeader);

  const getHeader = (name: string) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';
  const getAllHeaders = (name: string) => headers.filter(h => h.name.toLowerCase() === name.toLowerCase()).map(h => h.value);

  const authResults = getHeader('authentication-results');
  let spf: EmailAuthResults['spf'] = 'NONE';
  let dkim: EmailAuthResults['dkim'] = 'NONE';
  let dmarc: EmailAuthResults['dmarc'] = 'NONE';

  if (authResults.toLowerCase().includes('spf=pass')) spf = 'PASS';
  else if (authResults.toLowerCase().includes('spf=fail')) spf = 'FAIL';
  else if (authResults.toLowerCase().includes('spf=softfail')) spf = 'SOFTFAIL';
  else if (authResults.toLowerCase().includes('spf=neutral')) spf = 'NEUTRAL';

  if (authResults.toLowerCase().includes('dkim=pass')) dkim = 'PASS';
  else if (authResults.toLowerCase().includes('dkim=fail')) dkim = 'FAIL';

  if (authResults.toLowerCase().includes('dmarc=pass')) dmarc = 'PASS';
  else if (authResults.toLowerCase().includes('dmarc=fail')) dmarc = 'FAIL';

  const hops: Hop[] = getAllHeaders('received').map(received => {
    const fromMatch = received.match(/from\s+([^\s]+)/i);
    const byMatch = received.match(/by\s+([^\s]+)/i);
    const withMatch = received.match(/with\s+([^\s;]+)/i);
    const dateMatch = received.match(/;\s*(.*)$/);
    
    return {
      from: fromMatch ? fromMatch[1] : 'Unknown',
      by: byMatch ? byMatch[1] : 'Unknown',
      with: withMatch ? withMatch[1] : 'Unknown',
      date: dateMatch ? dateMatch[1].trim() : 'Unknown',
    };
  });

  return {
    headers,
    auth: { spf, dkim, dmarc },
    hops,
    sender: {
      from: getHeader('from'),
      replyTo: getHeader('reply-to'),
      returnPath: getHeader('return-path'),
      messageId: getHeader('message-id'),
      originatingIp: getHeader('x-originating-ip'),
    }
  };
}
