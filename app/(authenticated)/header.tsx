import Logo from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { JwtPayload } from "@supabase/supabase-js";
import { Bell, LogOut } from "lucide-react";
import { urls } from "@/lib/urls";
import { getUserQuery } from "@/components/auth/queries";
import LogoutBtn from "@/components/auth/logout-btn";

export default async function AuthenticatedHeader() {
  const user = await getUserQuery();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="main-container">
        <div className="flex items-center justify-between">
          <Logo href={urls.root} />
          <div className="flex items-center">
            <Button variant="ghost" size="icon">
              <Bell className="size-5" />
            </Button>
            <LogoutBtn />
          </div>
        </div>
      </div>
    </header>
  );
}
