'use client';

import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';

interface IsNewBadgeProps {
  createdAt: string | Date;
}

export function IsNewBadge({ createdAt }: IsNewBadgeProps) {
  const isNew = useMemo(() => {
    const createdDate = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    return now - createdDate < SEVEN_DAYS_MS;
  }, [createdAt]);

  if (!isNew) return null;

  return (
    <Badge className="h-5 border-none bg-amber-500 px-1.5 text-[10px] font-bold tracking-wider text-white uppercase hover:bg-amber-600">
      New
    </Badge>
  );
}

export function IsComingBadge() {
  return (
    <Badge
      variant="outline"
      className="h-5 border-none bg-gray-500 px-1.5 text-[10px] font-bold text-white hover:bg-gray-600"
    >
      Coming
    </Badge>
  );
}
