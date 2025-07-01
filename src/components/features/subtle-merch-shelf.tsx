"use client";

import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubtleMerchShelfProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockMerch = [
  {
    id: 1,
    label: "Linen-Blend Blazer",
    price: "$129.99",
    imageUrl: "https://placehold.co/400x400.png",
    hint: "linen blazer",
  },
  {
    id: 2,
    label: "Classic Leather Loafers",
    price: "$99.50",
    imageUrl: "https://placehold.co/400x400.png",
    hint: "leather shoes",
  },
  {
    id: 3,
    label: "High-Waisted Trousers",
    price: "$89.00",
    imageUrl: "https://placehold.co/400x400.png",
    hint: "dress pants",
  },
  {
    id: 4,
    label: "Silk-Cotton Scarf",
    price: "$45.00",
    imageUrl: "https://placehold.co/400x400.png",
    hint: "silk scarf",
  },
  {
    id: 5,
    label: "Minimalist Tote Bag",
    price: "$155.00",
    imageUrl: "https://placehold.co/400x400.png",
    hint: "tote bag",
  },
  {
    id: 6,
    label: "Chunky Knit Sweater",
    price: "$110.00",
    imageUrl: "https://placehold.co/400x400.png",
    hint: "knit sweater",
  },
];

export function SubtleMerchShelf({ open, onOpenChange }: SubtleMerchShelfProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Subtle Merch Shelf</SheetTitle>
          <SheetDescription>
            A curated selection of items with a similar tone and aesthetic.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {mockMerch.map((item) => (
            <a href="#" key={item.id} className="group block">
              <Card className="overflow-hidden transition-all group-hover:shadow-md">
                <CardContent className="p-0">
                  <div className="relative aspect-square w-full overflow-hidden bg-muted">
                    <Image
                      src={item.imageUrl}
                      alt={item.label}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      data-ai-hint={item.hint}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium leading-tight">
                      {item.label}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      {item.price}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
