import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import { SiteHeader } from '@/components/site-header'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'MyTube — Watch & Share Videos',
  description:
    'A YouTube-style video platform. Browse, watch, and upload videos, powered by a live backend API.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className={`${roboto.variable} font-sans antialiased`}>
        <AuthProvider>
          <SiteHeader />
          {children}
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
