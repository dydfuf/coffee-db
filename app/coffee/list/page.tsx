import { CoffeeInfo } from "../../../types/coffee";
import { getCoffeeInfoList } from "../../../utils/api";
import CoffeeList from "./_component/CoffeeList";

export default async function page() {
  const coffeeInfoList = getCoffeeInfoList();

  return <CoffeeList coffeeInfoList={coffeeInfoList as CoffeeInfo[]} />;
}
