"use server";

import { createClient } from "@/utils/supabase/server";
import { Coffee } from "@/schema/coffee";

export const insertCoffeeInfoRows = async (
  coffeeInfoList: Omit<Coffee, "id">[]
) => {
  console.log("insertCoffeeInfoRows");
  const supabase = createClient();

  const { error } = await supabase.from("coffee-info").insert(coffeeInfoList);

  if (error) {
    throw error;
  }
};
