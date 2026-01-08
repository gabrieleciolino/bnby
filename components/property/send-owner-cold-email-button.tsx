"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { sendOwnerColdEmailAction } from "@/components/property/actions";

type SendOwnerColdEmailButtonProps = {
  propertyId: string;
  disabled?: boolean;
  title?: string;
};

export const SendOwnerColdEmailButton = ({
  propertyId,
  disabled,
  title,
}: SendOwnerColdEmailButtonProps) => {
  const [isSending, startSending] = useTransition();

  const handleClick = () => {
    if (disabled) return;

    startSending(async () => {
      try {
        const { serverError, validationErrors } =
          await sendOwnerColdEmailAction({
            propertyId,
            baseUrl: window.location.origin,
          });

        if (serverError) {
          throw new Error(serverError);
        }

        if (validationErrors) {
          throw new Error("Dati non validi per l'invio della email");
        }

        toast.success("Email inviata al proprietario");
      } catch (error) {
        toast.error("Errore durante l'invio della email");
      }
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={disabled || isSending}
      title={title}
    >
      {isSending ? "Invio in corso..." : "Invia cold email"}
    </Button>
  );
};
