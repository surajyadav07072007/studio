'use server';

/**
 * @fileOverview Analyzes a job description for suspicious terms.
 *
 * - analyzeJobDescriptionForSuspiciousTerms - A function that analyzes the job description for suspicious terms.
 * - AnalyzeJobDescriptionForSuspiciousTermsInput - The input type for the analyzeJobDescriptionForSuspiciousTerms function.
 * - AnalyzeJobDescriptionForSuspiciousTermsOutput - The return type for the analyzeJobDescriptionForSuspiciousTerms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeJobDescriptionForSuspiciousTermsInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The job description to analyze for suspicious terms.'),
});
export type AnalyzeJobDescriptionForSuspiciousTermsInput = z.infer<
  typeof AnalyzeJobDescriptionForSuspiciousTermsInputSchema
>;

const AnalyzeJobDescriptionForSuspiciousTermsOutputSchema = z.object({
  isSuspicious: z
    .boolean()
    .describe('Whether the job description contains suspicious terms.'),
  suspiciousTerms: z
    .array(z.string())
    .describe('The list of suspicious terms found in the job description.'),
  reason: z
    .string()
    .describe('The reason why the job description is suspicious.'),
});
export type AnalyzeJobDescriptionForSuspiciousTermsOutput = z.infer<
  typeof AnalyzeJobDescriptionForSuspiciousTermsOutputSchema
>;

export async function analyzeJobDescriptionForSuspiciousTerms(
  input: AnalyzeJobDescriptionForSuspiciousTermsInput
): Promise<AnalyzeJobDescriptionForSuspiciousTermsOutput> {
  return analyzeJobDescriptionForSuspiciousTermsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeJobDescriptionForSuspiciousTermsPrompt',
  input: {schema: AnalyzeJobDescriptionForSuspiciousTermsInputSchema},
  output: {schema: AnalyzeJobDescriptionForSuspiciousTermsOutputSchema},
  prompt: `You are an expert in identifying fraudulent job postings. Analyze the following job description for suspicious terms such as unrealistic salary, requests to pay fees, urgent joining, or limited seats. Return a boolean value indicating whether the job is suspicious, a list of suspicious terms found, and a reason for the determination.\n\nJob Description: {{{jobDescription}}}`,
});

const analyzeJobDescriptionForSuspiciousTermsFlow = ai.defineFlow(
  {
    name: 'analyzeJobDescriptionForSuspiciousTermsFlow',
    inputSchema: AnalyzeJobDescriptionForSuspiciousTermsInputSchema,
    outputSchema: AnalyzeJobDescriptionForSuspiciousTermsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
