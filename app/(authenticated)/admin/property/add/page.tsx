import ProtectedWrapper from "@/app/(authenticated)/wrapper";
import AddPropertyForm from "@/components/property/add-property-form";

export default function AddPropertyPage() {
  return (
    <ProtectedWrapper title="Aggiungi una nuova proprietà">
      <AddPropertyForm />
    </ProtectedWrapper>
  );
}
