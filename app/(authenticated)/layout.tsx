import AuthenticatedHeader from "@/app/(authenticated)/header";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthenticatedHeader />
      <main>{children}</main>
    </>
  );
}
