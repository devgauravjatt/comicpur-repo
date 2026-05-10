import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Zap, X, ArrowLeft } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';

import Link from 'next/link';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';
import { RiTelegramLine } from 'react-icons/ri';

export const metadata: Metadata = {
  title: siteConfig.meta.name + ' - Choose Your Plan',
  description: 'Upgrade to Pro for unlimited access and an ad-free experience.',
};

export default function PlanPage() {
  return (
    <div className="bg-background min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 pt-4">
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground -ml-2 w-fit">
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Back to Browse
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Choose Your Plan</h1>
            <p className="text-muted-foreground text-sm">Select the best way to enjoy your favorite comics.</p>
          </div>
        </div>

        {/* Free Plan */}
        <Card className="border-border hover:border-muted-foreground/20 relative overflow-hidden transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">{siteConfig.freePlanName} Plan</CardTitle>
            <CardDescription>Perfect for casual readers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">₹0</span>
              <span className="text-muted-foreground text-sm">/ forever</span>
            </div>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-full p-0.5">
                  <Check className="text-primary size-3.5" />
                </div>
                <span>5 Daily Free Chapters</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-full p-0.5">
                  <Check className="text-primary size-3.5" />
                </div>
                <span>Standard Reading Experience</span>
              </li>
              <li className="text-muted-foreground flex items-center gap-2">
                <div className="bg-muted rounded-full p-0.5">
                  <X className="size-3.5" />
                </div>
                <span>Contains Advertisements</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="border-primary/50 bg-primary/2 shadow-primary/5 hover:border-primary relative overflow-hidden shadow-xl transition-all">
          <div className="absolute top-0 right-0">
            <div className="bg-primary text-primary-foreground rounded-bl-lg px-3 py-1 text-[10px] font-bold tracking-wider uppercase">
              Most Popular
            </div>
          </div>
          <CardHeader>
            <div className="flex items-center justify-between pt-2">
              <CardTitle className="flex items-center gap-2">
                <Zap className="fill-primary text-primary size-5" />
                {siteConfig.proPlanName} Plan
              </CardTitle>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">UNLIMITED</Badge>
            </div>
            <CardDescription>The ultimate comic reading experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">₹{siteConfig.proPlanPrice}</span>
              <span className="text-muted-foreground text-sm">/ month</span>
            </div>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-full p-0.5">
                  <Check className="text-primary size-3.5" />
                </div>
                <span className="font-medium">Unlimited Daily Chapters</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-full p-0.5">
                  <Check className="text-primary size-3.5" />
                </div>
                <span>Ad-Free Reading</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-full p-0.5">
                  <Check className="text-primary size-3.5" />
                </div>
                <span>Early Access to New Releases</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-full p-0.5">
                  <Check className="text-primary size-3.5" />
                </div>
                <span>High-Quality Image Servers</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <h3 className="text-center text-lg font-semibold">Upgrade to Pro</h3>
            <p className="text-muted-foreground text-center text-sm">Contact admin to buy Pro</p>
            <div className="flex gap-2">
              <Button
                className="h-10 flex-1 rounded-lg bg-[#0088cc] font-semibold text-white hover:bg-[#0088cc]/90"
                variant="default"
              >
                <RiTelegramLine size={24} />
                <Link href={siteConfig.contact.telegram} target="_blank" rel="noopener noreferrer">
                  Telegram
                </Link>
              </Button>
              <Button
                className="h-10 flex-1 rounded-lg bg-[#25D366] font-semibold text-white hover:bg-[#25D366]/90"
                variant="default"
              >
                <FaWhatsapp size={24} />

                <Link href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Footer info */}
        <div className="space-y-2 pb-8 text-center">
          <p className="text-muted-foreground text-xs">Payments are processed securely. You can cancel anytime.</p>
        </div>
      </div>
    </div>
  );
}
