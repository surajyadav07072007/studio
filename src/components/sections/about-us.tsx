import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function AboutUs() {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us-image');

  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Our Mission</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Empowering Your Career Journey</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              VeriJob was born from a simple idea: to create a safer digital space for students and recent graduates embarking on their careers. We leverage cutting-edge AI to fight back against fraudulent job postings, ensuring every opportunity you pursue is a real one.
            </p>
            <ul className="grid gap-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">Trust & Safety First</h3>
                  <p className="text-muted-foreground">Our primary goal is to protect you from scams and provide peace of mind.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">AI-Powered Verification</h3>
                  <p className="text-muted-foreground">Using advanced machine learning, we analyze every detail to give you an accurate risk assessment.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">Community-Driven</h3>
                  <p className="text-muted-foreground">Your reports and feedback help make our system smarter and the community safer for everyone.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center">
            {aboutImage && (
              <Image
                src={aboutImage.imageUrl}
                alt={aboutImage.description}
                width={600}
                height={400}
                className="overflow-hidden rounded-xl object-cover"
                data-ai-hint={aboutImage.imageHint}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
