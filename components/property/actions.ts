"use server";

import {
  createOwnerUserSchema,
  propertySchema,
  PropertySchema,
  PropertyDetailsSchema,
} from "@/components/property/schema";
import { adminActionClient, authActionClient } from "@/lib/actions/client";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Database } from "@/lib/db/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";

const SUPABASE_PUBLIC_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? null;
const STORAGE_PUBLIC_PREFIX = SUPABASE_PUBLIC_URL
  ? `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/properties/`
  : null;
const STORAGE_PATH_TOKEN = "/storage/v1/object/public/properties/";

const getStoragePathFromUrl = (url: string): string | null => {
  if (STORAGE_PUBLIC_PREFIX && url.startsWith(STORAGE_PUBLIC_PREFIX)) {
    return url.slice(STORAGE_PUBLIC_PREFIX.length);
  }

  try {
    const parsedUrl = new URL(url);
    const index = parsedUrl.pathname.indexOf(STORAGE_PATH_TOKEN);
    if (index === -1) {
      return null;
    }
    return parsedUrl.pathname.slice(index + STORAGE_PATH_TOKEN.length);
  } catch {
    return null;
  }
};

const isSupabaseStorageUrl = (url: string): boolean =>
  Boolean(getStoragePathFromUrl(url));

const normalizeExtension = (extension?: string | null): string | null => {
  if (!extension) {
    return null;
  }
  const trimmed = extension.trim().toLowerCase();
  if (!trimmed) {
    return null;
  }
  return trimmed.startsWith(".") ? trimmed.slice(1) : trimmed;
};

const getExtensionFromFileName = (name: string): string | null => {
  const lastDot = name.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === name.length - 1) {
    return null;
  }
  return normalizeExtension(name.slice(lastDot + 1));
};

const getExtensionFromUrl = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    const fileName = parsedUrl.pathname.split("/").pop() ?? "";
    return getExtensionFromFileName(fileName);
  } catch {
    return null;
  }
};

const getExtensionFromContentType = (
  contentType?: string | null
): string | null => {
  if (!contentType) {
    return null;
  }
  const normalized = contentType.split(";")[0]?.trim().toLowerCase();
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  };
  return map[normalized] ?? null;
};

const resolveImageExtension = (options: {
  fileName?: string;
  url?: string;
  contentType?: string | null;
}): string => {
  return (
    getExtensionFromFileName(options.fileName ?? "") ??
    getExtensionFromUrl(options.url ?? "") ??
    getExtensionFromContentType(options.contentType) ??
    "jpg"
  );
};

const getNextGalleryIndex = (
  urls: string[],
  propertyId: string
): number => {
  let maxIndex = -1;
  for (const url of urls) {
    const storagePath = getStoragePathFromUrl(url);
    if (!storagePath) {
      continue;
    }
    if (!storagePath.startsWith(`${propertyId}/`)) {
      continue;
    }
    const fileName = storagePath.slice(propertyId.length + 1);
    const match = fileName.match(/^(\d+)\./);
    if (!match) {
      continue;
    }
    const value = Number.parseInt(match[1], 10);
    if (!Number.isNaN(value)) {
      maxIndex = Math.max(maxIndex, value);
    }
  }

  return maxIndex >= 0 ? maxIndex + 1 : urls.length;
};

const uploadGalleryImage = async ({
  supabase,
  propertyId,
  index,
  body,
  contentType,
  extension,
}: {
  supabase: SupabaseClient<Database>;
  propertyId: string;
  index: number;
  body: ArrayBuffer | File;
  contentType?: string | null;
  extension: string;
}): Promise<string> => {
  const key = `${propertyId}/${index}.${extension}`;
  const options = contentType ? { contentType } : undefined;

  const { error: uploadError } = await supabase.storage
    .from("properties")
    .upload(key, body, options);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { error: galleryError } = await supabase.from("gallery").insert({
    key,
    property_id: propertyId,
  });

  if (galleryError) {
    throw new Error(galleryError.message);
  }

  const { data: publicUrlData } = await supabase.storage
    .from("properties")
    .getPublicUrl(key);

  if (!publicUrlData?.publicUrl) {
    throw new Error("Impossibile ottenere l'URL pubblico dell'immagine");
  }

  return publicUrlData.publicUrl;
};

