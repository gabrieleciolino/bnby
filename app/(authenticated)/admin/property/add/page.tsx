import ProtectedWrapper from "@/app/(authenticated)/wrapper";
import PropertyForm from "@/components/property/property-form";

export default function AddPropertyPage() {
  return (
    <ProtectedWrapper>
      <PropertyForm isAdmin />
    </ProtectedWrapper>
  );
}
