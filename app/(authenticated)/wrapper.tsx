export default function ProtectedWrapper({
  children,
  title,
  actions,
}: {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="main-container">
      <div className="bg-card rounded-lg p-4 shadow-lg">
        {title && (
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground">
              {title}
            </h1>
            {actions}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
