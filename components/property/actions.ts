"use server";

import { propertySchema } from "@/components/property/schema";
import { authActionClient } from "@/lib/actions/client";

export const addPropertyAction = authActionClient
  .inputSchema(propertySchema)
  .action(async ({ ctx, parsedInput }) => {
    const { supabase, user } = ctx;
    const {
      name,
      description,
      address,
      city,
      country,
      rooms,
      bathrooms,
      guests,
      services,
    } = parsedInput;

    console.log(parsedInput, typeof parsedInput);

    return;

    const { data, error } = await supabase
      .from("property")
      .insert({
        name,
        description,
        address,
        city,
        country,
        rooms,
        bathrooms,
        guests,
        services,
        user_id: user.sub,
      })
      .select()
      .single();

    if (!data || error) {
      throw new Error(
        error?.message ?? "Errore durante l'aggiunta della proprietà"
      );
    }

    return data;
  });
