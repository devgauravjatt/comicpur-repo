import { Calendar, CreditCard, Mail, Settings, ShieldCheck, User } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import honoClient from '@/hono/client';
import { siteConfig } from '@/lib/site-config';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: siteConfig.meta.name + ' - User Profile',
};

export default async function Page() {
  const token = (await cookies()).get('token')?.value;

  const profile = await honoClient.api.v1.user.profile
    .$get(
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    .then((res) => {
      if (res.status === 401) {
        redirect('/api/auth/logout');
      }
      return res.json();
    });

  const billing = await honoClient.api.v1.user.plan
    .$get(
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    .then((res) => res.json());

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 p-4 md:p-6">
      {/* Profile Header */}
      <div id="account" className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
        <Avatar className="border-primary/10 size-24 border-2 shadow-sm md:size-32">
          <AvatarImage src={profile.user.avatar} alt={profile.user.name} />
          <AvatarFallback className="text-3xl font-bold uppercase">{profile.user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{profile.user.name}</h1>
          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <div className="flex items-center gap-2">
              <Mail className="size-4" />
              <span className="text-sm font-medium">{profile.user.email}</span>
            </div>
            {billing.premium && (
              <div className="bg-primary/10 text-primary flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold">
                <ShieldCheck className="size-3.5" />
                PRO USER
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Information Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="text-primary size-5" />
              Account Details
            </CardTitle>
            <CardDescription>Manage your personal profile information</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="grid gap-1">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Full Name</span>
              <p className="text-base font-medium">{profile.user.name}</p>
            </div>
            <div className="grid gap-1">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Email Address
              </span>
              <p className="text-base font-medium">{profile.user.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Billing Card */}
        <Card id="billing" className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="text-primary size-5" />
              Subscription
            </CardTitle>
            <CardDescription>View and manage your billing status</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {billing.premium ? (
              <div className="space-y-4">
                <div className="grid gap-1">
                  <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Current Plan
                  </span>
                  <div className="text-primary flex items-center gap-2 font-semibold">
                    <ShieldCheck className="size-4" />
                    Premium Plan
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1">
                    <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Payment Method
                    </span>
                    <p className="text-sm font-medium capitalize">{billing.premium.payMode}</p>
                  </div>
                  <div className="grid gap-1">
                    <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Expiry Date
                    </span>
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Calendar className="text-muted-foreground size-3.5" />
                      {new Date(billing.premium.expiryDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center space-y-3 py-4 text-center">
                <div className="bg-muted rounded-full p-3">
                  <CreditCard className="text-muted-foreground size-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">No Active Subscription</p>
                  <p className="text-muted-foreground text-xs">Upgrade to Premium to access all features.</p>
                </div>
                <Button asChild size="sm" className="mt-2 rounded-xl">
                  <Link href="/plan">View Plans</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card id="preferences" className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="text-primary size-5" />
              Preferences
            </CardTitle>
            <CardDescription>Personalize your experience with ComicPur</CardDescription>
          </CardHeader>
          <CardContent className="bg-muted/30 flex min-h-30 items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium italic">Settings & Preferences are coming soon</p>
              <p className="text-muted-foreground/60 text-xs">
                We&apos;re working on giving you more control on website and content preferences.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
