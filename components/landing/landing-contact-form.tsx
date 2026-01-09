"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js";

const loadTurnstileScript = () =>
  new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    if (window.turnstile) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TURNSTILE_SCRIPT_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Turnstile script load failed")),
        { once: true }
      );
      return;
    }
    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Turnstile script load failed"));
    document.head.appendChild(script);
  });

export const LandingContactForm = () => {
  const [isSending, startSending] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (captchaRequired && !captchaToken) {
      toast.info("Completa la verifica anti-spam per continuare");
      return;
    }

    startSending(async () => {
      try {
        const response = await fetch("/api/landing-contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            message,
            company,
            formStart: formStartRef.current,
            turnstileToken: captchaToken || undefined,
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          if (response.status === 403 && data?.error === "captcha_required") {
            if (!turnstileSiteKey) {
              toast.error("Verifica anti-spam non disponibile");
              return;
            }
            setCaptchaRequired(true);
            setCaptchaToken("");
            toast.info("Completa la verifica anti-spam per continuare");
            return;
          }
          throw new Error(data?.error || "Invio non riuscito");
        }

        toast.success("Messaggio inviato, ti ricontatteremo presto");
        setName("");
        setEmail("");
        setMessage("");
        setCompany("");
        setCaptchaToken("");
        setCaptchaRequired(false);
        formStartRef.current = Date.now();
        if (captchaWidgetIdRef.current && window.turnstile) {
          window.turnstile.reset(captchaWidgetIdRef.current);
        }
      } catch (error) {
        toast.error("Errore durante l'invio del messaggio");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          name="name"
          placeholder="Il tuo nome"
          className="h-12 rounded-2xl border border-border bg-background px-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="La tua email"
          className="h-12 rounded-2xl border border-border bg-background px-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <textarea
        name="message"
        placeholder="Raccontaci della tua struttura e di cosa ti serve"
        className="min-h-[140px] w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        required
      />
      {captchaRequired && turnstileSiteKey ? (
        <div className="rounded-2xl border border-border bg-white/90 p-3 shadow-sm">
          <div ref={captchaContainerRef} />
        </div>
      ) : null}
      <Button type="submit" size="lg" disabled={isSending}>
        {isSending ? "Invio in corso..." : "Richiedi una demo"}
      </Button>
    </form>
  );
};
