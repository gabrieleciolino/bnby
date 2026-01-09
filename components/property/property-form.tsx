"use client";

import {
  propertySchema,
  PropertyFormValues,
  PropertyWithDetails,
} from "@/components/property/schema";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition, useState } from "react";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  addPropertyAction,
  editPropertyAction,
  deleteGalleryImageAction,
} from "@/components/property/actions";
import { toast } from "sonner";
import { urls } from "@/lib/urls";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { NumberField } from "../ui/number-field";
import { useDropzone } from "react-dropzone";
import { services } from "@/components/property/services";
import ImportFromHtmlSheet from "@/components/property/import-from-html-sheet";
import {
  associateOwnerUserAction,
  createOwnerUserAction,
} from "@/components/property/actions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { resolveLandingConfig } from "@/components/property/landing-config";
import TemplatePreviewSheet from "@/components/property/template-preview-sheet";

export default function PropertyForm({
  property,
  isAdmin = false,
}: {
  property?: PropertyWithDetails;
  isAdmin?: boolean;
}) {
  const [isUpdatingProperty, startUpdatingProperty] = useTransition();
  const [isCreatingOwnerUser, startCreatingOwnerUser] = useTransition();
  const [isAssociatingOwnerUser, startAssociatingOwnerUser] = useTransition();
  const [ownerUserEmail, setOwnerUserEmail] = useState("");
  const [ownerUserPassword, setOwnerUserPassword] = useState("");
  const [existingOwnerEmail, setExistingOwnerEmail] = useState("");
  const [isGeneratingEditorial, setIsGeneratingEditorial] = useState(false);
  const [deletingGalleryIndex, setDeletingGalleryIndex] = useState<
    number | null
  >(null);
  const router = useRouter();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      id: property?.id,
      slug: property?.details.slug ?? "",
      info: {
        name: property?.details.info.name ?? "",
        description: property?.details.info.description ?? "",
        rooms: property?.details.info.rooms ?? 1,
        bathrooms: property?.details.info.bathrooms ?? 0,
        guests: property?.details.info.guests ?? 1,
      },
      services: property?.details.services ?? [],
      gallery: property?.details.gallery ?? [],
      position: property?.details.position ?? {
        address: "",
        lat: undefined,
        lng: undefined,
      },
      contact: property?.details.contact ?? {
        name: "",
        email: "",
        phone: "",
      },
      booking: {
        bookingUrl: property?.details.booking?.bookingUrl ?? "",
      },
      editorialBlocks: property?.details.editorialBlocks ?? [],
      faqs: property?.details.faqs ?? [],
      landing: resolveLandingConfig(property?.details.landing),
      template: property?.template ?? "",
    },
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  const {
    fields: editorialFields,
    append: appendEditorial,
    remove: removeEditorial,
  } = useFieldArray({
    control: form.control,
    name: "editorialBlocks",
  });

  const galleryItems = form.watch("gallery") ?? [];
  const galleryUrls = useMemo(
    () =>
      galleryItems.filter((item): item is string => typeof item === "string"),
    [galleryItems]
  );

  const onSubmit = (data: PropertyFormValues) => {
    startUpdatingProperty(async () => {
      try {
        const {
          data: updatedProperty,
          serverError,
          validationErrors,
        } = property
          ? await editPropertyAction(data)
          : await addPropertyAction(data);

        if (serverError) {
          throw new Error(serverError);
        }

        if (validationErrors) {
          throw new Error();
        }

        if (updatedProperty?.template != null) {
          form.setValue("template", updatedProperty.template ?? "", {
            shouldDirty: false,
            shouldValidate: true,
          });
        }

        toast.success("Proprietà salvata con successo");
      } catch (error) {
        toast.error("Errore durante l'aggiunta della proprietà");
      }
    });
  };

  const buildEditorialAiPayload = (values: PropertyFormValues) => ({
    ...values,
    gallery: (values.gallery ?? []).map((item) =>
      typeof item === "string" ? item : item.name
    ),
    editorialBlocks: (values.editorialBlocks ?? []).map((block) => ({
      title: block.title,
      body: block.body,
      image: typeof block.image === "string" ? block.image : block.image?.name,
      imageAlt: block.imageAlt,
    })),
  });

  const handleGenerateEditorial = async () => {
    if (isGeneratingEditorial) return;
    setIsGeneratingEditorial(true);
    try {
      const values = form.getValues();
      const response = await fetch("/api/editorial-block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ property: buildEditorialAiPayload(values) }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Generazione non riuscita");
      }
      const data = await response.json();
      if (!data?.title || !data?.body) {
        throw new Error("Risposta AI non valida");
      }
      appendEditorial({
        title: String(data.title),
        body: String(data.body),
        image: "",
      });
      toast.success("Blocco editoriale generato");
    } catch (error) {
      toast.error("Errore durante la generazione del blocco");
    } finally {
      setIsGeneratingEditorial(false);
    }
  };

  const gallery = form.watch("gallery");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      const currentGallery = form.getValues("gallery") ?? [];
      const remainingSlots = Math.max(0, 20 - currentGallery.length);
      if (remainingSlots === 0) {
        toast.error("Puoi caricare al massimo 20 immagini");
        return;
      }
      const nextFiles = acceptedFiles.slice(0, remainingSlots);
      if (acceptedFiles.length > remainingSlots) {
        toast.info(
          "Limite massimo 20 immagini: alcune non sono state aggiunte"
        );
      }
      form.setValue("gallery", [...currentGallery, ...nextFiles], {
        shouldDirty: true,
      });
    },
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    multiple: true,
  });

  const loadedImages = useMemo(() => {
    return (gallery ?? []).map((item, index) => {
      if (typeof item === "string") {
        return {
          url: item,
          name: item.split("/").pop() ?? `image-${index + 1}`,
          source: "stored" as const,
        };
      }

      return {
        url: URL.createObjectURL(item),
        name: item.name,
        source: "local" as const,
      };
    });
  }, [gallery]);

  const selectedServices = form.watch("services") ?? [];

  const handleRemoveGalleryImage = (index: number) => {
    const currentGallery = form.getValues("gallery") ?? [];
    const target = currentGallery[index];
    if (!target) {
      return;
    }
    if (typeof target !== "string" || !property?.id) {
      const nextGallery = currentGallery.filter((_, idx) => idx !== index);
      form.setValue("gallery", nextGallery, { shouldDirty: true });
      return;
    }

    setDeletingGalleryIndex(index);
    startUpdatingProperty(async () => {
      try {
        const { data, serverError } = await deleteGalleryImageAction({
          propertyId: property.id,
          imageUrl: target,
        });
        if (serverError) {
          throw new Error(serverError);
        }
        const nextGallery = currentGallery.filter((_, idx) => idx !== index);
        form.setValue("gallery", nextGallery, { shouldDirty: true });
        if (data?.template != null) {
          form.setValue("template", data.template ?? "", {
            shouldDirty: false,
            shouldValidate: true,
          });
        }
        toast.success("Foto rimossa");
      } catch (error) {
        toast.error("Errore durante la rimozione della foto");
      } finally {
        setDeletingGalleryIndex(null);
      }
    });
  };

  const handleCreateOwnerUser = () => {
    startCreatingOwnerUser(async () => {
      try {
        const { serverError, validationErrors } = await createOwnerUserAction({
          email: ownerUserEmail,
          password: ownerUserPassword,
          propertyId: property?.id ?? "",
        });

        if (serverError) {
          throw new Error(serverError);
        }

        if (validationErrors) {
          throw new Error();
        }
        toast.success("Utente proprietario creato con successo");
        setOwnerUserEmail("");
        setOwnerUserPassword("");
        router.refresh();
      } catch (error) {
        toast.error("Errore durante la creazione dell'utente proprietario");
      }
    });
  };

  const handleAssociateOwnerUser = () => {
    startAssociatingOwnerUser(async () => {
      try {
        const { serverError, validationErrors } =
          await associateOwnerUserAction({
            email: existingOwnerEmail,
            propertyId: property?.id ?? "",
          });

        if (serverError) {
          throw new Error(serverError);
        }

        if (validationErrors) {
          throw new Error();
        }

        toast.success("Utente associato con successo");
        setExistingOwnerEmail("");
        router.refresh();
      } catch (error) {
        toast.error("Errore durante l'associazione dell'utente proprietario");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <input type="hidden" {...form.register("template")} />
        {!isAdmin && <input type="hidden" {...form.register("slug")} />}
        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && <ImportFromHtmlSheet />}
          <TemplatePreviewSheet
            isAdmin={isAdmin}
            initialIsPublished={property?.is_published ?? false}
          />
          {property && !property?.user_id && (
            <Sheet>
              <SheetTrigger asChild>
                <Button type="button" variant="outline">
                  Crea utente proprietario
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-card">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-bold">
                    Utente proprietario
                  </SheetTitle>
                </SheetHeader>
                <Tabs defaultValue="create" className="p-4">
                  <TabsList className="h-12 w-full">
                    <TabsTrigger value="create">Crea nuovo</TabsTrigger>
                    <TabsTrigger value="associate">
                      Associa esistente
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="create" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="owner-email">Email</Label>
                      <Input
                        id="owner-email"
                        placeholder="john.doe@example.com"
                        value={ownerUserEmail}
                        onChange={(e) => setOwnerUserEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner-password">Password</Label>
                      <Input
                        id="owner-password"
                        type="password"
                        placeholder="Password"
                        value={ownerUserPassword}
                        onChange={(e) => setOwnerUserPassword(e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleCreateOwnerUser}
                      disabled={isCreatingOwnerUser}
                    >
                      {isCreatingOwnerUser && (
                        <Loader2 className="size-4 animate-spin" />
                      )}
                      Crea utente
                    </Button>
                  </TabsContent>
                  <TabsContent value="associate" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="existing-owner-email">Email utente</Label>
                      <Input
                        id="existing-owner-email"
                        placeholder="utente.esistente@example.com"
                        value={existingOwnerEmail}
                        onChange={(e) => setExistingOwnerEmail(e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleAssociateOwnerUser}
                      disabled={isAssociatingOwnerUser}
                    >
                      {isAssociatingOwnerUser && (
                        <Loader2 className="size-4 animate-spin" />
                      )}
                      Associa utente
                    </Button>
                  </TabsContent>
                </Tabs>
              </SheetContent>
            </Sheet>
          )}
        </div>

        <Tabs defaultValue="info">
          <TabsList className="h-16 w-full mb-8">
            <TabsTrigger value="info">Dettagli</TabsTrigger>
            <TabsTrigger value="gallery">Galleria</TabsTrigger>
            <TabsTrigger value="editorial">Editoriali</TabsTrigger>
            <TabsTrigger value="contact">Contatti</TabsTrigger>
            <TabsTrigger value="faqs">Domande frequenti</TabsTrigger>
            <TabsTrigger value="position">Posizione</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-8">
            <h2 className="text-2xl font-bold">Dettagli</h2>
            <FormField
              control={form.control}
              name="info.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Villa Giulia BnB" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isAdmin && (
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="villa-giulia-bnb" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="info.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrizione</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[70px] max-h-[300px]"
                      placeholder="Situata in una zona tranquilla, la villa offre una vista panoramica sulla città..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
              <FormField
                control={form.control}
                name="info.rooms"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-2 items-center">
                    <FormLabel>Numero di camere</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <NumberField
                          {...field}
                          min={1}
                          max={10}
                          step={1}
                          className="border rounded-lg p-2"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="info.bathrooms"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-2 items-center">
                    <FormLabel>Numero di bagni</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <NumberField
                          {...field}
                          min={0}
                          max={10}
                          step={1}
                          className="border rounded-lg p-2"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="info.guests"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-2 items-center">
                    <FormLabel>Numero di ospiti</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <NumberField
                          {...field}
                          min={1}
                          max={20}
                          step={1}
                          className="border rounded-lg p-2"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Servizi</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={cn(
                      "flex flex-col items-center justify-center min-h-[100px] gap-2 border-2  p-2 rounded-md",
                      selectedServices.includes(service.id)
                        ? "border-primary"
                        : "border-muted"
                    )}
                    onClick={() => {
                      if (selectedServices.includes(service.id)) {
                        form.setValue(
                          "services",
                          selectedServices.filter((s) => s !== service.id)
                        );
                      } else {
                        form.setValue("services", [
                          ...selectedServices,
                          service.id,
                        ]);
                      }
                    }}
                  >
                    {service.icon}
                    <span>{service.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Prenotazioni</h3>
              <p className="text-sm text-muted-foreground">
                Inserisci il link diretto al portale di prenotazioni.
              </p>
              <FormField
                control={form.control}
                name="booking.bookingUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link diretto prenotazioni</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://www.airbnb.com/..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          <TabsContent value="position" className="space-y-8">
            <h2 className="text-2xl font-bold">Posizione</h2>
            <FormField
              control={form.control}
              name="position.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indirizzo</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Via dei Monti Tiburtini, 123"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="position.lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitudine</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.000001"
                        placeholder="38.45364"
                        value={field.value ?? ""}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position.lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitudine</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.000001"
                        placeholder="14.96069"
                        value={field.value ?? ""}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          <TabsContent value="gallery" className="space-y-8">
            <h2 className="text-2xl font-bold">Galleria</h2>
            <p className="text-sm text-muted-foreground">
              Puoi caricare fino a 20 immagini.
            </p>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-secondary rounded-lg p-4 min-h-[200px] flex items-center justify-center"
            >
              <input {...getInputProps()} />
              <p className="text-sm text-muted-foreground">
                Trascina e rilascia le immagini qui o clicca per caricare
              </p>
            </div>

            {loadedImages && loadedImages.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Immagini caricate</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {loadedImages?.map((image, index) => (
                    <div key={image.name} className="relative">
                      <Image
                        src={image.url}
                        alt={image.name}
                        width={500}
                        height={500}
                        className="rounded-lg w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        className="absolute top-1 right-1"
                        onClick={() => handleRemoveGalleryImage(index)}
                        disabled={deletingGalleryIndex === index}
                        aria-label="Rimuovi foto"
                      >
                        {deletingGalleryIndex === index ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <X className="size-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="editorial" className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Blocchi editoriali</h2>
                <p className="text-sm text-muted-foreground">
                  Aggiungi sezioni narrative con titolo e testo per arricchire
                  la landing.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendEditorial({ title: "", body: "", image: "" })
                  }
                >
                  Aggiungi blocco
                </Button>
                <Button
                  type="button"
                  onClick={handleGenerateEditorial}
                  disabled={isGeneratingEditorial}
                >
                  {isGeneratingEditorial && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  Genera con AI
                </Button>
              </div>
            </div>

            {editorialFields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nessun blocco editoriale presente.
              </p>
            ) : (
              <div className="space-y-6">
                {editorialFields.map((field, index) => {
                  const imageValue = form.getValues(
                    `editorialBlocks.${index}.image`
                  );
                  const imageUrl =
                    typeof imageValue === "string" ? imageValue : "";
                  const imageLabel =
                    imageValue instanceof File ? imageValue.name : "";
                  return (
                    <div
                      key={field.id}
                      className="space-y-4 rounded-lg border border-border bg-card p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-lg font-semibold">
                          Blocco {index + 1}
                        </h3>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeEditorial(index)}
                        >
                          Rimuovi blocco
                        </Button>
                      </div>
                      <FormField
                        control={form.control}
                        name={`editorialBlocks.${index}.title`}
                        render={({ field: titleField }) => (
                          <FormItem>
                            <FormLabel>Titolo</FormLabel>
                            <FormControl>
                              <Input
                                {...titleField}
                                placeholder="Un soggiorno che sa di casa"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`editorialBlocks.${index}.body`}
                        render={({ field: bodyField }) => (
                          <FormItem>
                            <FormLabel>Testo</FormLabel>
                            <FormControl>
                              <Textarea
                                {...bodyField}
                                className="min-h-[120px]"
                                placeholder="Racconta cosa rende unica la struttura..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Foto dalla galleria</Label>
                          <select
                            className="h-12 w-full rounded-md border border-border bg-transparent px-3 text-sm"
                            value={imageUrl}
                            onChange={(event) => {
                              form.setValue(
                                `editorialBlocks.${index}.image`,
                                event.target.value,
                                { shouldDirty: true }
                              );
                            }}
                          >
                            <option value="">Nessuna foto selezionata</option>
                            {galleryUrls.map((url) => (
                              <option key={url} value={url}>
                                {url.split("/").pop()}
                              </option>
                            ))}
                          </select>
                          {imageLabel ? (
                            <p className="text-xs text-muted-foreground">
                              File selezionato: {imageLabel}
                            </p>
                          ) : null}
                        </div>
                        <div className="space-y-2">
                          <Label>Carica foto custom</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.target.files?.[0] ?? null;
                              if (!file) return;
                              form.setValue(
                                `editorialBlocks.${index}.image`,
                                file,
                                { shouldDirty: true }
                              );
                            }}
                          />
                        </div>
                      </div>
                      <FormField
                        control={form.control}
                        name={`editorialBlocks.${index}.imageAlt`}
                        render={({ field: altField }) => (
                          <FormItem>
                            <FormLabel>Testo alternativo immagine</FormLabel>
                            <FormControl>
                              <Input
                                {...altField}
                                placeholder="Descrizione breve dell'immagine"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {imageUrl ? (
                        <div className="overflow-hidden rounded-lg border border-border">
                          <Image
                            src={imageUrl}
                            alt="Anteprima immagine editoriale"
                            width={320}
                            height={200}
                            className="h-48 w-full object-cover"
                          />
                        </div>
                      ) : null}
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          form.setValue(`editorialBlocks.${index}.image`, "", {
                            shouldDirty: true,
                          })
                        }
                      >
                        Rimuovi immagine
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
          <TabsContent value="contact" className="space-y-8">
            <h2 className="text-2xl font-bold">Contatti</h2>
            <FormField
              control={form.control}
              name="contact.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="john.doe@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefono</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="333 123 4567" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="faqs" className="space-y-8">
            <h2 className="text-2xl font-bold">Domande frequenti</h2>
            <div className="space-y-4">
              {faqFields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nessuna FAQ inserita. Aggiungi le domande piu comuni.
                </p>
              )}
              {faqFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-3 rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name={`faqs.${index}.question`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Domanda</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Es. Quali sono gli orari di check-in?"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="mt-7"
                      onClick={() => removeFaq(index)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name={`faqs.${index}.answer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risposta</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[80px]"
                            placeholder="Risposta breve e chiara"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendFaq({ question: "", answer: "" })}
              >
                Aggiungi FAQ
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Button type="submit" disabled={isUpdatingProperty}>
          {isUpdatingProperty && <Loader2 className="size-4 animate-spin" />}
          {property ? "Salva modifiche" : "Aggiungi proprietà"}
        </Button>
      </form>
    </Form>
  );
}
