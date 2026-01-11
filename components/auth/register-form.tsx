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
import {
  loginSchema,
  LoginSchema,
  RegisterSchema,
  registerSchema,
} from "@/components/auth/schema";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction, registerAction } from "@/components/auth/actions";
import { urls } from "@/lib/urls";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { loadTurnstileScript } from "@/components/auth/turnstile";

export default function RegisterForm() {
  const [isRegistering, startRegistering] = useTransition();
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaContainerRef = useRef<HTMLDivElement | null>(null);
  const captchaWidgetIdRef = useRef<string | null>(null);
  const formStartRef = useRef(Date.now());
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  useEffect(() => {
    if (!captchaRequired || !turnstileSiteKey) return;
    let isCancelled = false;
    loadTurnstileScript()
      .then(() => {
        if (isCancelled) return;
        if (!captchaContainerRef.current || !window.turnstile) return;
        if (captchaWidgetIdRef.current) {
          window.turnstile.reset(captchaWidgetIdRef.current);
          return;
        }
        captchaWidgetIdRef.current = window.turnstile.render(
          captchaContainerRef.current,
          {
            sitekey: turnstileSiteKey,
            callback: (token) => setCaptchaToken(token),
            "error-callback": () => setCaptchaToken(""),
            "expired-callback": () => setCaptchaToken(""),
          }
        );
      })
      .catch(() => {
        toast.error("Impossibile caricare la verifica anti-spam");
      });
    return () => {
      isCancelled = true;
    };
  }, [captchaRequired, turnstileSiteKey]);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterSchema) => {
    if (captchaRequired && !captchaToken) {
      toast.info("Completa la verifica anti-spam per continuare");
      return;
    }
    startRegistering(async () => {
      try {
        const payload = {
          ...data,
          company,
          formStart: formStartRef.current,
          turnstileToken: captchaToken || undefined,
        };
        const {
          data: registerData,
          serverError,
          validationErrors,
        } = await registerAction(payload);

        if (serverError) {
          if (serverError === "captcha_required") {
            if (!turnstileSiteKey) {
              toast.error("Verifica anti-spam non disponibile");
              return;
            }
            setCaptchaRequired(true);
            setCaptchaToken("");
            toast.info("Completa la verifica anti-spam per continuare");
            return;
          }
          console.error(serverError);
          throw new Error(serverError);
        }

        if (validationErrors) {
          console.error(validationErrors);
          throw new Error();
        }

        if (registerData?.user) {
          toast.success(
            "Abbiamo inviato una mail di conferma al tuo indirizzo."
          );
          setCompany("");
          setCaptchaToken("");
          setCaptchaRequired(false);
          formStartRef.current = Date.now();
          if (captchaWidgetIdRef.current && window.turnstile) {
            window.turnstile.reset(captchaWidgetIdRef.current);
          }
        }
      } catch (error) {
        toast.error("Errore durante il login");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="absolute left-[-10000px] top-0 h-0 w-0 overflow-hidden">
          <label>
            Company
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
            />
          </label>
        </div>
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {captchaRequired && turnstileSiteKey ? (
          <div className="rounded-2xl border border-border bg-white/90 p-3 shadow-sm">
            <div ref={captchaContainerRef} />
          </div>
        ) : null}
        <Button type="submit" className="w-full" disabled={isRegistering}>
          {isRegistering && <Loader2 className="size-4 animate-spin" />}
          Registrati
        </Button>
        <p className="mt-4 text-lg text-center">
          Hai già un account?{" "}
          <Link href={urls.auth.login} className="main-link">
            Accedi
          </Link>
        </p>
      </form>
    </Form>
  );
}
