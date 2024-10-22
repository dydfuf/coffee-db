"use client";

import { experimental_useObject as useObject } from "ai/react";
import { useRef, useState } from "react";
import { coffeeSchema } from "@/schema/coffee";
import SuggestionForm from "./_component/SuggestionForm";
import { CoffeeSuggestionForm } from "./_schema";
import { insertCoffeeInfo } from "./actions";

export default function SuggestionPage() {
  const { object, submit: handleObjectSubmit } = useObject({
    api: "/api/chat",
    schema: coffeeSchema,
  });

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();

        if (file) {
          setFiles(new DataTransfer().files);
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          setFiles(dataTransfer.files);
        }
      }
    }
  };

  const handleSubmit = async (data: CoffeeSuggestionForm) => {
    await insertCoffeeInfo(data);
    alert("추가되었습니다.");
  };

  return (
    <div className="mx-auto">
      <SuggestionForm
        defaultValues={{
          name_en: object?.name_en ?? "",
          name_kr: object?.name_kr ?? "",
          processing: object?.processing ?? "",
          origin: object?.origin ?? "",
          farm: object?.farm ?? "",
          variety: object?.variety ?? "",
          altitude: object?.altitude ?? "",
          notes: object?.notes?.filter((note) => note !== undefined) ?? [],
          source_origin_url: object?.source_origin_url ?? "",
          nations: object?.name_kr?.split(" ")[0] ?? "",
        }}
        handleSubmit={handleSubmit}
      />

      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        {object && <pre>{JSON.stringify(object, null, 2)}</pre>}

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (!files || files.length === 0) {
              return;
            }

            const formData = new FormData();
            formData.append("file", files[0]);

            handleObjectSubmit({
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: "다음 이미지를 분석하여, 커피관련 정보를 추출하세요.",
                    },
                    {
                      type: "image",
                      image: `data:image/png;base64,${await(async (file) => {
                        return new Promise<string>((resolve, reject) => {
                          const reader = new FileReader();
                          reader.readAsDataURL(file);
                          reader.onload = () =>
                            resolve(
                              reader.result?.toString().split(",")[1] || ""
                            );
                          reader.onerror = (error) => reject(error);
                        });
                      })(files[0])}`,
                    },
                  ],
                },
              ],
            });

            setFiles(undefined);

            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          className="fixed bottom-0 w-full max-w-md mb-8 border border-gray-300 rounded shadow-xl"
        >
          {files && files.length > 0 && files[0] instanceof File && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={URL.createObjectURL(files[0])} alt="업로드된 이미지" />
          )}
          <input className="w-full p-2" onPaste={handlePaste} />
        </form>
      </div>
    </div>
  );
}
