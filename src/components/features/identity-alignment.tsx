"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { runIdentityAlignment } from "@/app/actions";
import type { IdentityExpressionAlignmentOutput } from "@/ai/flows/identity-expression-alignment";

const formSchema = z.object({
  questionnaireResponses: z
    .string()
    .min(10, "Please share a bit more about your current mood and feelings."),
  contentExamples: z
    .string()
    .min(10, "Please provide some examples of your recent content."),
});

export function IdentityAlignment() {
  const [result, setResult] = useState<IdentityExpressionAlignmentOutput | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionnaireResponses: "",
      contentExamples: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);

    const response = await runIdentityAlignment(values);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        title: "Analysis Failed",
        description: response.error,
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identity–Expression Alignment</CardTitle>
        <CardDescription>
          This mood-first questionnaire helps map where your content may or may
          not reflect who you are becoming.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="questionnaireResponses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mood &amp; Identity Reflection</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your current mood, what you're aspiring towards, or how you want to be perceived right now..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contentExamples"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recent Content Examples</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste in text from a few recent posts, a description of your latest project, or your current bio..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Analyzing..." : "Check Alignment"}
            </Button>
          </form>
        </Form>

        <div className="flex flex-col gap-4">
          <h3 className="font-headline text-lg">Alignment Report</h3>
          <div className="min-h-[300px] rounded-lg border border-dashed border-muted p-4">
            {loading && (
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-8 w-1/3 mt-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            )}
            {result && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Alignment Score</h4>
                  <div className="mt-2 flex items-center gap-4">
                    <Progress value={result.alignmentScore} className="w-full" />
                    <span className="font-mono text-lg font-medium">
                      {result.alignmentScore}%
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Feedback &amp; Suggestions</h4>
                  <p className="mt-2 text-sm text-foreground/80 whitespace-pre-wrap">
                    {result.feedback}
                  </p>
                </div>
              </div>
            )}
            {!loading && !result && (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>Your alignment report will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
