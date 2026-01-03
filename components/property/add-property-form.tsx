"use client";

import InfoForm from "@/components/property/info-form";
import PricesForm from "@/components/property/services-form";
import { propertySchema, PropertySchema } from "@/components/property/schema";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryState, parseAsStringEnum } from "nuqs";
import React, { useCallback, useTransition } from "react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import ServicesForm from "@/components/property/services-form";
import PositionForm from "@/components/property/position-form";
import GalleryForm from "@/components/property/gallery-form";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { addPropertyAction } from "@/components/property/actions";
import { toast } from "sonner";
import { urls } from "@/lib/urls";
import { Loader2 } from "lucide-react";

const stepKeys = ["info", "position", "services", "gallery"] as const;
type StepKey = (typeof stepKeys)[number];

const fieldsStepMap: Record<keyof PropertySchema, StepKey> = {
  name: "info",
  description: "info",
  rooms: "info",
  bathrooms: "info",
  guests: "info",
  address: "position",
  city: "position",
  country: "position",
  services: "services",
  gallery: "gallery",
};

const StepperItem = ({
  idx,
  label,
  isActive,
  hasErrors,
}: {
  idx: number;
  label: string;
  isActive: boolean;
  hasErrors: boolean;
}) => {
  return (
    <div className="font-medium flex items-center gap-4 self-start w-full border-b border-secondary pb-2 last:border-b-0 md:border-none md:pb-0 md:w-auto">
      <span
        className={cn(
          "text-lg text-secondary-foreground bg-secondary rounded-full w-12 h-12 flex items-center justify-center",
          isActive ? "bg-primary text-primary-foreground" : "",
          hasErrors ? "border-2 border-red-500 " : ""
        )}
      >
        {idx}
      </span>
      <span className="text-xl text-secondary-foreground font-medium">
        {label}
      </span>
    </div>
  );
};

const Stepper = ({
  steps,
}: {
  steps: { label: string; isActive: boolean; hasErrors: boolean }[];
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <StepperItem
            idx={index + 1}
            label={step.label}
            isActive={step.isActive}
            hasErrors={step.hasErrors}
          />
          {index < steps.length - 1 && (
            <div className="flex-1 h-px bg-secondary"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default function AddPropertyForm() {
  const [isAddingProperty, startAddingProperty] = useTransition();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useQueryState(
    "step",
    parseAsStringEnum([...stepKeys]).withDefault("info")
  );

  const form = useForm<PropertySchema>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      country: "",
      rooms: 1,
      bathrooms: 0,
      guests: 1,
    },
  });

  const hasPrevious = useMemo(() => {
    return currentStep !== "info";
  }, [currentStep]);

  const goPrevious = useCallback(() => {
    switch (currentStep) {
      case "services":
        setCurrentStep("position");
        break;
      case "position":
        setCurrentStep("info");
        break;
      case "gallery":
        setCurrentStep("services");
        break;
    }
  }, [currentStep]);

  const goNext = useCallback(() => {
    switch (currentStep) {
      case "info":
        setCurrentStep("position");
        break;
      case "position":
        setCurrentStep("services");
        break;
      case "services":
        setCurrentStep("gallery");
        break;
    }
  }, [currentStep]);

  const renderStep = useMemo(() => {
    switch (currentStep) {
      case "info":
        return <InfoForm goNext={goNext} />;
      case "position":
        return <PositionForm goNext={goNext} goPrevious={goPrevious} />;
      case "services":
        return <ServicesForm goNext={goNext} goPrevious={goPrevious} />;
      case "gallery":
        return <GalleryForm goPrevious={goPrevious} />;
      default:
        return null;
    }
    return null;
  }, [currentStep]);

  const onSubmit = (data: PropertySchema) => {
    startAddingProperty(async () => {
      try {
        const { serverError, validationErrors } = await addPropertyAction(data);

        if (serverError) {
          throw new Error(serverError);
        }

        if (validationErrors) {
          throw new Error();
        }

        toast.success("Proprietà aggiunta con successo");
        router.push(urls.dashboard.index);
      } catch (error) {
        toast.error("Errore durante l'aggiunta della proprietà");
      }
    });
  };

  const changeStepOnError = useCallback(() => {
    const firstErrorKey = Object.keys(
      form.formState.errors
    )[0] as keyof typeof fieldsStepMap;

    if (firstErrorKey) {
      setCurrentStep(fieldsStepMap[firstErrorKey]);
    }
  }, [form.formState.errors]);

  const hasThisStepAnyError = useMemo(
    () => (step: StepKey) => {
      if (form.formState.errors) {
        const foundErrors = Object.keys(form.formState.errors).filter(
          (key) => fieldsStepMap[key as keyof PropertySchema] === step
        );
        return foundErrors.length > 0;
      }
      return false;
    },
    [form.formState.errors]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="main-container">
          <div className="p-4">
            <div className="mb-8 md:p-4 space-y-4">
              <Stepper
                steps={[
                  {
                    label: "Generale",
                    isActive: currentStep === "info",
                    hasErrors: hasThisStepAnyError("info"),
                  },
                  {
                    label: "Posizione e contatti",
                    isActive: currentStep === "position",
                    hasErrors: hasThisStepAnyError("position"),
                  },
                  {
                    label: "Servizi",
                    isActive: currentStep === "services",
                    hasErrors: hasThisStepAnyError("services"),
                  },
                  {
                    label: "Galleria",
                    isActive: currentStep === "gallery",
                    hasErrors: hasThisStepAnyError("gallery"),
                  },
                ]}
              />
            </div>

            <div className="max-w-4xl mx-auto">{renderStep}</div>
          </div>

          <div className="my-8 mx-1 flex flex-col md:flex-row justify-between gap-2">
            {currentStep !== "info" && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={goPrevious}
              >
                Indietro
              </Button>
            )}
            <Button
              type={currentStep === "gallery" ? "submit" : "button"}
              size="lg"
              onClick={currentStep === "gallery" ? changeStepOnError : goNext}
              className="ml-auto"
              disabled={isAddingProperty}
            >
              {isAddingProperty && <Loader2 className="size-4 animate-spin" />}
              Continua
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
