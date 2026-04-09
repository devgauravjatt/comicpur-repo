'use client';
import { LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import ProfileDropdown from './shadcn-studio/blocks/dropdown-profile';
import { siteConfig } from '@/lib/site-config';

interface HeaderProps {
  email: string;
  id: number;
  googleId: string | null;
  name: string;
  avatar: string;
}

const Header = ({ user }: { user: HeaderProps | null }) => {
  return (
    <header className="bg-card sticky top-0 z-50 border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-1 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              src="/assets/images/logo.webp"
              alt={siteConfig.meta.name}
              title={siteConfig.meta.title}
              width={155}
              height={40}
              style={{ width: '155px', height: '40px' }}
              loading="eager"
            />
          </Link>
        </div>
        <div className="flex items-center gap-1.5">
          {user ? (
            <ProfileDropdown
              user={user}
              trigger={
                <Button variant="ghost" size="icon" className="size-9.5">
                  <Avatar className="size-9.5 rounded-md">
                    <AvatarImage title={user.name} alt={user.name} src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              }
            />
          ) : (
            <Link href="/login">
              <Button variant={'secondary'}>
                <LogIn />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
