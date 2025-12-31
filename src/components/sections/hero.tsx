import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

  return (
    <section className="relative w-full pt-12 md:pt-24 lg:pt-32">
        {heroImage && (
            <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-10"
                data-ai-hint={heroImage.imageHint}
                priority
            />
        )}
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                AI-Powered Job Verification
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Apply with Confidence
            </h1>
            <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                Don't let job scams ruin your career search. VeriJob uses AI to analyze job postings for red flags, so you can focus on legitimate opportunities.
            </p>
            <div className="space-x-4">
                <Button asChild size="lg">
                    <Link href="#verify">
                        Verify a Job
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
        </div>
      </div>
    </section>
  );
}
