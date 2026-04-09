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
      <div className="flex items-center gap-2 mb-2">
        <BookAIcon />
        <h2 className="text-lg font-semibold">Chapters</h2>
        <span className="text-sm text-muted-foreground">({totalChapters})</span>
      </div>
      <InfiniteScroll
        className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        dataLength={chapters.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center mt-4">
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
            <Card className="hover:bg-accent/50 mt-4 transition-colors border border-muted-foreground/20 shadow-none bg-muted/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-background flex items-center justify-center font-bold text-sm  shadow-sm">
                    {chapter.chapterNumber}
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-none mb-1">Chapter {chapter.chapterNumber}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {chapter.title || `Chapter ${chapter.chapterNumber}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="text-[10px] font-medium flex items-center gap-1">
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
