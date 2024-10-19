"use server";

import { createClient } from "./supabase/server";

export const getCoffeeInfoList = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.from("coffee-info").select("*");

  if (error) {
    throw error;
  }

  return data || [];
};

export const getCoffeeInfoById = async (id: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("coffee-info")
    .select("*")
    .eq("id", id);

  if (error) {
    throw error;
  }

  return data[0];
};
