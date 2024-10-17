"use client";

import { Button } from "@/components/ui/button";
import { insertCoffeeInfo } from "./actions";

export default function SuggestionPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    await insertCoffeeInfo({
      name_kr: data.name_kr as string,
      name_en: data.name_en as string,
      processing: data.processing as string,
      origin: data.origin as string,
      farm: data.farm as string,
      notes: (data.notes as string).split(","),
      variety: data.variety as string,
      altitude: data.altitude as string,
    });
    console.log(data);
  };

  return (
    <div>
      SuggestionPage
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="text" name="name_kr" />
        <label htmlFor="name_kr">한국어 이름</label>
        <input type="text" name="name_en" />
        <label htmlFor="name_en">영어 이름</label>
        <input type="text" name="processing" />
        <label htmlFor="processing">처리 방법</label>
        <input type="text" name="origin" />
        <label htmlFor="origin">원산지</label>
        <input type="text" name="farm" />
        <label htmlFor="farm">농장</label>
        <input type="text" name="notes" />
        <label htmlFor="notes">노트</label>
        <input type="text" name="variety" />
        <label htmlFor="variety">종류</label>
        <input type="text" name="altitude" />
        <label htmlFor="altitude">고도</label>
        <Button type="submit">제출</Button>
      </form>
    </div>
  );
}
