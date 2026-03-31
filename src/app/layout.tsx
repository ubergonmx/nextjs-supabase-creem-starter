import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import Script from 'next/script';
import { SonnerToaster } from '../components/sonner-toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const siteName = 'CreemKit';
const siteDescription =
  'Production-ready Next.js starter with Supabase auth and Creem payments pre-integrated.';

function getMetadataBase() {
  const fallbackUrl = 'http://localhost:3000';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? fallbackUrl;

  try {
    return new URL(appUrl);
  } catch {
    return new URL(fallbackUrl);
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  applicationName: siteName,
  title: siteName,
  description: siteDescription,
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    siteName,
    title: siteName,
    description: siteDescription,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('antialiased', inter.variable, 'font-sans')}
      data-scroll-behavior="smooth"
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
        <ThemeProvider>
          {children}
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
