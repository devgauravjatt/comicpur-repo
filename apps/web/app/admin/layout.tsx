import honoClient from '@/hono/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get('token')?.value;
  const res = await honoClient.api.v1.admin.check.$get(
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  const admins = await res.json();

  if (!admins.access) {
    return redirect('/');
  }

  return <section>{children}</section>;
}
