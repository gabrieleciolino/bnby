import { urls } from "@/lib/urls";
import { HousePlus } from "lucide-react";
import Link from "next/link";

export default function Logo({ href }: { href?: string }) {
  return (
    <Link href={href ?? urls.root}>
      <div className="flex items-center gap-2">
        <div className="bg-primary text-primary-foreground rounded-full p-2">
          <HousePlus className="size-6 font-medium" />
        </div>
        <span className="font-display text-2xl">bnbfacile</span>
      </div>
    </Link>
  );
}
