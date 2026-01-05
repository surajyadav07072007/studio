'use server';

import { z } from 'zod';
import { analyzeJobDescriptionForSuspiciousTerms } from '@/ai/flows/analyze-job-description-for-suspicious-terms';
import { predictJobRiskLevel } from '@/ai/flows/predict-job-risk-level';
import { extractTextFromImage } from '@/ai/flows/extract-text-from-image';
import type { AnalysisResult, VerificationFormData } from '@/lib/types';

const FormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  jobLink: z.string().url('Please enter a valid URL.').or(z.literal('')).optional(),
  recruiterEmail: z.string().email('Please enter a valid email.').or(z.literal('')).optional(),
  jobDescription: z.string().max(5000, 'Job description must be less than 5000 characters.').optional(),
  jobScreenshot: z.string().optional(),
  websiteSecure: z.boolean(),
  websiteIsNew: z.boolean(),
  emailDomainMatchesCompany: z.boolean(),
}).refine(data => !!data.jobDescription || !!data.jobScreenshot, {
  message: "Either a job description or a screenshot is required.",
  path: ["jobDescription"],
});

function mapRiskToScore(riskLevel: 'safe' | 'be careful' | 'fake'): number {
  switch (riskLevel) {
    case 'safe':
      return 90;
    case 'be careful':
      return 60;
    case 'fake':
      return 25;
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
    const { companyName, jobScreenshot } = validatedFields.data;
    let jobDescription = validatedFields.data.jobDescription || '';

    // Step 1: If there's a screenshot, extract text from it
    if (jobScreenshot) {
      const extractionResult = await extractTextFromImage({ image: jobScreenshot });
      if (extractionResult.text) {
        // Prepend a note about the source
        const screenshotText = `[Text extracted from screenshot]:\n${extractionResult.text}`;
        // Combine with user-provided text if any
        jobDescription = jobDescription ? `${jobDescription}\n\n${screenshotText}` : screenshotText;
      }
    }
    
    if (!jobDescription) {
      return {
        success: false,
        error: 'Could not extract any text from the image. Please provide a clearer image or manually enter the job description.',
      };
    }

    // Step 2: Analyze job description for suspicious terms
    const suspiciousTermsAnalysis = await analyzeJobDescriptionForSuspiciousTerms({
      jobDescription,
    });

    // Step 3: Predict job risk level
    const riskPrediction = await predictJobRiskLevel({
      ...validatedFields.data,
      jobDescription: jobDescription, // Use the potentially combined description
      websiteAgeDays: validatedFields.data.websiteIsNew ? 30 : 365, // Simulate age
      suspiciousTermsPresent: suspiciousTermsAnalysis.isSuspicious,
    });

    const score = mapRiskToScore(riskPrediction.riskLevel);
    
    // Generate a more stable unique ID
    const uniqueId = `${companyName.replace(/\s+/g, '-')}-${Date.now()}`;

    const result: AnalysisResult = {
      ...riskPrediction,
      suspiciousTerms: suspiciousTermsAnalysis.suspiciousTerms,
      score,
      id: uniqueId,
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
