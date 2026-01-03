import { Property } from "@/components/property/queries";
import { Card, CardHeader, CardTitle } from "../ui/card";

export const PropertiesList = ({ properties }: { properties: Property[] }) => {
  return (
    <div>
      {properties.map((property) => (
        <Card key={property.id}>
          <CardHeader>
            <CardTitle>{property.name}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};
