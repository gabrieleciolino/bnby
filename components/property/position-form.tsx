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

export default function PositionForm({
  goNext,
  goPrevious,
}: {
  goNext: () => void;
  goPrevious: () => void;
}) {
  const form = useFormContext<PropertySchema>();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Posizione</h2>
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Indirizzo</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Via dei Monti Tiburtini, 123" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Città</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Roma" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Paese</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Italia" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
