'use client';

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';

import { performJobAnalysis } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, ArrowLeft, BadgeCheck, FileWarning, Loader2, Flag, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { AnalysisResult, VerificationFormData } from '@/lib/types';
import ReportJobDialog from '../report-job-dialog';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';

const FormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  jobLink: z.string().url('Please enter a valid URL.'),
  recruiterEmail: z.string().email('Please enter a valid email.'),
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters.').max(5000, 'Job description must be less than 5000 characters.'),
  websiteSecure: z.boolean(),
  websiteIsNew: z.boolean(),
  emailDomainMatchesCompany: z.boolean(),
});

const TrustScoreCircle = ({ score }: { score: number }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let colorClass = 'text-green-500';
  if (score < 40) {
    colorClass = 'text-red-500';
  } else if (score < 80) {
    colorClass = 'text-yellow-500';
  }

  return (
    <div className="relative flex h-48 w-48 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          className="text-gray-200 dark:text-gray-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <motion.circle
          className={colorClass}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold">{score}</span>
        <span className="text-sm text-muted-foreground">Trust Score</span>
      </div>
    </div>
  );
};

export default function VerificationPanel({ onAnalysisComplete }: { onAnalysisComplete: (result: AnalysisResult) => void }) {
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isReportDialogOpen, setReportDialogOpen] = React.useState(false);

  const { toast } = useToast();
  const form = useForm<VerificationFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      companyName: '',
      jobLink: '',
      recruiterEmail: '',
      jobDescription: '',
      websiteSecure: true,
      websiteIsNew: false,
      emailDomainMatchesCompany: true,
    },
  });

  const onSubmit: SubmitHandler<VerificationFormData> = async (data) => {
    setIsLoading(true);
    setAnalysisResult(null);
    const result = await performJobAnalysis(data);
    setIsLoading(false);

    if (result.success) {
      setAnalysisResult(result.data);
      onAnalysisComplete(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: result.error,
      });
    }
  };

  const getRiskInfo = (level: AnalysisResult['riskLevel']) => {
    switch (level) {
      case 'safe':
        return { icon: <CheckCircle className="h-8 w-8 text-green-500" />, title: "Looks Safe", description: "Our analysis suggests this job posting is legitimate." };
      case 'be careful':
        return { icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />, title: "Be Careful", description: "This job posting has some characteristics that warrant caution." };
      case 'fake':
        return { icon: <XCircle className="h-8 w-8 text-red-500" />, title: "Likely Fake", description: "Our analysis indicates a high risk of this being a fraudulent job posting." };
    }
  };

  if (isLoading) {
    return (
      <section id="verify" className="w-full py-12 md:py-24 lg:py-32 bg-card">
        <div className="container flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="text-2xl font-bold tracking-tighter">Analyzing...</h2>
            <p className="max-w-[600px] text-muted-foreground">Our AI is checking every detail. This will only take a moment.</p>
        </div>
      </section>
    );
  }

  if (analysisResult) {
    const riskInfo = getRiskInfo(analysisResult.riskLevel);
    return (
      <section id="result" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="mx-auto max-w-4xl">
              <CardHeader className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                    {riskInfo.icon}
                  </div>
                  <CardTitle className="mt-4 text-3xl">{riskInfo.title}</CardTitle>
                  <CardDescription className="text-lg">{riskInfo.description}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-8 md:grid-cols-2">
                <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-secondary p-6">
                  <TrustScoreCircle score={analysisResult.score} />
                </div>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold">AI Reasoning</h3>
                        <p className="text-sm text-muted-foreground">{analysisResult.reasoning}</p>
                    </div>
                    {analysisResult.suspiciousTerms.length > 0 && (
                        <div>
                            <h3 className="font-semibold">Suspicious Terms Found</h3>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {analysisResult.suspiciousTerms.map(term => (
                                    <Badge key={term} variant="destructive">{term}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="space-y-2 rounded-md border p-4">
                        <h4 className="font-medium">Your Input Summary</h4>
                        <p className="text-sm text-muted-foreground"><strong>Company:</strong> {analysisResult.formData.companyName}</p>
                         <p className="text-sm text-muted-foreground truncate"><strong>Link:</strong> {analysisResult.formData.jobLink}</p>
                    </div>
                </div>
              </CardContent>
              <div className="flex flex-col items-center justify-center gap-4 border-t p-6 sm:flex-row">
                <Button onClick={() => setAnalysisResult(null)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Check Another Job
                </Button>
                <Button variant="outline" onClick={() => setReportDialogOpen(true)}>
                  <Flag className="mr-2 h-4 w-4" /> This seems wrong, Report it
                </Button>
              </div>
            </Card>
          </motion.div>
          <ReportJobDialog open={isReportDialogOpen} onOpenChange={setReportDialogOpen} />
        </div>
      </section>
    );
  }

  return (
    <section id="verify" className="w-full py-12 md:py-24 lg:py-32 bg-card">
      <div className="container">
        <Card className="mx-auto max-w-3xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl">Verify a Job Posting</CardTitle>
            <CardDescription>Enter the details below and our AI will analyze the posting for you.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Acme Corporation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job/Internship Link</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/job/123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="recruiterEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recruiter Email</FormLabel>
                      <FormControl>
                        <Input placeholder="recruiter@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Paste the full job description here..." className="min-h-[150px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4 rounded-md border p-4">
                  <h3 className="text-sm font-medium">Additional Context</h3>
                  <p className="text-sm text-muted-foreground">Help our AI by providing some extra information.</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="websiteSecure"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Secure Website (HTTPS)</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="websiteIsNew"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>New Website (&lt;90 days)</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="emailDomainMatchesCompany"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Email Matches Company</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Verify Job Now'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
