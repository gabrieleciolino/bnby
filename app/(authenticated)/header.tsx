import Logo from "@/components/layout/logo";
import { urls } from "@/lib/urls";
import { getUserQuery } from "@/components/auth/queries";
import LogoutBtn from "@/components/auth/logout-btn";

export default async function AuthenticatedHeader() {
  const user = await getUserQuery();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="main-container">
        <div className="flex items-center justify-between">
          <Logo href={urls.dashboard.index} />
          <div className="flex items-center">
            <LogoutBtn />
          </div>
        </div>
      </div>
    </header>
  );
}
