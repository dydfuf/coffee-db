"use server";

import { createClient } from "./supabase/client";

export const getCoffeeInfoList = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.from("coffee-info").select("*");

  if (error) {
    throw error;
  }

  return data || [];
};
