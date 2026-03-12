# Tier 1: Fix Broken Features Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the three broken user-facing features: Monte Carlo simulation (never runs), certified checkout CTA (404s), and AI analysis rate limiting (queries non-existent column).

**Architecture:** Wire `runMonteCarloSimulation` synchronously into the valuation orchestrator, build a Razorpay checkout API route with client modal integration, and fix the DB schema + query.

**Tech Stack:** Next.js 16.1.6, TypeScript 5, Razorpay SDK, Supabase, Vitest

**Spec:** `docs/superpowers/specs/2026-03-12-tier1-broken-features-fix-design.md`

---

## Chunk 1: Monte Carlo Wiring (Tasks 1-3)

### Task 1: Update orchestrator test to expect Monte Carlo results

**Files:**
- Modify: `__tests__/lib/valuation/orchestrator.test.ts:75-78`

- [ ] **Step 1: Update the existing monte_carlo test**

Replace the test at lines 75-78 that asserts `monte_carlo` is null:

```typescript
  it('runs Monte Carlo simulation with valid percentiles', () => {
    const result = calculateValuation(makeInputs())
    expect(result.monte_carlo).not.toBeNull()
    expect(result.monte_carlo!.p10).toBeGreaterThan(0)
    expect(result.monte_carlo!.p50).toBeGreaterThan(0)
    expect(result.monte_carlo!.p90).toBeGreaterThan(0)
    expect(result.monte_carlo!.p10).toBeLessThan(result.monte_carlo!.p50)
    expect(result.monte_carlo!.p50).toBeLessThan(result.monte_carlo!.p90)
    expect(result.monte_carlo!.iterations_total).toBe(10000)
    expect(result.monte_carlo!.iterations_valid).toBeGreaterThan(1000)
  })

  it('uses MC P10/P90 for composite range instead of placeholders', () => {
    const result = calculateValuation(makeInputs())
    expect(result.composite_low).toBe(result.monte_carlo!.p10)
    expect(result.composite_high).toBe(result.monte_carlo!.p90)
  })

  it('runs Monte Carlo for pre-revenue startups', () => {
    const result = calculateValuation(makeInputs({ annual_revenue: 0, gross_margin_pct: 0 }))
    expect(result.monte_carlo).not.toBeNull()
    expect(result.monte_carlo!.p50).toBeGreaterThan(0)
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run __tests__/lib/valuation/orchestrator.test.ts`
Expected: 3 tests FAIL (monte_carlo is currently null, composite_low/high are placeholders)

- [ ] **Step 3: Commit failing tests**

```bash
git add __tests__/lib/valuation/orchestrator.test.ts
git commit -m "test: expect Monte Carlo results from orchestrator (currently failing)"
```

---

### Task 2: Wire Monte Carlo into the orchestrator

**Files:**
- Modify: `src/lib/valuation/index.ts`

- [ ] **Step 1: Add MC imports and call**

Replace the entire file with:

