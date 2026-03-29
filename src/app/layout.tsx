import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/header'
import { FloatingActions } from '@/components/layout/floating-actions'
import { ModalProvider } from '@/components/providers/modal-provider'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'First Unicorn Startup — India\'s Most Comprehensive Startup Valuation Platform',
    template: '%s | First Unicorn Startup',
  },
  description: '3 Approaches x 10 Methods — DCF, PWERM, Revenue Multiple, EV/EBITDA, NAV, Scorecard, Berkus & more. Monte Carlo simulation. Damodaran India data. Free instant valuation. Built by an IBBI-Registered Valuer.',
  keywords: ['startup valuation', 'india', 'rule 11ua', 'fema valuation', 'dcf', 'monte carlo', 'cap table', 'esop valuation', 'damodaran india'],
  authors: [{ name: 'First Unicorn Startup' }],
  openGraph: {
    title: 'First Unicorn Startup — Know Your Startup\'s True Worth',
    description: '10 valuation methods, 4 approaches, Monte Carlo simulation. Powered by Damodaran India data.',
    url: 'https://firstunicornstartup.com',
    siteName: 'First Unicorn Startup',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'First Unicorn Startup — Startup Valuation Platform',
    description: '10 methods, 3 approaches, Monte Carlo, Damodaran India data. Free.',
  },
  metadataBase: new URL('https://firstunicornstartup.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${dmSerif.variable} font-sans antialiased`} suppressHydrationWarning>
        <ModalProvider>
          <Header />
          {children}
          <FloatingActions />
          <Toaster 
            position="top-center" 
            richColors 
            closeButton
            toastOptions={{
              style: {
                background: 'oklch(0.99 0.002 260)',
                border: '1px solid oklch(0.91 0.005 260)',
                borderRadius: '16px',
                fontSize: '13px',
                boxShadow: '0 8px 32px oklch(0 0 0 / 0.08)',
              },
            }}
          />
        </ModalProvider>
      </body>
    </html>
  )
}
