'use server';

/**
 * @fileOverview 根據季節氛圍產生內容主題和貼文結構建議。
 *
 * - seasonalContentCompass - 建議內容主題和結構的函式。
 * - SeasonalContentCompassInput - seasonalContentCompass 函式的輸入型別。
 * - SeasonalContentCompassOutput - seasonalContentCompass 函式的回傳型別。
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SeasonalContentCompassInputSchema = z.object({
  currentSeason: z.string().describe('當前季節（例如，春季、夏季、秋季、冬季）。'),
  mood: z.string().describe('使用者當前的心情或感受。'),
  platform: z.string().describe('社群媒體平台（例如，IG、X、LinkedIn）。'),
});
export type SeasonalContentCompassInput = z.infer<typeof SeasonalContentCompassInputSchema>;

const SeasonalContentCompassOutputSchema = z.object({
  theme: z.string().describe('根據季節和心情建議的內容主題。'),
  postStructure: z
    .string()
    .describe('針對指定平台的貼文結構建議。'),
});
export type SeasonalContentCompassOutput = z.infer<typeof SeasonalContentCompassOutputSchema>;

export async function seasonalContentCompass(
  input: SeasonalContentCompassInput
): Promise<SeasonalContentCompassOutput> {
  return seasonalContentCompassFlow(input);
}

const prompt = ai.definePrompt({
  name: 'seasonalContentCompassPrompt',
  input: {schema: SeasonalContentCompassInputSchema},
  output: {schema: SeasonalContentCompassOutputSchema},
  prompt: `您是一位社群媒體內容策略師。請根據當前季節、使用者的心情和社群媒體平台，建議一個內容主題和一個貼文結構。

Current Season: {{{currentSeason}}}
Mood: {{{mood}}}
Platform: {{{platform}}}

Theme:`,
});

const seasonalContentCompassFlow = ai.defineFlow(
  {
    name: 'seasonalContentCompassFlow',
    inputSchema: SeasonalContentCompassInputSchema,
    outputSchema: SeasonalContentCompassOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
