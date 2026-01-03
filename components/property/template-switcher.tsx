"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ConversionMinimalTemplate,
  GalleryFirstTemplate,
  StoryExperienceTemplate,
  type PropertyTemplateProps,
} from "@/components/property/templates";
import { useFormContext, useWatch } from "react-hook-form";
import { PropertyFormValues } from "@/components/property/schema";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

type TemplateOption = {
  id: "gallery-first" | "conversion-minimal" | "story-experience";
  label: string;
  description: string;
  Component: (props: PropertyTemplateProps) => JSX.Element;
};

type PaletteOption = {
  id:
    | "coastal"
    | "terracotta"
    | "forest"
    | "sandstone"
    | "graphite"
    | "sage"
    | "midnight"
    | "sunset"
    | "lavender"
    | "oceanic";
  label: string;
  description: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    muted: string;
    mutedForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
  };
};

const templateOptions: TemplateOption[] = [
  {
    id: "gallery-first",
    label: "Gallery First",
    description: "Premium, visuale, perfetto per strutture sceniche.",
    Component: GalleryFirstTemplate,
  },
  {
    id: "conversion-minimal",
    label: "Conversion Minimal",
    description: "Compatto, veloce, ideale per performance e mobile.",
    Component: ConversionMinimalTemplate,
  },
  {
    id: "story-experience",
    label: "Story / Experience",
    description: "Narrativo, editoriale, atmosfera boutique.",
    Component: StoryExperienceTemplate,
  },
];

