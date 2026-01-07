"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useFormContext } from "react-hook-form";
import { PropertyFormValues } from "@/components/property/schema";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  buildPropertyLandingHtml,
  defaultTemplateTheme,
  extractTemplateTheme,
  templateGalleryLayouts,
  templateFonts,
  templatePalettes,
  type TemplateTheme,
} from "@/components/property/template-html";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  publishPropertyTemplateAction,
  savePropertyTemplateAction,
} from "@/components/property/actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  blockKeys,
  defaultBlockOrder,
  type BlockKey,
} from "@/components/property/landing-config";

type PreviewImage = {
  url: string;
  name: string;
  revoke?: () => void;
};

const buildPreviewImages = (
  gallery: PropertyFormValues["gallery"] | undefined
): PreviewImage[] => {
  const images: PreviewImage[] = [];

  (gallery ?? []).forEach((item, index) => {
    if (typeof item === "string") {
      const name = item.split("/").pop()?.split("?")[0] ?? `image-${index + 1}`;
      images.push({ url: item, name });
      return;
    }

    if (item instanceof File) {
      const url = URL.createObjectURL(item);
      images.push({
        url,
        name: item.name || `image-${index + 1}`,
        revoke: () => URL.revokeObjectURL(url),
      });
    }
  });

  return images;
};

const sectionLabels: Record<BlockKey, string> = {
  hero: "Hero",
  description: "Descrizione",
  gallery: "Galleria",
  services: "Servizi",
  position: "Posizione",
  contact: "Contatti",
  faq: "FAQ",
  footer: "Footer",
};

const normalizeSectionOrder = (order?: BlockKey[]) => {
  const unique = Array.from(new Set(order ?? []));
  const filtered = unique.filter((key) => blockKeys.includes(key));
  const base = filtered.length > 0 ? filtered : defaultBlockOrder;
  const missing = defaultBlockOrder.filter((key) => !base.includes(key));
  return [...base, ...missing];
};

