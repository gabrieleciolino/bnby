import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  PropertySchema,
  PropertyWithDetails,
} from "@/components/property/schema";
import { EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { urls } from "@/lib/urls";

export const PropertiesList = ({
  properties,
  hrefBuilder,
}: {
  properties: PropertyWithDetails[];
  hrefBuilder?: (id: string) => string;
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
              <Link href={buildHref(property.id)}>
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
