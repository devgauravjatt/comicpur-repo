'use server';

import honoClient from '@/hono/client';

export async function getComicChaptersAction(comicId: number, page: number = 1) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const response = await honoClient.api.v1.public.chapters.$get({
      query: {
        comicId,
        page,
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log('🚀 getComicChaptersAction error :- ', error);
    return {
      success: false,
      error: 'Failed to fetch comic chapters',
      data: null,
    };
  }
}

export async function getComicesByCategorySlug(slug: string, page: number = 1) {
  // wait 5s
  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const response = await honoClient.api.v1.public.comics.category
      .$get({
        query: { slug: slug, page: page },
      })
      .then(async (res) => await res.json());
    if (!response.success || !response.data?.comics) return null;
    return response;
  } catch (error) {
    console.error('Failed to fetch comic detail:', error);
    return {
      success: false,
      error: 'Failed to fetch comic with category',
      data: null,
    };
  }
}
