import { CoffeeInfoField, CoffeeInfo } from "../types/coffee";

export const getAllNationByCoffeeInfoList = (coffeeInfoList: CoffeeInfo[]) => {
  const nations = coffeeInfoList.map(
    (coffeeInfo) => coffeeInfo[CoffeeInfoField.NATION]
  );

  return Array.from(new Set(nations));
};

export const getAllNotesByCoffeeInfoList = (
  coffeeInfoList: CoffeeInfo[],
  selectedNations: string[]
) => {
  const notes = coffeeInfoList
    .filter((coffeeInfo) =>
      selectedNations.includes(coffeeInfo[CoffeeInfoField.NATION])
    )
    .map((coffeeInfo) => coffeeInfo[CoffeeInfoField.NOTE_FOR_FILTER])
    .join(",")
    .split(",")
    .filter((note) => note)
    .map((note) => note.trim())
    .sort((a, b) => a.localeCompare(b));

  return Array.from(new Set(notes));
};
