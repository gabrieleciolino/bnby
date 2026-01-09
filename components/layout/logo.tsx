import { urls } from "@/lib/urls";
import { HousePlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Logo({ href }: { href?: string }) {
  return (
    <Link href={href ?? urls.root} aria-label="Torna alla home page">
      <Image
        src="/logo.png"
        alt=""
        width={120}
        height={120}
        className="w-[100px] md:w-auto"
      />
    </Link>
  );
}
