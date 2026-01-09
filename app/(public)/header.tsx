import Logo from "@/components/layout/logo";
import { urls } from "@/lib/urls";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="main-container">
        <div className="flex items-center justify-between">
          <Logo href={urls.root} />
        </div>
      </div>
    </header>
  );
}