const processGalleryItems = async ({
  supabase,
  propertyId,
  galleryItems,
}: {
  supabase: SupabaseClient<Database>;
  propertyId: string;
  galleryItems?: PropertySchema["gallery"];
}): Promise<string[]> => {
  const items = galleryItems ?? [];
  const existingSupabaseUrls = items.filter(
    (item): item is string => typeof item === "string" && isSupabaseStorageUrl(item)
  );
  let nextIndex = getNextGalleryIndex(existingSupabaseUrls, propertyId);
  const uploadedImages: string[] = [];
  const externalCache = new Map<string, string>();

  for (const item of items) {
    if (typeof item === "string") {
      if (isSupabaseStorageUrl(item)) {
        uploadedImages.push(item);
        continue;
      }

      const cached = externalCache.get(item);
      if (cached) {
        uploadedImages.push(cached);
        continue;
      }

      const response = await fetch(item);
      if (!response.ok) {
        throw new Error(`Impossibile scaricare l'immagine: ${item}`);
      }

      const contentType =
        response.headers.get("content-type")?.split(";")[0]?.trim() ?? null;
      const extension = resolveImageExtension({
        url: item,
        contentType,
      });
      const body = await response.arrayBuffer();

      const publicUrl = await uploadGalleryImage({
        supabase,
        propertyId,
        index: nextIndex,
        body,
        contentType,
        extension,
      });
      nextIndex += 1;
      externalCache.set(item, publicUrl);
      uploadedImages.push(publicUrl);
      continue;
    }

    if (item instanceof File) {
      const extension = resolveImageExtension({
        fileName: item.name,
        contentType: item.type,
      });
      const publicUrl = await uploadGalleryImage({
        supabase,
        propertyId,
        index: nextIndex,
        body: item,
        contentType: item.type,
        extension,
      });
      nextIndex += 1;
      uploadedImages.push(publicUrl);
    }
  }

  return uploadedImages;
};

const publishDirectory = path.join(process.cwd(), "public", "p");

export const addPropertyAction = authActionClient
  .inputSchema(propertySchema)
  .action(async ({ ctx, parsedInput }) => {
    const { supabase, account } = ctx;
    const gallerySupabase = account?.is_admin ? supabaseAdmin : supabase;
    const {
      info: { name, description, rooms, bathrooms, guests, cancellationPolicy },
      services,
      position,
      contact,
      gallery,
      faqs,
      landing,
      template,
    } = parsedInput;

    const normalizedTemplate = template?.trim() ? template : null;

    const details: PropertyDetailsSchema = {
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
      faqs,
      landing,
    };

    const { data, error } = await supabase
      .from("property")
      .insert({
        details,
        template: normalizedTemplate,
      })
      .select()
      .single();

    if (!data || error) {
      throw new Error(
        error?.message ?? "Errore durante l'aggiunta della proprietà"
      );
    }

    const uploadedImages = await processGalleryItems({
      supabase: gallerySupabase,
      propertyId: data.id,
      galleryItems: gallery,
    });

    const { data: updatedData, error: updatedError } = await supabase
      .from("property")
      .update({
        details: {
          ...details,
          gallery: uploadedImages,
        },
        template: normalizedTemplate,
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
    const { supabase, account } = ctx;
    const gallerySupabase = account?.is_admin ? supabaseAdmin : supabase;
    const { id, template, ...data } = parsedInput;
    const normalizedTemplate = template?.trim() ? template : null;

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

    const uploadedImages = await processGalleryItems({
      supabase: gallerySupabase,
      propertyId: id,
      galleryItems: data.gallery,
    });

    const { data: updatedData, error: updatedError } = await supabase
      .from("property")
      .update({
        details: {
          ...data,
          gallery: uploadedImages,
        } as PropertyDetailsSchema,
        template: normalizedTemplate,
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

export const publishPropertyTemplateAction = authActionClient
  .inputSchema(
    z.object({
      propertyId: z.string().uuid(),
      template: z.string().min(1),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const { supabase, user, account } = ctx;
    const { propertyId, template } = parsedInput;

    const { data: propertyData, error: propertyError } = await supabase
      .from("property")
      .select("id, user_id")
      .eq("id", propertyId)
      .single();

    if (propertyError || !propertyData) {
      throw new Error(propertyError?.message ?? "Proprieta non trovata");
    }

    if (!account?.is_admin && propertyData.user_id !== user.sub) {
      throw new Error("Unauthorized");
    }

    await fs.mkdir(publishDirectory, { recursive: true });
    const filename = `id-${propertyId}.html`;
    const filePath = path.join(publishDirectory, filename);
    await fs.writeFile(filePath, template, "utf8");

    return {
      path: `/p/${filename}`,
    };
  });
