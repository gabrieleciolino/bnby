import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmation_url: string }>;
}) {
  const { confirmation_url } = await searchParams;

  if (!confirmation_url) {
    return notFound();
  }

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-center">
        Conferma il tuo account
      </h1>
      <p className="text-sm text-muted-foreground text-center">
        Conferma il tuo account cliccando sul bottone qui sotto.
      </p>
      <Button className="w-full mt-4" asChild>
        <Link href={decodeURIComponent(confirmation_url)}>Conferma</Link>
      </Button>
    </div>
  );
}
