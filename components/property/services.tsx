import {
  WashingMachine,
  Wifi,
  Tv,
  Car,
  WavesLadder,
  Fence,
  Waves,
} from "lucide-react";

export const services = [
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
