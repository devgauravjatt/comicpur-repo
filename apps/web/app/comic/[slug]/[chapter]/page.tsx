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
    const response = await honoClient.api.v1.user.read.chapter
      .$get(
        {
          query: {
            chap: chapter,
            comic: slug,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(async (res) => await res.json());

    if (!response.success) return null;
    return response;
  } catch (error) {
    console.error('Failed to fetch comic detail:', error);
    return null;
  }
}

export default async function page({ params }: { params: { slug: string; chapter: string } }) {
  const { slug, chapter } = await params;
  const chapterDetail = await getFullChapter(slug, chapter);

  if (!chapterDetail) return notFound();

  const isLimitReached = 'limitInfo' in chapterDetail.data && !chapterDetail.data.limitInfo.allowed;

  if (isLimitReached && 'limitInfo' in chapterDetail.data) {
    const limitInfo = chapterDetail.data.limitInfo;
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <Card className="w-full max-w-md border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <Lock className="size-8 text-destructive" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-bold">Read Limit Reached</h2>
            <p className="text-muted-foreground mb-6">
              {limitInfo.reason || "You've reached your daily reading limit. Please wait before reading more."}
            </p>
            {limitInfo.resetAt && (
              <div className="mb-6 flex items-center justify-center gap-2 text-sm font-medium">
                <Clock className="size-4" />
                <span>Resets at: {new Date(limitInfo.resetAt).toLocaleTimeString()}</span>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <Link href={`/comic/${slug}`}>
                <Button className="w-full" variant="outline">
                  <ChevronLeft className="mr-2 size-4" />
                  Back to Comic
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full" variant="ghost">
                  <Home className="mr-2 size-4" />
                  Go Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!chapterDetail.data.chapter) return notFound();

  const { title, images } = chapterDetail.data.chapter;
  const limitInfo = 'limitInfo' in chapterDetail.data ? chapterDetail.data.limitInfo : null;

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Header Navigation */}
      <div className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-2">
          <Link href={`/comic/${slug}`}>
            <Button variant="ghost" size="icon" className="size-9">
              <ChevronLeft className="size-5" />
            </Button>
          </Link>
          <h1 className="mx-4 truncate text-sm font-semibold md:text-base">{title}</h1>
          <Link href="/">
            <Button variant="ghost" size="icon" className="size-9">
              <Home className="size-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center bg-black/5 dark:bg-white/5">
          {images.map((image, index) => (
            <div key={image} className="relative w-full overflow-hidden">
              <CustomImage
                src={image}
                alt={`${title} - Page ${index + 1}`}
                width={1200}
                height={1600}
                className="h-auto w-full object-contain"
                unoptimized={true}
                priority={index < 2}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Limit Info Box */}
      {limitInfo && (
        <div className="fixed bottom-18 left-0 right-0 z-40 px-4 pointer-events-none md:bottom-20">
          <div className="mx-auto max-w-md pointer-events-auto">
            <Card className="border-primary/20 bg-background/95 shadow-lg backdrop-blur-sm">
              <CardContent className="flex items-center justify-between p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Info className="size-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Reading Limit
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{limitInfo.remaining} reads left</span>
                      {limitInfo.remaining <= 2 && (
                        <Badge variant="destructive" className="h-4 px-1 text-[10px] uppercase">
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
                        Resets{' '}
                        {new Date(limitInfo.resetAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {limitInfo.remaining === 0 && (
                      <Badge variant="outline" className="mt-1 text-[10px] text-destructive border-destructive/20">
                        Limit Reached
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Scroll to top / navigation could be added here if needed */}
    </div>
  );
}
