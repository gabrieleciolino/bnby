import { Database } from "@/lib/db/types";
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_DEFAULT_KEY!
);
