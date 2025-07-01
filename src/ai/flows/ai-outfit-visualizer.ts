// src/ai/flows/ai-outfit-visualizer.ts
'use server';
/**
 * @fileOverview AI Outfit Visualizer Flow - identifies fashion items in an image, provides semantic labels, and visualizes them on a neutral virtual model.
 *
 * - aiOutfitVisualizer - A function that handles the outfit visualization process.
 * - AiOutfitVisualizerInput - The input type for the aiOutfitVisualizer function.
 * - AiOutfitVisualizerOutput - The return type for the aiOutfitVisualizer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const AiOutfitVisualizerInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an outfit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AiOutfitVisualizerInput = z.infer<typeof AiOutfitVisualizerInputSchema>;

const AiOutfitVisualizerOutputSchema = z.object({
  identifiedItems: z.array(
    z.object({
      label: z.string().describe('A semantic label for the fashion item.'),
      imageUrl: z.string().describe('URL of the identified fashion item on the virtual model.'),
    })
  ).describe('A list of identified fashion items and their labels.'),
  overallStyleDescription: z.string().describe('A description of the overall style of the outfit.'),
});
export type AiOutfitVisualizerOutput = z.infer<typeof AiOutfitVisualizerOutputSchema>;

export async function aiOutfitVisualizer(input: AiOutfitVisualizerInput): Promise<AiOutfitVisualizerOutput> {
  return aiOutfitVisualizerFlow(input);
}

const analyzeOutfitPrompt = ai.definePrompt({
  name: 'analyzeOutfitPrompt',
  input: {schema: AiOutfitVisualizerInputSchema},
  output: {schema: AiOutfitVisualizerOutputSchema},
  prompt: `You are a fashion expert. Analyze the provided outfit photo and identify the fashion items, providing semantic labels for each.

  Also, generate a description of the overall style of the outfit.

  Output the identified items with semantic labels, and the overall style description, using the specified schema.

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
      throw new Error('No outfit analysis returned from the prompt.');
    }
    // Generate images for each fashion item visualized on a neutral model
    const visualizedItems = await Promise.all(
      outfitAnalysis.output.identifiedItems.map(async (item) => {
          const imageGenResult = await ai.generate({
              model: 'googleai/gemini-2.0-flash-preview-image-generation',
              prompt: `Generate an image of a neutral, non-gendered virtual model wearing a ${item.label}. Focus on the garment itself, not the model's features.  The model should be in a neutral pose.`, // Adjusted prompt
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

