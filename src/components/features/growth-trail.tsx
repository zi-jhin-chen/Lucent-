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
    date: "3天前",
    title: "風格洞察：大地與踏實",
    type: "style",
    content: "上傳了一張包含溫暖地景和自然紡織品的風格板。",
    tags: ["大地", "踏實", "秋日"],
  },
  {
    date: "1週前",
    title: "一致性分數：82%",
    type: "alignment",
    content:
      "回饋指出，您對平靜的渴望與您內容的寧靜美學之間有很強的連結。",
    tags: ["一致性", "平靜", "寧靜"],
  },
  {
    date: "2週前",
    title: "羅盤讀取：俏皮與明亮",
    type: "compass",
    content:
      "建議在 Instagram 上使用「多巴胺穿搭」主題，以配合充滿活力的心情。",
    tags: ["羅盤", "俏皮", "明亮"],
  },
  {
    date: "1個月前",
    title: "風格洞察：大膽與超現實",
    type: "style",
    content:
      "分析了一套具有對比色和建築形狀的穿搭。",
    tags: ["大膽", "超現實", "對比"],
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
        <CardTitle>反思與成長足跡</CardTitle>
        <CardDescription>
          一條視覺化的記憶線索，記錄您的風格和氛圍如何隨時間變化。沒有數字，只有追溯和步調。
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
