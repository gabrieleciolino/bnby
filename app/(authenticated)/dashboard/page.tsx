import ProtectedWrapper from "@/app/(authenticated)/wrapper";
import {
  getCurrentPropertyQuery,
  getPropertiesQuery,
} from "@/components/property/queries";
import PropertyForm from "@/components/property/property-form";
import { PropertyWithDetails } from "@/components/property/schema";

export default async function DashboardPage() {
  const property = await getCurrentPropertyQuery();

  return (
    <ProtectedWrapper title="Proprietà">
      <PropertyForm property={property as PropertyWithDetails} />
    </ProtectedWrapper>
  );
}
