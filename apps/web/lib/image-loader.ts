const myImageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number | undefined }) => {
  const url = new URL('/api/image', 'http://localhost:3000');

  url.searchParams.set('url', src);
  url.searchParams.set('w', width.toString());
  url.searchParams.set('q', String(quality || 75));

  return url.toString();
};

export default myImageLoader;
