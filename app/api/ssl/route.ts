import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: 'Domain is required' } }, { status: 400 });
  }

  domain = domain.replace(/^https?:\/\//, '').split('/')[0];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const crtRes = await fetch(`https://crt.sh/?q=${encodeURIComponent(domain)}&output=json`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!crtRes.ok) throw new Error(`crt.sh API responded with status ${crtRes.status}`);

    const data = await crtRes.json();

    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error: any) {
    console.error('SSL API Error:', error);
    if (error.name === 'AbortError') {
       return NextResponse.json({ success: false, error: { code: 'TIMEOUT', message: 'crt.sh API timed out' } }, { status: 504 });
    }
    return NextResponse.json({ success: false, error: { code: 'API_ERROR', message: 'Failed to fetch SSL data' } }, { status: 500 });
  }
}
