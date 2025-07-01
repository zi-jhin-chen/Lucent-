"use client";

import { useState, type ChangeEvent, type DragEvent } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { runAnalyzeStyle } from "@/app/actions";
import { UploadCloud, X } from "lucide-react";
import type { AnalyzeStyleOutput } from "@/ai/flows/style-insight-engine";

export function StyleInsightEngine() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeStyleOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 4MB.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0] ?? null);
  };

  const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true); // Keep highlighting
  };
  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      handleFileChange(droppedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    // Reset the input value
    const input = document.getElementById("style-insight-file") as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload an image to analyze.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const photoDataUri = reader.result as string;
      const response = await runAnalyzeStyle({ photoDataUri });

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
    };
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      toast({
        title: "File Read Error",
        description: "Could not read the selected file.",
        variant: "destructive",
      });
      setLoading(false);
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Style Insight Engine</CardTitle>
        <CardDescription>
          Upload a moodboard, outfit, or post capture to get soft-labeled
          visual clusters and thematic tags.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          {!previewUrl && (
            <label
              htmlFor="style-insight-file"
              className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted bg-card p-8 text-center transition-colors ${isDragging ? "border-primary bg-accent" : "hover:border-primary/50"}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <UploadCloud className="h-10 w-10 text-muted-foreground" />
              <span className="font-medium text-primary">
                Drag & drop or click to upload
              </span>
              <span className="text-sm text-muted-foreground">
                PNG, JPG, GIF up to 4MB
              </span>
              <Input
                id="style-insight-file"
                type="file"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={onFileChange}
                accept="image/*"
              />
            </label>
          )}

          {previewUrl && (
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
              <Image
                src={previewUrl}
                alt="Image preview"
                fill
                className="object-cover"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute right-2 top-2 h-8 w-8 rounded-full"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          )}

          <Button onClick={handleSubmit} disabled={!file || loading}>
            {loading ? "Analyzing..." : "Analyze Style"}
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-headline text-lg">Analysis Results</h3>
          <div className="min-h-[200px] rounded-lg border border-dashed border-muted p-4">
            {loading && (
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                </div>
                <Skeleton className="h-8 w-1/4" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-32 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
            )}
            {result && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Visual Clusters</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.visualClusters.map((cluster) => (
                      <Badge variant="secondary" key={cluster}>
                        {cluster}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Thematic Tags</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.thematicTags.map((tag) => (
                      <Badge variant="outline" key={tag}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {!loading && !result && (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>Results will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
