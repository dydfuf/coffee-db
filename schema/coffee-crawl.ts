import { z } from "zod";

export const pageTypeEnum = z.enum([
  "menu",
  "product",
  "blog",
  "review",
  "news",
  "brand",
  "cafeteria",
  "roastery",
  "landing",
  "other",
]);

export const coffeeCrawlSchema = z.object({
  source_url: z.string().url(),
  title: z.string().nullable(),
  page_type: pageTypeEnum,
  name_kr: z.string().nullable(),
  name_en: z.string().nullable(),
  description: z.string().nullable(),
  origin: z.string().nullable(),
  notes: z.array(z.string()).nullable(),
  images: z.array(z.string().url()).nullable(),
  price: z.string().nullable(),
});

export type CoffeeCrawl = z.infer<typeof coffeeCrawlSchema>;