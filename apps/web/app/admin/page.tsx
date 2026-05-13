import ComicsTable from '@/components/manage-comics';
import { SectionCards } from '@/components/section-cards';
import { Button } from '@/components/ui/button';
import honoClient from '@/hono/client';
import { cacheLife } from 'next/cache';
import { cookies } from 'next/headers';
import Link from 'next/link';

async function getHomeStatus(token: string) {
  'use cache';
  cacheLife('hours');
  const res = await honoClient.api.v1.admin.status
    .$get(
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    .then((res) => {
      return res.json();
    });

  return res;
}

export default async function Admin() {
  const token = (await cookies()).get('token')?.value;

  const homeStatus = await getHomeStatus(token || '');

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards homeStatus={homeStatus.data} />
        <div className="space-y-6 p-4 md:p-6">
          <h2>Manage More Options</h2>
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/admin/premium">
              <Button> Manage Premium </Button>
            </Link>
          </div>
        </div>
        <ComicsTable />
      </div>
    </div>
  );
}
