import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { CustomizationProvider } from "@/lib/customization-context"
import { ImportantNotificationModal } from "@/components/important-notification-modal"
import { GlobalTutorialWrapper } from "@/components/tutorial/global-tutorial-wrapper"
import { PhoneNumberPrompt } from "@/components/phone-number-prompt"

import { Geist } from 'next/font/google'

const geistSans = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RefZone",
  description:
    "Master decision-making with real-game scenarios, comprehensive quizzes, and AI-powered performance analytics. Supporting referees across Australia.",
  generator: "RefZone",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RefZone",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${geistSans.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CustomizationProvider>
            <GlobalTutorialWrapper>{children}</GlobalTutorialWrapper>
            <ImportantNotificationModal />
            <PhoneNumberPrompt />
          </CustomizationProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
