'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, X } from 'lucide-react';
import dayjs from 'dayjs';
import useComicsTableStore from '@/stateStore/comicsTable';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import Link from 'next/link';

// Debounce hook — delays updating the value until the user stops typing
function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function ComicsTable() {
  const { search, currentPage, comics, totalPages, isLoading, setSearch, setCurrentPage, fetchComics, clearSearch } =
    useComicsTableStore();

  const debouncedSearch = useDebounce(search, 400);

  // Track whether this is the very first render so we can skip the
  // redundant fetch that would fire before the debounce settles.
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchComics(); // Initial load
      return;
    }
    fetchComics();
    // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch]);
  // ↑ fetchComics is intentionally excluded — it's stable but not memoised,
  //   including it would cause infinite loops. The store owns the reference.

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value); // updates store immediately (for controlled input)
    // debouncedSearch will settle 400 ms after the user stops typing → triggers fetch
  };

  const getPaginationRange = () => {
    const delta = 1;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h2 className="text-2xl font-bold">Manage Comics</h2>
      {/* Search */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search comics..."
          value={search}
          onChange={handleSearchChange}
          className="pl-10 pr-10 h-11 rounded-xl"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Mobile: Card View / Desktop: Table View */}
      <div className="space-y-4">
        {/* Mobile View */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 bg-background border rounded-2xl">
              <Spinner className="size-8 text-primary" />
              <p className="text-sm text-muted-foreground">Loading comics...</p>
            </div>
          ) : comics.length > 0 ? (
            comics.map((comic) => (
              <Card key={comic.id} className="rounded-2xl border overflow-hidden">
                <CardHeader className="p-4 pb-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-semibold line-clamp-2">{comic.title}</CardTitle>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${comic.published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}
                    >
                      {comic.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{dayjs(comic.createdAt).format('MMM DD, YYYY')}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                    <span className="uppercase tracking-wider">{comic.languageCode}</span>
                    {comic.isAdult && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                        <span className="text-rose-600 dark:text-rose-400 font-medium">18+</span>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardFooter className="p-4 pt-2 flex flex-wrap gap-3">
                  <Button size="sm" variant="secondary" className="h-11 px-4 rounded-xl flex-1 min-w-25">
                    Add Chapter
                  </Button>
                  <Button size="sm" variant="outline" className="h-11 px-4 rounded-xl flex-1 min-w-25">
                    Manage Chapter
                  </Button>
                  <Link href={`/admin/update/comic/${comic.slug}`}>
                    <Button size="sm" variant="default" className="h-11 px-4 rounded-xl w-full mt-1">
                      Edit
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-background border rounded-2xl">No comics found</div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block rounded-2xl border bg-background overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[50%]">Title</TableHead>
                <TableHead>Is Published</TableHead>
                <TableHead>Language Code</TableHead>
                <TableHead>Adult Content</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Spinner className="size-8 text-primary" />
                      <p className="text-sm text-muted-foreground">Loading comics...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : comics.length > 0 ? (
                comics.map((comic) => (
                  <TableRow key={comic.id} className="group">
                    <TableCell className="font-medium">{comic.title}</TableCell>
                    <TableCell className="text-muted-foreground">{comic.published ? 'Yes' : 'No'}</TableCell>
                    <TableCell className="text-muted-foreground">{comic.languageCode}</TableCell>
                    <TableCell className="text-muted-foreground">{comic.isAdult ? 'Yes' : 'No'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="secondary" className="h-9 px-4 rounded-lg">
                          Add Chapter
                        </Button>
                        <Button size="sm" variant="outline" className="h-9 px-4 rounded-lg">
                          Manage Chapter
                        </Button>
                        <Link href={`/admin/update/comic/${comic.slug}`}>
                          <Button size="sm" variant="default" className="h-9 px-4 rounded-lg">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-12">
                    No comics found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-center md:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>

            {getPaginationRange().map((page, i) => (
              <PaginationItem key={i}>
                {page === '...' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(Number(page));
                    }}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
