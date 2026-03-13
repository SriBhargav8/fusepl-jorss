'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { PURPOSE_LABELS, PURPOSE_PRICES, type ValuationPurpose } from '@/types'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

interface Props {
  valuationId: string
  email: string
  purpose: ValuationPurpose
}

function loadRazorpayScript(): Promise<void> {
  if (typeof window !== 'undefined' && window.Razorpay) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay'))
    document.head.appendChild(script)
  })
}

function formatPrice(paise: number): string {
  return `Rs ${(paise / 100).toLocaleString('en-IN')}`
}

export function CertifiedCTA({ valuationId, email, purpose }: Props) {
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)

  const price = PURPOSE_PRICES[purpose]
  const canPurchase = email.length > 0 && price > 0

  // Free purpose — no CTA needed
  if (price === 0) return null

  const handleCheckout = async () => {
    if (!canPurchase) return
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valuation_id: valuationId, email, purpose }),
      })

      if (res.status === 503) {
        toast.error('Payment service is being set up. Contact us directly.')
        setLoading(false)
        return
      }

      if (res.status === 400) {
        toast.error('Please complete a valuation and provide your email first.')
        setLoading(false)
        return
      }

      if (!res.ok) {
        toast.error('Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      const data = await res.json()

      await loadRazorpayScript()

      const rzp = new window.Razorpay({
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,
        name: 'First Unicorn Startup',
        description: `${PURPOSE_LABELS[purpose]} Report`,
        handler: () => {
          setPaid(true)
          setLoading(false)
          toast.success('Payment received! Your report will be delivered within 48 hours.')
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        theme: { color: '#f59e0b' },
      })

      rzp.open()
    } catch {
      toast.error('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (paid) {
    return (
      <Card className="border-2 border-green-500/30 bg-green-500/5">
        <CardContent className="text-center py-8 space-y-3">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto" />
          <h2 className="text-xl font-bold text-[oklch(0.15_0.02_260)]">Payment Received</h2>
          <p className="text-sm text-[oklch(0.45_0.01_260)]">
            Your {PURPOSE_LABELS[purpose].toLowerCase()} report will be delivered to{' '}
            <strong className="text-[oklch(0.15_0.02_260)]">{email}</strong> within 48 hours.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-amber-500/30 bg-amber-500/5">
      <CardContent className="text-center py-8 space-y-4">
        <h2 className="text-xl font-bold text-[oklch(0.15_0.02_260)]">
          Upgrade to {PURPOSE_LABELS[purpose]}
        </h2>
        <p className="text-sm text-[oklch(0.45_0.01_260)] max-w-lg mx-auto">
          Get a professionally prepared {PURPOSE_LABELS[purpose].toLowerCase()} report
          — {formatPrice(price)}. Signed by a registered valuer where applicable.
        </p>
        <Button
          size="lg"
          className="mt-2 bg-[#32373c] hover:bg-[#1d2024] text-white font-semibold"
          onClick={handleCheckout}
          disabled={loading || !canPurchase}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Get ${PURPOSE_LABELS[purpose]} Report — ${formatPrice(price)}`
          )}
        </Button>
        {!email && (
          <p className="text-xs text-[oklch(0.62_0.22_330)]">Complete the email gate above to purchase</p>
        )}
        <p className="text-xs text-[oklch(0.50_0.01_260)]">
          Payment via Razorpay. GST included. Refund if not delivered within 48 hours.
        </p>
      </CardContent>
    </Card>
  )
}