const paletteOptions: PaletteOption[] = [
  {
    id: "coastal",
    label: "Coastal Blue",
    description: "Blu mare e bianco luminoso.",
    colors: {
      background: "#F5F9FC",
      foreground: "#0F172A",
      card: "#FFFFFF",
      cardForeground: "#111827",
      muted: "#E2E8F0",
      mutedForeground: "#64748B",
      primary: "#0EA5E9",
      primaryForeground: "#FFFFFF",
      secondary: "#DFF2FB",
      secondaryForeground: "#0F172A",
      accent: "#14B8A6",
      accentForeground: "#FFFFFF",
      border: "#E2E8F0",
    },
  },
  {
    id: "terracotta",
    label: "Terracotta",
    description: "Caldo mediterraneo, elegante.",
    colors: {
      background: "#FFF7F1",
      foreground: "#3B1F1A",
      card: "#FFFFFF",
      cardForeground: "#3B1F1A",
      muted: "#F2E6DC",
      mutedForeground: "#7C5A4B",
      primary: "#D97745",
      primaryForeground: "#FFFFFF",
      secondary: "#F5E2D6",
      secondaryForeground: "#3B1F1A",
      accent: "#B45309",
      accentForeground: "#FFFFFF",
      border: "#E7D2C2",
    },
  },
  {
    id: "forest",
    label: "Forest Green",
    description: "Verde bosco e naturali.",
    colors: {
      background: "#F6FAF7",
      foreground: "#0F2F1E",
      card: "#FFFFFF",
      cardForeground: "#0F2F1E",
      muted: "#E1ECE5",
      mutedForeground: "#4B6B5A",
      primary: "#1F7A4C",
      primaryForeground: "#FFFFFF",
      secondary: "#DDEDE3",
      secondaryForeground: "#0F2F1E",
      accent: "#2F855A",
      accentForeground: "#FFFFFF",
      border: "#D3E2D7",
    },
  },
  {
    id: "sandstone",
    label: "Sandstone",
    description: "Neutri morbidi e sabbia.",
    colors: {
      background: "#FBF8F2",
      foreground: "#3B3124",
      card: "#FFFFFF",
      cardForeground: "#3B3124",
      muted: "#F0E9DE",
      mutedForeground: "#7A6A55",
      primary: "#C89B5B",
      primaryForeground: "#2D2218",
      secondary: "#EFE2CF",
      secondaryForeground: "#3B3124",
      accent: "#B27838",
      accentForeground: "#FFFFFF",
      border: "#E6D7C4",
    },
  },
  {
    id: "graphite",
    label: "Graphite",
    description: "Minimal chic, alto contrasto.",
    colors: {
      background: "#F8FAFC",
      foreground: "#111827",
      card: "#FFFFFF",
      cardForeground: "#111827",
      muted: "#E5E7EB",
      mutedForeground: "#6B7280",
      primary: "#111827",
      primaryForeground: "#FFFFFF",
      secondary: "#E5E7EB",
      secondaryForeground: "#111827",
      accent: "#374151",
      accentForeground: "#FFFFFF",
      border: "#E5E7EB",
    },
  },
  {
    id: "sage",
    label: "Sage",
    description: "Sfumature morbide e rilassanti.",
    colors: {
      background: "#F5F7F2",
      foreground: "#22302A",
      card: "#FFFFFF",
      cardForeground: "#22302A",
      muted: "#E1E6DD",
      mutedForeground: "#5E6B61",
      primary: "#5B7F6E",
      primaryForeground: "#FFFFFF",
      secondary: "#DDE7E1",
      secondaryForeground: "#22302A",
      accent: "#4B6B5A",
      accentForeground: "#FFFFFF",
      border: "#D3DBD4",
    },
  },
  {
    id: "midnight",
    label: "Midnight",
    description: "Eleganza notturna e moderna.",
    colors: {
      background: "#0F172A",
      foreground: "#F8FAFC",
      card: "#111827",
      cardForeground: "#F8FAFC",
      muted: "#1F2937",
      mutedForeground: "#CBD5F5",
      primary: "#38BDF8",
      primaryForeground: "#0F172A",
      secondary: "#1E293B",
      secondaryForeground: "#F8FAFC",
      accent: "#F59E0B",
      accentForeground: "#0F172A",
      border: "#273449",
    },
  },
  {
    id: "sunset",
    label: "Sunset",
    description: "Coralli e rosa caldi.",
    colors: {
      background: "#FFF5F5",
      foreground: "#3B1D2B",
      card: "#FFFFFF",
      cardForeground: "#3B1D2B",
      muted: "#F6E6EA",
      mutedForeground: "#8B5C6C",
      primary: "#F97316",
      primaryForeground: "#FFFFFF",
      secondary: "#FCE7F3",
      secondaryForeground: "#3B1D2B",
      accent: "#EC4899",
      accentForeground: "#FFFFFF",
      border: "#EBD5DB",
    },
  },
  {
    id: "lavender",
    label: "Lavender",
    description: "Toni soft, boutique.",
    colors: {
      background: "#F6F3FB",
      foreground: "#2E1F47",
      card: "#FFFFFF",
      cardForeground: "#2E1F47",
      muted: "#E9E0F5",
      mutedForeground: "#6B5A82",
      primary: "#8B5CF6",
      primaryForeground: "#FFFFFF",
      secondary: "#EDE9FE",
      secondaryForeground: "#2E1F47",
      accent: "#7C3AED",
      accentForeground: "#FFFFFF",
      border: "#DED4F0",
    },
  },
  {
    id: "oceanic",
    label: "Oceanic",
    description: "Blu profondo e accenti aqua.",
    colors: {
      background: "#F1F7FA",
      foreground: "#0F2533",
      card: "#FFFFFF",
      cardForeground: "#0F2533",
      muted: "#DEEAF0",
      mutedForeground: "#527082",
      primary: "#0F6AA8",
      primaryForeground: "#FFFFFF",
      secondary: "#D6EEF7",
      secondaryForeground: "#0F2533",
      accent: "#06B6D4",
      accentForeground: "#0F2533",
      border: "#D4E2EA",
    },
  },
];