export default function TemplatePreviewSheet() {
  const { watch, setValue } = useFormContext<PropertyFormValues>();
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [theme, setTheme] = useState<TemplateTheme>(defaultTemplateTheme);
  const [editableHtml, setEditableHtml] = useState("");
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [publishedHtml, setPublishedHtml] = useState<string | null>(null);
  const [publishedPath, setPublishedPath] = useState<string | null>(null);
  const [localUpdatedAt, setLocalUpdatedAt] = useState<Date | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [publishedAt, setPublishedAt] = useState<Date | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [isPublishing, startPublishing] = useTransition();

  const info = watch("info");
  const gallery = watch("gallery");
  const selectedServices = watch("services") ?? [];
  const position = watch("position");
  const contact = watch("contact");
  const faqs = watch("faqs") ?? [];
  const landing = watch("landing");
  const landingCopy = landing?.copy;
  const templateValue = watch("template") ?? "";
  const propertyId = watch("id");

  const previewImages = useMemo(
    () => buildPreviewImages(gallery),
    [gallery]
  );

  useEffect(() => {
    return () => {
      previewImages.forEach((image) => image.revoke?.());
    };
  }, [previewImages]);

  const galleryItems = useMemo(
    () =>
      previewImages.map((image, index) => ({
        url: image.url,
        alt: image.name || `image-${index + 1}`,
      })),
    [previewImages]
  );

  const defaultTemplateHtml = useMemo(
    () =>
      buildPropertyLandingHtml({
        info,
        services: selectedServices,
        gallery: galleryItems,
        position,
        contact,
        faqs,
        landing,
        theme: defaultTemplateTheme,
      }),
    [
      info,
      selectedServices,
      galleryItems,
      position,
      contact,
      faqs,
      landing,
    ]
  );

  const templateHtml = useMemo(
    () =>
      buildPropertyLandingHtml({
        info,
        services: selectedServices,
        gallery: galleryItems,
        position,
        contact,
        faqs,
        landing,
        theme,
      }),
    [
      info,
      selectedServices,
      galleryItems,
      position,
      contact,
      faqs,
      landing,
      theme,
    ]
  );

  const baselineHtml = templateValue.trim()
    ? templateValue
    : defaultTemplateHtml;
  const previewHtml = editableHtml || templateHtml;
  const isDirty = editableHtml !== baselineHtml;
  const isBlank = editableHtml.trim().length === 0;
  const publishHtml = templateValue.trim()
    ? templateValue
    : defaultTemplateHtml;
  const normalizeHtml = (value: string | null) => value?.trim() ?? "";
  const hasUnpublishedChanges =
    normalizeHtml(publishedHtml) !== normalizeHtml(publishHtml);
  const isLocalDraft = isDirty;
  const canPublish = Boolean(propertyId) && !isLocalDraft;
  const templateLabel = !propertyId
    ? "Template non salvato"
    : isLocalDraft
      ? "Template da salvare"
      : "Template salvato";

  const hasLocalImages = useMemo(
    () => (gallery ?? []).some((item) => item instanceof File),
    [gallery]
  );

  useEffect(() => {
    if (!propertyId) {
      setPublishedHtml(null);
      setPublishedPath(null);
      setPublishedAt(null);
      return;
    }
    const path = `/p/id-${propertyId}.html`;
    setPublishedPath(path);
    fetch(path, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          setPublishedHtml(null);
          return null;
        }
        return response.text();
      })
      .then((html) => {
        if (typeof html === "string") {
          setPublishedHtml(html);
        }
      })
      .catch(() => {
        setPublishedHtml(null);
      });
  }, [propertyId]);

  useEffect(() => {
    if (templateValue.trim()) {
      const parsedTheme = extractTemplateTheme(templateValue);
      setTheme(parsedTheme);
      setIsManualEdit(false);
      setEditableHtml(templateValue);
    }
  }, [templateValue]);

  useEffect(() => {
    if (templateValue.trim()) {
      return;
    }
    if (!isManualEdit) {
      setEditableHtml(templateHtml);
    }
  }, [templateValue, templateHtml, isManualEdit]);

  const previewMaxWidth = useMemo(() => {
    if (previewMode === "tablet") {
      return "900px";
    }
    if (previewMode === "mobile") {
      return "420px";
    }
    return "100%";
  }, [previewMode]);

  const sectionOrder = useMemo(
    () => normalizeSectionOrder(landing?.layout?.order),
    [landing?.layout?.order]
  );
  const hiddenSections = useMemo(
    () => new Set(landing?.layout?.hidden ?? []),
    [landing?.layout?.hidden]
  );

  const updateTheme = (next: TemplateTheme) => {
    setTheme(next);
    const nextHtml = buildPropertyLandingHtml({
      info,
      services: selectedServices,
      gallery: galleryItems,
      position,
      contact,
      faqs,
      landing,
      theme: next,
    });
    setIsManualEdit(true);
    setEditableHtml(nextHtml);
    setLocalUpdatedAt(new Date());
  };

  const updateLandingCopy = (
    nextLandingCopy: PropertyFormValues["landing"]["copy"]
  ) => {
    const nextLanding = {
      ...(landing ?? {}),
      copy: nextLandingCopy,
    };
    const nextHtml = buildPropertyLandingHtml({
      info,
      services: selectedServices,
      gallery: galleryItems,
      position,
      contact,
      faqs,
      landing: nextLanding,
      theme,
    });
    setIsManualEdit(true);
    setEditableHtml(nextHtml);
    setLocalUpdatedAt(new Date());
  };

  const updateLandingLayout = (
    nextLayout: PropertyFormValues["landing"]["layout"]
  ) => {
    const nextLanding = {
      ...(landing ?? {}),
      copy: landing?.copy ?? {},
      layout: nextLayout,
    };
    setValue("landing.layout", nextLayout, {
      shouldDirty: true,
      shouldValidate: true,
    });
    const nextHtml = buildPropertyLandingHtml({
      info,
      services: selectedServices,
      gallery: galleryItems,
      position,
      contact,
      faqs,
      landing: nextLanding,
      theme,
    });
    setIsManualEdit(true);
    setEditableHtml(nextHtml);
    setLocalUpdatedAt(new Date());
  };

  const moveSection = (key: BlockKey, direction: "up" | "down") => {
    const index = sectionOrder.indexOf(key);
    if (index === -1) return;
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= sectionOrder.length) return;
    const nextOrder = [...sectionOrder];
    [nextOrder[index], nextOrder[nextIndex]] = [
      nextOrder[nextIndex],
      nextOrder[index],
    ];
    updateLandingLayout({
      order: nextOrder,
      hidden: landing?.layout?.hidden ?? [],
    });
  };

  const toggleSection = (key: BlockKey) => {
    const nextHidden = new Set(landing?.layout?.hidden ?? []);
    if (nextHidden.has(key)) {
      nextHidden.delete(key);
    } else {
      nextHidden.add(key);
    }
    updateLandingLayout({
      order: sectionOrder,
      hidden: Array.from(nextHidden),
    });
  };

  const formatTime = (value: Date | null) =>
    value
      ? value.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
      : "—";

  const statusMessage = !propertyId
    ? "Crea la proprieta per poter salvare il template."
    : isLocalDraft
      ? "Stai vedendo la bozza locale. Premi Salva per salvarla nel template."
      : hasUnpublishedChanges
        ? "Template salvato ma non pubblicato. Premi Pubblica per renderlo visibile."
        : "Template pubblicato e aggiornato.";

  const previewLabel = !propertyId || isLocalDraft
    ? "Anteprima: bozza locale"
    : "Anteprima: versione salvata";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline">
          Vedi template
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-card inset-0 flex h-screen w-screen flex-col max-w-none sm:max-w-none sm:w-screen rounded-none overflow-hidden">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">
            Anteprima template
          </SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 p-6">
          {hasLocalImages && (
            <p className="text-sm text-muted-foreground">
              Alcune immagini sono locali: salva la proprieta per ottenere gli
              URL pubblici.
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-muted/30 p-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${
                    isLocalDraft
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-700"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                  }`}
                >
                  Bozza locale {isLocalDraft ? "attiva" : "allineata"}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${
                    !propertyId || isLocalDraft
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-700"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                  }`}
                >
                  {templateLabel}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${
                    !propertyId || hasUnpublishedChanges
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-700"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                  }`}
                >
                  {propertyId
                    ? hasUnpublishedChanges
                      ? "Da pubblicare"
                      : "Pubblicato"
                    : "Pubblicazione disattiva"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>Modifica locale: {formatTime(localUpdatedAt)}</span>
                <span>Salvataggio template: {formatTime(savedAt)}</span>
                <span>Pubblicazione: {formatTime(publishedAt)}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-full border bg-card p-1">
                <Button
                  type="button"
                  size="icon-sm"
                  variant={previewMode === "desktop" ? "default" : "outline"}
                  onClick={() => setPreviewMode("desktop")}
                  aria-label="Anteprima desktop"
                >
                  <Monitor className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant={previewMode === "tablet" ? "default" : "outline"}
                  onClick={() => setPreviewMode("tablet")}
                  aria-label="Anteprima tablet"
                >
                  <Tablet className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant={previewMode === "mobile" ? "default" : "outline"}
                  onClick={() => setPreviewMode("mobile")}
                  aria-label="Anteprima mobile"
                >
                  <Smartphone className="size-4" />
                </Button>
              </div>
              <Button
                type="button"
                variant={isDirty ? "default" : "outline"}
                size="sm"
                disabled={!isDirty || isBlank || isSaving}
                onClick={() => {
                  if (!propertyId) {
                    setValue("template", editableHtml, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                    toast.info(
                      "Template pronto. Salva la proprieta per registrarlo."
                    );
                    return;
                  }

                  startSaving(async () => {
                    try {
                      const { serverError } = await savePropertyTemplateAction({
                        propertyId,
                        template: editableHtml,
                      });

                      if (serverError) {
                        throw new Error(serverError);
                      }

                      setValue("template", editableHtml, {
                        shouldDirty: false,
                        shouldValidate: true,
                      });
                      setSavedAt(new Date());
                      toast.success("Template salvato");
                    } catch (error) {
                      toast.error("Errore durante il salvataggio");
                    }
                  });
                }}
              >
                {isSaving ? "Salvo..." : "Salva"}
              </Button>
              <Button
                type="button"
                variant={hasUnpublishedChanges ? "default" : "outline"}
                size="sm"
                disabled={!canPublish || isPublishing}
                onClick={() => {
                  if (!propertyId) return;
                  startPublishing(async () => {
                    try {
                      const { serverError } =
                        await publishPropertyTemplateAction({
                          propertyId,
                          template: publishHtml,
                        });

                      if (serverError) {
                        throw new Error(serverError);
                      }

                      setPublishedHtml(publishHtml);
                      setPublishedAt(new Date());
                      toast.success("Template pubblicato");
                    } catch (error) {
                      toast.error("Errore durante la pubblicazione");
                    }
                  });
                }}
              >
                {isPublishing ? "Pubblico..." : "Pubblica"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setValue("template", "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setTheme(defaultTemplateTheme);
                  setIsManualEdit(false);
                  setEditableHtml(defaultTemplateHtml);
                  setLocalUpdatedAt(new Date());
                }}
              >
                Ripristina
              </Button>
              {propertyId && publishedPath && publishedHtml && (
                <>
                  <Button asChild variant="outline" size="sm">
                    <a href={publishedPath} target="_blank" rel="noreferrer">
                      Apri pubblicato
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const url = `${window.location.origin}${publishedPath}`;
                      await navigator.clipboard.writeText(url);
                      toast.success("Link copiato");
                    }}
                  >
                    Copia link
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-muted-foreground">
            {statusMessage}
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden lg:flex-row">
            <div
              className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden rounded-lg border bg-muted/10 p-3"
            >
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>{previewLabel}</span>
                {isLocalDraft && (
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-700">
                    Non salvata
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-hidden rounded-lg border bg-white">
                <div
                  className="mx-auto h-full w-full"
                  style={{ maxWidth: previewMaxWidth }}
                >
                  <iframe
                    title="Anteprima template"
                    className="h-full w-full bg-white"
                    srcDoc={previewHtml}
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full min-h-0 flex-col gap-3 overflow-hidden rounded-lg border bg-muted/20 p-4 lg:max-w-[420px]">
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs uppercase text-muted-foreground">
                      Palette
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {templatePalettes.map((palette) => {
                        const isActive = theme.palette === palette.id;
                        return (
                          <button
                            key={palette.id}
                            type="button"
                            className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                              isActive
                                ? "border-primary bg-primary/10"
                                : "border-border bg-background"
                            }`}
                            onClick={() =>
                              updateTheme({
                                ...theme,
                                palette: palette.id,
                              })
                            }
                          >
                            <span>{palette.label}</span>
                            <span className="flex items-center gap-1">
                              <span
                                className="h-3 w-3 rounded-full"
                                style={{ background: palette.colors.accent }}
                              />
                              <span
                                className="h-3 w-3 rounded-full"
                                style={{ background: palette.colors.bg }}
                              />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Font titoli</Label>
                      <Select
                        value={theme.fontTitle}
                        onValueChange={(value) =>
                          updateTheme({ ...theme, fontTitle: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleziona font" />
                        </SelectTrigger>
                        <SelectContent>
                          {templateFonts.map((font) => (
                            <SelectItem key={font.id} value={font.id}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Font contenuto</Label>
                      <Select
                        value={theme.fontBody}
                        onValueChange={(value) =>
                          updateTheme({ ...theme, fontBody: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleziona font" />
                        </SelectTrigger>
                        <SelectContent>
                          {templateFonts.map((font) => (
                            <SelectItem key={font.id} value={font.id}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Sezioni</Label>
                    <div className="space-y-2">
                      {sectionOrder.map((sectionKey, index) => {
                        const isHidden = hiddenSections.has(sectionKey);
                        return (
                          <div
                            key={sectionKey}
                            className="space-y-3 rounded-lg border bg-background p-3 text-sm"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="rounded-md border px-2 py-1 text-xs"
                                  onClick={() => toggleSection(sectionKey)}
                                >
                                  {isHidden ? (
                                    <span className="flex items-center gap-1">
                                      <EyeOff className="size-3" />
                                      Nascosta
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1">
                                      <Eye className="size-3" />
                                      Visibile
                                    </span>
                                  )}
                                </button>
                                <span className="font-medium">
                                  {sectionLabels[sectionKey] ?? sectionKey}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  size="icon-sm"
                                  variant="outline"
                                  onClick={() => moveSection(sectionKey, "up")}
                                  disabled={index === 0}
                                  aria-label="Sposta su"
                                >
                                  <ChevronUp className="size-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="icon-sm"
                                  variant="outline"
                                  onClick={() =>
                                    moveSection(sectionKey, "down")
                                  }
                                  disabled={index === sectionOrder.length - 1}
                                  aria-label="Sposta giu"
                                >
                                  <ChevronDown className="size-4" />
                                </Button>
                              </div>
                            </div>
                            {sectionKey === "hero" && (
                              <div className="space-y-2">
                                <Label className="text-xs">
                                  Testo outline hero
                                </Label>
                                <Input
                                  value={landingCopy?.hero?.outline ?? ""}
                                  placeholder="Inserisci testo"
                                  onChange={(event) => {
                                    const nextOutline = event.target.value;
                                    const nextLandingCopy = {
                                      ...(landingCopy ?? {}),
                                      hero: {
                                        ...(landingCopy?.hero ?? {}),
                                        outline: nextOutline,
                                      },
                                    };
                                    setValue(
                                      "landing.copy.hero.outline",
                                      nextOutline,
                                      {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      }
                                    );
                                    updateLandingCopy(nextLandingCopy);
                                  }}
                                />
                              </div>
                            )}
                            {sectionKey === "gallery" && (
                              <div className="space-y-2">
                                <Label className="text-xs">
                                  Layout galleria
                                </Label>
                                <Select
                                  value={theme.galleryLayout}
                                  onValueChange={(value) =>
                                    updateTheme({
                                      ...theme,
                                      galleryLayout:
                                        value as TemplateTheme["galleryLayout"],
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleziona layout" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {templateGalleryLayouts.map((layout) => (
                                      <SelectItem
                                        key={layout.id}
                                        value={layout.id}
                                      >
                                        {layout.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
