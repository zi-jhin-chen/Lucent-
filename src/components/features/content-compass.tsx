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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { runSeasonalContentCompass } from "@/app/actions";
import type { SeasonalContentCompassOutput } from "@/ai/flows/seasonal-content-compass";

const formSchema = z.object({
  currentSeason: z.string({ required_error: "請選擇一個季節。" }),
  mood: z.string({ required_error: "請選擇一種心情。" }),
  platform: z.string({ required_error: "請選擇一個平台。" }),
});

export function ContentCompass() {
  const [result, setResult] = useState<SeasonalContentCompassOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);

    const response = await runSeasonalContentCompass(values);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        title: "建議失敗",
        description: response.error,
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>季節性內容羅盤</CardTitle>
        <CardDescription>
          一個風格羅盤，能為您選擇的平台提供主題建議和貼文結構。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currentSeason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>季節</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇目前季節" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Spring">春季</SelectItem>
                      <SelectItem value="Summer">夏季</SelectItem>
                      <SelectItem value="Autumn">秋季</SelectItem>
                      <SelectItem value="Winter">冬季</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>您當下的氛圍</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇您當下的心情或能量" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Early summer calm">
                        初夏的寧靜
                      </SelectItem>
                      <SelectItem value="Deep creative energy">
                        深度的創作能量
                      </SelectItem>
                      <SelectItem value="Quietly reflective">
                        靜靜地反思
                      </SelectItem>
                      <SelectItem value="Playful and bright">
                        俏皮而明亮
                      </SelectItem>
                      <SelectItem value="Focused and grounded">
                        專注而踏實
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>平台</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇一個社群媒體平台" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="X (Twitter)">X (Twitter)</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading ? "指引中..." : "尋找我的羅盤"}
            </Button>
          </form>
        </Form>
        <div className="flex flex-col gap-4">
          <h3 className="font-headline text-lg">您的羅盤讀取結果</h3>
          <div className="min-h-[300px] rounded-lg border border-dashed border-muted p-4">
            {loading && (
               <div className="space-y-4">
                 <Skeleton className="h-8 w-1/3" />
                 <Skeleton className="h-4 w-4/5" />
                 <Skeleton className="h-4 w-3/4" />
                 <Skeleton className="h-8 w-1/2 mt-4" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-2/3" />
               </div>
            )}
            {result && (
              <div className="space-y-4">
                 <Card>
                  <CardHeader>
                    <CardTitle className="text-base">建議主題</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-headline text-accent-foreground">{result.theme}</p>
                  </CardContent>
                 </Card>
                 <Card>
                  <CardHeader>
                    <CardTitle className="text-base">貼文結構建議</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{result.postStructure}</p>
                  </CardContent>
                 </Card>
              </div>
            )}
            {!loading && !result && (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>您的內容方向將會出現在這裡。</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
