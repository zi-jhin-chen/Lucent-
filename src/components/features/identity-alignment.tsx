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
    .min(10, "請多分享一些關於您目前心情和感受的資訊。"),
  contentExamples: z
    .string()
    .min(10, "請提供一些您最近的內容範例。"),
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
        title: "分析失敗",
        description: response.error,
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>身分認同與表達一致性</CardTitle>
        <CardDescription>
          這份以情緒為先的問卷，幫助您了解您的內容在多大程度上反映了您正在成為的自己。
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
                  <FormLabel>情緒與身分認同反思</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="描述您當前的心情、您的期許，或您希望現在給人什麼樣的感覺..."
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
                  <FormLabel>近期內容範例</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="貼上幾篇近期貼文的文字、您最新專案的描述，或您目前的個人簡介..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "分析中..." : "檢查一致性"}
            </Button>
          </form>
        </Form>

        <div className="flex flex-col gap-4">
          <h3 className="font-headline text-lg">一致性報告</h3>
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
                  <h4 className="font-semibold">一致性分數</h4>
                  <div className="mt-2 flex items-center gap-4">
                    <Progress value={result.alignmentScore} className="w-full" />
                    <span className="font-mono text-lg font-medium">
                      {result.alignmentScore}%
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">回饋與建議</h4>
                  <p className="mt-2 text-sm text-foreground/80 whitespace-pre-wrap">
                    {result.feedback}
                  </p>
                </div>
              </div>
            )}
            {!loading && !result && (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>您的一致性報告將會出現在這裡。</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
