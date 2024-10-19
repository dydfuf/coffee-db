import {
  getAllNationByCoffeeInfoList,
  getAllNotesByCoffeeInfoList,
} from "@/utils/coffee";
import { getCoffeeInfoList } from "../../../utils/api";
import { CoffeeLinkCard } from "./_component/CoffeeLinkCard";
import CoffeeFilter from "./_component/CoffeeFilter";
import { Coffee } from "@/schema/coffee";
import MobileCoffeeFilter from "./_component/MobileCoffeeFilter";
import { COFFEE_NOTE_DICT } from "@/constants/coffee";

interface Props {
  searchParams: {
    nation: string;
    note: string;
  };
}

export default async function CoffeeListPage({
  searchParams: { nation, note },
}: Props) {
  const coffeeInfoList = await getCoffeeInfoList();

  const selectedNations = nation ? nation.split(",") : [];
  const selectedNotes = note ? note.split(",") : [];

  const allNations = getAllNationByCoffeeInfoList(coffeeInfoList);
  const allNotes = getAllNotesByCoffeeInfoList(
    coffeeInfoList,
    selectedNations.length > 0 ? selectedNations : allNations
  );

  const filterByNations = (coffeeInfo: Coffee) => {
    const hasSelectedNations = selectedNations.length > 0;

    if (!coffeeInfo.nations) {
      return false;
    }

    if (hasSelectedNations) {
      return selectedNations.includes(coffeeInfo.nations);
    }
    return true;
  };

  const filterByNotes = (coffeeInfo: Coffee) => {
    if (selectedNotes.length === 0) {
      return true;
    }

    if (!coffeeInfo.notes) {
      return false;
    }

    return coffeeInfo.notes.some(
      (note) =>
        selectedNotes.includes(COFFEE_NOTE_DICT[note]) ||
        selectedNotes.includes(note)
    );
  };

  const filteredCoffeeInfoList = coffeeInfoList
    .filter(filterByNations)
    .filter(filterByNotes);

  return (
    <div className="mx-auto px-8 pt-4 pb-8 flex flex-col gap-4 w-[1024px]">
      <CoffeeFilter
        allNations={allNations}
        allNotes={allNotes}
        selectedNations={selectedNations}
        selectedNotes={selectedNotes}
      />
      <MobileCoffeeFilter
        allNations={allNations}
        allNotes={allNotes}
        selectedNations={selectedNations}
        selectedNotes={selectedNotes}
      />
      {filteredCoffeeInfoList.map((coffeeInfo) => (
        <CoffeeLinkCard
          key={`coffee-${coffeeInfo.id}`}
          coffeeInfo={coffeeInfo}
        />
      ))}
    </div>
  );
}
