import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('antialiased', inter.variable, 'font-sans')}
    >
      <body>
        {process.env.NODE_ENV === 'development' && (
          <Script
            src="https://unpkg.com/@oyerinde/caliper/dist/index.global.min.js"
            data-config={JSON.stringify({
              theme: { primary: '#AC2323' },
            })}
            strategy="afterInteractive"
          />
        )}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
