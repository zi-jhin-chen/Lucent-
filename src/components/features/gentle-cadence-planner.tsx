"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

const suggestions = {
  scattered: {
    low: "休息一下也無妨。或許只發一篇溫和的貼文，或者完全不發。您的存在就已足夠。",
    medium: "專注於一件小事。一張照片，一個簡短的想法。沒有壓力。",
    high: "引導那股能量！嘗試快速發布一系列貼文，像是IG限時動態系列，然後就下線。",
  },
  tired: {
    low: "允許自己離線。休息是有效率的。準備好後再回來。",
    medium: "分享一些已經創作好的簡單內容。一張過去的照片，一句喜歡的名言。",
    high: "一句簡短的問候就足夠了。別勉強自己。或許可以轉發一些能激勵您的內容。",
  },
  inspired: {
    low: "捕捉靈感火花，無需力求完美。一則筆記，一段語音備忘，一份草稿。",
    medium: "順勢而為。創作並分享感覺良好的內容。不要過度思考排程。",
    high: "隨心所欲！這是一個發布系列、深度貼文或批量創作內容的好時機。",
  },
};

export function GentleCadencePlanner() {
  const [mood, setMood] = useState<"scattered" | "tired" | "inspired">(
    "inspired"
  );
  const [energy, setEnergy] = useState(50);

  const getEnergyLevel = (value: number) => {
    if (value < 33) return "low";
    if (value < 66) return "medium";
    return "high";
  };
  
  const energyLevel = getEnergyLevel(energy);
  const suggestion = suggestions[mood][energyLevel as "low" | "medium" | "high"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>溫和節奏規劃器</CardTitle>
        <CardDescription>
          一個適應性節奏追蹤器。當您感到心煩意亂或疲憊時，它會重新校準建議。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <Label className="font-headline">您今天感覺如何？</Label>
            <RadioGroup
              value={mood}
              onValueChange={(value) =>
                setMood(value as "scattered" | "tired" | "inspired")
              }
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scattered" id="mood-scattered" />
                <Label htmlFor="mood-scattered">有點心煩意亂</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tired" id="mood-tired" />
                <Label htmlFor="mood-tired">感到疲倦</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inspired" id="mood-inspired" />
                <Label htmlFor="mood-inspired">感到充滿靈感</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="energy-slider" className="font-headline">
              您的能量水平如何？
            </Label>
            <Slider
              id="energy-slider"
              value={[energy]}
              onValueChange={(value) => setEnergy(value[0])}
              className="mt-4"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="font-headline text-lg">您的溫和建議</h3>
          <div className="flex-1 mt-2 rounded-lg border border-dashed border-muted bg-accent/30 p-6 flex items-center justify-center">
            <p className="text-center text-accent-foreground">{suggestion}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
