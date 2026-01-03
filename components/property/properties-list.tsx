import { Property } from "@/components/property/queries";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PropertySchema } from "@/components/property/schema";
import { EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { urls } from "@/lib/urls";

export const PropertiesList = ({
  properties,
}: {
  properties: PropertyWithDetails[];
}) => {
  return (
    <div>
      {properties.map((property) => (
        <Card key={property.id}>
          <CardHeader>
            <CardTitle>{property.details.info.name}</CardTitle>
            <CardDescription>
              {property.details.info.description?.slice(0, 300)}...
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href={urls.admin.property.view(property.id)}>
                <EyeIcon className="size-4" />
                Visualizza
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
