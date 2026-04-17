import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default async function Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 py-6 md:py-10">
      <div className="px-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Chapters</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Manage Chapters</h1>
          </div>
          <Button asChild className="w-full rounded-xl sm:w-auto">
            <Link href={`/admin/create/premium`}>
              <Plus className="mr-2 h-4 w-4" />
              Create Premium
            </Link>
          </Button>
        </div>
      </div>
      {/* <ManageChaptersTable comic_id={comicData.comic.id} comic_slug={slug} /> */}
    </div>
  );
}
