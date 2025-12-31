import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Search, ShieldCheck } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <FileText className="mb-4 h-12 w-12 text-primary" />,
      title: 'Step 1: Submit Details',
      description: 'Provide the job details you have, including the job description, company name, and recruiter email.',
    },
    {
      icon: <Search className="mb-4 h-12 w-12 text-primary" />,
      title: 'Step 2: AI Analysis',
      description: 'Our AI gets to work, checking the website, verifying the email, and scanning the description for red flags.',
    },
    {
      icon: <ShieldCheck className="mb-4 h-12 w-12 text-primary" />,
      title: 'Step 3: Get Your Score',
      description: 'Receive a simple trust score from 0-100 and a detailed report, helping you decide your next move with confidence.',
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">How It Works</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">A Simple, Three-Step Process</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We make job verification straightforward. In just a few moments, you can get a comprehensive analysis of any job posting.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:grid-cols-3 md:gap-12">
          {steps.map((step, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                {step.icon}
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
