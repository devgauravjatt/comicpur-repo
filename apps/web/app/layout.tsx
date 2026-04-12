import type { Metadata } from 'next';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';
import Header from '@/components/header';
import '@fontsource-variable/merriweather/standard.css';
import honoClient from '@/hono/client';
import { Footer } from '@/components/footer';
import { BottomNav } from '@/components/bottom-nav';
import { siteConfig } from '@/lib/site-config';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: siteConfig.meta.title,
  description: siteConfig.meta.description,
  keywords: siteConfig.meta.keywords,
  authors: [{ name: siteConfig.meta.author }],
  publisher: siteConfig.meta.name,
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: siteConfig.meta.title,
    description: siteConfig.meta.description,
    url: siteConfig.meta.url,
    siteName: siteConfig.meta.name,
    images: [
      {
        url: siteConfig.meta.url + '/og-image.png',
        width: 1200,
        height: 630,
        alt: siteConfig.meta.name,
      },
    ],
  },
  twitter: {
    title: siteConfig.meta.title,
    card: 'summary_large_image',
  },
  alternates: {
    canonical: siteConfig.meta.url,
    languages: {
      'en-US': '/en-US',
      'hi-IN': '/hi-IN',
    },
  },
};

async function HeaderWithUser() {
  const token = (await cookies()).get('token')?.value;

  const res = await honoClient.api.v1.user.profile.$get(
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  const data = await res.json();
  return <Header user={data.user} />;
}

function NavLoding() {
  return (
    <div>
      <h2>loading</h2>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` antialiased flex min-h-dvh w-full dark`}>
        <TooltipProvider>
          <div className="flex flex-1 flex-col">
            <Suspense fallback={<Header user={null} />}>
              <HeaderWithUser />
            </Suspense>
            <main className="mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
              <div className="h-full">{children}</div>
            </main>
            <div className="w-full">
              <Footer />
            </div>
          </div>
          <Suspense fallback={<NavLoding />}>
            <BottomNav />
          </Suspense>
        </TooltipProvider>
      </body>
    </html>
  );
}
