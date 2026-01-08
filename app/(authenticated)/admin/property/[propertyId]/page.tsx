import Link from "next/link";

import ProtectedWrapper from "@/app/(authenticated)/wrapper";
import { getPropertyQuery } from "@/components/property/queries";
import PropertyForm from "@/components/property/property-form";
import { PropertyWithDetails } from "@/components/property/schema";
import { Button } from "@/components/ui/button";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  const property = await getPropertyQuery(propertyId);

  return (
    <ProtectedWrapper
      title="Proprietà"
      actions={
        <Button asChild variant="outline">
          <Link href={`/admin/property/${propertyId}/contacts`}>
            Contatti
          </Link>
        </Button>
      }
    >
      <PropertyForm property={property as PropertyWithDetails} isAdmin />
    </ProtectedWrapper>
  );
}
