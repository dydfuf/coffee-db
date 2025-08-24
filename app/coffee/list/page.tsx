import { getCoffeeInfoList } from "../../../utils/api";
import { CoffeeLinkCard } from "./_component/CoffeeLinkCard";
import CoffeeFilter from "./_component/CoffeeFilter";
import MobileCoffeeFilter from "./_component/MobileCoffeeFilter";
import {
  applyCoffeeFilters,
  computeAvailableNations,
  computeAvailableNotes,
  parseCriteriaFromQuery,
} from "@/utils/coffee-filters";

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

  // parse criteria from search params
  const criteria = parseCriteriaFromQuery(nation, note);

  // derive options using centralized utils
  const allNations = computeAvailableNations(coffeeInfoList);
  const allNotes = computeAvailableNotes(coffeeInfoList, criteria);

  // apply filters centrally
  const filteredCoffeeInfoList = applyCoffeeFilters(coffeeInfoList, criteria);

  return (
    <>
      <CoffeeFilter
        allNations={allNations}
        allNotes={allNotes}
        selectedNations={criteria.nations}
        selectedNotes={criteria.notes}
      />
      <MobileCoffeeFilter
        allNations={allNations}
        allNotes={allNotes}
        selectedNations={criteria.nations}
        selectedNotes={criteria.notes}
      />
      {filteredCoffeeInfoList.map((coffeeInfo) => (
        <CoffeeLinkCard
          key={`coffee-${coffeeInfo.id}`}
          coffeeInfo={coffeeInfo}
        />
      ))}
    </>
  );
}
