import honoClient from '@/hono/client';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { notFound } from 'next/navigation';

async function getFullChapter(slug: string, chapter: string) {
  const token = (await cookies()).get('token')?.value;
  console.log('🚀 ~ getFullChapter ~ token :- ', token);
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

  if ('limitInfo' in chapterDetail.data) {
    const limitInfo = chapterDetail.data.limitInfo;
    if (!limitInfo.allowed) {
      return (
        <div>
          <p>Read limit reached.</p>
        </div>
      );
    }
  }
  if (!chapterDetail.data.chapter) return notFound();
  return (
    <div>
      <h2>{chapterDetail.data.chapter.title}</h2>
      <div>
        {chapterDetail.data.chapter.images.map((image) => (
          <Image unoptimized={true} width={640} height={480} key={image} src={image} alt={chapter} />
        ))}
      </div>
    </div>
  );
}
