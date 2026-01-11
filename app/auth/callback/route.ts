import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createUrl } from "@/lib/utils";
import { urls } from "@/lib/urls";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const loginUrl = createUrl(urls.auth.login);
  const dashboardUrl = createUrl(urls.dashboard.index);

  const token_hash = searchParams.get("token_hash");

  if (token_hash) {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.verifyOtp({
      token_hash,
      type: "email",
    });

    if (error || !user) {
      console.error(error);

      // TODO: handle this error
      redirect(loginUrl);
    }

    const { error: accountError } = await supabase.from("account").insert({
      user_id: user.id,
    });

    if (accountError) {
      console.error(accountError);

      // TODO: handle this error
      redirect(loginUrl);
    }

    redirect(dashboardUrl);
  }

  console.error("No code found");
  redirect(loginUrl);
}