```typescript
import type { WizardInputs, ValuationResult, MethodResult } from '@/types'
import { MARKET_CONSTANTS } from '@/lib/constants'
import { computeDerivedFields } from '@/lib/calculators/burn-rate'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import { runMonteCarloSimulation } from './monte-carlo.worker'
import { calculateDCF } from './dcf'
import { calculatePWERM } from './pwerm'
import { calculateRevenueMultiple } from './revenue-multiple'
import { calculateEBITDAMultiple } from './ebitda-multiple'
import { calculateComparableTransaction } from './comparable-transaction'
import { calculateNAV } from './nav'
import { calculateReplacementCost } from './replacement-cost'
import { calculateScorecard } from './scorecard'
import { calculateBerkus } from './berkus'
import { calculateRiskFactor } from './risk-factor'
import { calculateConfidenceScore } from './confidence-score'
import { getIBCRecovery } from '@/lib/data/ibc-recovery'

/**
 * Main valuation orchestrator.
 * Runs all 10 methods across 3 approaches + VC methods,
 * computes weighted composite, confidence score, and Monte Carlo simulation.
 */
export function calculateValuation(inputs: WizardInputs): ValuationResult {
  const derived = computeDerivedFields({
    monthly_burn: inputs.monthly_burn,
    cash_in_bank: inputs.cash_in_bank,
    cac: inputs.cac,
    ltv: inputs.ltv,
    patents_count: inputs.patents_count,
    stage: inputs.stage,
    sector: inputs.sector,
  })

  // Run all 10 methods across 4 approach categories
  const methods: MethodResult[] = [
    // Income Approach
    calculateDCF(inputs, derived),
    calculatePWERM(inputs, derived),
    // Market Approach
    calculateRevenueMultiple(inputs, derived),
    calculateEBITDAMultiple(inputs, derived),
    calculateComparableTransaction(inputs, derived),
    // Asset/Cost Approach
    calculateNAV(inputs, derived),
    calculateReplacementCost(inputs, derived),
    // VC/Startup Methods
    calculateScorecard(inputs, derived),
    calculateBerkus(inputs, derived),
    calculateRiskFactor(inputs, derived),
  ]

  // Weighted composite: weight by confidence, exclude confidence < 0.3
  const qualifying = methods.filter(m => m.applicable && m.confidence >= 0.3)
  let compositeValue = 0
  if (qualifying.length > 0) {
    const totalWeight = qualifying.reduce((sum, m) => sum + m.confidence, 0)
    compositeValue = qualifying.reduce((sum, m) => sum + m.value * m.confidence, 0) / totalWeight
  }

  // Monte Carlo simulation (synchronous — ~50-100ms for 10K iterations)
  const benchmark = getDamodaranBenchmark(inputs.sector)
  const terminalGrowth = MARKET_CONSTANTS.GDP_GROWTH_CAP
  const rawWacc = benchmark.wacc ?? 0.12
  const mcWacc = rawWacc <= terminalGrowth ? terminalGrowth + 0.02 : rawWacc
  const mcResult = runMonteCarloSimulation({
    baseRevenue: inputs.annual_revenue > 0 ? inputs.annual_revenue : 1_000_000,
    growthRate: inputs.revenue_growth_pct / 100,
    grossMargin: inputs.gross_margin_pct / 100,
    wacc: mcWacc,
    iterations: 10000,
  })

  // Confidence score
  const confidenceScore = calculateConfidenceScore(inputs, methods)

  // IBC recovery
  const ibcRecovery = getIBCRecovery(inputs.sector)

  return {
    methods,
    composite_value: compositeValue,
    composite_low: mcResult.p10,
    composite_high: mcResult.p90,
    confidence_score: confidenceScore,
    monte_carlo: mcResult,
    ibc_recovery_range: {
      low: ibcRecovery.p25,
      high: ibcRecovery.p75,
      sector: inputs.sector,
    },
  }
}
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `npx vitest run __tests__/lib/valuation/orchestrator.test.ts`
Expected: All tests PASS including the 3 new MC tests

- [ ] **Step 3: Run full test suite**

Run: `npm run test`
Expected: All 168 tests pass (166 existing - 1 removed + 3 new)

- [ ] **Step 4: Run build**

Run: `npm run build`
Expected: Build succeeds with zero errors

- [ ] **Step 5: Commit**

```bash
git add src/lib/valuation/index.ts __tests__/lib/valuation/orchestrator.test.ts
git commit -m "feat: wire Monte Carlo simulation into orchestrator — real P10/P90 replace placeholders"
```

---

### Task 3: Verify Monte Carlo renders in UI components

No code changes — manual verification only.

- [ ] **Step 1: Verify MonteCarloChart will render**

Read `src/components/results/monte-carlo-chart.tsx` and confirm it checks `monteCarlo` for non-null before rendering. With MC now non-null, the chart should render automatically.

- [ ] **Step 2: Verify PDF generator handles MC**

Read `src/lib/export/pdf-generator.ts` and confirm it already has a Monte Carlo section that checks for non-null `monte_carlo`. No changes needed.

---

## Chunk 2: Razorpay Certified Checkout (Tasks 4-6)

### Task 4: Create `/api/certified/checkout` route

**Files:**
- Create: `src/app/api/certified/checkout/route.ts`

- [ ] **Step 1: Create the checkout API route**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { EMAIL_REGEX } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 503 }
      )
    }

    const { valuation_id, email } = await req.json()

    if (!valuation_id || typeof valuation_id !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid valuation_id' },
        { status: 400 }
      )
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Missing or invalid email' },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const Razorpay = require('razorpay')
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })

    const order = await razorpay.orders.create({
      amount: 1499900, // Rs 14,999 in paise
      currency: 'INR',
      receipt: valuation_id,
      notes: {
        valuation_id,
        email,
        report_type: 'rule_11ua',
      },
    })

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
    })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds. New route appears as `ƒ /api/certified/checkout`

- [ ] **Step 3: Commit**

```bash
git add src/app/api/certified/checkout/route.ts
git commit -m "feat: add /api/certified/checkout route for Razorpay order creation"
```

---

### Task 5: Wire Razorpay modal into CertifiedCTA

**Files:**
- Modify: `src/components/report/certified-cta.tsx`

- [ ] **Step 1: Rewrite CertifiedCTA with props, state, and Razorpay modal**

Replace the entire file:

```typescript
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

interface Props {
  valuationId: string
  email: string
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

export function CertifiedCTA({ valuationId, email }: Props) {
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)

  const canPurchase = email.length > 0

