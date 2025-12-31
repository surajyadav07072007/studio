'use client';

import * as React from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/sections/hero';
import VerificationPanel from '@/components/sections/verification-panel';
import HowItWorks from '@/components/sections/how-it-works';
import AboutUs from '@/components/sections/about-us';
import HistorySection from '@/components/sections/history';
import AnalysisResultDisplay from '@/components/sections/analysis-result-display';
import type { AnalysisResult } from '@/lib/types';
import { performJobAnalysis } from './actions';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [history, setHistory] = React.useState<AnalysisResult[]>([]);
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('verijob-history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse history from localStorage", error);
    }
  }, []);

  const handleAnalysisComplete = (newResult: AnalysisResult) => {
    try {
      const updatedHistory = [newResult, ...history].slice(0, 5); // Keep last 5
      setHistory(updatedHistory);
      localStorage.setItem('verijob-history', JSON.stringify(updatedHistory));
      setAnalysisResult(newResult);
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  };
  
  const handleReset = () => {
    setAnalysisResult(null);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <VerificationPanel 
          onAnalysisComplete={handleAnalysisComplete}
          setLoading={setIsLoading}
          isLoading={isLoading}
          analysisResult={analysisResult}
          onReset={handleReset}
        />
        <HowItWorks />
        <HistorySection history={history} />
        <AboutUs />
      </main>
      <Footer />
    </div>
  );
}
