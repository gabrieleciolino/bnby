import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PropertySchema } from "@/components/property/schema";
import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { NumberField } from "@/components/ui/number-field";
import { useDropzone } from "react-dropzone";
import { useMemo } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function GalleryForm({
  goPrevious,
}: {
  goPrevious: () => void;
}) {
  const form = useFormContext<PropertySchema>();

  const gallery = form.watch("gallery");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      form.setValue("gallery", [...(gallery || []), ...acceptedFiles]);
    },
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    multiple: true,
  });

  const loadedImages = useMemo(() => {
    return gallery?.map((file) => {
      return {
        url: URL.createObjectURL(file),
        name: file.name,
      };
    });
  }, [gallery]);

  return (
    <div className="space-y-4">
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
    </div>
  );
}
