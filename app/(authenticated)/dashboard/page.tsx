import ProtectedWrapper from "@/app/(authenticated)/wrapper";
import { getPropertiesQuery } from "@/components/property/queries";
import { PropertiesList } from "@/components/property/properties-list";

export default async function DashboardPage() {
  const properties = await getPropertiesQuery();

  return (
    <ProtectedWrapper title="Dashboard">
      <div>Dashboard</div>
    </ProtectedWrapper>
  );
}
