"use client";

import {
  propertySchema,
  PropertyFormValues,
  PropertyWithDetails,
} from "@/components/property/schema";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { editPropertyAction } from "@/components/property/actions";
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
import TemplateSwitcher from "@/components/property/template-switcher";

export default function EditPropertyForm({
  property,
}: {
  property: PropertyWithDetails;
}) {
  const [isEditingProperty, startEditingProperty] = useTransition();
  const router = useRouter();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      info: {
        name: property.details.info.name,
        description: property.details.info.description ?? "",
        rooms: 1,
        bathrooms: property.details.info.bathrooms,
        guests: property.details.info.guests,
        cancellationPolicy: property.details.info.cancellationPolicy ?? "",
      },
      services: property.details.services ?? [],
      gallery: property.details.gallery ?? [],
      position: property.details.position ?? {
        address: "",
        city: "",
        country: "",
      },
      contact: property.details.contact ?? {
        name: "",
        email: "",
        phone: "",
      },
    },
  });

  const onSubmit = (data: PropertyFormValues) => {
    startEditingProperty(async () => {
      try {
        const { serverError, validationErrors } = await editPropertyAction(
          data
        );

        if (serverError) {
          throw new Error(serverError);
        }

        if (validationErrors) {
          throw new Error();
        }

        toast.success("Proprietà aggiornata con successo");
        router.push(urls.dashboard.index);
      } catch (error) {
        toast.error("Errore durante l'aggiornamento della proprietà");
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          <ImportFromHtmlSheet />
          <TemplateSwitcher />
        </div>
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
                  form.setValue("services", [...selectedServices, service.id]);
                }
              }}
            >
              {service.icon}
              <span>{service.label}</span>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold">Posizione</h2>
        <FormField
          control={form.control}
          name="position.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Indirizzo</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Via dei Monti Tiburtini, 123" />
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

        <Button type="submit" disabled={isEditingProperty}>
          {isEditingProperty && <Loader2 className="size-4 animate-spin" />}
          Salva proprietà
        </Button>
      </form>
    </Form>
  );
}
