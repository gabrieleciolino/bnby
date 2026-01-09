"use server";

import {
  createOwnerUserSchema,
  propertySchema,
  PropertySchema,
  PropertyDetailsSchema,
} from "@/components/property/schema";
import {
  buildPropertyLandingHtml,
  defaultTemplateTheme,
  extractTemplateTheme,
} from "@/components/property/template-html";
import { adminActionClient, authActionClient } from "@/lib/actions/client";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Database } from "@/lib/db/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
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

const getNextGalleryIndex = (urls: string[], propertyId: string): number => {
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
  const items = (galleryItems ?? []).slice(0, 20);
  const existingSupabaseUrls = items.filter(
    (item): item is string =>
      typeof item === "string" && isSupabaseStorageUrl(item)
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

const uploadEditorialImage = async ({
  supabase,
  propertyId,
  body,
  contentType,
  extension,
}: {
  supabase: SupabaseClient<Database>;
  propertyId: string;
  body: ArrayBuffer | File;
  contentType?: string | null;
  extension: string;
}): Promise<string> => {
  const key = `editorial/${propertyId}/${randomUUID()}.${extension}`;
  const options = contentType ? { contentType } : undefined;

  const { error: uploadError } = await supabase.storage
    .from("properties")
    .upload(key, body, options);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicUrlData } = await supabase.storage
    .from("properties")
    .getPublicUrl(key);

  if (!publicUrlData?.publicUrl) {
    throw new Error("Impossibile ottenere l'URL pubblico dell'immagine");
  }

  return publicUrlData.publicUrl;
};

const processEditorialBlocks = async ({
  supabase,
  propertyId,
  blocks,
}: {
  supabase: SupabaseClient<Database>;
  propertyId: string;
  blocks?: PropertySchema["editorialBlocks"];
}): Promise<PropertyDetailsSchema["editorialBlocks"]> => {
  const items = blocks ?? [];
  const processed = [];

  for (const block of items) {
    if (!block) continue;
    const title = block.title?.trim() ?? "";
    const body = block.body?.trim() ?? "";
    if (!title || !body) {
      continue;
    }
    let imageUrl =
      typeof block.image === "string" ? block.image.trim() : "";
    if (block.image instanceof File) {
      const contentType = block.image.type || null;
      const extension = resolveImageExtension({
        fileName: block.image.name,
        contentType,
      });
      const body = await block.image.arrayBuffer();
      imageUrl = await uploadEditorialImage({
        supabase,
        propertyId,
        body,
        contentType,
        extension,
      });
    }
    processed.push({
      id: block.id?.trim() || undefined,
      title,
      body,
      image: imageUrl || undefined,
      imageAlt: block.imageAlt?.trim() || undefined,
    });
  }

  return processed;
};

const toTemplateGalleryItems = (gallery?: PropertyDetailsSchema["gallery"]) =>
  (gallery ?? [])
    .filter((item): item is string => typeof item === "string")
    .map((url, index) => ({
      url,
      alt: url.split("/").pop() ?? `image-${index + 1}`,
    }));

const resolveTemplateTheme = (template?: string | null) =>
  template?.trim() ? extractTemplateTheme(template) : defaultTemplateTheme;

const buildTemplateFromDetails = (
  details: PropertyDetailsSchema,
  template?: string | null,
  propertyId?: string | null
) =>
  buildPropertyLandingHtml({
    info: details.info,
    services: details.services ?? [],
    gallery: toTemplateGalleryItems(details.gallery),
    position: details.position,
    contact: details.contact,
    booking: details.booking,
    editorialBlocks: details.editorialBlocks,
    faqs: details.faqs ?? [],
    landing: details.landing,
    theme: resolveTemplateTheme(template),
    propertyId: propertyId ?? undefined,
  });

type PropertyDetailsDb = Omit<PropertyDetailsSchema, "gallery"> & {
  gallery: string[];
};

export const addPropertyAction = authActionClient
  .inputSchema(propertySchema)
  .action(async ({ ctx, parsedInput }) => {
    const { supabase, account } = ctx;
    const gallerySupabase = account?.is_admin ? supabaseAdmin : supabase;
    const {
      slug,
      info: { name, description, rooms, bathrooms, guests },
      services,
      position,
      contact,
      booking,
      editorialBlocks,
      gallery,
      faqs,
      landing,
      template,
    } = parsedInput;
    const themeTemplate = template?.trim() ? template : null;

    const details: PropertyDetailsDb = {
      slug,
      info: {
        name,
        description,
        rooms,
        bathrooms,
        guests,
      },
      services,
      position,
      contact,
      booking,
      editorialBlocks: [],
      faqs,
      landing,
      gallery: [],
    };

    const { data, error } = await supabase
      .from("property")
      .insert({
        details:
          details as Database["public"]["Tables"]["property"]["Row"]["details"],
        template: null,
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
    const processedEditorialBlocks = await processEditorialBlocks({
      supabase: gallerySupabase,
      propertyId: data.id,
      blocks: editorialBlocks,
    });
    const nextDetails: PropertyDetailsDb = {
      ...details,
      gallery: uploadedImages,
      editorialBlocks: processedEditorialBlocks,
    };
    const nextTemplate = buildTemplateFromDetails(
      nextDetails,
      themeTemplate,
      data.id
    );

    const { data: updatedData, error: updatedError } = await supabase
      .from("property")
      .update({
        details:
          nextDetails as Database["public"]["Tables"]["property"]["Row"]["details"],
        template: nextTemplate,
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
    const processedEditorialBlocks = await processEditorialBlocks({
      supabase: gallerySupabase,
      propertyId: id,
      blocks: data.editorialBlocks,
    });
    const themeTemplate =
      template?.trim() || propertyData?.template?.trim() || null;
    const nextDetails: PropertyDetailsDb = {
      ...data,
      gallery: uploadedImages,
      editorialBlocks: processedEditorialBlocks,
    } as PropertyDetailsDb;
    const nextTemplate = buildTemplateFromDetails(
      nextDetails,
      themeTemplate,
      id
    );

    const { data: updatedData, error: updatedError } = await supabase
      .from("property")
      .update({
        details:
          nextDetails as Database["public"]["Tables"]["property"]["Row"]["details"],
        template: nextTemplate,
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

export const associateOwnerUserAction = adminActionClient
  .inputSchema(
    z.object({
      email: z.email(),
      propertyId: z.string(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const { supabase } = ctx;

    const { data: usersData, error: usersError } =
      await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

    if (usersError) {
      throw new Error(usersError.message);
    }

    const normalizedEmail = parsedInput.email.trim().toLowerCase();
    const user = usersData?.users.find(
      (item) => item.email?.toLowerCase() === normalizedEmail
    );

    if (!user) {
      throw new Error("Utente non trovato");
    }

    const { data: propertyData, error: propertyError } = await supabase
      .from("property")
      .select("id,user_id")
      .eq("id", parsedInput.propertyId)
      .single();

    if (propertyError) {
      throw new Error(propertyError.message);
    }

    if (propertyData?.user_id) {
      throw new Error("La proprietà ha già un proprietario associato");
    }

    const { data: accountData, error: accountError } = await supabase
      .from("account")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (accountError) {
      throw new Error(accountError.message);
    }

    if (accountData?.is_admin) {
      throw new Error("L'utente selezionato è un amministratore");
    }

    if (!accountData) {
      const { error: insertAccountError } = await supabase
        .from("account")
        .insert({
          user_id: user.id,
          is_admin: false,
        });

      if (insertAccountError) {
        throw new Error(insertAccountError.message);
      }
    }

    const { data: propertyUpdate, error: propertyUpdateError } = await supabase
      .from("property")
      .update({
        user_id: user.id,
      })
      .eq("id", parsedInput.propertyId)
      .select()
      .single();

    if (propertyUpdateError) {
      throw new Error(propertyUpdateError.message);
    }

    return {
      user,
      property: propertyUpdate,
    };
  });

export const setPropertyPublishedAction = adminActionClient
  .inputSchema(
    z.object({
      propertyId: z.string().uuid(),
      isPublished: z.boolean(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const { supabase } = ctx;
    const { propertyId, isPublished } = parsedInput;

    const { error: updateError } = await supabase
      .from("property")
      .update({
        is_published: isPublished,
      })
      .eq("id", propertyId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return {
      isPublished,
    };
  });

export const savePropertyTemplateAction = authActionClient
  .inputSchema(
    z.object({
      propertyId: z.string().uuid(),
      template: z.string(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const { supabase, user, account } = ctx;
    const { propertyId, template } = parsedInput;
    const normalizedTemplate = template?.trim() ? template : null;

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

    const { error: updateError } = await supabase
      .from("property")
      .update({
        template: normalizedTemplate,
      })
      .eq("id", propertyId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return {
      template: normalizedTemplate ?? "",
    };
  });

export const deleteGalleryImageAction = authActionClient
  .inputSchema(
    z.object({
      propertyId: z.string().uuid(),
      imageUrl: z.string().url(),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const { supabase, user, account } = ctx;
    const { propertyId, imageUrl } = parsedInput;

    const { data: propertyData, error: propertyError } = await supabase
      .from("property")
      .select("id,user_id,details,template")
      .eq("id", propertyId)
      .single();

    if (propertyError || !propertyData) {
      throw new Error(propertyError?.message ?? "Proprieta non trovata");
    }

    if (!account?.is_admin && propertyData.user_id !== user.sub) {
      throw new Error("Unauthorized");
    }

    const details = propertyData.details as PropertyDetailsSchema;
    const nextGallery = (details.gallery ?? []).filter(
      (url) => url !== imageUrl
    );
    const storagePath = getStoragePathFromUrl(imageUrl);

    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from("properties")
        .remove([storagePath]);

      if (storageError) {
        throw new Error(storageError.message);
      }

      const { error: deleteError } = await supabase
        .from("gallery")
        .delete()
        .eq("property_id", propertyId)
        .eq("key", storagePath);

      if (deleteError) {
        throw new Error(deleteError.message);
      }
    }

    const nextDetails: PropertyDetailsDb = {
      ...details,
      gallery: nextGallery,
    } as PropertyDetailsDb;
    const nextTemplate = buildTemplateFromDetails(
      nextDetails,
      propertyData.template,
      propertyId
    );

    const { error: updateError } = await supabase
      .from("property")
      .update({
        details:
          nextDetails as Database["public"]["Tables"]["property"]["Row"]["details"],
        template: nextTemplate,
      })
      .eq("id", propertyId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return {
      gallery: nextGallery,
      template: nextTemplate,
    };
  });

const resolveSenderEmail = (fromValue: string) => {
  const match = fromValue.match(/<([^>]+)>/);
  return (match?.[1] ?? fromValue).trim();
};

export const sendOwnerColdEmailAction = adminActionClient
  .inputSchema(
    z.object({
      propertyId: z.string().uuid(),
      baseUrl: z.string().min(1),
    })
  )
  .action(async ({ ctx, parsedInput }) => {
    const { supabase } = ctx;
    const normalizedBaseUrl = parsedInput.baseUrl.trim().replace(/\/$/, "");

    let baseUrl: URL;
    try {
      baseUrl = new URL(normalizedBaseUrl);
    } catch {
      throw new Error("Base URL non valido");
    }

    const { data: propertyData, error: propertyError } = await supabase
      .from("property")
      .select("id,user_id,details")
      .eq("id", parsedInput.propertyId)
      .single();

    if (propertyError || !propertyData) {
      throw new Error(propertyError?.message ?? "Proprieta non trovata");
    }

    if (propertyData.user_id) {
      throw new Error("La proprieta ha gia un proprietario associato");
    }

    const details = propertyData.details as PropertyDetailsSchema | null;
    const propertyName = details?.info?.name?.trim() || "Proprieta";
    const slug = details?.slug?.trim();
    const ownerEmail = details?.contact?.email?.trim();

    if (!slug) {
      throw new Error("Slug proprieta non disponibile");
    }

    if (!ownerEmail) {
      throw new Error("Email proprietario non disponibile");
    }

    const previewUrl = `${baseUrl.origin}/p/${slug}`;
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFrom = process.env.RESEND_MARKETING_FROM;

    if (!resendApiKey || !resendFrom) {
      throw new Error("Configurazione email mancante");
    }

    const replyEmail = resolveSenderEmail(resendFrom);
    const subject = `Ti propongo un sito per il tuo BnB: ${propertyName}`;
    const textLines = [
      `Ciao,`,
      "",
      `sono Gabriele, fondatore di bnby.me. Ti contatto perché vorrei proporti un sito per il tuo BnB: ${propertyName}`,
      `Mi sono permesso di prepararti un'anteprima qui: ${previewUrl}`,
      "",
      "Se ti piace, possiamo metterlo online in pochi minuti. Avrai a disposizione anche un pannello di controllo dove potrai personalizzare i colori e i dettagli.",
      "Il costo del servizio è di 399€ per l'attivazione e copre il primo anno, dal secondo in poi ti costa 99€ all'anno per coprire i costi di mantenimento.",
      "Per maggiori informazioni puoi rispondermi a questa email oppure prenotare subito una videochiamata per saperne di più.",
      "",
      `Prenota call (disponibilità dalle ore 9 alle 18): ${process.env.CALENDLY_MEETING_EARLY_URL}`,
      `Prenota call (disponibilità dalle ore 18 alle 21): ${process.env.CALENDLY_MEETING_LATE_URL}`,
      "",
      "Gabriele",
      "fondatore di bnby.me",
    ];

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: resendFrom,
        to: ownerEmail,
        subject,
        text: textLines.join("\n"),
        reply_to: replyEmail || undefined,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      throw new Error(errorText || "Invio email non riuscito");
    }

    return {
      sent: true,
      ownerEmail,
      previewUrl,
    };
  });
