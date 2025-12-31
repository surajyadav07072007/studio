'use server';

import { z } from 'zod';
import { analyzeJobDescriptionForSuspiciousTerms } from '@/ai/flows/analyze-job-description-for-suspicious-terms';
import { predictJobRiskLevel } from '@/ai/flows/predict-job-risk-level';
import type { AnalysisResult, VerificationFormData } from '@/lib/types';

const FormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  jobLink: z.string().url('Please enter a valid URL.').or(z.literal('')).optional(),
  recruiterEmail: z.string().email('Please enter a valid email.').or(z.literal('')).optional(),
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters.'),
  websiteSecure: z.boolean(),
  websiteIsNew: z.boolean(),
  emailDomainMatchesCompany: z.boolean(),
});

function mapRiskToScore(riskLevel: 'safe' | 'be careful' | 'fake'): number {
  switch (riskLevel) {
    case 'safe':
      return 90; // 80-100
    case 'be careful':
      return 60; // 40-79
    case 'fake':
      return 25; // 10-39
    default:
      return 0;
  }
}

export async function performJobAnalysis(
  formData: VerificationFormData
): Promise<{ success: true; data: AnalysisResult } | { success: false; error: string }> {
  const validatedFields = FormSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: 'Invalid form data provided.',
    };
  }

  try {
    const { jobDescription } = validatedFields.data;

    // Step 1: Analyze job description for suspicious terms
    const suspiciousTermsAnalysis = await analyzeJobDescriptionForSuspiciousTerms({
      jobDescription,
    });

    // Step 2: Predict job risk level
    const riskPrediction = await predictJobRiskLevel({
      ...validatedFields.data,
      websiteAgeDays: validatedFields.data.websiteIsNew ? 30 : 365, // Simulate age
      suspiciousTermsPresent: suspiciousTermsAnalysis.isSuspicious,
    });

    const score = mapRiskToScore(riskPrediction.riskLevel);

    const result: AnalysisResult = {
      ...riskPrediction,
      suspiciousTerms: suspiciousTermsAnalysis.suspiciousTerms,
      score,
      id: new Date().toISOString(),
      formData,
    };

    return { success: true, data: result };
  } catch (error) {
    console.error('Error during job analysis:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during analysis. Please try again later.',
    };
  }
}
