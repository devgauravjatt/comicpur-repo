import Link from 'next/link';
import Image from 'next/image';
import { Comic } from '@/types/comic';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Star, Calendar } from 'lucide-react';

import { IsNewBadge } from './is-new-badge';

interface ComicCardProps {
  comic: Comic;
}

export function ComicCard({ comic }: ComicCardProps) {
  return (
    <Link href={`/comic/${comic.slug}`} className="block group">
      <Card className="h-full border-none shadow-none bg-transparent hover:bg-accent/10 transition-all duration-300 overflow-hidden">
        <div className="relative aspect-3/4 overflow-hidden rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
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
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
            <p className="text-xs line-clamp-3 mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              {comic.description}
            </p>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <IsNewBadge createdAt={comic.createdAt} />

            <Badge
              variant="outline"
              className="bg-background/80 backdrop-blur-md border-none text-[10px] h-5 px-1.5 uppercase font-bold"
            >
              {comic.languageCode}
            </Badge>
          </div>

          <div className="absolute top-2 right-2">
            {comic.isAdult && (
              <Badge
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white border-none text-[10px] h-5 px-1.5 font-bold"
              >
                18+
              </Badge>
            )}
          </div>

          <div className="absolute bottom-2 right-2">
            <Badge
              variant="secondary"
              className="bg-background/90 backdrop-blur-md border-none text-[10px] h-5 px-2 font-bold flex items-center gap-1 shadow-sm"
            >
              <BookOpen className="size-3" />
              {comic.chaptersCount}
            </Badge>
          </div>
        </div>

        <CardHeader className="p-3 pt-2">
          <CardTitle className="line-clamp-1 text-sm font-bold group-hover:text-primary transition-colors leading-tight">
            {comic.title}
          </CardTitle>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
              <Calendar className="size-3" />
              {new Date(comic.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            {/* You can add rating here if available in comic type */}
            <span className="flex items-center gap-0.5 text-[11px] text-amber-500 font-bold">
              <Star className="size-3 fill-amber-500" />
              4.8
            </span>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
