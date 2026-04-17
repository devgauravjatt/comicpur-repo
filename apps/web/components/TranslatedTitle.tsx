'use client';
import { translateComicTitleAction } from '@/app/actions';
import { CardTitle } from './ui/card';
import { useEffect, useMemo, useState } from 'react';

function TranslatedTitle({ comicTitle }: { comicTitle: string }) {
  const [title, setTitle] = useState(comicTitle);
  const lines = useMemo(() => title.split('-'), [title]);

  useEffect(() => {
    translateComicTitleAction(comicTitle).then((translatedTitle) => {
      setTitle(translatedTitle);
    });
  }, [comicTitle]);

  return (
    <>
      <CardTitle className="group-hover:text-primary line-clamp-1 text-sm leading-tight font-bold transition-colors">
        {lines[0]}
      </CardTitle>
      {lines[1] ? <span className="text-text-200 text-sm">&ldquo;{lines[1]}&rdquo;</span> : ''}
    </>
  );
}

export default TranslatedTitle;
