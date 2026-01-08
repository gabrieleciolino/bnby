import ProtectedWrapper from "@/app/(authenticated)/wrapper";
import { getUserPropertiesQuery } from "@/components/property/queries";
import { PropertiesList } from "@/components/property/properties-list";
import { PropertyWithDetails } from "@/components/property/schema";
import { urls } from "@/lib/urls";

export default async function DashboardPage() {
  const properties = await getUserPropertiesQuery();

  return (
    <ProtectedWrapper title="Proprietà">
      <PropertiesList
        properties={properties as PropertyWithDetails[]}
        hrefBuilder={urls.dashboard.property.view}
      />
    </ProtectedWrapper>
  );
}
