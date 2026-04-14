'use client';

import { getComicChaptersAction } from '@/app/actions';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BookAIcon, Clock, Loader } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import Link from 'next/link';

export default function ChaptersBox({
  comicID,
  comicSlug,
  totalChapters,
}: {
  comicID: number;
  comicSlug: string;
  totalChapters: number;
}) {
  const [chapters, setChapters] = useState<
    {
      id: number;
      chapterNumber: number;
      title: string;
    }[]
  >([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    console.log('🐱‍💻 Load more is calling with page ', page);
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    const result = await getComicChaptersAction(comicID, page);

    if (result.success && result.data) {
      if (result.data.chapters.length > 0) {
        setChapters((prev) => [...prev, ...result.data.chapters]);
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="mb-2 flex items-center gap-2">
        <BookAIcon />
        <h2 className="text-lg font-semibold">Chapters</h2>
        <span className="text-muted-foreground text-sm">({totalChapters})</span>
      </div>
      <InfiniteScroll
        className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        dataLength={chapters.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="mt-4 flex justify-center">
            <Loader className="animate-spin" />
          </div>
        }
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {chapters.map((chapter) => (
          <Link key={chapter.id} href={`/comic/${comicSlug}/${chapter.chapterNumber}`}>
            <Card className="hover:bg-accent/50 border-muted-foreground/20 bg-muted/20 mt-4 border shadow-none transition-colors">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-background flex size-10 items-center justify-center rounded-xl text-sm font-bold shadow-sm">
                    {chapter.chapterNumber}
                  </div>
                  <div>
                    <p className="mb-1 text-sm leading-none font-bold">Chapter {chapter.chapterNumber}</p>
                    <p className="text-muted-foreground line-clamp-1 text-xs">
                      {chapter.title || `Chapter ${chapter.chapterNumber}`}
                    </p>
                  </div>
                </div>
                <div className="text-muted-foreground flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[10px] font-medium">
                    <Clock className="size-3" />
                    {new Date().toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </InfiniteScroll>
    </div>
  );
}
