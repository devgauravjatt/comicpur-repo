'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePremiumTableStore from '@/stateStore/premiumTable';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { X, Search } from 'lucide-react';
import dayjs from 'dayjs';

function getDaysLeft(expiryDate: string | null | undefined): string {
  if (!expiryDate) return 'No Expiry';

  const expiry = dayjs(expiryDate);
  const now = dayjs();
  const diffDays = expiry.diff(now, 'day');

  if (diffDays < 0) return 'Expired';
  if (diffDays === 0) return 'Today';
  return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
}

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

export default function ManagePremiumTable() {
  const {
    search,
    active,
    currentPage,
    premiums,
    totalPages,
    isLoading,
    isToggling,
    setSearch,
    setActive,
    setCurrentPage,
    clearFilters,
    fetchPremiums,
    togglePremiumStatus,
  } = usePremiumTableStore();

  const [searchInput, setSearchInput] = useState(search);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    id: number;
    active: boolean;
  }>({ isOpen: false, id: 0, active: false });

  const handleToggleClick = (id: number, active: boolean) => {
    setConfirmDialog({ isOpen: true, id, active });
  };

  const confirmToggle = async () => {
    await togglePremiumStatus(confirmDialog.id, confirmDialog.active);
    setConfirmDialog({ isOpen: false, id: 0, active: false });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, setSearch]);

  useEffect(() => {
    fetchPremiums();
    // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
  }, [search, active, currentPage]);

  const paginationRange = getPaginationRange(parseInt(currentPage), totalPages);

  return (
    <div className="space-y-6 px-4 pb-10 md:px-0">
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        <div className="relative min-w-50 flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by user email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-11 rounded-xl pl-10"
          />
        </div>

        <Select value={active || 'all'} onValueChange={(val) => setActive(val === 'all' ? undefined : val)}>
          <SelectTrigger className="h-11 w-full rounded-xl md:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {(search || active) && (
          <Button variant="outline" onClick={clearFilters} className="h-11 gap-2 rounded-xl">
            <X className="size-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {isLoading ? (
          <div className="bg-background flex flex-col items-center justify-center gap-2 rounded-2xl border py-12">
            <Spinner className="text-primary size-8" />
            <p className="text-muted-foreground text-sm">Loading premium entries...</p>
          </div>
        ) : premiums.length > 0 ? (
          premiums.map((premium) => (
            <Card key={premium.id} className="overflow-hidden rounded-2xl border">
              <CardHeader className="space-y-2 p-4 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2 text-base font-semibold">User #{premium.userId}</CardTitle>
                  <Badge
                    variant={premium.active ? 'default' : 'secondary'}
                    className={premium.active ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    {premium.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex flex-col items-start gap-3 p-4 pt-2">
                <div className="text-muted-foreground w-full text-sm">
                  <p>Pay Mode: {premium.payMode}</p>
                  <p>Amount: ₹{premium.amount}</p>
                  <p>Expiry: {premium.expiryDate ? new Date(premium.expiryDate).toLocaleDateString() : 'No Expiry'}</p>
                  <p>
                    Days Left: <span className="font-medium">{getDaysLeft(premium.expiryDate)}</span>
                  </p>
                </div>
                <Button
                  variant={premium.active ? 'destructive' : 'default'}
                  onClick={() => handleToggleClick(premium.id, !premium.active)}
                  disabled={isToggling === premium.id}
                  className="h-11 w-full rounded-xl"
                >
                  {isToggling === premium.id ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" /> Processing...
                    </>
                  ) : premium.active ? (
                    'Deactivate'
                  ) : (
                    'Activate'
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="bg-background rounded-2xl border py-12 text-center">No premium entries found</div>
        )}
      </div>

      <div className="bg-background hidden overflow-hidden rounded-2xl border md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>User ID</TableHead>
              <TableHead>Pay Mode</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Days Left</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Spinner className="text-primary size-8" />
                    <p className="text-muted-foreground text-sm">Loading premium entries...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : premiums.length > 0 ? (
              premiums.map((premium) => (
                <TableRow key={premium.id} className="group">
                  <TableCell className="font-medium">#{premium.userId}</TableCell>
                  <TableCell>{premium.payMode}</TableCell>
                  <TableCell>₹{premium.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={premium.active ? 'default' : 'secondary'}
                      className={premium.active ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      {premium.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {premium.expiryDate ? new Date(premium.expiryDate).toLocaleDateString() : 'No Expiry'}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{getDaysLeft(premium.expiryDate)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={premium.active ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => handleToggleClick(premium.id, !premium.active)}
                      disabled={isToggling === premium.id}
                      className="h-9 rounded-lg px-4"
                    >
                      {isToggling === premium.id ? (
                        <>
                          <Spinner className="mr-2 h-4 w-4" />
                        </>
                      ) : premium.active ? (
                        'Deactivate'
                      ) : (
                        'Activate'
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  No premium entries found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="justify-center md:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const page = parseInt(currentPage);
                  if (page > 1) setCurrentPage((page - 1).toString());
                }}
                className={parseInt(currentPage) === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
                      setCurrentPage(page.toString());
                    }}
                    isActive={currentPage === page.toString()}
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
                  const page = parseInt(currentPage);
                  if (page < totalPages) setCurrentPage((page + 1).toString());
                }}
                className={parseInt(currentPage) === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) => !open && setConfirmDialog({ isOpen: false, id: 0, active: false })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {confirmDialog.active ? 'Activate' : 'Deactivate'}</DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmDialog.active ? 'activate' : 'deactivate'} this premium subscription?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ isOpen: false, id: 0, active: false })}>
              Cancel
            </Button>
            <Button
              variant={confirmDialog.active ? 'default' : 'destructive'}
              onClick={confirmToggle}
              disabled={isToggling !== null}
            >
              {isToggling !== null ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" /> Processing...
                </>
              ) : confirmDialog.active ? (
                'Activate'
              ) : (
                'Deactivate'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
