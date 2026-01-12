"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { templatePalettes } from "@/components/property/template-html";
import { toast } from "sonner";

type GeneratedLanding = {
  url: string;
  filename: string;
  createdAt?: string | null;
};

export default function AiLandingGenerator({
  propertyId,
}: {
  propertyId?: string;
}) {
  const [paletteId, setPaletteId] = useState(templatePalettes[0]?.id ?? "");
  const [layoutId, setLayoutId] = useState("modern-minimalist");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [landings, setLandings] = useState<GeneratedLanding[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const canGenerate = Boolean(propertyId);
  const paletteOptions = useMemo(() => templatePalettes, []);
  const layoutOptions = useMemo(
    () => [
      {
        id: "modern-minimalist",
        label: "Landing Modern Minimalist",
        description:
          "Design pulito, ampi spazi bianchi, tipografia serif sofisticata.",
      },
      {
        id: "warm-boutique",
        label: "Landing Warm Boutique",
        description:
          "Accogliente, angoli smussati, ombre morbide, atmosfera boutique.",
      },
      {
        id: "editorial-bold",
        label: "Landing Editorial Bold",
        description:
          "Stile editoriale, contrasti netti, titoli audaci, griglia asimmetrica.",
      },
    ],
    []
  );

  useEffect(() => {
    if (!listOpen || !propertyId) {
      return;
    }
    setIsLoadingList(true);
    fetch(`/api/landing-generator?propertyId=${propertyId}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((data) => {
        setLandings(data.items ?? []);
      })
      .catch(() => {
        toast.error("Impossibile caricare le landing generate");
      })
      .finally(() => setIsLoadingList(false));
  }, [listOpen, propertyId]);

  const handleGenerate = async () => {
    if (!propertyId) {
      toast.error("Salva la proprietà prima di generare una landing");
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch("/api/landing-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          paletteId,
          layoutId,
          prompt,
        }),
      });
      if (!response.ok) {
        throw new Error();
      }
      const data = await response.json();
      if (data?.url) {
        setGeneratedUrl(data.url);
        toast.success("Landing generata");
      } else {
        toast.error("Generazione completata ma nessun link ricevuto");
      }
    } catch {
      toast.error("Errore durante la generazione");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Sheet open={generateOpen} onOpenChange={setGenerateOpen}>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={!canGenerate}
            title={
              canGenerate
                ? undefined
                : "Salva la proprietà prima di generare una landing"
            }
          >
            Genera landing AI
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="bg-card mx-auto w-full max-w-2xl rounded-t-2xl border"
        >
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">
              Genera landing con AI
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 p-4 pt-0">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Schema colori</Label>
                <Select value={paletteId} onValueChange={setPaletteId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleziona palette" />
                  </SelectTrigger>
                  <SelectContent>
                    {paletteOptions.map((palette) => (
                      <SelectItem key={palette.id} value={palette.id}>
                        {palette.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Layout</Label>
                <Select value={layoutId} onValueChange={setLayoutId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleziona layout" />
                  </SelectTrigger>
                  <SelectContent>
                    {layoutOptions.map((layout) => (
                      <SelectItem key={layout.id} value={layout.id}>
                        {layout.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {layoutOptions.find((layout) => layout.id === layoutId)
                    ?.description ?? ""}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Prompt (opzionale)</Label>
              <Textarea
                placeholder="Dettagli extra o stile desiderato..."
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
              >
                {isGenerating ? "Genero..." : "Genera"}
              </Button>
              {generatedUrl && (
                <Button asChild variant="secondary" type="button">
                  <a href={generatedUrl} target="_blank" rel="noreferrer">
                    Apri ultima landing
                  </a>
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={listOpen} onOpenChange={setListOpen}>
        <SheetTrigger asChild>
          <Button type="button" variant="secondary" disabled={!canGenerate}>
            Landing generate
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-card">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">
              Landing generate dall&apos;AI
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-3 p-4 pt-0">
            {isLoadingList ? (
              <p className="text-sm text-muted-foreground">Caricamento...</p>
            ) : landings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nessuna landing generata.
              </p>
            ) : (
              <div className="space-y-2">
                {landings.map((item) => (
                  <div
                    key={item.filename}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{item.filename}</span>
                      {item.createdAt && (
                        <span className="text-xs text-muted-foreground">
                          {item.createdAt}
                        </span>
                      )}
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <a href={item.url} target="_blank" rel="noreferrer">
                        Apri
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
