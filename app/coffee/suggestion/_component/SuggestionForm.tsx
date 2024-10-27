"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { coffeeSuggestionSchema, CoffeeSuggestionForm } from "../_schema";
import { Loader2 } from "lucide-react";

interface SuggestionFormProps {
  defaultValues?: CoffeeSuggestionForm;
  handleSubmit: (data: CoffeeSuggestionForm) => Promise<void>;
}

export default function SuggestionForm({
  defaultValues,
  handleSubmit,
}: SuggestionFormProps) {
  const form = useForm<CoffeeSuggestionForm>({
    resolver: zodResolver(coffeeSuggestionSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const onSubmit = async (data: CoffeeSuggestionForm) => {
    await handleSubmit(data);
  };

  type FormFieldItem = {
    name: keyof z.infer<typeof coffeeSuggestionSchema>;
    label: string;
    description: string;
    placeholder: string;
    className?: string;
  };
  const formFieldItems: FormFieldItem[] = [
    {
      name: "name_kr",
      label: "name_kr",
      description: "원두명을 한글로 입력해주세요.",
      placeholder: "에티오피아 예가체프",
    },
    {
      name: "name_en",
      label: "name_en",
      description: "원두명을 영어로 입력해주세요.",
      placeholder: "Ethiopia Yirgacheffe",
    },
    {
      name: "processing",
      label: "processing",
      description: "원두 처리법을 입력해주세요.",
      placeholder: "Washed",
    },
    {
      name: "origin",
      label: "origin",
      description: "원산지를 입력해주세요.",
      placeholder: "Ethiopia",
    },
    {
      name: "farm",
      label: "farm",
      description: "농장명을 입력해주세요.",
      placeholder: "Yirgacheffe",
    },
    {
      name: "variety",
      label: "variety",
      description: "원두 품종을 입력해주세요.",
      placeholder: "Ethiopian",
    },
    {
      name: "altitude",
      label: "altitude",
      description: "고도를 입력해주세요.",
      placeholder: "1500m",
    },
    {
      name: "notes",
      label: "notes",
      description: "원두 특징을 입력해주세요.",
      placeholder: "재스민, 오렌지, 복숭아, 베리, 캔디, 주시",
    },
    {
      name: "nations",
      label: "nations",
      description: "원산지 국가를 입력해주세요.",
      placeholder: "Ethiopia",
    },
    {
      name: "source_origin_url",
      label: "source_origin_url",
      description: "원산지 원본 이미지 URL을 입력해주세요.",
      placeholder: "https://example.com/image.jpg",
    },
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4 border border-gray-300 rounded p-4 relative"
      >
        {formFieldItems.map((fieldItem) => (
          <FormField
            key={fieldItem.name}
            control={form.control}
            name={fieldItem.name}
            render={({ field }) => (
              <FormItem
                className={cn(
                  "flex flex-col justify-between",
                  fieldItem.className
                )}
              >
                <FormLabel className="text-lg">{fieldItem.label}</FormLabel>
                <FormDescription className="">
                  {fieldItem.description}
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder={fieldItem.placeholder}
                    {...field}
                    value={field.value ?? ""}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="submit" className="col-span-2">
          제출
        </Button>

        {form.formState.isSubmitting && (
          <div className="inset-0 absolute bg-black/50 backdrop-blur-sm flex items-center justify-center rounded">
            <Loader2 className="animate-spin" width={32} height={32} />
          </div>
        )}
      </form>
    </Form>
  );
}
