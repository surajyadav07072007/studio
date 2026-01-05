'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShieldCheck, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReportJobDialog from '../report-job-dialog';

export default function Header() {
  const [isReportDialogOpen, setReportDialogOpen] = React.useState(false);

  const navLinks = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'History', href: '#history' },
    { name: 'About Us', href: '#about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">VeriJob</span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm md:flex lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-foreground/60 transition-colors hover:text-foreground/80"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setReportDialogOpen(true)} className="hidden sm:flex">
                <Flag className="mr-2 h-4 w-4" />
                Report a Scam
            </Button>
            <Button asChild>
              <Link href="#verify">Start Verification</Link>
            </Button>
          </div>
        </div>
      </header>
      <ReportJobDialog open={isReportDialogOpen} onOpenChange={setReportDialogOpen} />
    </>
  );
}
