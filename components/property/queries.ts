import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/db/types";
import { getUserQuery } from "@/components/auth/queries";
import { PropertyDetailsSchema } from "@/components/property/schema";

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
    details: data?.details as PropertyDetailsSchema,
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

export const getUserPropertiesQuery = cache(async () => {
  const supabase = await createClient();
  const user = await getUserQuery();

  const { data } = await supabase
    .from("property")
    .select("*")
    .eq("user_id", user.sub)
    .order("created_at", { ascending: false });

  return data;
});

type ContactRow = Database["public"]["Tables"]["contact"]["Row"];

export const getPropertyContacts = async (propertyId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact")
    .select("id,name,email,phone,message,created_at")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  return {
    contacts: (data ?? []) as ContactRow[],
    error: error?.message ?? null,
  };
};
