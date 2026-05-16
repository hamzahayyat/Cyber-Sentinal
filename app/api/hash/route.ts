import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get('hash');

  if (!hash) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: 'Hash is required' } }, { status: 400 });
  }

  try {
    if (!process.env.VT_API_KEY) {
       return NextResponse.json({ success: false, error: { code: 'NO_API_KEY', message: 'VT_API_KEY is not configured' } }, { status: 500 });
    }

    const vtRes = await fetch(`https://www.virustotal.com/api/v3/files/${hash}`, {
      headers: { 'x-apikey': process.env.VT_API_KEY }
    });

    if (!vtRes.ok) {
        if (vtRes.status === 404) {
            return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Hash not found in VirusTotal database' } }, { status: 404 });
        }
        throw new Error(`VT API responded with status ${vtRes.status}`);
    }

    const data = await vtRes.json();

    return NextResponse.json({
      success: true,
      data: data.data
    });

  } catch (error) {
    console.error('Hash API Error:', error);
    return NextResponse.json({ success: false, error: { code: 'API_ERROR', message: 'Failed to fetch Hash data' } }, { status: 500 });
  }
}
