import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Palette, Sparkles } from "lucide-react";

const mockTrail = [
  {
    date: "3 days ago",
    title: "Style Insight: Earthy & Grounded",
    type: "style",
    content: "Uploaded a moodboard of warm landscapes and natural textiles.",
    tags: ["Earthy", "Grounded", "Autumnal"],
  },
  {
    date: "1 week ago",
    title: "Alignment Score: 82%",
    type: "alignment",
    content:
      "Feedback noted a strong connection between your desire for calm and your content's serene aesthetic.",
    tags: ["Alignment", "Calm", "Serene"],
  },
  {
    date: "2 weeks ago",
    title: "Compass Reading: Playful & Bright",
    type: "compass",
    content:
      "Suggested theme 'Dopamine Dressing' for Instagram to match a vibrant, energetic mood.",
    tags: ["Compass", "Playful", "Bright"],
  },
  {
    date: "1 month ago",
    title: "Style Insight: Bold & Surreal",
    type: "style",
    content:
      "Analyzed an outfit with contrasting colors and architectural shapes.",
    tags: ["Bold", "Surreal", "Contrast"],
  },
];

const typeIcons: { [key: string]: React.ReactNode } = {
  style: <Palette className="h-4 w-4" />,
  alignment: <Sparkles className="h-4 w-4" />,
  compass: <Bot className="h-4 w-4" />,
};

export function GrowthTrail() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reflection &amp; Growth Trail</CardTitle>
        <CardDescription>
          A visual memory thread of how your tone and vibe have shifted over
          time. No numbers, just trace and pace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
          <div className="absolute left-3 top-0 h-full w-0.5 bg-border" />
          {mockTrail.map((item, index) => (
            <div key={index} className="relative mb-8 flex items-start">
              <div className="absolute left-[-1.125rem] top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
                {typeIcons[item.type]}
              </div>
              <div className="ml-4 flex-1">
                <p className="text-xs text-muted-foreground">{item.date}</p>
                <h4 className="font-headline font-semibold">{item.title}</h4>
                <p className="mt-1 text-sm text-foreground/80">
                  {item.content}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge variant="outline" key={tag}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
