import Link from 'next/link';
import Image from 'next/image';
import { Comic } from '@/types/comic';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Star, Calendar } from 'lucide-react';

import { IsNewBadge } from './is-new-badge';
import { Suspense } from 'react';
import { translateComicTitle } from '@/lib/translate';

interface ComicCardProps {
  comic: Comic;
}

async function TranslatedTitle({ comicTitle }: { comicTitle: string }) {
  const title = await translateComicTitle(comicTitle);
  const lines = title.split('-');
  return (
    <>
      {' '}
      <CardTitle className="group-hover:text-primary line-clamp-1 text-sm leading-tight font-bold transition-colors">
        {lines[0]}
      </CardTitle>
      {lines[1] ? <span className="text-text-200 text-sm">&ldquo;{lines[1]}&rdquo;</span> : ''}
    </>
  );
}

export function ComicCard({ comic }: ComicCardProps) {
  return (
    <Link href={`/comic/${comic.slug}`} className="group block">
      <Card className="hover:bg-accent/10 h-full overflow-hidden border-none bg-transparent shadow-none transition-all duration-300">
        <div className="relative aspect-3/4 overflow-hidden rounded-2xl shadow-sm transition-shadow group-hover:shadow-md">
          <Image
            placeholder="blur"
            blurDataURL="https://placehold.net/400x600.png"
            src={comic.coverImage}
            alt={comic.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 flex flex-col justify-end bg-black/40 p-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="mb-1 line-clamp-3 translate-y-2 transform text-xs transition-transform duration-300 group-hover:translate-y-0">
              {comic.description}
            </p>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <IsNewBadge createdAt={comic.createdAt} />

            <Badge
              variant="outline"
              className="bg-background/80 h-5 border-none px-1.5 text-[10px] font-bold uppercase backdrop-blur-md"
            >
              {comic.languageCode}
            </Badge>
          </div>

          <div className="absolute top-2 right-2">
            {comic.isAdult && (
              <Badge
                variant="destructive"
                className="h-5 border-none bg-red-600 px-1.5 text-[10px] font-bold text-white hover:bg-red-700"
              >
                18+
              </Badge>
            )}
          </div>

          <div className="absolute right-2 bottom-2">
            <Badge
              variant="secondary"
              className="bg-background/90 flex h-5 items-center gap-1 border-none px-2 text-[10px] font-bold shadow-sm backdrop-blur-md"
            >
              <BookOpen className="size-3" />
              {comic.chaptersCount}
            </Badge>
          </div>
        </div>

        <CardHeader className="p-3 pt-2">
          <Suspense fallback={<div>Loading...</div>}>
            <TranslatedTitle comicTitle={comic.title} />
          </Suspense>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px] font-medium">
              <Calendar className="size-3" />
              {new Date(comic.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            {/* You can add rating here if available in comic type */}
            <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-500">
              <Star className="size-3 fill-amber-500" />
              4.8
            </span>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
