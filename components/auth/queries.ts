import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { urls } from "@/lib/urls";
import { redirect } from "next/navigation";

export const getUserQuery = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) return redirect(urls.auth.login);

  return data.claims;
});
