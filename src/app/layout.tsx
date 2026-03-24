import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNavBar } from "@/components/BottomNavBar";
import { AuthProvider } from "@/components/AuthProvider";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { ParticleBackground, FloatingOrbs } from "@/components/ParticleBackground";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/ui/Feedback";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Diet Tracker",
  description: "App de control nutricional mobile-first con diseño profesional",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Diet Tracker",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  themeColor: "#0a0a0f",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body 
        suppressHydrationWarning 
        className={`${inter.className} ${inter.variable} bg-[#0a0a0f] text-white antialiased min-h-screen h-screen overflow-hidden flex flex-col`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              <ServiceWorkerRegistration />
              
              {/* Enhanced background effects */}
              <ParticleBackground />
              <FloatingOrbs />
              
              {/* Animated mesh gradient overlay */}
              <div className="fixed inset-0 bg-mesh pointer-events-none z-[1]" />
              
              <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20 relative z-10 scroll-momentum">
                {children}
              </main>
              
              <BottomNavBar />
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
