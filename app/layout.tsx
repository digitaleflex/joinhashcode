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
    default: "HASHCODE — Build skills. Prove expertise. Create opportunities.",
    template: "%s | HASHCODE",
  },
  description:
    "HASHCODE is a technology ecosystem where you learn, experiment, build and prove what you can do. Explore programs, labs and a community that builds.",
  keywords: ["technology", "ecosystem", "learn to code", "build projects", "prove skills", "tech community", "programming", "labs", "talents", "hashcode"],
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
    statusBarStyle: "black-translucent",
    title: "HASHCODE",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: APP_URL,
    title: "HASHCODE — Build skills. Prove expertise. Create opportunities.",
    description: "A place to learn, experiment, build and demonstrate what you can do.",
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
    title: "HASHCODE — Build skills. Prove expertise. Create opportunities.",
    description: "A place to learn, experiment, build and demonstrate what you can do.",
    images: ["/hashcode-logo.png"],
  },
}

export const viewport: Viewport = {
  themeColor: "#c5f441",
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
