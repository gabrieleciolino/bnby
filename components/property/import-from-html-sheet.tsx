"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FieldPath, useFormContext } from "react-hook-form";
import { PropertyFormValues } from "@/components/property/schema";
import { parseAirbnbHtml } from "@/lib/parsers/airbnb";
import { useState } from "react";
import { toast } from "sonner";

export default function ImportFromHtmlSheet() {
  const form = useFormContext<PropertyFormValues>();

  const [source, setSource] = useState<"airbnb" | "booking" | "">("");
  const [html, setHtml] = useState("");

  type FormPath = FieldPath<PropertyFormValues>;

  const applyStringValue = (path: FormPath, value?: string) => {
    if (!value || value.trim().length === 0) {
      return;
    }
    form.setValue(path, value as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const applyNumberValue = (path: FormPath, value?: number) => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return;
    }
    form.setValue(path, value as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const applyArrayValue = (path: FormPath, value?: unknown[]) => {
    if (!value || value.length === 0) {
      return;
    }
    const nextValue =
      path === "gallery" ? value.slice(0, 20) : value;
    if (path === "gallery" && value.length > 20) {
      toast.info("Importate solo le prime 20 immagini");
    }
    form.setValue(path, nextValue as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleImport = () => {
    if (!source) {
      toast.error("Seleziona una sorgente");
      return;
    }

    if (!html.trim()) {
      toast.error("Inserisci il codice HTML");
      return;
    }

    if (source !== "airbnb") {
      toast.error("Parser non disponibile per questa sorgente");
      return;
    }

    const { values } = parseAirbnbHtml(html);

    if (
      !values.info &&
      !values.services &&
      !values.gallery &&
      !values.position &&
      !values.contact
    ) {
      toast.error("Nessun dato valido trovato nell'HTML");
      return;
    }

    if (values.info) {
      applyStringValue("info.name", values.info.name);
      applyStringValue("info.description", values.info.description);
      applyNumberValue("info.rooms", values.info.rooms);
      applyNumberValue("info.bathrooms", values.info.bathrooms);
      applyNumberValue("info.guests", values.info.guests);
    }

    if (values.services) {
      applyArrayValue("services", values.services);
    }

    if (values.gallery) {
      applyArrayValue("gallery", values.gallery);
    }

    if (values.position) {
      applyStringValue("position.address", values.position.address);
      applyNumberValue("position.lat", values.position.lat);
      applyNumberValue("position.lng", values.position.lng);
    }

    if (values.contact?.name) {
      applyStringValue("contact.name", values.contact.name);
    }

    if (values.booking?.bookingUrl) {
      applyStringValue("booking.bookingUrl", values.booking.bookingUrl);
    }

    toast.success("Dati importati dal codice HTML");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Importa da HTML</Button>
      </SheetTrigger>
      <SheetContent className="bg-card w-full! max-w-3xl!">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">
            Importa da HTML
          </SheetTitle>
        </SheetHeader>
        <div className="p-4 space-y-4">
          <Select
            value={source}
            onValueChange={(value) => setSource(value as "airbnb" | "booking")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona la sorgente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="airbnb">Airbnb</SelectItem>
              <SelectItem value="booking">Booking</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Inserisci il codice HTML"
            className="h-[400px]"
            value={html}
            onChange={(event) => setHtml(event.target.value)}
          />

          <Button type="button" className="w-full" onClick={handleImport}>
            Importa
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
