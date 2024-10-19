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
    .map((coffeeInfo) => coffeeInfo.notes ?? [])
    .flat()
    .filter((note) => note)
    .map((note) => note.trim())
    .sort((a, b) => a.localeCompare(b));

  return Array.from(new Set(notes));
};
