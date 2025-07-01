"use client";

import { useState, type ChangeEvent, type DragEvent } from "react";
import Image from "next/image";
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
import { runAiOutfitVisualizer } from "@/app/actions";
import { UploadCloud, X, ShoppingBag, ImageIcon } from "lucide-react";
import type { AiOutfitVisualizerOutput } from "@/ai/flows/ai-outfit-visualizer";
import { SubtleMerchShelf } from "./subtle-merch-shelf";

export function OutfitVisualizer() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AiOutfitVisualizerOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isShelfOpen, setIsShelfOpen] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) {
        toast({
          title: "檔案太大",
          description: "請上傳小於 4MB 的圖片。",
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

  const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) handleFileChange(droppedFile);
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    const input = document.getElementById("outfit-file") as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({ title: "未選擇檔案", description: "請上傳穿搭照片。", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const photoDataUri = reader.result as string;
      const response = await runAiOutfitVisualizer({ photoDataUri });

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        toast({ title: "模擬失敗", description: response.error, variant: "destructive" });
      }
      setLoading(false);
    };
    reader.onerror = () => {
      toast({ title: "檔案讀取錯誤", description: "無法讀取所選檔案。", variant: "destructive" });
      setLoading(false);
    };
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>AI 穿搭模擬器</CardTitle>
          <CardDescription>
            上傳一張穿搭照片，以識別其中的單品並在虛擬模特兒身上進行模擬。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            {!previewUrl ? (
              <label
                htmlFor="outfit-file"
                className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted bg-card p-8 text-center transition-colors ${isDragging ? "border-primary bg-accent" : "hover:border-primary/50"}`}
                onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
              >
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                <span className="font-medium text-primary">上傳穿搭照片</span>
                <span className="text-sm text-muted-foreground">支援 PNG, JPG, GIF 格式，最大 4MB</span>
                <Input id="outfit-file" type="file" className="absolute inset-0 h-full w-full cursor-pointer opacity-0" onChange={onFileChange} accept="image/*" />
              </label>
            ) : (
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                <Image src={previewUrl} alt="Outfit preview" fill className="object-cover" />
                <Button size="icon" variant="destructive" className="absolute right-2 top-2 h-8 w-8 rounded-full" onClick={clearFile}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">移除圖片</span>
                </Button>
              </div>
            )}
            <Button onClick={handleSubmit} disabled={!file || loading}>
              {loading ? "模擬中..." : "模擬穿搭"}
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-headline text-lg">模擬結果</h3>
            <div className="min-h-[200px] space-y-4 rounded-lg border border-dashed border-muted p-4">
              {loading && <Skeleton className="h-full w-full" />}
              {result && (
                <div>
                  <h4 className="font-semibold">整體風格</h4>
                  <p className="text-sm text-muted-foreground">{result.overallStyleDescription}</p>
                </div>
              )}
               {!loading && !result && (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <p>結果將會出現在這裡。</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        {result && (
          <CardFooter className="flex-col items-start gap-4">
            <div className="flex w-full items-center justify-between">
              <h3 className="font-headline text-lg">已識別單品</h3>
              <Button variant="outline" size="sm" onClick={() => setIsShelfOpen(true)}>
                <ShoppingBag className="mr-2 h-4 w-4" /> 尋找相似單品
              </Button>
            </div>
            <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {result.identifiedItems.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-square bg-muted">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.label} fill className="object-cover" data-ai-hint="fashion model" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-2">
                    <p className="text-center text-xs font-medium">{item.label}</p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
      <SubtleMerchShelf open={isShelfOpen} onOpenChange={setIsShelfOpen} />
    </>
  );
}
