import type { Metadata, Viewport } from "next"
import { Syne, Outfit, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import NextTopLoader from 'nextjs-toploader'

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
})

import { APP_URL } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "HashCode — Apprendre. Construire. Évoluer.",
    template: "%s | HashCode",
  },
  description:
    "HashCode accompagne les talents du numérique dans trois domaines : développement web, cybersécurité et IA appliquée. Apprendre, pratiquer et démontrer ses compétences.",
  keywords: ["HashCode", "développement web", "cybersécurité", "intelligence artificielle", "apprentissage numérique", "communauté tech", "labs", "compétences", "talents"],
  authors: [{ name: "HASHCODE Team" }],
  creator: "HashCode",
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
    statusBarStyle: "black-translucent",
    title: "HashCode",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: APP_URL,
    title: "HashCode — Apprendre. Construire. Évoluer.",
    description: "Un écosystème pour apprendre, pratiquer et démontrer ses compétences dans le numérique.",
    siteName: "HashCode",
    images: [
      {
        url: "/brand/hashcode-og.png",
        width: 1200,
        height: 630,
        alt: "HashCode — Apprendre. Construire. Évoluer.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HashCode — Apprendre. Construire. Évoluer.",
    description: "Un écosystème pour apprendre, pratiquer et démontrer ses compétences dans le numérique.",
    images: ["/brand/hashcode-og.png"],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

import { Toaster } from "@/components/ui/sonner"
import { AuthErrorToast } from "@/components/ui/auth-error-toast"
import { ServiceWorkerRegister } from "@/components/service-worker-register"
import { Providers } from "@/components/providers"
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${syne.variable} ${outfit.variable} ${ibmPlexMono.variable} bg-background`}
      data-scroll-behavior="smooth"
    >
      <body className={`${outfit.variable} font-sans antialiased bg-background text-foreground relative`}>
        <ImpersonationBanner />
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
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-center" richColors />
        <AuthErrorToast />
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
