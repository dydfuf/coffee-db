export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="container py-6">
      <header className="mb-6">
        <h2 className="text-xl font-semibold">Admin Area</h2>
      </header>
      {children}
    </section>
  );
}