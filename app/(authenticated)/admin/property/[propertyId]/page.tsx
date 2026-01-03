import ProtectedWrapper from "@/app/(authenticated)/wrapper";
import { getPropertyQuery } from "@/components/property/queries";
import EditPropertyForm from "@/components/property/edit-property-form";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  const property = await getPropertyQuery(propertyId);

  return (
    <ProtectedWrapper title="Proprietà">
      <EditPropertyForm property={property} />
    </ProtectedWrapper>
  );
}
