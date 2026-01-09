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
    <div className="bg-white">
      <div className="main-container">
        <div className="my-8">
          {title && (
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
              {actions}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
