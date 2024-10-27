"use client";

import { experimental_useObject as useObject } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { coffeeSchema } from "@/schema/coffee";
import SuggestionForm from "./_component/SuggestionForm";
import { CoffeeSuggestionForm } from "./_schema";
import { insertCoffeeInfo, uploadImage } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle, Loader2 } from "lucide-react";

export default function SuggestionPage() {
  const [sourceOriginUrl, setSourceOriginUrl] = useState("");
  const [object, setObject] = useState<CoffeeSuggestionForm | undefined>();

  const {
    object: _object,
    submit: handleObjectSubmit,
    isLoading,
  } = useObject({
    api: "/api/chat",
    schema: coffeeSchema,
  });

  useEffect(() => {
    if (_object) {
      setObject(_object as CoffeeSuggestionForm);
    }
  }, [_object]);

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
    if (!files || files.length === 0) {
      return;
    }

    const imageUploadFormData = new FormData();
    imageUploadFormData.append("file", files[0]);

    const uploadedImage = await uploadImage(imageUploadFormData);
    const insertedCoffeeInfo = await insertCoffeeInfo({
      ...data,
      origin_image_uri: uploadedImage,
    });

    if (insertedCoffeeInfo) {
      alert(`추가되었습니다.${JSON.stringify(insertedCoffeeInfo)}`);
      handleReset();
    }
  };

  const handleReset = () => {
    setFiles(undefined);
    setObject(undefined);
  };

  return (
    <div className="mx-auto">
      <Input
        type="text"
        placeholder="원본 이미지 URL"
        value={sourceOriginUrl}
        onChange={(e) => setSourceOriginUrl(e.target.value)}
      />

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
          source_origin_url: sourceOriginUrl,
          nations: object?.name_kr?.split(" ")[0] ?? "",
        }}
        handleSubmit={handleSubmit}
      />

      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
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
                      image: `data:image/png;base64,${await (async (file) => {
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

            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          className="flex flex-col items-center fixed bottom-0 w-full max-w-md mb-8 border border-gray-300 rounded shadow-xl gap-4 p-2"
        >
          {files && files.length > 0 && files[0] instanceof File && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={URL.createObjectURL(files[0])} alt="업로드된 이미지" />
          )}
          <div className="flex items-center w-full">
            <Label htmlFor="image-file" className="cursor-pointer p-2">
              <PlusCircle />
            </Label>
            <Input
              id="image-file"
              type="file"
              className="hidden"
              onChange={(e) => {
                const files = e.currentTarget.files;
                if (files && files.length > 0) {
                  setFiles(files);
                }
              }}
            />
            <Input className="w-full p-2" onPaste={handlePaste} />
            <Button type="submit">제출</Button>
          </div>
          {isLoading && (
            <div className="inset-0 absolute bg-black/50 backdrop-blur-sm flex items-center justify-center rounded">
              <Loader2 className="animate-spin" width={32} height={32} />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
