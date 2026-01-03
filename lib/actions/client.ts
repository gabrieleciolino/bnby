import { createSafeActionClient } from "next-safe-action";
import { createClient } from "@/lib/supabase/server";

const actionClient = createSafeActionClient();

export const publicActionClient = actionClient.use(
  async ({ next, clientInput }) => {
    const formData = new FormData();

    console.log(clientInput, typeof clientInput);

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

    return next({ ctx: { ...ctx, user: data.claims } });
  }
);
