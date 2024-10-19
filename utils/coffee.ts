import { getSegmentedNote } from "@/constants/coffee";
import { Coffee } from "@/schema/coffee";

export const getAllNationByCoffeeInfoList = (coffeeInfoList: Coffee[]) => {
  const nations = coffeeInfoList.map((coffeeInfo) => coffeeInfo.nations ?? "");

  return Array.from(new Set(nations));
};

export const getAllNotesByCoffeeInfoList = (
  coffeeInfoList: Coffee[],
  selectedNations: string[]
) => {
  const notes = coffeeInfoList
    .filter((coffeeInfo) => selectedNations.includes(coffeeInfo.nations ?? ""))
    .map((coffeeInfo) => getSegmentedNote(coffeeInfo.notes ?? []))
    .flat()
    .filter((note) => note)
    .map((note) => note.trim())
    .sort((a, b) => {
      const isAKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(a);
      const isBKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(b);

      if (isAKorean && !isBKorean) return -1;
      if (!isAKorean && isBKorean) return 1;
      return a.localeCompare(b);
    });

  return Array.from(new Set(notes));
};
