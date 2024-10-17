"use server";

import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function insertCoffeeInfo(
  coffeeInfo: Database["public"]["Tables"]["coffee-info"]["Insert"]
) {
  const supabase = createClient();

  const { error } = await supabase.from("coffee-info").insert(coffeeInfo);

  if (error) {
    throw error;
  }
}
