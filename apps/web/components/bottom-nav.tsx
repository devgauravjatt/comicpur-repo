'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Home, Search, Star, ChartBarStacked } from 'lucide-react';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Explore', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/favorites', label: 'Favorites', icon: Star },
  { href: '/categories', label: 'Categories', icon: ChartBarStacked },
];

export function BottomNav() {
  const [activePath, setActivePath] = React.useState('/');
  const pathname = usePathname();

  React.useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  return (
    <div className="bg-background/95 supports-backdrop-filter:bg-background/60 fixed right-0 bottom-0 left-0 z-50 mx-auto h-16 w-full border backdrop-blur md:max-w-7xl md:rounded-4xl">
      <div className="grid h-full w-full grid-cols-4">
        {' '}
        {/* Adjust cols for item count */}
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'inline-flex flex-col items-center justify-center p-2 text-sm font-medium transition-all hover:text-foreground/80',
              activePath === href ? 'text-foreground -mt-1 pt-1' : 'text-foreground/60',
            )}
            onClick={() => setActivePath(href)}
          >
            <Icon className="mb-0.5 h-5 w-5" />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
