'use server';
/**
 * @fileOverview Predicts the risk level of a job posting based on job details,
 * past fake job data, and suspicious terms in the job description.
 *
 * - predictJobRiskLevel - The main function to predict job risk level.
 * - PredictJobRiskLevelInput - The input type for the predictJobRiskLevel function.
 * - PredictJobRiskLevelOutput - The output type for the predictJobRiskLevel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictJobRiskLevelInputSchema = z.object({
  companyName: z.string().describe('The name of the company offering the job.'),
  jobLink: z.string().describe('The URL of the job posting.').optional(),
  recruiterEmail: z.string().describe('The email address of the recruiter.').optional(),
  jobDescription: z.string().describe('The full text of the job description.'),
  websiteSecure: z.boolean().describe('Whether the job posting website is secure (HTTPS).'),
  websiteAgeDays: z.number().describe('The age of the job posting website in days.'),
  emailDomainMatchesCompany: z.boolean().describe('Whether the recruiter email domain matches the company name.'),
  suspiciousTermsPresent: z.boolean().describe('Whether suspicious terms like \"pay fees\" or \"urgent joining\" are present in the job description.'),
});
export type PredictJobRiskLevelInput = z.infer<typeof PredictJobRiskLevelInputSchema>;

const PredictJobRiskLevelOutputSchema = z.object({
  riskLevel: z
    .enum(['safe', 'be careful', 'fake'])
    .describe('The predicted risk level of the job posting.'),
  reasoning: z.string().describe('The reasoning behind the risk level prediction.'),
});
export type PredictJobRiskLevelOutput = z.infer<typeof PredictJobRiskLevelOutputSchema>;

export async function predictJobRiskLevel(input: PredictJobRiskLevelInput): Promise<PredictJobRiskLevelOutput> {
  return predictJobRiskLevelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictJobRiskLevelPrompt',
  input: {schema: PredictJobRiskLevelInputSchema},
  output: {schema: PredictJobRiskLevelOutputSchema},
  prompt: `You are an AI job risk assessment tool. Analyze the following job details to determine if the job is safe, potentially risky (be careful), or likely a fake job.

Consider these factors:
- Company Name: {{{companyName}}}
- Job Link: {{{jobLink}}}
- Recruiter Email: {{{recruiterEmail}}}
- Job Description: {{{jobDescription}}}
- Website Security (HTTPS): {{{websiteSecure}}}
- Website Age (days): {{{websiteAgeDays}}}
- Email Domain Match: {{{emailDomainMatchesCompany}}}
- Suspicious Terms Present: {{{suspiciousTermsPresent}}}

Based on these factors, provide a riskLevel of either "safe", "be careful", or "fake". Also, provide a brief reasoning for your prediction.

Output in JSON format:
{
  "riskLevel": "...",
  "reasoning": "..."
}`,
});

const predictJobRiskLevelFlow = ai.defineFlow(
  {
    name: 'predictJobRiskLevelFlow',
    inputSchema: PredictJobRiskLevelInputSchema,
    outputSchema: PredictJobRiskLevelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
