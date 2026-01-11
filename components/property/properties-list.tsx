import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PropertyWithDetails } from "@/components/property/schema";
import { DeletePropertyButton } from "@/components/property/delete-property-button";
import { EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { urls } from "@/lib/urls";

export const PropertiesList = ({
  properties,
  hrefBuilder,
  canDelete = false,
}: {
  properties: PropertyWithDetails[];
  hrefBuilder?: (id: string) => string;
  canDelete?: boolean;
}) => {
  const buildHref = hrefBuilder ?? urls.admin.property.view;

  if (!properties || properties.length === 0) {
    return (
      <p className="rounded-lg border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Nessuna proprietà trovata.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {properties.map((property) => (
        <Card key={property.id}>
          <CardHeader>
            <CardTitle>{property.details.info.name}</CardTitle>
            <CardDescription>
              {property.details.info.description?.slice(0, 300)}...
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href={buildHref(property.id)}>
                <EyeIcon className="size-4" />
                Visualizza
              </Link>
            </Button>
            {canDelete && (
              <DeletePropertyButton
                propertyId={property.id}
                propertyName={property.details.info.name}
              />
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
