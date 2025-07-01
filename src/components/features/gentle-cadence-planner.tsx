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
    low: "It's okay to rest. Maybe just one gentle post, or none at all. Your presence is enough.",
    medium: "Focus on one small thing. A single photo, a short thought. No pressure.",
    high: "Channel that energy! Try a quick burst of posts, like an IG story series, then log off.",
  },
  tired: {
    low: "Permission to be offline. Rest is productive. Come back when you're ready.",
    medium: "Share something simple that's already created. A past photo, a favorite quote.",
    high: "A quick 'hello' is plenty. Don't push. Maybe reshare something that inspires you.",
  },
  inspired: {
    low: "Capture the spark without needing to perfect it. A note, a voice memo, a draft.",
    medium: "Ride the wave. Create and share what feels good. Don't overthink the schedule.",
    high: "Flow with it! This is a great time for a series, a deep-dive post, or batch-creating content.",
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
        <CardTitle>Gentle Cadence Planner</CardTitle>
        <CardDescription>
          An adaptive rhythm tracker. When you feel scattered or tired, it
          recalibrates suggestions.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <Label className="font-headline">How are you feeling today?</Label>
            <RadioGroup
              value={mood}
              onValueChange={(value) =>
                setMood(value as "scattered" | "tired" | "inspired")
              }
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scattered" id="mood-scattered" />
                <Label htmlFor="mood-scattered">A bit scattered</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tired" id="mood-tired" />
                <Label htmlFor="mood-tired">Feeling tired</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inspired" id="mood-inspired" />
                <Label htmlFor="mood-inspired">Feeling inspired</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="energy-slider" className="font-headline">
              What's your energy level?
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
          <h3 className="font-headline text-lg">Your Gentle Suggestion</h3>
          <div className="flex-1 mt-2 rounded-lg border border-dashed border-muted bg-accent/30 p-6 flex items-center justify-center">
            <p className="text-center text-accent-foreground">{suggestion}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