export default function TemplateSwitcher() {
  const { control } = useFormContext<PropertyFormValues>();
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateOption["id"]>("gallery-first");
  const [selectedPalette, setSelectedPalette] =
    useState<PaletteOption["id"]>("coastal");
  const [previewGallery, setPreviewGallery] = useState<string[]>([]);

  const info = useWatch({ control, name: "info" });
  const services = useWatch({ control, name: "services" });
  const gallery = useWatch({ control, name: "gallery" });
  const position = useWatch({ control, name: "position" });
  const contact = useWatch({ control, name: "contact" });

  useEffect(() => {
    const createdUrls: string[] = [];
    const urls = (gallery ?? []).map((item) => {
      if (typeof item === "string") {
        return item;
      }
      const url = URL.createObjectURL(item);
      createdUrls.push(url);
      return url;
    });

    setPreviewGallery(urls);

    return () => {
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [gallery]);

  const previewData = useMemo<PropertyTemplateProps>(() => {
    const safeInfo = info ?? {
      name: "Nome struttura",
      description: "",
      rooms: 1,
      bathrooms: 1,
      guests: 2,
      cancellationPolicy: "",
    };

    return {
      info: {
        name: safeInfo.name?.trim() || "Nome struttura",
        description: safeInfo.description ?? "",
        rooms: safeInfo.rooms ?? 1,
        bathrooms: safeInfo.bathrooms ?? 1,
        guests: safeInfo.guests ?? 2,
        cancellationPolicy: safeInfo.cancellationPolicy ?? "",
      },
      services: services ?? [],
      gallery: previewGallery,
      position: position ?? undefined,
      contact: contact ?? undefined,
    };
  }, [info, services, previewGallery, position, contact]);

  const activeTemplate =
    templateOptions.find((template) => template.id === selectedTemplate) ??
    templateOptions[0];

  const activePalette =
    paletteOptions.find((palette) => palette.id === selectedPalette) ??
    paletteOptions[0];

  const paletteStyles = {
    "--background": activePalette.colors.background,
    "--foreground": activePalette.colors.foreground,
    "--card": activePalette.colors.card,
    "--card-foreground": activePalette.colors.cardForeground,
    "--muted": activePalette.colors.muted,
    "--muted-foreground": activePalette.colors.mutedForeground,
    "--primary": activePalette.colors.primary,
    "--primary-foreground": activePalette.colors.primaryForeground,
    "--secondary": activePalette.colors.secondary,
    "--secondary-foreground": activePalette.colors.secondaryForeground,
    "--accent": activePalette.colors.accent,
    "--accent-foreground": activePalette.colors.accentForeground,
    "--border": activePalette.colors.border,
  } as CSSProperties;

  const ActiveTemplateComponent = activeTemplate.Component;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Scegli template</Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full gap-0 border-l-0 p-0 sm:max-w-none"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b bg-background/95 px-6 py-4 backdrop-blur">
            <SheetTitle className="text-2xl font-bold">
              Template switcher
            </SheetTitle>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <Select
                value={selectedTemplate}
                onValueChange={(value) =>
                  setSelectedTemplate(value as TemplateOption["id"])
                }
              >
                <SelectTrigger className="min-w-[220px]">
                  <SelectValue placeholder="Seleziona template" />
                </SelectTrigger>
                <SelectContent className="z-[60]">
                  {templateOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedPalette}
                onValueChange={(value) =>
                  setSelectedPalette(value as PaletteOption["id"])
                }
              >
                <SelectTrigger className="min-w-[220px]">
                  <SelectValue placeholder="Palette colori" />
                </SelectTrigger>
                <SelectContent className="z-[60]">
                  {paletteOptions.map((palette) => (
                    <SelectItem key={palette.id} value={palette.id}>
                      {palette.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <p>{activeTemplate.description}</p>
                <p>{activePalette.description}</p>
              </div>
            </div>
          </SheetHeader>
          <div
            className="flex-1 overflow-y-auto bg-slate-100"
            style={paletteStyles}
          >
            <ActiveTemplateComponent {...previewData} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
