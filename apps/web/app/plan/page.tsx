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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 pt-4">
          <Button variant="ghost" size="sm" asChild className="w-fit -ml-2 text-muted-foreground hover:text-foreground">
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Back to Browse
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Choose Your Plan</h1>
            <p className="text-sm text-muted-foreground">Select the best way to enjoy your favorite comics.</p>
          </div>
        </div>

        {/* Free Plan */}
        <Card className="relative overflow-hidden border-border transition-all hover:border-muted-foreground/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Free Plan</CardTitle>
            <CardDescription>Perfect for casual readers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">₹0</span>
              <span className="text-sm text-muted-foreground">/ forever</span>
            </div>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-0.5">
                  <Check className="size-3.5 text-primary" />
                </div>
                <span>5 Daily Free Chapters</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-0.5">
                  <Check className="size-3.5 text-primary" />
                </div>
                <span>Standard Reading Experience</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <div className="rounded-full bg-muted p-0.5">
                  <X className="size-3.5" />
                </div>
                <span>Contains Advertisements</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="relative overflow-hidden border-primary/50 bg-primary/2 shadow-xl shadow-primary/5 transition-all hover:border-primary">
          <div className="absolute top-0 right-0">
            <div className="bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground rounded-bl-lg">
              Most Popular
            </div>
          </div>
          <CardHeader>
            <div className="flex items-center justify-between pt-2">
              <CardTitle className="flex items-center gap-2">
                <Zap className="size-5 fill-primary text-primary" />
                Pro Plan
              </CardTitle>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">UNLIMITED</Badge>
            </div>
            <CardDescription>The ultimate comic reading experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">₹99</span>
              <span className="text-sm text-muted-foreground">/ month</span>
            </div>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-0.5">
                  <Check className="size-3.5 text-primary" />
                </div>
                <span className="font-medium">Unlimited Daily Chapters</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-0.5">
                  <Check className="size-3.5 text-primary" />
                </div>
                <span>Ad-Free Reading</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-0.5">
                  <Check className="size-3.5 text-primary" />
                </div>
                <span>Early Access to New Releases</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-0.5">
                  <Check className="size-3.5 text-primary" />
                </div>
                <span>High-Quality Image Servers</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-center">Upgrade to Pro</h3>
            <p className="text-sm text-muted-foreground text-center">Contact admin to buy Pro</p>
            <div className="flex gap-2">
              <Button
                className="flex-1 h-10 rounded-lg font-semibold bg-[#0088cc] text-white hover:bg-[#0088cc]/90"
                variant="default"
              >
                <RiTelegramLine size={24} />
                <Link href={siteConfig.contact.telegram} target="_blank" rel="noopener noreferrer">
                  Telegram
                </Link>
              </Button>
              <Button
                className="flex-1 h-10 rounded-lg font-semibold bg-[#25D366] text-white hover:bg-[#25D366]/90"
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
        <div className="text-center space-y-2 pb-8">
          <p className="text-xs text-muted-foreground">Payments are processed securely. You can cancel anytime.</p>
        </div>
      </div>
    </div>
  );
}
