'use client';

import { ShieldCheck, Twitter, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 sm:flex-row sm:gap-2 sm:px-0">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by your trusted AI partner. © {currentYear} VeriJob.
          </p>
        </div>
        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="Twitter">
                    <Twitter className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="GitHub">
                    <Github className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="LinkedIn">
                    <Linkedin className="h-4 w-4" />
                </Link>
            </Button>
        </div>
      </div>
    </footer>
  );
}
