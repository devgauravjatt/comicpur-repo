import { NextResponse } from 'next/server';
import honoClient from '@/hono/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const token = searchParams.get('token');

  if (!token) {
    return new Response('Invalid authentication!', { status: 400 });
  }

  const res = await honoClient.api.v1.auth.check.$post({
    json: {
      accessToken: token,
    },
  });
  const data = await res.json();

  if (!data.success) {
    return new Response('Invalid authentication!', { status: 400 });
  }

  const response = NextResponse.redirect(new URL('/', request.url));

  response.cookies.set({
    value: token,
    name: 'token',
    path: '/',
    secure: true,
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  return response;
}
