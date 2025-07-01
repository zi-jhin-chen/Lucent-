'use server';

/**
 * @fileOverview 此檔案定義了一個 Genkit 流程，用於分析使用者情緒與其內容之間的一致性。
 *
 * 此流程接收一份問卷作為輸入，並回饋內容是否反映了所期望的個人表達。
 * - identityExpressionAlignment - 處理一致性分析流程的函式。
 * - IdentityExpressionAlignmentInput - identityExpressionAlignment 函式的輸入型別。
 * - IdentityExpressionAlignmentOutput - identityExpressionAlignment 函式的回傳型別。
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentityExpressionAlignmentInputSchema = z.object({
  questionnaireResponses: z
    .string()
    .describe('以情緒為重點的問卷回覆。'),
  contentExamples: z
    .string()

    .describe('使用者產生的內容範例（例如，社群媒體貼文）。'),
});
export type IdentityExpressionAlignmentInput = z.infer<
  typeof IdentityExpressionAlignmentInputSchema
>;

const IdentityExpressionAlignmentOutputSchema = z.object({
  alignmentScore: z
    .number()
    .describe(
      '代表使用者情緒與內容之間一致性的數值分數（0-100）。'
    ),
  feedback: z
    .string()
    .describe(
      '關於一致性的質性回饋，並提出改善建議。'
    ),
});
export type IdentityExpressionAlignmentOutput = z.infer<
  typeof IdentityExpressionAlignmentOutputSchema
>;

export async function identityExpressionAlignment(
  input: IdentityExpressionAlignmentInput
): Promise<IdentityExpressionAlignmentOutput> {
  return identityExpressionAlignmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identityExpressionAlignmentPrompt',
  input: {schema: IdentityExpressionAlignmentInputSchema},
  output: {schema: IdentityExpressionAlignmentOutputSchema},
  prompt: `您是一位 AI 助理，旨在分析使用者表達的情緒與其內容之間的一致性。

  根據使用者的問卷回覆：
  {{questionnaireResponses}}

  以及他們的內容範例：
  {{contentExamples}}

  請提供一個一致性分數（0-100）和關於內容如何反映其個人表達的回饋。您的回饋應具體，並專注於可行的改進領域。
  請記得根據輸出結構以 JSON 格式回傳您的答案。
  `,
});

const identityExpressionAlignmentFlow = ai.defineFlow(
  {
    name: 'identityExpressionAlignmentFlow',
    inputSchema: IdentityExpressionAlignmentInputSchema,
    outputSchema: IdentityExpressionAlignmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
