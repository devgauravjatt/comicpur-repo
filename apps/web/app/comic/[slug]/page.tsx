import honoClient from '@/hono/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ChaptersBox from '@/components/chapters-box';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Calendar, Heart, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ShareButton from '@/components/ShareButton';
import { translateComicTitle } from '@/lib/translate';

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

export default async function ComicPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const comicData = await getComicDetail(slug);

  if (!comicData) {
    notFound();
  }

  const translatedTitle = await translateComicTitle(comicData.comic.title);

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Mobile-First Header / Hero */}
      <section className="bg-muted/30 relative w-full overflow-hidden rounded-3xl p-4 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:gap-10">
          {/* Cover Image */}
          <div className="relative mx-auto aspect-3/4 w-full max-w-60 shrink-0 overflow-hidden rounded-2xl shadow-xl md:mx-0">
            <Image
              src={comicData.comic.coverImage}
              alt={comicData.comic.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 240px, 300px"
            />
            {comicData.comic.isAdult && (
              <Badge variant="destructive" className="absolute top-3 right-3 px-2 py-0.5 font-black uppercase">
                18+
              </Badge>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col gap-4 text-center md:text-left">
            <div className="mb-1 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <Link href={`/categories/${comicData.categorySlug}`}>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3">
                  {comicData.categoryName}
                </Badge>
              </Link>
              <Badge variant="outline" className="border-muted-foreground/30 px-3">
                {comicData.comic.languageCode.toUpperCase()}
              </Badge>
            </div>

            <h1 className="comicpur-text-gradient py-2 text-lg leading-tight font-black tracking-tight md:text-3xl lg:text-4xl">
              {translatedTitle}
            </h1>

            <div className="text-muted-foreground mt-2 flex flex-wrap items-center justify-center gap-6 text-sm font-medium md:justify-start">
              <div className="flex items-center gap-1.5">
                <Star className="size-4 fill-amber-500 text-amber-500" />
                <span className="text-foreground font-bold">4.8</span>
                <span>(1.2k)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="size-4" />
                <span className="text-foreground font-bold">{comicData.comic.chaptersCount}</span>
                <span>Chapters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="text-primary size-4" />
                <span>#5 Trending</span>
              </div>
            </div>
            {/* Reusable row component for meta info */}
            <div className="text-muted-foreground border-muted flex items-center justify-between border-b py-2 text-sm">
              <span className="flex items-center gap-2">
                <Calendar className="size-4" />
                Released
              </span>
              <span className="font-semibold">
                {new Date(comicData.comic.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </span>
            </div>
            <div className="text-muted-foreground border-muted flex items-center justify-between border-b py-2 text-sm">
              <span className="flex items-center gap-2">
                <Calendar className="size-4" />
                Last Update
              </span>
              <span className="font-semibold">
                {new Date(comicData.comic.updatedAt || comicData.comic.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
              <Link href={`/comic/${comicData.comic.slug}/1`} className="flex-1">
                <Button
                  size="lg"
                  className="shadow-primary/20 h-12 w-full rounded-full text-base font-bold shadow-lg md:h-14"
                >
                  Read Now
                </Button>
              </Link>
              <div className="flex gap-3">
                <Button size="lg" variant="secondary" className="h-12 flex-1 rounded-full px-6 sm:flex-none md:h-14">
                  <Heart className="mr-2 size-5" />
                  Save
                </Button>
                <ShareButton title={translatedTitle} text={comicData.comic.description} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 px-1 md:px-0 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">Description</h2>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap md:text-base">
              {comicData.comic.description || 'No description available.'}
            </p>
          </section>

          <Separator className="opacity-50" />

          {/* Chapters List */}
          <section id="chapters">
            <ChaptersBox
              comicID={comicData.comic.id}
              comicSlug={comicData.comic.slug}
              totalChapters={comicData.comic.chaptersCount}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
