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

export default function InfoForm({ goNext }: { goNext: () => void }) {
  const form = useFormContext<PropertySchema>();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Informazioni generali</h2>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Villa Giulia BnB" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrizione</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className="min-h-[100px]"
                placeholder="Situata in una zona tranquilla, la villa offre una vista panoramica sulla città..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        <FormField
          control={form.control}
          name="rooms"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 md:grid-cols-2 items-center">
              <FormLabel>Numero di camere</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <NumberField
                    {...field}
                    min={1}
                    max={10}
                    step={1}
                    className="border rounded-lg p-2"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bathrooms"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 md:grid-cols-2 items-center">
              <FormLabel>Numero di bagni</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <NumberField
                    {...field}
                    min={0}
                    max={10}
                    step={1}
                    className="border rounded-lg p-2"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="guests"
          render={({ field }) => (
            <FormItem className="grid grid-cols-1 md:grid-cols-2 items-center">
              <FormLabel>Numero di ospiti</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <NumberField
                    {...field}
                    min={1}
                    max={20}
                    step={1}
                    className="border rounded-lg p-2"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
