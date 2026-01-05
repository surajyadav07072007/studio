import { config } from 'dotenv';
config();

import '@/ai/flows/predict-job-risk-level.ts';
import '@/ai/flows/analyze-job-description-for-suspicious-terms.ts';
import '@/ai/flows/extract-text-from-image.ts';
