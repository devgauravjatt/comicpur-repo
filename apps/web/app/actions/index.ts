// oxlint-disable no-unused-vars
'use server';
import translate from 'translate';

import type { InferRequestType, InferResponseType } from 'hono/client';
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
    return null;
  }
}

const chaptersListAndActionGet = honoClient.api.v1.public.chapters.$get;
export type chaptersListAndActionBody = InferResponseType<typeof chaptersListAndActionGet>;

export async function chaptersListAndAction(page: number = 1, comicId: number) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const token = (await cookies()).get('token')?.value;
  try {
    const response = await honoClient.api.v1.public.chapters.$get(
      {
        query: {
          page: page.toString(),
          comicId,
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
  } catch (_error) {
    return null;
  }
}

const updateComicPut = honoClient.api.v1.admin.comics.$put;
export type updateComicActionBody = InferRequestType<typeof updateComicPut>['json'];

export async function updateComicAction(req: updateComicActionBody) {
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
    return null;
  }
}

export async function deleteChapterAction(id: number) {
  const token = (await cookies()).get('token')?.value;
  try {
    const response = await honoClient.api.v1.admin.chapters[':id'].$delete(
      {
        param: {
          id: id.toString(),
        },
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
    return null;
  }
}

export async function getLastChapterNumberAction(comicId: number) {
  const token = (await cookies()).get('token')?.value;
  try {
    const response = await honoClient.api.v1.admin.chapters['count']['last'][':comicId'].$get(
      {
        param: {
          comicId: comicId.toString(),
        },
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
    return null;
  }
}

export async function createChapterAction(req: {
  title: string;
  comicId: number;
  chapterNumber: number;
  images: string[];
}) {
  const token = (await cookies()).get('token')?.value;
  try {
    const response = await honoClient.api.v1.admin.chapters.$post(
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
    console.log('🚀 ~ createChapterAction ~ data :- ', data);

    return data;
  } catch (error) {
    return null;
  }
}

export async function getComicBySlugAction(slug: string) {
  try {
    const response = await honoClient.api.v1.public.comics.$get({
      query: {
        slug,
      },
    });

    const data = await response.json();

    if (!data.success) return null;
    return data;
  } catch (error) {
    return null;
  }
}

const createComicPost = honoClient.api.v1.admin.comics.$post;
export type createComicActionBody = InferRequestType<typeof createComicPost>['json'];

export async function createComicAction(req: createComicActionBody) {
  const token = (await cookies()).get('token')?.value;
  try {
    const response = await honoClient.api.v1.admin.comics.$post(
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
    return null;
  }
}

export async function translateComicTitleAction(comicTitle: string) {
  try {
    const res = await translate(comicTitle, { from: 'en', to: 'hi' });
    return res ? `${comicTitle} - ${res}` : comicTitle;
  } catch (_error) {
    return comicTitle;
  }
}
