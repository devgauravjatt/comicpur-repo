import { LoaderIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

function Spinner() {
  return <LoaderIcon size={45} role="status" aria-label="Loading" className={cn('animate-spin')} />;
}

export default function Loading() {
  return (
    <div className="h-full flex items-center justify-center gap-2">
      <Spinner />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
