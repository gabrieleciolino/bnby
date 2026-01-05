import { createSafeActionClient } from "next-safe-action";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const actionClient = createSafeActionClient();

export const publicActionClient = actionClient.use(
  async ({ next, clientInput }) => {
    const formData = new FormData();

    const input = clientInput as Record<string, string>;

    for (const key in input) {
      formData.append(key, input[key]);
    }

    const supabase = await createClient();

    return next({ ctx: { supabase } });
  }
);

export const authActionClient = publicActionClient.use(
  async ({ next, ctx }) => {
    const { supabase } = ctx;

    const { data, error: authError } = await supabase.auth.getClaims();

    if (authError || !data?.claims) {
      throw new Error("Unauthorized");
    }

    const { data: accountData, error: accountError } = await supabase
      .from("account")
      .select("*")
      .eq("user_id", data.claims.sub)
      .single();

    if (accountError) {
      throw new Error(accountError.message);
    }

    return next({ ctx: { ...ctx, user: data.claims, account: accountData } });
  }
);

export const adminActionClient = authActionClient.use(async ({ next, ctx }) => {
  const { user, account } = ctx;

  if (!account?.is_admin) {
    throw new Error("Unauthorized");
  }

  return next({ ctx: { ...ctx, supabase: supabaseAdmin } });
});
