import { ReactNode } from "react";
import { createClient } from "@/utils/supabase/server";

export default async function SessionCheck({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  await supabase.auth.getSession();
  return <>{children}</>;
}
