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
        <h1 className="mb-6 text-3xl font-bold">Categories</h1>
        <p className="text-destructive">Failed to load categories.</p>
      </div>
    );
  }

  const { categories } = response;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-2">Browse through our collection of comic categories.</p>
        </div>
        <Badge variant="outline" className="h-6">
          {categories.length} Categories
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => {
          const Icon = categoryIcons[category.slug] || ChartBarStacked;
          return (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="group h-full cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/5 group-hover:bg-primary/10 rounded-lg p-2 transition-colors">
                        <Icon className="text-primary size-5" />
                      </div>
                      <CardTitle className="line-clamp-1">{category.name}</CardTitle>
                    </div>
                    {category.isAdult && (
                      <Badge variant="destructive" className="h-4 shrink-0 px-1 text-[10px]">
                        18+
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="mt-2 line-clamp-3 min-h-12">
                    {category.description || 'No description available for this category.'}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">No categories found.</p>
        </div>
      )}
    </div>
  );
}
