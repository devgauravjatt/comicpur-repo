'use client';
import { Share2 } from 'lucide-react';
import { Button } from './ui/button';

export default function ShareButton({ title, text }: { title: string; text: string }) {
  async function handleShare() {
    const url = window.location.href;
    const shareData = {
      title,
      text,
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Shared successfully');
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      console.log('Web Share API not supported');
    }
  }

  return (
    <Button
      onClick={handleShare}
      size="lg"
      variant="outline"
      className="h-12 flex-1 rounded-full px-6 sm:flex-none md:h-14"
    >
      <Share2 className="size-5" />
    </Button>
  );
}
