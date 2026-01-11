import Logo from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { urls } from "@/lib/urls";
import Link from "next/link";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="main-container">
        <div className="flex items-center justify-between">
          <Logo href={urls.root} />
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href={urls.auth.login}>Accedi</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={urls.auth.register}>Registrati</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
