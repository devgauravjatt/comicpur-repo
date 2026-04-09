'use client';

import { getComicesByCategorySlug } from '@/app/actions';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import RowLoader from './row-loader';
import { Comic } from '@/types/comic';
import { ComicCard } from './comic-card';

export default function ComicsBox({ slug, initialComics }: { slug: string; initialComics: Comic[] }) {
  const [comics, setComics] = useState<Comic[]>(initialComics);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    console.log('🐱‍💻 Load more is calling with page ', page);
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    const result = await getComicesByCategorySlug(slug, nextPage);

    if (result!.success && result!.data?.comics && result) {
      if (result.data.comics.length > 0) {
        setComics((prev) => [...prev, ...(result.data?.comics || [])]);
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    }
    setLoading(false);
  };

  return (
    <InfiniteScroll
      className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      dataLength={comics.length}
      next={loadMore}
      hasMore={hasMore}
      loader={
        <div className="flex justify-center mt-8 py-4">
          <RowLoader title="Loading more comics..." />
        </div>
      }
      endMessage={
        <div className="flex justify-center mt-8 py-4 border-t">
          <p className="text-muted-foreground font-medium">Yay! You have seen it all</p>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {comics.map((comic) => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
