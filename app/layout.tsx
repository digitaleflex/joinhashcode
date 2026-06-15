import type { Metadata, Viewport } from "next"
import { Syne, Outfit, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import { Noise } from "@/components/ui/noise"
import NextTopLoader from 'nextjs-toploader'

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
})

import { APP_URL } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "HASHCODE — Le programme de la nouvelle ère",
    template: "%s | HASHCODE",
  },
  description:
    "HASHCODE est un accélérateur de carrière qui décode ton potentiel, t'oriente vers la communauté d'élite adaptée à tes forces et t'accompagne dans ton parcours technologique.",
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
import { Providers } from "@/components/providers"
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner"
import { FloatingFeedbackButton } from "@/components/ui/floating-feedback-button"
import { UXPollBanner } from "@/components/ui/ux-poll-banner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${syne.variable} ${outfit.variable} ${ibmPlexMono.variable} bg-background`}
      data-scroll-behavior="smooth"
    >
      <body className={`${outfit.variable} font-sans antialiased bg-background text-foreground relative`}>
        <ImpersonationBanner />
        <UXPollBanner />
        <FloatingFeedbackButton />
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
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-center" richColors />
        <AuthErrorToast />
        <CookieBanner />
      </body>
    </html>
  )
}
