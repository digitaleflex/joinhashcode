import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { AnalyticsConsent } from "@/components/ui/analytics-consent"
import "./globals.css"
import { Noise } from "@/components/ui/noise"
import NextTopLoader from 'nextjs-toploader'

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

import { APP_URL } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "HASHCODE — Le programme de la nouvelle ère",
    template: "%s | HASHCODE",
  },
  description:
    "HASHCODE est une plateforme de profilage qui détecte ton profil, t'oriente vers la bonne communauté et t'accompagne dans ton parcours technologique.",
  keywords: ["tech", "communauté", "formation", "développement", "afrique", "talents", "hashcode"],
  authors: [{ name: "HASHCODE Team" }],
  creator: "HASHCODE",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/app-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HASHCODE",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: APP_URL,
    title: "HASHCODE — Le programme de la nouvelle ère",
    description: "Détecte ton profil, rejoins ta communauté et évolue dans la tech.",
    siteName: "HASHCODE",
    images: [
      {
        url: "/hashcode-logo.png",
        width: 1200,
        height: 630,
        alt: "HASHCODE — Le programme de la nouvelle ère",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HASHCODE — Le programme de la nouvelle ère",
    description: "Détecte ton profil, rejoins ta communauté et évolue dans la tech.",
    images: ["/hashcode-logo.png"],
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
}

import { Toaster } from "@/components/ui/sonner"
import { CookieBanner } from "@/components/ui/cookie-banner"
import { AuthErrorToast } from "@/components/ui/auth-error-toast"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="fr" 
      className={`${geist.variable} ${geistMono.variable} bg-background`}
      data-scroll-behavior="smooth"
    >
      <body className="font-sans antialiased bg-background text-foreground relative">
        <NextTopLoader
          color="oklch(0.91 0.22 124)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px oklch(0.91 0.22 124),0 0 5px oklch(0.91 0.22 124)"
        />
        <Noise />
        {children}
        <Toaster position="top-center" richColors />
        <AuthErrorToast />
        <CookieBanner />
        {process.env.NODE_ENV === "production" && <AnalyticsConsent />}
      </body>
    </html>
  )
}
