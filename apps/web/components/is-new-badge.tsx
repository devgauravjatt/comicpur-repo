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
    <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none text-[10px] h-5 px-1.5 uppercase font-bold tracking-wider">
      New
    </Badge>
  );
}
