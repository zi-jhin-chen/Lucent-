'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing the alignment between a user's mood and their content.
 *
 * The flow takes a questionnaire as input and returns feedback on whether the content reflects the desired personal expression.
 * - identityExpressionAlignment - A function that handles the alignment analysis process.
 * - IdentityExpressionAlignmentInput - The input type for the identityExpressionAlignment function.
 * - IdentityExpressionAlignmentOutput - The return type for the identityExpressionAlignment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentityExpressionAlignmentInputSchema = z.object({
  questionnaireResponses: z
    .string()
    .describe('The responses to the mood-focused questionnaire.'),
  contentExamples: z
    .string()
    .describe('Examples of user-generated content (e.g., social media posts).'),
});
export type IdentityExpressionAlignmentInput = z.infer<
  typeof IdentityExpressionAlignmentInputSchema
>;

const IdentityExpressionAlignmentOutputSchema = z.object({
  alignmentScore: z
    .number()
    .describe(
      'A numerical score representing the alignment between the user’s mood and content (0-100).'
    ),
  feedback: z
    .string()
    .describe(
      'Qualitative feedback on the alignment, suggesting areas for improvement.'
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
  prompt: `You are an AI assistant designed to analyze the alignment between a user's expressed mood and their content.

  Based on the user's questionnaire responses:
  {{questionnaireResponses}}

  And their content examples:
  {{contentExamples}}

  Provide an alignment score (0-100) and feedback on how well the content reflects their desired personal expression. Be specific in your feedback. Focus on actionable areas for improvement.
  Remember to return your answer in JSON format based on the output schema.
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
