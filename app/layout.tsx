import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AppProvider from "@/components/providers/AppProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: "RunIt",
  description: "An instant, multi-language coding environment built for speed.",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "RunIt",
    description: "Write, run, and share code instantly.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "RunIt Logo",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-[#050505] text-white flex flex-col`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}