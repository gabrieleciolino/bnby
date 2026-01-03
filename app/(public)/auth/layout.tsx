import Logo from "@/components/layout/logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main>
        <div className="flex flex-col gap-4 max-w-md mx-auto min-h-screen items-center justify-center">
          <Card className="w-full">
            <CardHeader className="justify-center">
              <Logo />
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
