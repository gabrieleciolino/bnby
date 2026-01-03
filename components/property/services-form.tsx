import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PropertyFormValues } from "@/components/property/schema";
import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import {
  WashingMachine,
  Wifi,
  Tv,
  Car,
  WavesLadder,
  Fence,
  Waves,
} from "lucide-react";

const ServicesList = () => {
  const services = [
    {
      id: "washing-machine",
      label: "Lavatrice",
      icon: <WashingMachine className="size-8" />,
    },
    {
      id: "wifi",
      label: "WiFi",
      icon: <Wifi className="size-8" />,
    },
    {
      id: "tv",
      label: "TV",
      icon: <Tv className="size-8" />,
    },
    {
      id: "parking",
      label: "Parcheggio",
      icon: <Car className="size-8" />,
    },
    {
      id: "pool",
      label: "Piscina",
      icon: <WavesLadder className="size-8" />,
    },
    {
      id: "garden",
      label: "Giardino",
      icon: <Fence className="size-8" />,
    },
    {
      id: "seaview",
      label: "Vista mare",
      icon: <Waves className="size-8" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {services.map((service) => (
        <div
          key={service.id}
          className="flex flex-col items-center justify-center min-h-[100px] gap-2 border-2  p-2 rounded-md"
        >
          {service.icon}
          <span>{service.label}</span>
        </div>
      ))}
    </div>
  );
};

export default function ServicesForm({
  goNext,
  goPrevious,
}: {
  goNext: () => void;
  goPrevious: () => void;
}) {
  const form = useFormContext<PropertyFormValues>();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Servizi</h2>
      <ServicesList />
    </div>
  );
}
