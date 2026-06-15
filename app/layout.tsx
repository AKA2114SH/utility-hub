import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans'
});
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
});

// This dynamic prefix handles the difference between GitHub Pages (/utility-hub) and Vercel (/)
const isGitHubPages = process.env.NODE_ENV === 'production' && process.env.GITHUB_ACTIONS === 'true';
const assetPrefix = isGitHubPages ? '/utility-hub' : '';

export const metadata: Metadata = {
  title: 'UtilityHub - 20+ Free Online Tools for Professionals',
  description: 'Access 20+ free online tools for PDF conversion, image processing, text editing, productivity, and development. 100% client-side processing - no server uploads, complete privacy.',
  keywords: [
    'PDF tools',
    'image converter',
    'JSON formatter',
    'password generator',
    'QR code generator',
    'online utilities',
    'free tools',
    'text converter',
    'productivity tools',
    'developer tools',
  ],
  generator: 'v0.app',
  metadataBase: new URL('https://utilityhub.dev'),
  openGraph: {
    title: 'UtilityHub - All-in-One Online Tools',
    description: '20+ free online tools for professionals. Everything runs in your browser - no uploads, complete privacy.',
    url: '/',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UtilityHub - Free Online Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UtilityHub - Free Online Tools',
    description: '20+ tools for PDF, Image, Text, Productivity & Development',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      {
        url: `${assetPrefix}/icon-light-32x32.png`,
        media: '(prefers-color-scheme: light)',
      },
      {
        url: `${assetPrefix}/icon-dark-32x32.png`,
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: `${assetPrefix}/icon.svg`,
        type: 'image/svg+xml',
      },
    ],
    apple: `${assetPrefix}/apple-icon.png`,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
