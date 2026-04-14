import honoClient from '@/hono/client';
import { notFound } from 'next/navigation';
import { UpdateComicForm } from './components/UpdateComicForm';

async function getCategores() {
  const response = await honoClient.api.v1.public.categories.$get().then((res) => res.json());
  return response;
}

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
  const categories = await getCategores();

  if (!comicData) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl py-10">
      <div className="mb-8 px-4">
        <h1 className="text-3xl font-bold">Update Comic</h1>
        <p className="text-muted-foreground mt-2">Update details for {comicData.comic.title}</p>
      </div>
      <UpdateComicForm initialData={comicData.comic} categories={categories.categories} />
    </div>
  );
}
