import honoClient from '@/hono/client';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Home, Lock, Clock, Info } from 'lucide-react';
import Link from 'next/link';
import CustomImage from '@/components/CustomImage';

async function getFullChapter(slug: string, chapter: string) {
  const token = (await cookies()).get('token')?.value;
  try {
    const res = await honoClient.api.v1.user.read.chapter.$get(
      { query: { chap: chapter, comic: slug } },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const data = await res.json();
    return data.success ? data : null;
  } catch (error) {
    console.error('Failed to fetch chapter:', error);
    return null;
  }
}

interface LimitInfoType {
  allowed: boolean;
  reason: string;
  remaining: number;
  waitTime: number;
  resetAt: number;
}

// --- Components ---

function LimitReachedCard({ slug, limitInfo }: { slug: string; limitInfo: LimitInfoType }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <Card className="w-full max-w-md border-destructive/20 bg-destructive/5 shadow-none">
        <CardContent className="pt-6">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <Lock className="size-8 text-destructive" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-destructive">Limit Reached</h2>
          <p className="text-muted-foreground mb-6 text-sm">{limitInfo.reason}</p>

          {limitInfo.resetAt && (
            <div className="mb-6 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="size-4" />
              <span>
                Resets at: {new Date(limitInfo.resetAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button asChild variant="outline" className="h-11 w-full rounded-xl">
              <Link href={`/comic/${slug}`}>
                <ChevronLeft className="mr-2 size-4" />
                Back to Comic
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-11 w-full rounded-xl">
              <Link href="/">
                <Home className="mr-2 size-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ChapterHeader({ title, slug }: { title: string; slug: string }) {
  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-2">
        <Button asChild variant="ghost" size="icon" className="size-11 rounded-full">
          <Link href={`/comic/${slug}`}>
            <ChevronLeft className="size-6" />
          </Link>
        </Button>
        <h1 className="mx-4 flex-1 truncate text-center text-sm font-semibold md:text-base">{title}</h1>
        <Button asChild variant="ghost" size="icon" className="size-11 rounded-full">
          <Link href="/">
            <Home className="size-6" />
          </Link>
        </Button>
      </div>
    </header>
  );
}

function ReadingLimitOverlay({ limitInfo }: { limitInfo: LimitInfoType }) {
  const isLow = limitInfo.remaining <= 2;
  const isFull = limitInfo.remaining === 0;

  return (
    <div className="pointer-events-none fixed bottom-18 left-0 right-0 z-40 px-4 md:bottom-20">
      <div className="pointer-events-auto mx-auto max-w-md">
        <Card className="border-primary/20 bg-background/95 shadow-lg backdrop-blur-sm">
          <CardContent className="flex items-center justify-between p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Info className="size-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Reading Limit
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{limitInfo.remaining} left</span>
                  {isLow && (
                    <Badge variant="destructive" className="h-4 px-1 text-[8px] uppercase">
                      Low
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {limitInfo.resetAt && (
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                  <Clock className="size-3" />
                  <span>
                    {new Date(limitInfo.resetAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {isFull && (
                  <Badge variant="outline" className="mt-1 border-destructive/20 text-[8px] uppercase text-destructive">
                    Full
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Main Page ---

export default async function Page({ params }: { params: { slug: string; chapter: string } }) {
  const { slug, chapter } = await params;
  const res = await getFullChapter(slug, chapter);

  if (!res?.success || !res.data.chapter) return notFound();

  const { chapter: chapterData, limitInfo } = res.data;

  // Handle access limit
  if (limitInfo && !limitInfo.allowed) {
    return <LimitReachedCard slug={slug} limitInfo={limitInfo} />;
  }

  return (
    <div className="bg-background min-h-screen pb-24">
      <ChapterHeader title={chapterData.title} slug={slug} />

      <main className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center bg-black/5 dark:bg-white/5">
          {chapterData.images.map((image, index) => (
            <div key={image} className="relative w-full overflow-hidden">
              <CustomImage
                src={image}
                alt={`${chapterData.title} - Page ${index + 1}`}
                width={1200}
                height={1600}
                className="h-auto w-full object-contain"
                unoptimized
                priority={index < 2}
              />
            </div>
          ))}
        </div>
      </main>

      {limitInfo && <ReadingLimitOverlay limitInfo={limitInfo} />}
    </div>
  );
}
