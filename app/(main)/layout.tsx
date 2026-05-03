import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col items-center w-full max-w-7xl mx-auto px-6 mt-8">
        {children}
      </main>
      <Footer />
    </>
  );
}