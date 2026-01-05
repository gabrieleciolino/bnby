import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getUserQuery } from "@/components/auth/queries";
import { PropertySchema } from "@/components/property/schema";

export const getPropertiesQuery = cache(async () => {
  const supabase = await createClient();
  const user = await getUserQuery();

  const { data } = await supabase
    .from("property")
    .select("*")
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

  return {
    ...data,
    details: data?.details as PropertySchema,
  };
});

export const getCurrentPropertyQuery = cache(async () => {
  const supabase = await createClient();
  const user = await getUserQuery();

  const { data } = await supabase
    .from("property")
    .select("*")
    .eq("user_id", user.sub)
    .limit(1)
    .single();

  return data;
});
