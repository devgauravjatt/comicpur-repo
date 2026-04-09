import honoClient from '@/hono/client';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Flame,
  Drama,
  Sparkles,
  Laugh,
  Swords,
  Home,
  Heart,
  Zap,
  Ghost,
  Search,
  Trophy,
  Clock,
  Smile,
  Skull,
  ChartBarStacked,
} from 'lucide-react';
import { cacheLife } from 'next/cache';

// oxlint-disable-next-line typescript/no-explicit-any
export const categoryIcons: Record<string, any> = {
  superhero: Zap,
  drama: Drama,
  fantasy: Sparkles,
  comedy: Laugh,
  action: Swords,
  'slice-of-life': Home,
  romance: Heart,
  thriller: Flame,
  supernatural: Ghost,
  mystery: Search,
  sports: Trophy,
  historical: Clock,
  heartwarming: Smile,
  horror: Skull,
};

async function getCategores() {
  'use cache';
  cacheLife('days');
  const response = await honoClient.api.v1.public.categories.$get().then((res) => res.json());
  return response;
}

export default async function page() {
  const response = await getCategores();
  if (!response.success) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Categories</h1>
        <p className="text-destructive">Failed to load categories.</p>
      </div>
    );
  }

  const { categories } = response;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-2">Browse through our collection of comic categories.</p>
        </div>
        <Badge variant="outline" className="h-6">
          {categories.length} Categories
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => {
          const Icon = categoryIcons[category.slug] || ChartBarStacked;
          return (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <CardTitle className="line-clamp-1">{category.name}</CardTitle>
                    </div>
                    {category.isAdult && (
                      <Badge variant="destructive" className="shrink-0 text-[10px] h-4 px-1">
                        18+
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-3 min-h-12 mt-2">
                    {category.description || 'No description available for this category.'}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No categories found.</p>
        </div>
      )}
    </div>
  );
}
