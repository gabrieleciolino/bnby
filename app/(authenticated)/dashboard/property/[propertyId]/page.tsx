import ProtectedWrapper from "@/app/(authenticated)/wrapper";
import { getPropertyQuery } from "@/components/property/queries";
import PropertyForm from "@/components/property/property-form";
import { PropertyWithDetails } from "@/components/property/schema";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  const property = await getPropertyQuery(propertyId);

  return (
    <ProtectedWrapper title="Proprietà">
      <PropertyForm property={property as PropertyWithDetails} />
    </ProtectedWrapper>
  );
}
