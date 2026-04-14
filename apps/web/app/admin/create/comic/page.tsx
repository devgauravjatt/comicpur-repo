import honoClient from '@/hono/client';
import CreateComicForm from './components/CreateComicForm';

async function getCategores() {
  const response = await honoClient.api.v1.public.categories.$get().then((res) => res.json());
  return response;
}

export default async function Page() {
  const categories = await getCategores();

  return (
    <div className="mx-auto max-w-4xl py-10">
      <div className="mb-8 px-4">
        <h1 className="text-3xl font-bold">Create Comic</h1>
      </div>
      <CreateComicForm categories={categories.categories} />
    </div>
  );
}
