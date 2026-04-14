'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useChaptersTableStore from '@/stateStore/chaptersTable';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { deleteChapterAction } from '@/app/actions';
import Link from 'next/link';

// ─── Pagination helper ────────────────────────────────────────────────────────

function getPaginationRange(currentPage: number, totalPages: number): (number | string)[] {
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
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ManageChaptersTable({ comic_id, comic_slug }: { comic_id: number; comic_slug: string }) {
  const { comicId, currentPage, chapters, totalPages, isLoading, setCurrentPage, fetchChapters, setComicId } =
    useChaptersTableStore();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (id: number) => {
    setChapterToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!chapterToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteChapterAction(chapterToDelete);
      if (response?.success) {
        toast.success('Chapter deleted successfully');
        fetchChapters(); // Refresh the list
      } else {
        toast.error(response?.message || 'Failed to delete chapter');
      }
      // oxlint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('An error occurred while deleting the chapter');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setChapterToDelete(null);
    }
  };

  useEffect(() => {
    setComicId(comic_id);
  }, [comic_id, setComicId]);

  useEffect(() => {
    if (comicId > 0) {
      fetchChapters();
    }
    // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
  }, [currentPage, comicId]);

  const paginationRange = getPaginationRange(currentPage, totalPages);

  return (
    <div className="space-y-6 px-4 pb-10 md:px-0">
      {/* Mobile: Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {isLoading ? (
          <div className="bg-background flex flex-col items-center justify-center gap-2 rounded-2xl border py-12">
            <Spinner className="text-primary size-8" />
            <p className="text-muted-foreground text-sm">Loading chapters...</p>
          </div>
        ) : chapters.length > 0 ? (
          chapters.map((chapter) => (
            <Card key={chapter.id} className="overflow-hidden rounded-2xl border">
              <CardHeader className="space-y-2 p-4 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2 text-base font-semibold">{chapter.title}</CardTitle>
                  <span className="text-muted-foreground rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium dark:bg-gray-800">
                    #{chapter.chapterNumber}
                  </span>
                </div>
              </CardHeader>
              <CardFooter className="flex flex-wrap gap-3 p-4 pt-2">
                <Link href={`/comic/${comic_slug}/${chapter.chapterNumber}`} className="flex-1">
                  <Button size="sm" variant="secondary" className="h-11 w-full rounded-xl px-4">
                    Show
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="destructive"
                  className="mt-1 h-11 w-full rounded-xl px-4"
                  onClick={() => handleDeleteClick(chapter.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="bg-background rounded-2xl border py-12 text-center">No chapters found</div>
        )}
      </div>

      {/* Desktop: Table View */}
      <div className="bg-background hidden overflow-hidden rounded-2xl border md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40%]">Title</TableHead>
              <TableHead>Chapter No.</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Spinner className="text-primary size-8" />
                    <p className="text-muted-foreground text-sm">Loading chapters...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : chapters.length > 0 ? (
              chapters.map((chapter) => (
                <TableRow key={chapter.id} className="group">
                  <TableCell className="font-medium">{chapter.title}</TableCell>
                  <TableCell className="text-muted-foreground">#{chapter.chapterNumber}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/comic/${comic_slug}/${chapter.chapterNumber}`}>
                        <Button size="sm" variant="secondary" className="h-9 rounded-lg px-4">
                          Show
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-9 rounded-lg px-4"
                        onClick={() => handleDeleteClick(chapter.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="py-12 text-center">
                  No chapters found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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

            {paginationRange.map((page, i) => (
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-[90vw] rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Are you sure?</DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              This action cannot be undone. This will permanently delete the chapter and remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="h-11 flex-1 rounded-xl sm:h-10"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="h-11 flex-1 rounded-xl sm:h-10"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
