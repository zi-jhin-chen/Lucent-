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
  currentSeason: z.string({ required_error: "Please select a season." }),
  mood: z.string({ required_error: "Please select a mood." }),
  platform: z.string({ required_error: "Please select a platform." }),
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
        title: "Suggestion Failed",
        description: response.error,
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seasonal Content Compass</CardTitle>
        <CardDescription>
          A tone compass that nudges theme clusters and suggests soft-focus post
          structures for your chosen platform.
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
                  <FormLabel>Season</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the current season" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Spring">Spring</SelectItem>
                      <SelectItem value="Summer">Summer</SelectItem>
                      <SelectItem value="Autumn">Autumn</SelectItem>
                      <SelectItem value="Winter">Winter</SelectItem>
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
                  <FormLabel>Your Current Vibe</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your current mood or energy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Early summer calm">
                        Early summer calm
                      </SelectItem>
                      <SelectItem value="Deep creative energy">
                        Deep creative energy
                      </SelectItem>
                      <SelectItem value="Quietly reflective">
                        Quietly reflective
                      </SelectItem>
                      <SelectItem value="Playful and bright">
                        Playful and bright
                      </SelectItem>
                      <SelectItem value="Focused and grounded">
                        Focused and grounded
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
                  <FormLabel>Platform</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a social media platform" />
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
              {loading ? "Guiding..." : "Find My Compass"}
            </Button>
          </form>
        </Form>
        <div className="flex flex-col gap-4">
          <h3 className="font-headline text-lg">Your Compass Reading</h3>
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
                    <CardTitle className="text-base">Suggested Theme</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-headline text-accent-foreground">{result.theme}</p>
                  </CardContent>
                 </Card>
                 <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Soft-Focus Post Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{result.postStructure}</p>
                  </CardContent>
                 </Card>
              </div>
            )}
            {!loading && !result && (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>Your content direction will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
