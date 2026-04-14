'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { MessageCircleMore } from 'lucide-react';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';

type FloatingContactProps = {
  whatsappUrl: string; // e.g. 919876543210
  telegramUrl: string; // e.g. myhandle
};

export function FloatingContact({ whatsappUrl, telegramUrl }: FloatingContactProps) {
  return (
    <div className="fixed right-5 bottom-18 z-50">
      <HoverCard openDelay={120} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-green-700 shadow-lg transition hover:scale-105 active:scale-95"
            aria-label="Open contact options"
          >
            <MessageCircleMore className="h-5 w-5" />
          </Button>
        </HoverCardTrigger>

        <HoverCardContent side="top" align="end" className="w-56 rounded-2xl p-2">
          <div className="flex flex-col gap-2">
            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl bg-green-950/40 text-green-600">
                <FaWhatsapp className="h-4 w-4" />
                WhatsApp
              </Button>
            </Link>

            <Link href={telegramUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl bg-sky-950/40 text-sky-600">
                <FaTelegram className="h-4 w-4" />
                Telegram
              </Button>
            </Link>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
