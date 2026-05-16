import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: 'Domain or URL is required' } }, { status: 400 });
  }

  const isUrl = query.startsWith('http://') || query.startsWith('https://');
  const domain = isUrl ? new URL(query).hostname : query;

  try {
    const vtHeaders = process.env.VT_API_KEY ? { 'x-apikey': process.env.VT_API_KEY } : undefined;

    const [vtRes, whoisRes, dnsRes, otxRes] = await Promise.allSettled([
      vtHeaders ? fetch(`https://www.virustotal.com/api/v3/domains/${domain}`, { headers: vtHeaders }).then(res => res.json()) : Promise.resolve(null),
      process.env.WHOIS_API_KEY ? fetch(`https://whoisjsonapi.com/v1/${domain}`, {
        headers: { 'Authorization': `Bearer ${process.env.WHOIS_API_KEY}` }
      }).then(res => res.json()) : Promise.resolve(null),
      fetch(`https://dns.google/resolve?name=${domain}&type=ANY`).then(res => res.json()),
      process.env.OTX_API_KEY ? fetch(`https://otx.alienvault.com/api/v1/indicators/domain/${domain}/general`, {
        headers: { 'X-OTX-API-KEY': process.env.OTX_API_KEY }
      }).then(res => res.json()) : Promise.resolve(null)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        vt: vtRes.status === 'fulfilled' ? vtRes.value?.data : null,
        whois: whoisRes.status === 'fulfilled' ? whoisRes.value : null,
        dns: dnsRes.status === 'fulfilled' ? dnsRes.value : null,
        otx: otxRes.status === 'fulfilled' ? otxRes.value : null
      }
    });

  } catch (error) {
    console.error('Domain API Error:', error);
    return NextResponse.json({ success: false, error: { code: 'API_ERROR', message: 'Failed to fetch Domain data' } }, { status: 500 });
  }
}
