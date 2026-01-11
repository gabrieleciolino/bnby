import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { urls } from "@/lib/urls";
import { redirect } from "next/navigation";
import type { Database } from "@/lib/db/types";

export const getUserQuery = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) return redirect(urls.auth.login);

  return data.claims;
});

type AccountRow = Database["public"]["Tables"]["account"]["Row"];

export const getAccountQuery = cache(async () => {
  const supabase = await createClient();
  const user = await getUserQuery();

  const { data, error } = await supabase
    .from("account")
    .select("*")
    .eq("user_id", user.sub)
    .single();

  if (error) return null;

  return data as AccountRow;
});
