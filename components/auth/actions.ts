"use server";

import { loginSchema } from "@/components/auth/schema";
import { authActionClient, publicActionClient } from "@/lib/actions/client";

export const loginAction = publicActionClient
  .inputSchema(loginSchema)
  .action(async ({ ctx, parsedInput }) => {
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
