import { Geist, Geist_Mono, Noto_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "./providers"
import { cn } from "@/lib/utils";

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: {
    template: '%s | My-Link',
    default: 'My-Link | 당신의 모든 것을 하나의 링크로',
  },
  description: "인스타그램, 틱톡, 깃허브, 블로그까지. 흩어져 있는 나의 채널들을 1분 만에 깔끔하게 모아보세요.",
  keywords: ["멀티링크", "링크트리", "프로필링크", "My-Link", "마이링크", "소셜링크", "랜딩페이지"],
  authors: [{ name: "My-Link Team" }],
  creator: "My-Link",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "My-Link | 당신의 모든 것을 하나의 링크로",
    description: "인스타그램, 틱톡, 깃허브, 블로그까지. 흩어져 있는 나의 채널들을 1분 만에 깔끔하게 모아보세요.",
    siteName: "My-Link",
  },
  twitter: {
    card: "summary_large_image",
    title: "My-Link | 당신의 모든 것을 하나의 링크로",
    description: "흩어져 있는 나의 채널들을 1분 만에 깔끔하게 모아보세요.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://vibe-selc.vercel.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", notoSans.variable)}
    >
      <body>
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
