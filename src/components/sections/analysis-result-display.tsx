'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Flag, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';
import ReportJobDialog from '../report-job-dialog';
import { Badge } from '../ui/badge';

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

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function AnalysisResultDisplay({ result, onReset }: AnalysisResultDisplayProps) {
  const [isReportDialogOpen, setReportDialogOpen] = React.useState(false);

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

  const riskInfo = getRiskInfo(result.riskLevel);

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
                <TrustScoreCircle score={result.score} />
              </div>
              <div className="space-y-6">
                  <div>
                      <h3 className="font-semibold">AI Reasoning</h3>
                      <p className="text-sm text-muted-foreground">{result.reasoning}</p>
                  </div>
                  {result.suspiciousTerms.length > 0 && (
                      <div>
                          <h3 className="font-semibold">Suspicious Terms Found</h3>
                          <div className="flex flex-wrap gap-2 pt-2">
                              {result.suspiciousTerms.map(term => (
                                  <Badge key={term} variant="destructive">{term}</Badge>
                              ))}
                          </div>
                      </div>
                  )}
                  <div className="space-y-2 rounded-md border p-4">
                      <h4 className="font-medium">Your Input Summary</h4>
                      <p className="text-sm text-muted-foreground"><strong>Company:</strong> {result.formData.companyName}</p>
                       <p className="text-sm text-muted-foreground truncate"><strong>Link:</strong> {result.formData.jobLink}</p>
                  </div>
              </div>
            </CardContent>
            <div className="flex flex-col items-center justify-center gap-4 border-t p-6 sm:flex-row">
              <Button onClick={onReset}>
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
