import type { PredictJobRiskLevelOutput } from "@/ai/flows/predict-job-risk-level";
import type { AnalyzeJobDescriptionForSuspiciousTermsOutput } from "@/ai/flows/analyze-job-description-for-suspicious-terms";

export type VerificationFormData = {
  companyName: string;
  jobLink: string;
  recruiterEmail: string;
  jobDescription: string;
  websiteSecure: boolean;
  websiteIsNew: boolean;
  emailDomainMatchesCompany: boolean;
};

export type AnalysisResult = PredictJobRiskLevelOutput & {
  suspiciousTerms: string[];
  score: number;
  id: string;
  formData: VerificationFormData;
};