  const handleCheckout = async () => {
    if (!canPurchase) return
    setLoading(true)

    try {
      const res = await fetch('/api/certified/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valuation_id: valuationId, email }),
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
        description: 'IBBI-Certified Valuation Report',
        handler: () => {
          setPaid(true)
          setLoading(false)
          toast.success('Payment received! Your certified report will be delivered within 48 hours.')
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
          <h2 className="text-xl font-bold text-white">Payment Received</h2>
          <p className="text-sm text-slate-400">
            Your certified valuation report will be delivered to <strong className="text-white">{email}</strong> within 48 hours.
          </p>
        </CardContent>
      </Card>
    )
  }

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
          onClick={handleCheckout}
          disabled={loading || !canPurchase}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Get Certified Report — Rs 14,999'
          )}
        </Button>
        {!canPurchase && (
          <p className="text-xs text-amber-400">Complete the email gate above to purchase</p>
        )}
        <p className="text-xs text-slate-500">
          Payment via Razorpay. GST included. Refund if not delivered within 48 hours.
        </p>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Update report page to pass props**

In `src/app/report/[id]/page.tsx`, change line 246 from:
```typescript
      <CertifiedCTA />
```
to:
```typescript
      <CertifiedCTA valuationId={valuation.id} email={valuation.email || ''} />
```

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Run tests**

Run: `npm run test`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/components/report/certified-cta.tsx src/app/report/\[id\]/page.tsx
git commit -m "feat: wire Razorpay checkout modal into CertifiedCTA with props and error handling"
```

---

### Task 6: Fix webhook to add user_id lookup

**Files:**
- Modify: `src/app/api/razorpay-webhook/route.ts:34-58`

- [ ] **Step 1: Add user_id lookup to webhook**

Replace lines 34-52 with:

```typescript
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity
      const notes = payment.notes || {}

      const supabase = createClient(supabaseUrl, serviceKey)

      // Look up user_id by email if available
      let userId: string | null = null
      if (notes.email) {
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('email', notes.email)
          .single()
        userId = user?.id ?? null
      }

      // Create certified request record
      const { error } = await supabase
        .from('certified_requests')
        .insert({
          valuation_id: notes.valuation_id,
          user_id: userId,
          status: 'paid',
          payment_id: payment.id,
          razorpay_order_id: payment.order_id,
          amount: payment.amount / 100, // paise to rupees
          report_type: notes.report_type || 'rule_11ua',
          purpose: notes.purpose || '',
          paid_at: new Date().toISOString(),
        })

      if (error) {
        console.error('Certified request insert error:', error)
        return NextResponse.json({ error: 'DB error' }, { status: 500 })
      }
    }
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/app/api/razorpay-webhook/route.ts
git commit -m "fix: add user_id lookup to Razorpay webhook certified_requests insert"
```

---

## Chunk 3: Database Schema & AI Rate Limit Fix (Tasks 7-8)

### Task 7: Add updated_at column migration

**Files:**
- Create: `supabase/migrations/002_add_updated_at.sql`

- [ ] **Step 1: Create the migration file**

```sql
-- Add updated_at column to valuations
ALTER TABLE valuations ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();

-- Backfill existing rows
UPDATE valuations SET updated_at = created_at WHERE updated_at IS NULL;

-- Auto-update trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to valuations
CREATE TRIGGER valuations_updated_at
  BEFORE UPDATE ON valuations
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Composite index for rate limiting in /api/capture
CREATE INDEX idx_valuations_ip_created ON valuations(ip_address, created_at);
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/002_add_updated_at.sql
git commit -m "feat: add updated_at column, trigger, and ip_address index to valuations"
```

---

### Task 8: Fix AI analysis rate limit query

**Files:**
- Modify: `src/app/api/ai-analysis/route.ts:62`

- [ ] **Step 1: Fix the column reference**

Change line 62 from:
```typescript
      .gte('updated_at', todayStart.toISOString())
```
to:
```typescript
      .gte('created_at', todayStart.toISOString())
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Run full test suite**

Run: `npm run test`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add src/app/api/ai-analysis/route.ts
git commit -m "fix: AI analysis rate limit — query created_at instead of non-existent updated_at"
```

---

## Verification Checklist

After all chunks are complete, run:

```bash
npm run build    # Must succeed with zero errors
npm run test     # All tests must pass (168 expected: 166 original - 1 removed + 3 new)
npm run dev      # Manual visual check
```

Manual verification:
1. **Monte Carlo** — Complete a valuation, verify MC chart renders on results page, composite range shows statistical bounds (not ±30%)
2. **Checkout** — On report page, click "Get Certified Report", verify Razorpay modal opens (will fail without real keys but should not 404)
3. **Report page** — Visit `/report/local`, verify CertifiedCTA renders with disabled state when email is empty
4. **PDF** — Download PDF, verify Monte Carlo section is now populated

---

### Critical Files for Implementation

- `src/lib/valuation/index.ts` — Orchestrator receiving MC wiring (Task 2)
- `src/lib/valuation/monte-carlo.worker.ts` — Already exported MC function, no changes needed
- `src/app/api/certified/checkout/route.ts` — New Razorpay order creation route (Task 4)
- `src/components/report/certified-cta.tsx` — Razorpay modal + props (Task 5)
- `src/app/api/razorpay-webhook/route.ts` — user_id lookup fix (Task 6)
- `src/app/api/ai-analysis/route.ts` — Rate limit query fix (Task 8)
- `supabase/migrations/002_add_updated_at.sql` — Schema migration (Task 7)
