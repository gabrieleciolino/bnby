import ProtectedWrapper from "@/app/(authenticated)/wrapper";
import { getPropertiesQuery } from "@/components/property/queries";
import { PropertiesList } from "@/components/property/properties-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { urls } from "@/lib/urls";
import { PropertyWithDetails } from "@/components/property/schema";

export default async function AdminPage() {
  const properties = await getPropertiesQuery();

  return (
    <ProtectedWrapper
      title="Admin"
      actions={
        <Button asChild>
          <Link href={urls.admin.property.add}>Add Property</Link>
        </Button>
      }
    >
      <PropertiesList properties={properties as PropertyWithDetails[]} />
    </ProtectedWrapper>
  );
}
