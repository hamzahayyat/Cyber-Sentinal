import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ip = searchParams.get('ip');

  if (!ip) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: 'IP address is required' } }, { status: 400 });
  }

  try {
    const htRes = await fetch(`https://api.hackertarget.com/nmap/?q=${encodeURIComponent(ip)}`);
    
    if (!htRes.ok) throw new Error(`HackerTarget API responded with status ${htRes.status}`);

    const text = await htRes.text();
    
    if (text.includes("API count exceeded")) {
        return NextResponse.json({ success: false, error: { code: 'RATE_LIMITED', message: 'HackerTarget daily free limit exceeded' } }, { status: 429 });
    }

    // Parse simple text output
    const lines = text.split('\n');
    const ports = [];
    let startParsing = false;

    for (const line of lines) {
        if (line.includes('PORT') && line.includes('STATE') && line.includes('SERVICE')) {
            startParsing = true;
            continue;
        }
        if (startParsing && line.trim() && !line.startsWith('Nmap done') && !line.startsWith('MAC Address') && !line.startsWith('Service Info')) {
            const match = line.match(/^(\d+\/[a-z]+)\s+([a-zA-Z]+)\s+(.*)$/);
            if (match) {
                 ports.push({
                     port_protocol: match[1],
                     state: match[2],
                     service: match[3]
                 });
            }
        }
    }

    return NextResponse.json({
      success: true,
      data: { raw: text, parsed: ports }
    });

  } catch (error) {
    console.error('Ports API Error:', error);
    return NextResponse.json({ success: false, error: { code: 'API_ERROR', message: 'Failed to fetch Ports data' } }, { status: 500 });
  }
}
