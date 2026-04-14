// oxlint-disable nextjs/no-img-element
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { TelegramOutlineIcon } from './icons/basil-telegram-outline';
import { siteConfig } from '@/lib/site-config';

const navLinks = [
  { href: '#', label: 'Features' },
  { href: '#', label: 'Blog' },
  { href: '#', label: 'About' },
  { href: '#', label: 'Contact' },
  { href: '#', label: 'Licence' },
  { href: '#', label: 'Privacy' },
];

export function Footer() {
  return (
    <footer className="mx-auto max-w-5xl pb-16 *:px-4 *:md:px-6">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {' '}
            <Image
              alt={siteConfig.meta.name}
              src="/assets/images/logo.webp"
              title={siteConfig.meta.title}
              width={155}
              height={40}
              style={{ width: '155px', height: '40px' }}
              loading="eager"
            />
          </div>
        </div>

        <nav>
          <ul className="text-muted-foreground flex flex-wrap gap-4 text-sm font-medium md:gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a className="hover:text-foreground" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Button size={'lg'} className="w-fit bg-[#0088cc] text-white hover:bg-[#0077b3]" variant="default">
          <TelegramOutlineIcon /> Join Telegram
        </Button>
      </div>

      <div className="text-muted-foreground flex items-center justify-center border-t py-4 text-sm">
        <p className="inline-flex items-center gap-1">
          <span>Built and development by</span>
          <a
            aria-label="x/twitter"
            className="text-foreground/80 hover:text-foreground inline-flex items-center gap-1 hover:underline"
            href={'https://github.com/devgauravjatt'}
            title="devgauravjatt"
            rel="noreferrer"
            target="_blank"
          >
            <img
              alt="devgauravjatt"
              className="size-4 rounded-full"
              height="auto"
              src="https://avatars.githubusercontent.com/u/134186834?v=4"
              width="auto"
            />
            devgauravjatt
          </a>
        </p>
      </div>
    </footer>
  );
}
