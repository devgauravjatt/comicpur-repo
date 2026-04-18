import CreatePremiumForm from './components/CreatePremiumForm';

export default async function Page() {
  return (
    <div className="mx-auto max-w-4xl py-10">
      <div className="mb-8 px-4">
        <h1 className="text-3xl font-bold">Create Premium</h1>
      </div>
      <CreatePremiumForm />
    </div>
  );
}
