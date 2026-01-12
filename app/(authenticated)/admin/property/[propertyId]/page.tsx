import Link from "next/link";

import ProtectedWrapper from "@/app/(authenticated)/wrapper";
import { getPropertyQuery } from "@/components/property/queries";
import PropertyForm from "@/components/property/property-form";
import { PropertyWithDetails } from "@/components/property/schema";
import { SendOwnerColdEmailButton } from "@/components/property/send-owner-cold-email-button";
import { Button } from "@/components/ui/button";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  const property = await getPropertyQuery(propertyId);
  const propertyDetails = (property as PropertyWithDetails)?.details;

  const ownerEmail = propertyDetails?.contact?.email?.trim() ?? "";
  const hasOwner = Boolean((property as PropertyWithDetails)?.user_id);
  const hasSlug = Boolean(propertyDetails?.slug?.trim());
  const canSendColdEmail = !hasOwner;
  const isColdEmailReady = Boolean(ownerEmail) && hasSlug;

  return (
    <ProtectedWrapper
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {canSendColdEmail && (
            <SendOwnerColdEmailButton
              propertyId={propertyId}
              disabled={!isColdEmailReady}
              title={
                isColdEmailReady
                  ? undefined
                  : "Serve una email di contatto e uno slug per inviare la cold email"
              }
            />
          )}
        </div>
      }
    >
      <PropertyForm property={property as PropertyWithDetails} isAdmin />
    </ProtectedWrapper>
  );
}
