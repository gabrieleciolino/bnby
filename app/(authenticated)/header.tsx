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
    <header>
      <div className="main-container">
        <div className="m-1 bg-card rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <Logo href={urls.dashboard.index} />
            <div className="flex items-center">
              <Button variant="ghost" size="icon">
                <Bell className="size-5" />
              </Button>
              <LogoutBtn />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
