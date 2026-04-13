import honoClient from '@/hono/client';
import { notFound } from 'next/navigation';
import { UpdateComicForm } from './components/UpdateComicForm';

async function getComicDetail(slug: string) {
  try {
    const response = await honoClient.api.v1.public.comics
      .$get({
        query: { slug },
      })
      .then(async (res) => await res.json());

    if (!response.success) return null;
    return response.data;
  } catch (error) {
    console.error('Failed to fetch comic detail:', error);
    return null;
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const comicData = await getComicDetail(slug);

  if (!comicData) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-8 px-4">
        <h1 className="text-3xl font-bold">Update Comic</h1>
        <p className="text-muted-foreground mt-2">Update details for {comicData.comic.title}</p>
      </div>
      <UpdateComicForm initialData={comicData.comic} />
    </div>
  );
}
