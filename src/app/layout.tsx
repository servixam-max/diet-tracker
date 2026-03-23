import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNavBar } from "@/components/BottomNavBar";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Diet Tracker",
  description: "App de control nutricional mobile-first",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Diet Tracker",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} bg-[#0a0a0f] text-white antialiased min-h-screen h-screen overflow-hidden flex flex-col`}>
        <AuthProvider>
          <main className="flex-1 overflow-hidden pb-16 relative">
            {/* Background mesh gradient */}
            <div className="fixed inset-0 bg-mesh pointer-events-none" />
            {children}
          </main>
          <BottomNavBar />
        </AuthProvider>
      </body>
    </html>
  );
}
