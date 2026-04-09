import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return new Response('Missing url', { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        Referer: 'https://www.webtoons.com/',
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!res.ok) {
      return new Response('Failed to fetch image', { status: 500 });
    }

    return new Response(res.body, {
      headers: {
        'Content-Type': res.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    console.log('🚀 GET err :- ', err);
    return new Response('Error fetching image', { status: 500 });
  }
}
