import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Apply the Dark Green theme ONLY here
    <div className="flex min-h-screen flex-col bg-green-950 text-green-100">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}