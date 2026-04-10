import honoClient from '@/hono/client';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Home, Lock, Clock, Info, LogIn, Zap } from 'lucide-react';
import Link from 'next/link';
import CustomImage from '@/components/CustomImage';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);

interface LimitInfoType {
  allowed: boolean;
  reason: string;
  remaining: number;
  waitTime: number;
}

function formatDuration(ms: number) {
  console.log('🚀 ~ formatDuration ~ ms :- ', ms);
  const wait = dayjs.duration(ms);
  console.log('🚀 ~ formatDuration ~ wait :- ', wait);
  return `${wait.hours()}h ${wait.minutes()}m ${wait.seconds()}s`;
}

// --- Components ---

function UnauthorizedCard() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
      <Card className="w-full max-w-md border-primary/20 bg-primary/5 shadow-none">
        <CardContent className="pt-8">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <LogIn className="size-10 text-primary" />
            </div>
          </div>
          <h2 className="mb-3 text-2xl font-bold">Login Required</h2>
          <p className="text-muted-foreground mb-8 text-sm">Please log in to your account to read this chapter.</p>
          <div className="flex flex-col gap-3">
            <Button asChild className="h-12 w-full rounded-2xl text-base font-semibold">
              <Link href="/login">Login to Continue</Link>
            </Button>
            <Button asChild variant="ghost" className="h-12 w-full rounded-2xl">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LimitReachedCard({ slug, limitInfo }: { slug: string; limitInfo: LimitInfoType }) {
  const isFullLimit = limitInfo.reason === 'limit_reached';

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
      <div className="relative w-full max-w-md overflow-hidden">
        {/* Premium Background Accent */}
        <div className="absolute -mt-16 -mr-16 top-0 right-0 h-32 w-32 rounded-full" />

        <div className="relative z-10 px-6 pt-10 pb-8">
          <div className="mb-6 flex justify-center">
            <span className="animate-bounce bg-destructive/10 text-destructive border-destructive/20 px-4 py-1 text-xs font-black uppercase tracking-widest">
              Today&apos;s Limit Reached
            </span>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-destructive/20 blur-xl" />
              <div className="relative rounded-full border border-destructive/20 bg-destructive/10 p-5">
                <Lock className="size-12 text-destructive" />
              </div>
            </div>
          </div>

          <h2 className="mb-4 text-2xl font-black tracking-tight text-destructive">
            {isFullLimit ? 'Daily Reading Limit' : 'Access Restricted'}
          </h2>

          <p className="text-muted-foreground mb-8 px-2 text-sm leading-relaxed">
            {isFullLimit
              ? "You've exhausted your free daily chapters. Unlock Pro to read unlimited chapters right now!"
              : limitInfo.reason}
          </p>

          <div className="mb-8 flex justify-center">
            <div className="rounded-2xl border border-border bg-background/80 p-4 shadow-sm w-full max-w-55">
              <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                <Clock className="size-3" />
                <span>Wait Time</span>
              </div>
              <div className="text-amber-600 text-xl font-black tracking-tight tabular-nums">
                {formatDuration(limitInfo.waitTime)}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              asChild
              size="lg"
              className="h-14 w-full border-none bg-amber-500 text-base font-bold text-white shadow-lg shadow-amber-500/20 hover:bg-amber-600 rounded-2xl"
            >
              <Link href="/plan">
                <Zap className="mr-2 size-5 fill-white" />
                Unlock Unlimited with Pro
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                asChild
                variant="outline"
                className="h-12 border-border text-sm font-semibold hover:bg-accent rounded-2xl"
              >
                <Link href={`/comic/${slug}`}>
                  <ChevronLeft className="mr-1.5 size-4" />
                  Comic Info
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 border-border text-sm font-semibold hover:bg-accent rounded-2xl"
              >
                <Link href="/">
                  <Home className="mr-1.5 size-4" />
                  Browse More
                </Link>
              </Button>
            </div>
          </div>

          <p className="mt-8 text-[11px] text-muted-foreground/60">
            Enjoying Comicpur? Join 10k+ readers on our Pro Plan!
          </p>
        </div>
      </div>
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
        <Card className="border-primary/20 bg-background/95 shadow-lg backdrop-blur-sm overflow-hidden">
          {isLow && <div className="absolute top-0 left-0 h-1 bg-amber-500 w-full animate-pulse" />}
          <CardContent className="flex items-center justify-between p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className={cn('rounded-full p-2', isLow ? 'bg-amber-500/10' : 'bg-primary/10')}>
                <Info className={cn('size-4', isLow ? 'text-amber-600' : 'text-primary')} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground leading-none mb-1">
                  Reading Limit
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tabular-nums">
                    {isFull ? 'Limit Reached' : `${limitInfo.remaining} chapters left`}
                  </span>
                  {isLow && !isFull && (
                    <Badge
                      variant="destructive"
                      className="h-4 px-1 text-[8px] uppercase bg-amber-500 hover:bg-amber-600 border-none"
                    >
                      Low
                    </Badge>
                  )}
                  {isFull && (
                    <Badge variant="destructive" className="h-4 px-1 text-[8px] uppercase animate-pulse">
                      Full
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                asChild
                size="sm"
                variant={isLow ? 'default' : 'outline'}
                className={cn(
                  'h-8 px-3 text-[11px] font-bold uppercase rounded-lg',
                  isLow && 'bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm',
                )}
              >
                <Link href="/user#billing">
                  {isLow ? <Zap className="mr-1 size-3 fill-current" /> : null}
                  {isFull ? 'Unlock Now' : 'Upgrade'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Main Page ---

export default async function Page({ params }: { params: { slug: string; chapter: string } }) {
  const { slug, chapter } = await params;
  const token = (await cookies()).get('token')?.value;
  const res = await honoClient.api.v1.user.read.chapter.$get(
    { query: { chap: chapter, comic: slug } },
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (res.status === 401) {
    return <UnauthorizedCard />;
  }

  if (res.status === 404) {
    return notFound();
  }

  const data = await res.json();

  if (!data.success) return notFound();
  if (!data.data) return notFound();

  // Handle access limit
  if (data.data.limitInfo && data.data.limitInfo.remaining <= 0) {
    console.log('🚀 ~ Page ~ limitInfo :- ', data.data.limitInfo);
    return <LimitReachedCard slug={slug} limitInfo={data.data.limitInfo} />;
  }

  const chapterData = data.data.chapter;

  if (!chapterData) return notFound();

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

      {data.data.limitInfo && <ReadingLimitOverlay limitInfo={data.data.limitInfo} />}
    </div>
  );
}
