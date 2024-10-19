import { z } from "zod";

export const coffeeSchema = z.object({
  id: z.number(),
  name_kr: z.string().nullable(),
  name_en: z.string().nullable(),
  processing: z.string().nullable(),
  origin: z.string().nullable(),
  farm: z.string().nullable(),
  notes: z.array(z.string()).nullable(),
  variety: z.string().nullable(),
  altitude: z.string().nullable(),
  origin_image_uri: z.string().nullable(),
  created_at: z.string(),
  source_origin_url: z.string().nullable(),
  nations: z.string().nullable(),
});

export type Coffee = z.infer<typeof coffeeSchema>;
