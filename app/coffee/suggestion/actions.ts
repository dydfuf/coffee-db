"use server";

import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function insertCoffeeInfo(
  coffeeInfo: Database["public"]["Tables"]["coffee-info"]["Insert"]
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("coffee-info")
    .insert(coffeeInfo)
    .select();

  if (error) {
    throw error;
  }

  return data[0];
}

const getUploadUrl = async () => {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );
  const data = await res.json();
  return data.result.uploadURL;
};

export async function uploadImage(formData: FormData) {
  const uploadUrl = await getUploadUrl();
  const res = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  const imageUrl = `https://imagedelivery.net/${process.env.CLOUDFLARE_IMAGE_DELIVERY_KEY}/${data.result.id}/public`;
  return imageUrl;
}
