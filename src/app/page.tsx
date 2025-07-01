import {
  Compass,
  HeartHandshake,
  LineChart,
  Palette,
  Shirt,
  SlidersHorizontal,
} from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Icons } from "@/components/icons";
import { StyleInsightEngine } from "@/components/features/style-insight-engine";
import { IdentityAlignment } from "@/components/features/identity-alignment";
import { ContentCompass } from "@/components/features/content-compass";
import { OutfitVisualizer } from "@/components/features/outfit-visualizer";
import { GrowthTrail } from "@/components/features/growth-trail";
import { GentleCadencePlanner } from "@/components/features/gentle-cadence-planner";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Icons.logo className="h-6 w-6" />
          <span className="font-headline text-xl">Lucent</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
        <Tabs defaultValue="style-insight" className="flex-1">
          <div className="overflow-x-auto pb-2">
            <TabsList className="grid h-auto w-full min-w-max grid-cols-6">
              <TabsTrigger value="style-insight" className="gap-2">
                <Palette className="h-4 w-4" /> Style Insight
              </TabsTrigger>
              <TabsTrigger value="alignment" className="gap-2">
                <HeartHandshake className="h-4 w-4" /> Alignment
              </TabsTrigger>
              <TabsTrigger value="compass" className="gap-2">
                <Compass className="h-4 w-4" /> Compass
              </TabsTrigger>
              <TabsTrigger value="outfit-visualizer" className="gap-2">
                <Shirt className="h-4 w-4" /> Outfit Visualizer
              </TabsTrigger>
              <TabsTrigger value="growth-trail" className="gap-2">
                <LineChart className="h-4 w-4" /> Growth Trail
              </TabsTrigger>
              <TabsTrigger value="cadence-planner" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Cadence
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="style-insight" className="mt-4">
            <StyleInsightEngine />
          </TabsContent>
          <TabsContent value="alignment" className="mt-4">
            <IdentityAlignment />
          </TabsContent>
          <TabsContent value="compass" className="mt-4">
            <ContentCompass />
          </TabsContent>
          <TabsContent value="outfit-visualizer" className="mt-4">
            <OutfitVisualizer />
          </TabsContent>
          <TabsContent value="growth-trail" className="mt-4">
            <GrowthTrail />
          </TabsContent>
          <TabsContent value="cadence-planner" className="mt-4">
            <GentleCadencePlanner />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
