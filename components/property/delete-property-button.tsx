"use client";

import { deletePropertyAction } from "@/components/property/actions";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export function DeletePropertyButton({
  propertyId,
  propertyName,
}: {
  propertyId: string;
  propertyName: string;
}) {
  const router = useRouter();
  const [isDeleting, startDeleting] = useTransition();

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Eliminare la proprietà "${propertyName}"? Questa azione non può essere annullata.`
    );

    if (!confirmed) {
      return;
    }

    startDeleting(async () => {
      const { serverError } = await deletePropertyAction({ propertyId });

      if (serverError) {
        toast.error(serverError);
        return;
      }

      toast.success("Proprietà eliminata.");
      router.refresh();
    });
  };

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 />}
      Elimina
    </Button>
  );
}
