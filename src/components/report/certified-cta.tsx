'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function CertifiedCTA() {
  return (
    <Card className="border-2 border-amber-500/30 bg-amber-500/5">
      <CardContent className="text-center py-8 space-y-4">
        <h2 className="text-xl font-bold text-white">Need a Legally Valid Valuation?</h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Get a certified Rule 11UA / FEMA valuation report — Rs 14,999.
          Signed by a registered valuer. Valid for RoC filing, fundraising, and tax compliance.
        </p>
        <ul className="text-sm space-y-1 text-left max-w-md mx-auto">
          <li className="flex items-center gap-2 text-slate-300">
            <span className="text-green-500">&#10003;</span> Compliant with Rule 11UA (Income Tax Act)
          </li>
          <li className="flex items-center gap-2 text-slate-300">
            <span className="text-green-500">&#10003;</span> Valid for FEMA pricing (foreign investment)
          </li>
          <li className="flex items-center gap-2 text-slate-300">
            <span className="text-green-500">&#10003;</span> 15-20 page professional report
          </li>
          <li className="flex items-center gap-2 text-slate-300">
            <span className="text-green-500">&#10003;</span> Signed by registered valuer with registration number
          </li>
          <li className="flex items-center gap-2 text-slate-300">
            <span className="text-green-500">&#10003;</span> Delivered within 48 hours of payment
          </li>
        </ul>
        <Button
          size="lg"
          className="mt-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          onClick={() => {
            // TODO: Wire to Razorpay checkout (Task 56)
            window.open('/api/certified/checkout', '_blank', 'noopener,noreferrer')
          }}
        >
          Get Certified Report — Rs 14,999
        </Button>
        <p className="text-xs text-slate-500">
          Payment via Razorpay. GST included. Refund if not delivered within 48 hours.
        </p>
      </CardContent>
    </Card>
  )
}
