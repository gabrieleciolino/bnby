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
    <div>
      {title && (
        <div className="main-container">
          <div className="m-1 p-4 flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground">
              {title}
            </h1>
            {actions}
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
