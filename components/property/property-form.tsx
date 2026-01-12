"use client";

import {
  propertySchema,
  PropertyFormValues,
  PropertyWithDetails,
} from "@/components/property/schema";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  addPropertyAction,
  editPropertyAction,
  deleteGalleryImageAction,
} from "@/components/property/actions";
import { toast } from "sonner";
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
import AiLandingGenerator from "@/components/property/ai-landing-generator";

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
  const [currentStep, setCurrentStep] = useState(0);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [customServiceInput, setCustomServiceInput] = useState("");
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
  const nameValue = form.watch("info.name");
  const serviceIdSet = useMemo(
    () => new Set(services.map((service) => service.id)),
    []
  );
  const serviceLabelToId = useMemo(() => {
    const map = new Map<string, string>();
    for (const service of services) {
      map.set(service.label.toLowerCase(), service.id);
    }
    return map;
  }, []);
  const customServices = selectedServices.filter(
    (serviceId) => !serviceIdSet.has(serviceId)
  );

  const steps = useMemo(
    () => [
      {
        id: "info",
        label: "Dettagli",
        fields: [
          "info.name",
          "info.description",
          "info.rooms",
          "info.bathrooms",
          "info.guests",
          "booking.bookingUrl",
          ...(isAdmin ? ["slug"] : []),
        ],
      },
      {
        id: "gallery",
        label: "Galleria",
        fields: ["gallery"],
      },
      {
        id: "editorial",
        label: "Editoriali",
        fields: ["editorialBlocks"],
      },
      {
        id: "contact",
        label: "Contatti",
        fields: ["contact.name", "contact.email", "contact.phone"],
      },
      {
        id: "faqs",
        label: "Domande frequenti",
        fields: ["faqs"],
      },
      {
        id: "position",
        label: "Posizione",
        fields: ["position.address", "position.lat", "position.lng"],
      },
    ],
    [isAdmin]
  );

  const isLastStep = currentStep === steps.length - 1;
  const showSaveOnly = Boolean(property);
  const isEditing = Boolean(property);

  const handleNextStep = async () => {
    const fields = steps[currentStep]?.fields ?? [];
    if (fields.length === 0) {
      setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
      return;
    }
    const isValid = await form.trigger(fields, { shouldFocus: true });
    if (isValid) {
      setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const handleAddCustomService = () => {
    const trimmed = customServiceInput.trim();
    if (!trimmed) {
      return;
    }
    const normalized = trimmed.toLowerCase();
    const mappedId = serviceIdSet.has(normalized)
      ? normalized
      : serviceLabelToId.get(normalized);
    const nextValue = mappedId ?? trimmed;
    const normalizedExisting = new Set(
      selectedServices.map((value) => value.toLowerCase())
    );
    if (normalizedExisting.has(nextValue.toLowerCase())) {
      toast.info("Servizio già presente");
      return;
    }
    form.setValue("services", [...selectedServices, nextValue], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setCustomServiceInput("");
  };

  const handleRemoveCustomService = (serviceValue: string) => {
    form.setValue(
      "services",
      selectedServices.filter((service) => service !== serviceValue),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const toSlug = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  useEffect(() => {
    if (isEditing || slugManuallyEdited) {
      return;
    }
    const slug = toSlug(nameValue ?? "");
    if (!slug) {
      return;
    }
    const currentSlug = form.getValues("slug");
    if (slug !== currentSlug) {
      form.setValue("slug", slug, { shouldDirty: true });
    }
  }, [form, isEditing, nameValue, slugManuallyEdited]);

  const getErrorAtPath = (
    errors: FieldErrors<PropertyFormValues>,
    path: string
  ) => {
    return path.split(".").reduce<unknown>((acc, key) => {
      if (!acc || typeof acc !== "object") return undefined;
      return (acc as Record<string, unknown>)[key];
    }, errors);
  };

  const hasAnyError = (value: unknown): boolean => {
    if (!value) return false;
    if (Array.isArray(value)) {
      return value.some(hasAnyError);
    }
    if (typeof value === "object") {
      return Object.values(value as Record<string, unknown>).some(hasAnyError);
    }
    return true;
  };

  const stepHasError = (
    errors: FieldErrors<PropertyFormValues>,
    stepFields: string[]
  ) => stepFields.some((field) => hasAnyError(getErrorAtPath(errors, field)));

  const stepErrors = useMemo(() => {
    const errors = form.formState.errors;
    return steps.map((step) => stepHasError(errors, step.fields));
  }, [form.formState.errors, steps]);

  const handleInvalidSubmit = (errors: FieldErrors<PropertyFormValues>) => {
    const firstErrorStep = steps.findIndex((step) =>
      stepHasError(errors, step.fields)
    );
    if (firstErrorStep >= 0) {
      setCurrentStep(firstErrorStep);
    }
  };

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
      <form
        onSubmit={form.handleSubmit(onSubmit, handleInvalidSubmit)}
        className="space-y-8"
      >
        <input type="hidden" {...form.register("template")} />
        {!isAdmin && <input type="hidden" {...form.register("slug")} />}
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Configurazione
            </p>
            <nav className="space-y-2">
              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                const hasError = stepErrors[index];
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(index)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition",
                      isActive
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : hasError
                        ? "border-destructive/40 bg-destructive/10 text-destructive"
                        : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold",
                        isActive
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : isCompleted
                          ? "border-primary/30 text-primary"
                          : hasError
                          ? "border-destructive/40 text-destructive"
                          : "border-muted text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">{step.label}</span>
                    {hasError && (
                      <span className="ml-auto text-xs font-medium text-destructive">
                        Errore
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold">
                {property ? "Modifica proprietà" : "Aggiungi una nuova proprietà"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Compila tutti i dettagli per pubblicare la tua inserzione e
                iniziare a ricevere prenotazioni.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isAdmin && <ImportFromHtmlSheet />}
              <TemplatePreviewSheet
                isAdmin={isAdmin}
                initialIsPublished={property?.is_published ?? false}
              />
              {isAdmin && <AiLandingGenerator propertyId={property?.id} />}
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
                    <div className="space-y-6 p-4">
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
                      <div className="space-y-2 border-t border-border pt-4">
                        <Label htmlFor="existing-owner-email">
                          Email utente esistente
                        </Label>
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
                        variant="outline"
                      >
                        {isAssociatingOwnerUser && (
                          <Loader2 className="size-4 animate-spin" />
                        )}
                        Associa utente
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              {currentStep === 0 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary">
                      1
                    </span>
                    <h3 className="text-xl font-semibold">Dettagli principali</h3>
                  </div>
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
                            <Input
                              {...field}
                              placeholder="villa-giulia-bnb"
                              disabled={isEditing}
                              onChange={(event) => {
                                field.onChange(event);
                                if (!isEditing) {
                                  setSlugManuallyEdited(true);
                                }
                              }}
                            />
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
                            "flex flex-col items-center justify-center min-h-[100px] gap-2 border-2 p-2 rounded-md",
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
                    <div className="space-y-3">
                      <Label htmlFor="custom-service">Altri servizi</Label>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                          id="custom-service"
                          placeholder="Es. Aria condizionata, Ferro da stiro"
                          value={customServiceInput}
                          onChange={(event) =>
                            setCustomServiceInput(event.target.value)
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddCustomService}
                        >
                          Aggiungi
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Inserisci servizi non presenti nella lista sopra.
                      </p>
                      {customServices.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {customServices.map((service) => (
                            <div
                              key={service}
                              className="flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1 text-sm"
                            >
                              <span>{service}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() =>
                                  handleRemoveCustomService(service)
                                }
                                aria-label={`Rimuovi ${service}`}
                              >
                                <X className="size-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
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
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary">
                      2
                    </span>
                    <h3 className="text-xl font-semibold">Galleria</h3>
                  </div>
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
                      <h3 className="text-lg font-medium">
                        Immagini caricate
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {loadedImages?.map((image, index) => (
                        <div key={`${image.name}-${index}`} className="relative">
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
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary">
                          3
                        </span>
                        <h3 className="text-xl font-semibold">
                          Blocchi editoriali
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Aggiungi sezioni narrative con titolo e testo per
                        arricchire la landing.
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
                                  <option value="">
                                    Nessuna foto selezionata
                                  </option>
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
                                    const file =
                                      event.target.files?.[0] ?? null;
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
                                form.setValue(
                                  `editorialBlocks.${index}.image`,
                                  "",
                                  {
                                    shouldDirty: true,
                                  }
                                )
                              }
                            >
                              Rimuovi immagine
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary">
                      4
                    </span>
                    <h3 className="text-xl font-semibold">Contatti</h3>
                  </div>
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
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary">
                      5
                    </span>
                    <h3 className="text-xl font-semibold">Domande frequenti</h3>
                  </div>
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
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary">
                      6
                    </span>
                    <h3 className="text-xl font-semibold">Posizione</h3>
                  </div>
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
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={handlePrevStep}
                disabled={currentStep === 0}
              >
                Indietro
              </Button>
              <div className="flex flex-wrap items-center gap-2">
                {showSaveOnly && !isLastStep && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleNextStep}
                  >
                    Prossimo step
                  </Button>
                )}
                <Button
                  type={showSaveOnly || isLastStep ? "submit" : "button"}
                  onClick={
                    showSaveOnly || isLastStep ? undefined : handleNextStep
                  }
                  disabled={isUpdatingProperty}
                >
                  {isUpdatingProperty && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  {showSaveOnly
                    ? "Salva modifiche"
                    : isLastStep
                    ? "Aggiungi proprietà"
                    : "Prossimo step"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
