import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const id = searchParams.get('id');

  if (!keyword && !id) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: 'Either keyword or id is required' } }, { status: 400 });
  }

  try {
    let url = 'https://services.nvd.nist.gov/rest/json/cves/2.0?';
    if (id) {
        url += `cveId=${encodeURIComponent(id)}`;
    } else if (keyword) {
        url += `keywordSearch=${encodeURIComponent(keyword)}&resultsPerPage=20`;
    }

    const nvdRes = await fetch(url, {
      headers: process.env.NVD_API_KEY ? { 'apiKey': process.env.NVD_API_KEY } : {}
    });

    if (nvdRes.status === 403) {
         return NextResponse.json({ success: false, error: { code: 'RATE_LIMITED', message: 'NVD API rate limit exceeded' } }, { status: 429 });
    }
    
    if (!nvdRes.ok) throw new Error(`NVD API responded with status ${nvdRes.status}`);
    
    const data = await nvdRes.json();

    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('CVE API Error:', error);
    return NextResponse.json({ success: false, error: { code: 'API_ERROR', message: 'Failed to fetch CVE data' } }, { status: 500 });
  }
}
