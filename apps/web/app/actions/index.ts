'use server';

import honoClient from '@/hono/client';
import { cookies } from 'next/headers';

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
        query: { slug: slug, page: page.toString() },
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

export async function comicsListAndSearchAction(page: number = 1, search?: string) {
  console.log('🚀 ~ comicsListAndSearchAction ~ page: search :- ', page, search);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const token = (await cookies()).get('token')?.value;
  try {
    const response = await honoClient.api.v1.admin.comics.list.$get(
      {
        query: {
          search,
          page: page.toString(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!data.success || !data.data) return null;
    return data;
  } catch (error) {
    console.log('🚀 comicsListAndSearchAction error :- ', error);
    return null;
  }
}

import type { InferRequestType } from 'hono/client';

const $put = honoClient.api.v1.admin.comics.$put;
export type ReqType = InferRequestType<typeof $put>['json'];

export async function updateComicAction(req: ReqType) {
  const token = (await cookies()).get('token')?.value;
  try {
    const response = await honoClient.api.v1.admin.comics.$put(
      {
        json: req,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.log('🚀 updateComicAction error :- ', error);
    return null;
  }
}
