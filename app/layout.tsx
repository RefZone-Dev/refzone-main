import type React from "react"
import type { Metadata } from "next"

import "./globals.css"

import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { CustomizationProvider } from "@/lib/customization-context"
import { ImportantNotificationModal } from "@/components/important-notification-modal"
import { GlobalTutorialWrapper } from "@/components/tutorial/global-tutorial-wrapper"
import { StructuredData } from "@/components/structured-data"
import { Toaster } from "@/components/ui/sonner"

import { Geist, Inter } from 'next/font/google'

const geistSans = Geist({ subsets: ["latin"] })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.refzone.com.au'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "RefZone",
  description:
    "Master decision-making with real-game scenarios, comprehensive quizzes, and advanced performance analytics. Supporting referees across Australia with 500+ quiz questions, 100+ scenarios, and 24/7 training assistant.",
  keywords: [
    "referee training",
    "football referee",
    "soccer referee",
    "referee education",
    "laws of the game",
    "LOTG",
    "referee quiz",
    "referee scenarios",
    "referee tools",
    "match official training",
    "Australian referee",
    "referee development",
    "referee certification",
    "referee exam preparation",
  ],
  authors: [{ name: "RefZone" }],
  creator: "RefZone",
  publisher: "RefZone",
  generator: "RefZone",
  applicationName: "RefZone",
  referrer: "origin-when-cross-origin",
  category: "Education",
  classification: "Sports Education & Training",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RefZone",
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteUrl,
    siteName: "RefZone",
    title: "RefZone - Football Referee Training Platform",
    description: "Master the Laws of the Game with algorithm-driven scenarios, quizzes, and expert analysis. Join hundreds of referees improving their skills every day.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "RefZone - Football Referee Training Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RefZone - Football Referee Training Platform",
    description: "Master the Laws of the Game with algorithm-driven scenarios, quizzes, and expert analysis.",
    images: [`${siteUrl}/og-image.jpg`],
    creator: "@refzone",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body className={`font-sans antialiased ${geistSans.className} ${inter.variable}`}>
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <CustomizationProvider>
              <GlobalTutorialWrapper>{children}</GlobalTutorialWrapper>
              <ImportantNotificationModal />
              <Toaster />
            </CustomizationProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
