import ProtectedWrapper from "@/app/(authenticated)/wrapper";
import PropertyForm from "@/components/property/property-form";

export default function AddPropertyPage() {
  return (
    <ProtectedWrapper title="Aggiungi una nuova proprietà">
      <PropertyForm />
    </ProtectedWrapper>
  );
}
