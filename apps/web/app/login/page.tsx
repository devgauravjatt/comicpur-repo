import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site-config';
import Link from 'next/link';
import envConfig from '@/envConfig';

export default function Page() {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="w-full max-w-100 space-y-10">
        <div className="flex flex-col items-center text-center">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Welcome to {siteConfig.meta.name}
            </h1>
            <p className="mx-auto max-w-[320px] text-balance text-sm text-muted-foreground sm:text-base">
              Sign in to your account to continue discovering and sharing amazing comics.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="grid gap-4">
            <Link href={envConfig.AUTH_URL}>
              <Button
                variant={'outline'}
                size="lg"
                className="w-full gap-3 font-semibold transition-all hover:bg-muted hover:shadow-md active:scale-[0.98]"
              >
                <Image src="/google-icon.webp" alt="Google" width={20} height={20} className="shrink-0" />
                Continue with Google
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground/80 font-medium">Secure Authentication</span>
            </div>
          </div>

          <p className="px-4 text-center text-xs leading-relaxed text-muted-foreground/70 sm:px-8">
            By signing in, you agree to our{' '}
            <Link
              href="/terms"
              className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
