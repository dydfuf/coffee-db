"use server";

import { notFound } from "next/navigation";
import { createClient } from "./supabase/server";

export const getCoffeeInfoList = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("coffee-info")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const getCoffeeInfoById = async (id: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("coffee-info")
    .select("*")
    .eq("id", id);

  if (!data || data.length === 0) {
    notFound();
  }

  if (error) {
    throw error;
  }

  return data[0];
};
