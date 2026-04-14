'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Comic } from '@/types/comic';
import { comicsListAndSearchAction } from '../actions';
import RowLoader from '@/components/row-loader';
import { ComicCard } from '@/components/comic-card';

export default function SearchArea() {
  const [inputValue, setInputValue] = useState('');
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Debounce the raw input by 400ms
  const [debouncedSearch] = useDebounce(inputValue, 400);

  const runSearch = useCallback(async (query: string) => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setHasSearched(true);
    setComics([]);

    try {
      const result = await comicsListAndSearchAction(1, query);
      if (result?.success && result.data?.comics) {
        setComics(result.data.comics);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setComics([]);
      setHasSearched(false);
      return;
    }
    runSearch(debouncedSearch.trim());
  }, [debouncedSearch, runSearch]);

  const clearSearch = () => {
    setInputValue('');
    setComics([]);
    setHasSearched(false);
  };

  const isPending = inputValue !== debouncedSearch && inputValue.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 size-4 transition-colors duration-200',
            inputValue ? 'text-foreground' : 'text-muted-foreground',
          )}
        />
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="search"
          placeholder="Search comics..."
          className="h-11 pr-10 pl-9 text-base"
          aria-label="Search comics"
        />
        {/* Loader spinner while debounce is pending or fetching */}
        {isPending || loading ? (
          <Loader2 className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin" />
        ) : inputValue ? (
          <button
            onClick={clearSearch}
            aria-label="Clear search"
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2 transition-colors"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {/* Result count badge */}
      {!loading && hasSearched && comics.length > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs font-medium">
            {comics.length} result{comics.length !== 1 ? 's' : ''}
          </Badge>
          <span className="text-muted-foreground text-xs">for &ldquo;{debouncedSearch}&rdquo;</span>
        </div>
      )}

      {/* Results grid */}
      {!loading && comics.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {comics.map((comic) => (
            <ComicCard key={comic.id} comic={comic} />
          ))}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="flex justify-center py-12">
          <RowLoader title="Searching comics..." />
        </div>
      )}

      {/* No results */}
      {!loading && hasSearched && comics.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 border-t pt-10 pb-4">
          <Search className="text-muted-foreground/40 size-8" />
          <p className="text-muted-foreground text-sm font-medium">No results for &ldquo;{debouncedSearch}&rdquo;</p>
          <p className="text-muted-foreground/60 text-xs">Try a different keyword</p>
        </div>
      )}
    </div>
  );
}
