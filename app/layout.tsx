import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, GoogleOneTap } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "@/providers/themeProvider";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "FinePilot - Your Personal Finance Manager",
  description: "FinePilot helps you manage your finances, track spending, and achieve your financial goals with ease. Take control of your financial future today.",
  keywords: "personal finance, banking, money management, financial planning, budget tracker, expense management, savings goals",
  authors: [{ name: "FinePilot Team" }],
  creator: "FinePilot",
  publisher: "FinePilot",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: { url: '/apple-icon.png', type: 'image/png' },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://finepilot.com",
    title: "FinePilot - Your Personal Finance Manager",
    description: "Take control of your finances with smart budgeting, expense tracking, and personalized insights",
    siteName: "FinePilot",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinePilot - Your Personal Finance Manager",
    description: "Take control of your finances with smart budgeting, expense tracking, and personalized insights",
    creator: "@finepilot",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "hsl(262.1 83.3% 57.8%)",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${geistSans.className} antialiased`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
            storageKey="finepilot-theme"
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
      <GoogleOneTap />
    </ClerkProvider>
  );
}
