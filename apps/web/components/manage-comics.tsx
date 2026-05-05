'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, X } from 'lucide-react';
import dayjs from 'dayjs';
import useComicsTableStore from '@/stateStore/comicsTable';
import { Spinner } from '@/components/ui/spinner';
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
    <div className="space-y-6 p-4 md:p-6">
      <h2 className="text-2xl font-bold">Manage Comics</h2>
      {/* Search */}
      <div className="relative flex w-full max-w-md items-center justify-center gap-13">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search comics..."
          value={search}
          onChange={handleSearchChange}
          className="h-11 rounded-xl pr-10 pl-10"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="hover:bg-muted absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 transition-colors"
            title="Clear search"
          >
            <X className="text-muted-foreground h-4 w-4" />
          </button>
        )}
        <Link href="/admin/create/comic" className="text-primary hover:underline">
          <Button className="bg-primary text-white">Create New Comic</Button>
        </Link>
      </div>

      {/* Comics Table */}
      <div className="bg-background overflow-hidden rounded-2xl border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40%]">Title</TableHead>
                <TableHead>Is Published</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Adult</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Spinner className="text-primary size-8" />
                      <p className="text-muted-foreground text-sm">Loading comics...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : comics.length > 0 ? (
                comics.map((comic) => (
                  <TableRow key={comic.id} className="group">
                    <TableCell className="font-medium">{comic.title}</TableCell>
                    <TableCell className="text-muted-foreground">{comic.published ? 'Yes' : 'No'}</TableCell>
                    <TableCell className="text-muted-foreground uppercase">{comic.languageCode}</TableCell>
                    <TableCell className="text-muted-foreground">{comic.isAdult ? 'Yes' : 'No'}</TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {dayjs(comic.createdAt).format('MMM DD, YYYY')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/create/chapter/${comic.slug}`}>
                          <Button size="sm" variant="secondary" className="h-9 rounded-lg px-4">
                            Add Chapter
                          </Button>
                        </Link>
                        <Link href={`/admin/chapters/${comic.slug}`}>
                          <Button size="sm" variant="outline" className="h-9 rounded-lg px-4">
                            Manage Chapter
                          </Button>
                        </Link>
                        <Link href={`/admin/update/comic/${comic.slug}`}>
                          <Button size="sm" variant="default" className="h-9 rounded-lg px-4">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
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
