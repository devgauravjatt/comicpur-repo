import honoClient from '@/hono/client';
import { ResMoives } from '@/types/comic';
import { ComicCard } from '@/components/comic-card';
import { ChevronRight, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cacheLife } from 'next/cache';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

async function getHomeComics() {
  'use cache';
  cacheLife('days');

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const response = (await honoClient.api.v1.public.comics.home.$get().then((res) => res.json())) as ResMoives;
  return response;
}

export default async function Home() {
  const response = await getHomeComics();

  if (!response.success || !response.data) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold">Failed to load comics</h2>
        <p className="text-muted-foreground">Please try again later.</p>
        <Link href="/">
          <Button>Retry</Button>
        </Link>
      </div>
    );
  }

  function lLoadingUi() {
    return (
      <div className="flex flex-col gap-10">
        {[1, 2, 3].map((section) => (
          <section key={section} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="aspect-3/4 rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-10">
      {/* Hero Section */}
      <section className="relative z-10 max-w-2xl mx-auto md:mx-0">
        <h1 className="mb-4 text-3xl font-black tracking-tight md:text-4xl lg:text-5xl xl:text-4xl">
          Read Your FavoriteComics Online
        </h1>
        <p className="mb-6 text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto md:mx-0">
          Explore thousands of comics, manga, and manhwa in high quality. Updated daily with the latest chapters.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center md:justify-start">
          <Link href="/categories" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-full px-8 h-11 md:h-12 text-sm font-bold backdrop-blur-sm transition-all hover:-translate-y-0.5"
            >
              Browse Categories
            </Button>
          </Link>
        </div>
      </section>

      <Suspense fallback={lLoadingUi()}>
        {response.data.map((section, index) => (
          <section key={section.id} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {index === 0 ? (
                    <TrendingUp className="size-5 text-primary" />
                  ) : (
                    <Clock className="size-5 text-primary" />
                  )}
                  <h2 className="text-2xl font-bold tracking-tight">{section.name}</h2>
                </div>
                <Link
                  href={`/categories/${section.slug}`}
                  className="group flex items-center gap-1 text-sm font-semibold text-primary transition-all hover:gap-2"
                >
                  See all
                  <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
              {section.description && (
                <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">{section.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {section.comics.map((comic) => (
                <ComicCard key={comic.id} comic={comic} />
              ))}
            </div>
          </section>
        ))}
      </Suspense>
    </div>
  );
}
