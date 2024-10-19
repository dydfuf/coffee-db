export default function CoffeeListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto px-8 pt-4 pb-8 flex flex-col gap-4 w-[1024px]">
      {children}
    </div>
  );
}
