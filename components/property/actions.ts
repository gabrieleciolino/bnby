"use server";

import { propertySchema } from "@/components/property/schema";
import { authActionClient } from "@/lib/actions/client";

export const addPropertyAction = authActionClient
  .inputSchema(propertySchema)
  .action(async ({ ctx, parsedInput }) => {
    const { supabase, user } = ctx;
    const {
      info: { name, description, rooms, bathrooms, guests, cancellationPolicy },
      services,
      position,
      contact,
      gallery,
    } = parsedInput;

    const details = {
      info: {
        name,
        description,
        rooms,
        bathrooms,
        guests,
        cancellationPolicy,
      },
      services,
      position,
      contact,
    };

    const { data, error } = await supabase
      .from("property")
      .insert({
        details,
        user_id: user.sub,
      })
      .select()
      .single();

    if (!data || error) {
      throw new Error(
        error?.message ?? "Errore durante l'aggiunta della proprietà"
      );
    }

    const uploadedImages: string[] = [];
    const galleryItems = gallery ?? [];
    const existingUrls = galleryItems.filter(
      (item): item is string => typeof item === "string"
    );
    const files = galleryItems.filter(
      (item): item is File => item instanceof File
    );

    if (existingUrls.length > 0) {
      uploadedImages.push(...existingUrls);
    }

    // upload gallery images
    if (files.length > 0) {
      const uploadOffset = uploadedImages.length;
      for (const [index, image] of files.entries()) {
        const key = `${data.id}/${uploadOffset + index}.${image.name
          .split(".")
          .pop()}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("properties")
          .upload(key, image);

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data: galleryData, error: galleryError } = await supabase
          .from("gallery")
          .insert({
            key,
            property_id: data.id,
          });

        if (galleryError) {
          throw new Error(galleryError.message);
        }

        const { data: publicUrlData } = await supabase.storage
          .from("properties")
          .getPublicUrl(key);

        if (publicUrlData) {
          uploadedImages.push(publicUrlData.publicUrl);
        }
      }
    }

    const { data: updatedData, error: updatedError } = await supabase
      .from("property")
      .update({
        details: {
          ...details,
          gallery: uploadedImages,
        },
      })
      .eq("id", data.id)
      .select()
      .single();

    if (updatedError) {
      throw new Error(updatedError.message);
    }

    return updatedData;
  });

export const editPropertyAction = authActionClient
  .inputSchema(propertySchema)
  .action(async ({ ctx, parsedInput }) => {
    const { supabase, user } = ctx;
    const { id, ...data } = parsedInput;

    const { data: propertyData, error: propertyError } = await supabase
      .from("property")
      .select("*")
      .eq("id", id)
      .single();

    if (propertyError) {
      throw new Error(propertyError.message);
    }

    const { data: updatedData, error: updatedError } = await supabase
      .from("property")
      .update({
        details: data,
      })
      .eq("id", id)
      .select()
      .single();

    if (updatedError) {
      throw new Error(updatedError.message);
    }

    return updatedData;
  });
