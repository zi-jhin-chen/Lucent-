// src/ai/flows/ai-outfit-visualizer.ts
'use server';
/**
 * @fileOverview AI 穿搭模擬器流程 - 辨識圖片中的時尚單品，提供語義標籤，並在一個中性的虛擬模特兒身上進行視覺化呈現。
 *
 * - aiOutfitVisualizer - 處理穿搭模擬流程的函式。
 * - AiOutfitVisualizerInput - aiOutfitVisualizer 函式的輸入型別。
 * - AiOutfitVisualizerOutput - aiOutfitVisualizer 函式的回傳型別。
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const AiOutfitVisualizerInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "一張穿搭照片，格式為包含 MIME 類型並使用 Base64 編碼的 data URI。預期格式：'data:<mimetype>;base64,<encoded_data>'。"
    ),
});
export type AiOutfitVisualizerInput = z.infer<typeof AiOutfitVisualizerInputSchema>;

const AiOutfitVisualizerOutputSchema = z.object({
  identifiedItems: z.array(
    z.object({
      label: z.string().describe('時尚單品的語義標籤。'),
      imageUrl: z.string().describe('已辨識時尚單品在虛擬模特兒身上的圖片 URL。'),
    })
  ).describe('已辨識的時尚單品及其標籤清單。'),
  overallStyleDescription: z.string().describe('對穿搭整體風格的描述。'),
});
export type AiOutfitVisualizerOutput = z.infer<typeof AiOutfitVisualizerOutputSchema>;

export async function aiOutfitVisualizer(input: AiOutfitVisualizerInput): Promise<AiOutfitVisualizerOutput> {
  return aiOutfitVisualizerFlow(input);
}

const analyzeOutfitPrompt = ai.definePrompt({
  name: 'analyzeOutfitPrompt',
  input: {schema: AiOutfitVisualizerInputSchema},
  output: {schema: AiOutfitVisualizerOutputSchema},
  prompt: `您是一位時尚專家。請分析提供的穿搭照片，辨識其中的時尚單品，並為每個單品提供語義標籤。同時，也請產生一段關於該穿搭整體風格的描述。

  請使用指定的結構，輸出已辨識的單品及其語義標籤，以及整體風格的描述。

  Photo: {{media url=photoDataUri}}
`,
});

const aiOutfitVisualizerFlow = ai.defineFlow(
  {
    name: 'aiOutfitVisualizerFlow',
    inputSchema: AiOutfitVisualizerInputSchema,
    outputSchema: AiOutfitVisualizerOutputSchema,
  },
  async input => {
    const outfitAnalysis = await analyzeOutfitPrompt(input);
    if (!outfitAnalysis.output) {
      throw new Error('提示未返回任何穿搭分析結果。');
    }
    // Generate images for each fashion item visualized on a neutral model
    const visualizedItems = await Promise.all(
      outfitAnalysis.output.identifiedItems.map(async (item) => {
          const imageGenResult = await ai.generate({
              model: 'googleai/gemini-2.0-flash-preview-image-generation',
              prompt: `產生一張中性、無性別的虛擬模特兒穿著 ${item.label} 的圖片。請專注於服裝本身，而非模特兒的特徵。模特兒應保持中性姿勢。`,
              config: {
                  responseModalities: ['TEXT', 'IMAGE'],
              },
          });

          return {
              label: item.label,
              imageUrl: imageGenResult.media?.url || '', // Use the generated image URL
          };
      })
    );

    return {
      identifiedItems: visualizedItems,
      overallStyleDescription: outfitAnalysis.output.overallStyleDescription,
    };
  }
);
