import { urls } from "@/lib/urls";
import { HousePlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Logo({ href }: { href?: string }) {
  return (
    <Link href={href ?? urls.root}>
      <Image src="/logo.png" alt="" width={150} height={150} />
    </Link>
  );
}
