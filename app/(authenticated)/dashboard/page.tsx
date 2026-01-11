import ProtectedWrapper from "@/app/(authenticated)/wrapper";
import { getUserPropertiesQuery } from "@/components/property/queries";
import { PropertiesList } from "@/components/property/properties-list";
import { PropertyWithDetails } from "@/components/property/schema";
import { urls } from "@/lib/urls";
import { getAccountQuery } from "@/components/auth/queries";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const [properties, account] = await Promise.all([
    getUserPropertiesQuery(),
    getAccountQuery(),
  ]);
  const userProperties = properties ?? [];

  if (account && !account.is_admin && userProperties.length === 0) {
    redirect(urls.dashboard.property.add);
  }

  return (
    <ProtectedWrapper title="Proprietà">
      <PropertiesList
        properties={userProperties as PropertyWithDetails[]}
        hrefBuilder={urls.dashboard.property.view}
      />
    </ProtectedWrapper>
  );
}
