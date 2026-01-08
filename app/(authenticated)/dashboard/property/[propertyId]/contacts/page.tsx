import Link from "next/link";

import ProtectedWrapper from "@/app/(authenticated)/wrapper";
import { getPropertyContacts, getPropertyQuery } from "@/components/property/queries";
import { PropertyWithDetails } from "@/components/property/schema";
import { Button } from "@/components/ui/button";
import { PropertyContactsList } from "@/components/property/property-contacts-list";

export default async function PropertyContactsPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  const [property, propertyContacts] = await Promise.all([
    getPropertyQuery(propertyId),
    getPropertyContacts(propertyId),
  ]);

  const propertyName =
    (property as PropertyWithDetails)?.details?.info?.name ?? "Proprietà";

  return (
    <ProtectedWrapper
      title={`Messaggi di ${propertyName}`}
      actions={
        <Button asChild variant="outline">
          <Link href={`/dashboard/property/${propertyId}`}>Vai alla proprietà</Link>
        </Button>
      }
    >
      {propertyContacts.error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {propertyContacts.error}
        </p>
      )}
      <PropertyContactsList contacts={propertyContacts.contacts} />
    </ProtectedWrapper>
  );
}
