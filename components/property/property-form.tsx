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
import { createOwnerUserAction } from "@/components/property/actions";
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
  const [ownerUserEmail, setOwnerUserEmail] = useState("");
  const [ownerUserPassword, setOwnerUserPassword] = useState("");
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
        houseRules: property?.details.info.houseRules ?? "",
        cancellationPolicy: property?.details.info.cancellationPolicy ?? "",
      },
      services: property?.details.services ?? [],
      gallery: property?.details.gallery ?? [],
      position: property?.details.position ?? {
        address: "",
        city: "",
        country: "",
        lat: undefined,
        lng: undefined,
      },
      contact: property?.details.contact ?? {
        name: "",
        email: "",
        phone: "",
      },
      faqs: property?.details.faqs ?? [],
      landing: resolveLandingConfig(property?.details.landing),
      template: property?.template ?? "",
    },
  });

  const {
    fields: faqFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  const onSubmit = (data: PropertyFormValues) => {
    startUpdatingProperty(async () => {
      try {
        const { data: updatedProperty, serverError, validationErrors } = property
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

        toast.success("Proprietà aggiunta con successo");
        router.push(urls.dashboard.index);
      } catch (error) {
        toast.error("Errore durante l'aggiunta della proprietà");
      }
    });
  };

  const gallery = form.watch("gallery");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      const currentGallery = form.getValues("gallery") ?? [];
      form.setValue("gallery", [...currentGallery, ...acceptedFiles]);
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
        };
      }

      return {
        url: URL.createObjectURL(item),
        name: item.name,
      };
    });
  }, [gallery]);

  const selectedServices = form.watch("services") ?? [];

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
      } catch (error) {
        toast.error("Errore durante la creazione dell'utente proprietario");
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
                    Crea utente proprietario
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 space-y-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="john.doe@example.com"
                    value={ownerUserEmail}
                    onChange={(e) => setOwnerUserEmail(e.target.value)}
                  />
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={ownerUserPassword}
                    onChange={(e) => setOwnerUserPassword(e.target.value)}
                  />
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
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        <Tabs defaultValue="info">
          <TabsList className="h-16 w-full mb-8">
            <TabsTrigger value="info">Informazioni generali</TabsTrigger>
            <TabsTrigger value="services">Servizi</TabsTrigger>
            <TabsTrigger value="gallery">Galleria</TabsTrigger>
            <TabsTrigger value="contact">Contatti</TabsTrigger>
            <TabsTrigger value="faqs">Domande frequenti</TabsTrigger>
            <TabsTrigger value="position">Posizione</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-8">
            <h2 className="text-2xl font-bold">Informazioni generali</h2>
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
                      className="min-h-[100px]"
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

            <FormField
              control={form.control}
              name="info.houseRules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regole di casa</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[100px]"
                      placeholder="Regole di casa"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="info.cancellationPolicy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Termini di cancellazione</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[100px]"
                      placeholder="Termini di cancellazione"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="services" className="space-y-8">
            <h2 className="text-2xl font-bold">Servizi</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={cn(
                    "flex flex-col items-center justify-center min-h-[100px] gap-2 border-2  p-2 rounded-md",
                    selectedServices.includes(service.id)
                      ? "border-primary"
                      : "border-secondary"
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
            <FormField
              control={form.control}
              name="position.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Città</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Roma" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paese</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Italia" />
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
                <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                  {loadedImages?.map((image) => (
                    <div key={image.name} className="relative">
                      <Image
                        src={image.url}
                        alt={image.name}
                        width={200}
                        height={200}
                        className="rounded-lg w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        className="absolute top-1 right-1"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
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
                      onClick={() => remove(index)}
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
                onClick={() => append({ question: "", answer: "" })}
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
