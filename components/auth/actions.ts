"use server";

import { loginSchema, registerSchema } from "@/components/auth/schema";
import { authActionClient, publicActionClient } from "@/lib/actions/client";
import { headers } from "next/headers";

const MIN_FORM_SUBMIT_MS = 3000;

const extractClientIp = () => {
  const headerList = headers();
  const cfIp = headerList.get("cf-connecting-ip");
  if (cfIp) return cfIp;
  const forwarded = headerList.get("x-forwarded-for");
  if (!forwarded) return null;
  return forwarded.split(",")[0]?.trim() || null;
};

const verifyTurnstile = async (
  token: string,
  secret: string,
  ip?: string | null
) => {
  const params = new URLSearchParams({
    secret,
    response: token,
  });
  if (ip) {
    params.set("remoteip", ip);
  }
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    }
  );
  const data = (await response.json().catch(() => null)) as {
    success?: boolean;
  } | null;
  return Boolean(data?.success);
};

const applyAntiSpamChecks = async (input: {
  company?: string;
  formStart?: number;
  turnstileToken?: string;
}) => {
  if (input.company?.trim()) {
    throw new Error("Richiesta non valida");
  }

  const now = Date.now();
  const formStart = input.formStart ?? null;
  const elapsedMs =
    typeof formStart === "number" && Number.isFinite(formStart)
      ? now - formStart
      : null;
  const tooFast = elapsedMs !== null ? elapsedMs < MIN_FORM_SUBMIT_MS : true;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const isSuspicious = tooFast;
  const turnstileToken = input.turnstileToken?.trim();

  if (isSuspicious && turnstileSecret && !turnstileToken) {
    throw new Error("captcha_required");
  }

  if (turnstileToken) {
    if (!turnstileSecret) {
      throw new Error("Configurazione anti-spam mancante");
    }
    const ok = await verifyTurnstile(
      turnstileToken,
      turnstileSecret,
      extractClientIp()
    );
    if (!ok) {
      throw new Error("Verifica anti-spam non riuscita");
    }
  }
};

export const loginAction = publicActionClient
  .inputSchema(loginSchema)
  .action(async ({ ctx, parsedInput }) => {
    await applyAntiSpamChecks(parsedInput);
    const { supabase } = ctx;
    const { email, password } = parsedInput;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    // get account related to the user
    const { data: accountData, error: accountError } = await supabase
      .from("account")
      .select("*")
      .eq("user_id", data.user.id)
      .single();

    if (accountError) {
      throw new Error(accountError.message);
    }

    return {
      user: data.user,
      account: accountData,
    };
  });

export const logoutAction = authActionClient.action(async ({ ctx }) => {
  const { supabase } = ctx;
  await supabase.auth.signOut();
});

export const registerAction = publicActionClient
  .inputSchema(registerSchema)
  .action(async ({ ctx, parsedInput }) => {
    await applyAntiSpamChecks(parsedInput);
    const { supabase } = ctx;
    const { email, password } = parsedInput;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!data.user || error) {
      throw new Error(error?.message || "No user");
    }

    return {
      user: data.user,
    };
  });
