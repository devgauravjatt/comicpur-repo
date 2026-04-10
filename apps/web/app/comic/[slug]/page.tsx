import honoClient from '@/hono/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ChaptersBox from '@/components/chapters-box';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Calendar, Heart, Share2, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';

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
  console.log('🚀 ~ ComicPage ~ comicData :- ', comicData);

  if (!comicData) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Mobile-First Header / Hero */}
      <section className="relative w-full overflow-hidden rounded-3xl bg-muted/30 p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Cover Image */}
          <div className="relative aspect-3/4 w-full max-w-60 mx-auto md:mx-0 shrink-0 overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={comicData.comic.coverImage}
              alt={comicData.comic.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 240px, 300px"
            />
            {comicData.comic.isAdult && (
              <Badge variant="destructive" className="absolute top-3 right-3 uppercase font-black px-2 py-0.5">
                18+
              </Badge>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col flex-1 gap-4 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <Link href={`/categories/${comicData.categorySlug}`}>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3">
                  {comicData.categoryName}
                </Badge>
              </Link>
              <Badge variant="outline" className="border-muted-foreground/30 px-3">
                {comicData.comic.languageCode.toUpperCase()}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {comicData.comic.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground font-medium mt-2">
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
                <TrendingUp className="size-4 text-primary" />
                <span>#5 Trending</span>
              </div>
            </div>
            {/* Reusable row component for meta info */}
            <div className="flex justify-between text-muted-foreground text-sm items-center py-2 border-b border-muted">
              <span className="flex items-center gap-2">
                <Calendar className="size-4" />
                Released
              </span>
              <span className="font-semibold">
                {new Date(comicData.comic.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground text-sm items-center py-2 border-b border-muted">
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

            <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
              <Link href={`/comic/${comicData.comic.slug}/chapter-1`} className="flex-1">
                <Button
                  size="lg"
                  className="w-full rounded-full h-12 md:h-14 text-base font-bold shadow-lg shadow-primary/20"
                >
                  Read Now
                </Button>
              </Link>
              <div className="flex gap-3">
                <Button size="lg" variant="secondary" className="flex-1 sm:flex-none rounded-full h-12 md:h-14 px-6">
                  <Heart className="size-5 mr-2" />
                  Save
                </Button>
                <Button size="lg" variant="outline" className="flex-1 sm:flex-none rounded-full h-12 md:h-14 px-6">
                  <Share2 className="size-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-1 md:px-0">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base whitespace-pre-wrap">
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
