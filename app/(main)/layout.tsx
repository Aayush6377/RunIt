import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UserProvider from "@/components/providers/UserProvider";
import PlaygroundBackground from "@/components/playground/PlaygroundBackground";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <PlaygroundBackground />
      
      <Navbar />
      
      <UserProvider>
        <main className="flex-grow flex flex-col items-center w-full px-6 mt-8 relative z-10">
          <div className="w-full max-w-7xl flex flex-col items-center">
            {children}
          </div>
        </main>
      </UserProvider>

      <Footer />
    </div>
  );
}