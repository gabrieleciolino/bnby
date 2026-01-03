import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getUserQuery } from "@/components/auth/queries";

export const getPropertiesQuery = cache(async () => {
  const supabase = await createClient();
  const user = await getUserQuery();

  const { data } = await supabase
    .from("property")
    .select("*")
    .eq("user_id", user.sub)
    .order("created_at", { ascending: false });

  return data;
});

export const getPropertyQuery = cache(async (id: string) => {
  const supabase = await createClient();
  const user = await getUserQuery();

  const { data } = await supabase
    .from("property")
    .select("*")
    .eq("id", id)
    .single();

  return data;
});
