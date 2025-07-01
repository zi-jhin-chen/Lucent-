'use server';

/**
 * @fileOverview Style Insight Engine for identifying visual clusters and thematic tags from uploaded images.
 *
 * - analyzeStyle - A function that handles the style analysis process.
 * - AnalyzeStyleInput - The input type for the analyzeStyle function, which is a data URI of an image.
 * - AnalyzeStyleOutput - The return type for the analyzeStyle function, which includes visual clusters and thematic tags.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStyleInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo representing a moodboard or outfit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeStyleInput = z.infer<typeof AnalyzeStyleInputSchema>;

const AnalyzeStyleOutputSchema = z.object({
  visualClusters: z
    .array(z.string())
    .describe('List of visual clusters identified in the image (e.g., earthy, bold, minimalist).'),
  thematicTags: z
    .array(z.string())
    .describe('List of thematic tags associated with the image (e.g., grounded, surreal, early summer calm).'),
});
export type AnalyzeStyleOutput = z.infer<typeof AnalyzeStyleOutputSchema>;

export async function analyzeStyle(input: AnalyzeStyleInput): Promise<AnalyzeStyleOutput> {
  return analyzeStyleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStylePrompt',
  input: {schema: AnalyzeStyleInputSchema},
  output: {schema: AnalyzeStyleOutputSchema},
  prompt: `Analyze the style of the image provided. Identify visual clusters and thematic tags that describe the style. Return the visual clusters and thematic tags as lists of strings.

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
