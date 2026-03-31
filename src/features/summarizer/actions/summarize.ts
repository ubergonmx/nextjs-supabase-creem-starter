'use server';

import { spendCredits } from '@/features/credits/actions/credits';
import { getUserSubscription } from '@/features/billing/actions/subscription';

const CREDIT_COST = 1;

// Mock summaries – in a real app this would call an AI API
const MOCK_SUMMARIES = [
  'The provided text discusses several key themes and ideas. The main point centers around the core subject matter, highlighting important relationships and outcomes. Key takeaways include the primary argument and its supporting evidence.',
  'This content covers the essential aspects of the topic at hand. The author presents a structured overview that emphasizes critical factors and their implications. The conclusion drawn is clear and actionable.',
  'The text outlines a comprehensive perspective on the subject. Notable elements include the foundational concepts and their practical applications. The overall narrative supports a coherent understanding of the material.',
];

export type SummarizeResult =
  | { success: true; summary: string; creditsUsed: number; isUnlimited: boolean }
  | { success: false; error: string };

export async function summarizeText(text: string): Promise<SummarizeResult> {
  if (!text || text.trim().length < 10) {
    return { success: false, error: 'Please enter at least 10 characters to summarize.' };
  }
  if (text.trim().length > 2000) {
    return { success: false, error: 'Text must be under 2,000 characters.' };
  }

  // Check if the user is on the Business plan (unlimited credits)
  const subscription = await getUserSubscription();
  const isActive =
    subscription?.status === 'active' || subscription?.status === 'trialing';
  const isUnlimited =
    isActive && subscription?.planId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BUSINESS;

  if (!isUnlimited) {
    const result = await spendCredits(CREDIT_COST, 'AI text summarization');
    if (!result.success) {
      return {
        success: false,
        error: result.error ?? 'Failed to spend credits. Please try again.',
      };
    }
  }

  // Pick a deterministic mock summary based on text length
  const index = text.trim().length % MOCK_SUMMARIES.length;
  const summary = MOCK_SUMMARIES[index];

  return { success: true, summary, creditsUsed: isUnlimited ? 0 : CREDIT_COST, isUnlimited };
}
