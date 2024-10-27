import { z } from "zod";

export const coffeeSuggestionSchema = z.object({
  name_en: z.string().min(1, { message: "영어 원두명을 입력해주세요." }),
  name_kr: z.string().min(1, { message: "한글 원두명을 입력해주세요." }),
  processing: z.string().min(1, { message: "원두 가공 방법을 입력해주세요." }),
  origin: z.string().min(1, { message: "원산지를 입력해주세요." }),
  farm: z.string().min(1, { message: "농장명을 입력해주세요." }),
  variety: z.string().min(1, { message: "품종을 입력해주세요." }),
  altitude: z.string().min(1, { message: "고도를 입력해주세요." }),
  notes: z.array(z.string()).min(1, { message: "원두 특징을 입력해주세요." }),
  source_origin_url: z
    .string()
    .min(1, { message: "원산지 원본 링크를 입력해주세요." }),
  nations: z.string().min(1, { message: "국가를 입력해주세요." }),
});

export type CoffeeSuggestionForm = z.infer<typeof coffeeSuggestionSchema>;
