'use server';

/**
 * @fileOverview Generates content themes and soft-focus post structures based on seasonal vibes.
 *
 * - seasonalContentCompass - A function that suggests content themes and structures.
 * - SeasonalContentCompassInput - The input type for the seasonalContentCompass function.
 * - SeasonalContentCompassOutput - The return type for the seasonalContentCompass function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SeasonalContentCompassInputSchema = z.object({
  currentSeason: z.string().describe('The current season (e.g., Spring, Summer, Autumn, Winter).'),
  mood: z.string().describe('The user\u2019s current mood or feeling.'),
  platform: z.string().describe('The social media platform (e.g., IG, X, LinkedIn).'),
});
export type SeasonalContentCompassInput = z.infer<typeof SeasonalContentCompassInputSchema>;

const SeasonalContentCompassOutputSchema = z.object({
  theme: z.string().describe('A suggested content theme based on the season and mood.'),
  postStructure: z
    .string()
    .describe('A soft-focus post structure suggestion for the specified platform.'),
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
  prompt: `You are a social media content strategist. Based on the current season, the user's mood, and the social media platform, suggest a content theme and a soft-focus post structure.

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
