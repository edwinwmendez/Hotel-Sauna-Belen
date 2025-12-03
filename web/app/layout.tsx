import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientProvider } from '@/components/providers/client-provider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Hotel Sauna Belén | Hotel con Sauna Privado en Moquegua',
    template: '%s | Hotel Sauna Belén',
  },
  description: 'Hotel 3 estrellas en Moquegua con sauna privado en cada habitación. Reserva online 24/7. WiFi, estacionamiento gratis y atención personalizada.',
  keywords: ['hotel moquegua', 'hotel con sauna', 'hospedaje moquegua', 'hotel sauna belen'],
  authors: [{ name: 'Hotel Sauna Belén' }],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://hotelsaunabelen.com',
    siteName: 'Hotel Sauna Belén',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  )
}
