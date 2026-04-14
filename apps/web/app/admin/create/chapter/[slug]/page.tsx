import { getComicBySlugAction, getLastChapterNumberAction } from '@/app/actions';
import { notFound } from 'next/navigation';
import CreateChapterForm from './components/CreateChapterForm';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default async function CreateChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getComicBySlugAction(slug);

  if (!result || !result.success || !result.data?.comic) {
    notFound();
  }

  const lastChapterResult = await getLastChapterNumberAction(result.data?.comic.id);

  if (!lastChapterResult || !lastChapterResult.success) {
    notFound();
  }

  const { comic } = result.data;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/chapters/${slug}`}>Chapters</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create Chapter</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-background rounded-2xl border p-4 shadow-sm md:p-8">
        <CreateChapterForm
          comicId={comic.id}
          comicTitle={comic.title}
          comicSlug={slug}
          LastChapterNumber={lastChapterResult.lastChapterNumber}
        />
      </div>
    </div>
  );
}
