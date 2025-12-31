'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Shield, XCircle } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';

function getRiskLevelStyles(riskLevel: string) {
  switch (riskLevel) {
    case 'safe':
      return {
        variant: 'default',
        className: 'bg-green-500 hover:bg-green-600',
        icon: <CheckCircle className="mr-2 h-4 w-4" />,
      };
    case 'be careful':
      return {
        variant: 'default',
        className: 'bg-yellow-500 hover:bg-yellow-600',
        icon: <AlertCircle className="mr-2 h-4 w-4" />,
      };
    case 'fake':
      return {
        variant: 'destructive',
        className: '',
        icon: <XCircle className="mr-2 h-4 w-4" />,
      };
    default:
      return {
        variant: 'secondary',
        className: '',
        icon: null,
      };
  }
}

export default function HistorySection({ history }: { history: AnalysisResult[] }) {
  const [selectedResult, setSelectedResult] = React.useState<AnalysisResult | null>(null);

  const prevHistoryRef = React.useRef<AnalysisResult[]>();

  React.useEffect(() => {
    // Only scroll into view if the history has actually changed and is not empty
    if (history.length > 0 && prevHistoryRef.current && history.length > prevHistoryRef.current.length) {
      const element = document.getElementById('history');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    prevHistoryRef.current = history;
  }, [history]);

  if (!history.length) {
    return null;
  }

  return (
    <section id="history" className="w-full scroll-mt-20 py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Your Recent Analyses</h2>
          <p className="text-muted-foreground md:text-xl/relaxed">
            Here are the last 5 jobs you've verified.
          </p>
        </div>
        <Card className="mt-8">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead className="text-center">Trust Score</TableHead>
                  <TableHead className="text-center">Risk Level</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => {
                  const styles = getRiskLevelStyles(item.riskLevel);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.formData.companyName}</TableCell>
                      <TableCell className="text-center font-mono">{item.score}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={styles.variant} className={styles.className}>
                          {item.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => setSelectedResult(item)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {selectedResult && (
        <Dialog open={!!selectedResult} onOpenChange={(open) => !open && setSelectedResult(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Analysis for {selectedResult.formData.companyName}</DialogTitle>
              <DialogDescription>
                Detailed breakdown of the job verification.
              </DialogDescription>
            </DialogHeader>
            <div className="grid max-h-[60vh] grid-cols-1 gap-6 overflow-y-auto p-1 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedResult.score} / 100</div>
                  <p className="text-xs text-muted-foreground">
                    Based on {getRiskLevelStyles(selectedResult.riskLevel).variant === 'destructive' ? 'multiple red flags' : 'our AI analysis'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                  {getRiskLevelStyles(selectedResult.riskLevel).icon}
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold capitalize`}>{selectedResult.riskLevel}</div>
                  <p className="text-xs text-muted-foreground">
                    Our AI's final assessment
                  </p>
                </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">AI Reasoning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{selectedResult.reasoning}</p>
                </CardContent>
              </Card>
              {selectedResult.suspiciousTerms.length > 0 && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Suspicious Terms Found</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {selectedResult.suspiciousTerms.map((term, index) => (
                      <Badge key={index} variant="destructive">{term}</Badge>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
