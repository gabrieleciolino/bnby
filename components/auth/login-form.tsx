"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/components/auth/schema";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/components/auth/actions";
import { urls } from "@/lib/urls";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginForm() {
  const [isLoggingIn, startLoggingIn] = useTransition();
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginSchema) => {
    startLoggingIn(async () => {
      try {
        const { serverError, validationErrors } = await loginAction(data);

        if (serverError) {
          console.error(serverError);
          throw new Error(serverError);
        }

        if (validationErrors) {
          console.error(validationErrors);
          throw new Error();
        }

        router.push(urls.dashboard.index);
      } catch (error) {
        toast.error("Errore durante il login");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoggingIn}>
          {isLoggingIn && <Loader2 className="size-4 animate-spin" />}
          Login
        </Button>
      </form>
    </Form>
  );
}
