'use server';

/**
 * @fileOverview 風格洞察引擎，用於從上傳的圖片中識別視覺分類和主題標籤。
 *
 * - analyzeStyle - 處理風格分析流程的函式。
 * - AnalyzeStyleInput - analyzeStyle 函式的輸入型別，為圖片的 data URI。
 * - AnalyzeStyleOutput - analyzeStyle 函式的回傳型別，包含視覺分類和主題標籤。
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStyleInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "代表風格板或穿搭的照片，格式為包含 MIME 類型並使用 Base64 編碼的 data URI。預期格式：'data:<mimetype>;base64,<encoded_data>'。"
    ),
});
export type AnalyzeStyleInput = z.infer<typeof AnalyzeStyleInputSchema>;

const AnalyzeStyleOutputSchema = z.object({
  visualClusters: z
    .array(z.string())
    .describe('在圖片中識別出的視覺分類清單（例如，大地色系、大膽、極簡）。'),
  thematicTags: z
    .array(z.string())
    .describe('與圖片相關的主題標籤清單（例如，踏實、超現實、初夏寧靜）。'),
});
export type AnalyzeStyleOutput = z.infer<typeof AnalyzeStyleOutputSchema>;

export async function analyzeStyle(input: AnalyzeStyleInput): Promise<AnalyzeStyleOutput> {
  return analyzeStyleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStylePrompt',
  input: {schema: AnalyzeStyleInputSchema},
  output: {schema: AnalyzeStyleOutputSchema},
  prompt: `分析所提供圖片的風格。識別描述該風格的視覺分類和主題標籤。以字串清單的形式回傳視覺分類和主題標籤。

Image: {{media url=photoDataUri}}`,
});

const analyzeStyleFlow = ai.defineFlow(
  {
    name: 'analyzeStyleFlow',
    inputSchema: AnalyzeStyleInputSchema,
    outputSchema: AnalyzeStyleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
