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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { X, Search } from 'lucide-react';

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
    setSearch,
    setActive,
    setCurrentPage,
    clearFilters,
    fetchPremiums,
  } = usePremiumTableStore();

  const [searchInput, setSearchInput] = useState(search);

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
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
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
              <CardFooter className="flex flex-col items-start gap-2 p-4 pt-2">
                <div className="text-muted-foreground text-sm">
                  <p>Pay Mode: {premium.payMode}</p>
                  <p>Amount: ₹{premium.amount}</p>
                  <p>Expiry: {new Date(premium.expiryDate).toLocaleDateString()}</p>
                </div>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
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
                  <TableCell>{new Date(premium.expiryDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
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
    </div>
  );
}
