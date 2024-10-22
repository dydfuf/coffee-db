import { coffeeSchema } from "@/schema/coffee";
import { z } from "zod";

export const coffeeSuggestionSchema = coffeeSchema.omit({
  id: true,
  created_at: true,
  origin_image_uri: true,
});

export type CoffeeSuggestionForm = z.infer<typeof coffeeSuggestionSchema>;
