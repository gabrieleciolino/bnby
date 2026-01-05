"use server";

import {
  createOwnerUserSchema,
  propertySchema,
  PropertySchema,
} from "@/components/property/schema";
import { adminActionClient, authActionClient } from "@/lib/actions/client";
import { z } from "zod";

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

    if (!id) {
      throw new Error("ID della proprietà non trovato");
    }

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
        details: data as PropertySchema,
      })
      .eq("id", id)
      .select()
      .single();

    if (updatedError) {
      throw new Error(updatedError.message);
    }

    return updatedData;
  });

export const createOwnerUserAction = adminActionClient
  .inputSchema(
    z.object({
      email: z.email(),
      password: z.string().min(8),
      propertyId: z.string(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const { supabase } = ctx;

    const { data, error } = await supabase.auth.admin.createUser({
      email: parsedInput.email,
      password: parsedInput.password,
      email_confirm: true,
    });

    if (error) {
      throw new Error(error.message);
    }

    const { data: accountData, error: accountError } = await supabase
      .from("account")
      .insert({
        user_id: data.user.id,
        is_admin: false,
      })
      .select()
      .single();

    if (accountError || !accountData) {
      throw new Error(
        accountError?.message ?? "Errore durante la creazione dell'account"
      );
    }

    const { data: propertyData, error: propertyError } = await supabase
      .from("property")
      .update({
        user_id: data.user.id,
      })
      .eq("id", parsedInput.propertyId)
      .select()
      .single();

    if (propertyError) {
      throw new Error(propertyError.message);
    }

    return {
      user: data.user,
      account: accountData,
    };
  });
