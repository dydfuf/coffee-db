export default function CoffeeDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex items-start md:items-center justify-center w-full">
      <div className="p-4 w-full flex justify-center">{children}</div>
    </div>
  );
}
