'use client';

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { performJobAnalysis } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import type { AnalysisResult, VerificationFormData } from '@/lib/types';
import { Switch } from '../ui/switch';
import AnalysisResultDisplay from './analysis-result-display';

const FormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  jobLink: z.string().url('Please enter a valid URL.').or(z.literal('')).optional(),
  recruiterEmail: z.string().email('Please enter a valid email.').or(z.literal('')).optional(),
  jobDescription: z.string().max(5000, 'Job description must be less than 5000 characters.'),
  jobScreenshot: z.string().optional(),
  websiteSecure: z.boolean(),
  websiteIsNew: z.boolean(),
  emailDomainMatchesCompany: z.boolean(),
}).refine(data => !!data.jobDescription || !!data.jobScreenshot, {
  message: "Either a job description or a screenshot is required.",
  path: ["jobDescription"],
});

interface VerificationPanelProps {
    onAnalysisComplete: (result: AnalysisResult) => void;
    setLoading: (loading: boolean) => void;
    isLoading: boolean;
    analysisResult: AnalysisResult | null;
    onReset: () => void;
}

export default function VerificationPanel({ 
    onAnalysisComplete, 
    setLoading, 
    isLoading,
    analysisResult,
    onReset
}: VerificationPanelProps) {
  
  const { toast } = useToast();
  const form = useForm<VerificationFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      companyName: '',
      jobLink: '',
      recruiterEmail: '',
      jobDescription: '',
      jobScreenshot: '',
      websiteSecure: true,
      websiteIsNew: false,
      emailDomainMatchesCompany: true,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('jobScreenshot', reader.result as string);
        toast({ title: "Image uploaded successfully!" });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<VerificationFormData> = async (data) => {
    setLoading(true);
    const result = await performJobAnalysis(data);
    setLoading(false);

    if (result.success) {
      onAnalysisComplete(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: result.error,
      });
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
    return <AnalysisResultDisplay result={analysisResult} onReset={onReset} />;
  }

  return (
    <section id="verify" className="w-full scroll-mt-20 py-12 md:py-24 lg:py-32 bg-card">
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
                          <Input type="text" placeholder="e.g. Acme Corporation" {...field} />
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
                        <FormLabel>Job/Internship Link (Optional)</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="https://example.com/job/123" {...field} />
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
                      <FormLabel>Recruiter Email (Optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="recruiter@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
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
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                            Or
                            </span>
                        </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="jobScreenshot"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload a screenshot</FormLabel>
                           <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              className="pt-2 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                              onChange={handleFileChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>


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
