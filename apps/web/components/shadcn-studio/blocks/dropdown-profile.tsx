import { CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  email: string;
  id: number;
  googleId: string | null;
  name: string;
  avatar: string;
}

type Props = {
  trigger: ReactNode;
  defaultOpen?: boolean;
  align?: 'start' | 'center' | 'end';
  user: HeaderProps;
};

const ProfileDropdown = ({ trigger, defaultOpen, align = 'end', user }: Props) => {
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align={align || 'end'}>
        <DropdownMenuLabel className="flex items-center gap-4 px-4 py-2.5 font-normal">
          <div className="relative">
            <Avatar className="size-10">
              <AvatarImage title={user.name} src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <span className="ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2" />
          </div>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-foreground text-lg font-semibold">{user.name}</span>
            <span className="text-muted-foreground text-base">{user.email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link href="/user">
            <DropdownMenuItem className="px-4 py-2.5 text-base">
              <UserIcon className="text-foreground size-5" />
              <span>My account</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/user#preferences">
            <DropdownMenuItem className="px-4 py-2.5 text-base">
              <SettingsIcon className="text-foreground size-5" />
              <span>Preferences</span>
            </DropdownMenuItem>
          </Link>

          <Link href="/user#billing">
            <DropdownMenuItem className="px-4 py-2.5 text-base">
              <CreditCardIcon className="text-foreground size-5" />
              <span>Subscription</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            // Remove all cookies and reload the page
            document.cookie.split(';').forEach((c) => {
              // biome-ignore lint/suspicious/noDocumentCookie: <t>
              document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
            });
            window.location.reload();
          }}
          variant="destructive"
          className="px-4 py-2.5 text-base"
        >
          <LogOutIcon className="size-5" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
