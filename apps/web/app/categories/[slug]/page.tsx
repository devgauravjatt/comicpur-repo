import { getComicesByCategorySlug } from '@/app/actions';
import { notFound } from 'next/navigation';
import ComicsBox from '@/components/comies-box';

export default async function page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const data = await getComicesByCategorySlug(slug);
  if (!data?.success || !data.data?.comics) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize tracking-tight">{slug.replace('-', ' ')}</h1>
        <p className="text-sm text-muted-foreground">{data.data.comics.length} results</p>
      </div>
      <ComicsBox initialComics={data.data.comics} slug={slug} />
    </div>
  );
}
