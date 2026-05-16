import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ip = searchParams.get('address');

  if (!ip) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: 'IP address is required' } }, { status: 400 });
  }

  try {
    const [ipapiRes, abuseipdbRes, shodanRes, otxRes] = await Promise.allSettled([
      fetch(`http://ip-api.com/json/${ip}`).then(res => res.json()),
      process.env.ABUSEIPDB_API_KEY ? fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}`, {
        headers: { 'Key': process.env.ABUSEIPDB_API_KEY, 'Accept': 'application/json' }
      }).then(res => res.json()) : Promise.resolve(null),
      process.env.SHODAN_API_KEY ? fetch(`https://api.shodan.io/shodan/host/${ip}?key=${process.env.SHODAN_API_KEY}`).then(res => res.json()) : Promise.resolve(null),
      process.env.OTX_API_KEY ? fetch(`https://otx.alienvault.com/api/v1/indicators/IPv4/${ip}/general`, {
        headers: { 'X-OTX-API-KEY': process.env.OTX_API_KEY }
      }).then(res => res.json()) : Promise.resolve(null)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        geo: ipapiRes.status === 'fulfilled' ? ipapiRes.value : null,
        abuse: abuseipdbRes.status === 'fulfilled' && abuseipdbRes.value ? abuseipdbRes.value.data : null,
        shodan: shodanRes.status === 'fulfilled' && !shodanRes.value?.error ? shodanRes.value : null,
        otx: otxRes.status === 'fulfilled' ? otxRes.value : null
      }
    });

  } catch (error) {
    console.error('IP API Error:', error);
    return NextResponse.json({ success: false, error: { code: 'API_ERROR', message: 'Failed to fetch IP data' } }, { status: 500 });
  }
}
