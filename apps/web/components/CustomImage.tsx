'use client';
import Image, { ImageProps } from 'next/image';
import myImageLoader from '@/lib/image-loader';

export default function CustomImage({ loader, ...props }: ImageProps) {
  const { alt, ...rest } = props;
  return <Image loader={loader || myImageLoader} alt={alt ?? ''} {...rest} />;
}
