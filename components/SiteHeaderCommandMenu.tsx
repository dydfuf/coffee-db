import { getCoffeeInfoList } from "../utils/api";
import CommandMenu from "./CommandMenu";

export default async function SiteHeaderCommandMenu() {
  const coffeeInfoList = await getCoffeeInfoList();

  return <CommandMenu list={coffeeInfoList} isInNav />;
}
