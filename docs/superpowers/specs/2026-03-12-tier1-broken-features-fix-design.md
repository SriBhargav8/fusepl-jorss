# Tier 1: Fix Broken Features — Design Spec

## Goal

Fix the three broken user-facing features in firstunicornstartup.com: (1) Monte Carlo simulation never runs, (2) certified checkout CTA 404s, (3) AI analysis rate limiting queries a non-existent column. After this fix, all headline features work end-to-end.

## Scope

**In scope:**
- Wire Monte Carlo simulation synchronously into the valuation orchestrator
- Replace placeholder composite_low/composite_high with real MC P10/P90
- Build `/api/certified/checkout` route (Razorpay order creation)
- Integrate Razorpay checkout modal into CertifiedCTA component
- Fix webhook to add user_id lookup (valuation_id extraction already works)
- Add `updated_at` column + trigger to valuations table
- Fix AI analysis rate limit query from `updated_at` to `created_at`
- Add composite index on `(ip_address, created_at)` for capture rate limiting

**Out of scope:**
- Async Web Worker for Monte Carlo (YAGNI — sync is fast enough behind loading spinner)
- `next.config.ts` webpack worker-loader configuration
- Payment success page / email receipt
- Expanding comparable companies or investor datasets
- Component tests
- Analytics (`page_events`) wiring
- Dead dependency cleanup

## Architecture

### 1. Monte Carlo Worker Wiring

**Current state:** `src/lib/valuation/monte-carlo.worker.ts` contains a fully working `runMonteCarloSimulation()` function (Box-Muller Normal sampling, 10K iterations desktop / 2K mobile, P10-P90 percentiles). It also registers a `self.onmessage` Web Worker handler. However, no code anywhere spawns a Worker or imports this function. The orchestrator (`src/lib/valuation/index.ts`) hardcodes `monte_carlo: null` and uses `compositeValue * 0.7` / `compositeValue * 1.3` as placeholder bounds.

**Fix:** Import `runMonteCarloSimulation` directly (synchronous call) into the orchestrator. No Worker thread, no webpack config changes.

**File to modify: `src/lib/valuation/index.ts`**

Changes:
1. Add import: `import { runMonteCarloSimulation } from './monte-carlo.worker'`
2. Add import: `import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'`
3. After computing `compositeValue`, call MC with the actual `MCParams` type:
   ```typescript
   // MCParams requires: baseRevenue, growthRate, grossMargin, wacc, iterations
   const benchmark = getDamodaranBenchmark(inputs.sector)
   const terminalGrowth = MARKET_CONSTANTS.GDP_GROWTH_CAP
   const rawWacc = benchmark.wacc ?? 0.12  // 12% default if Damodaran null
   const mcWacc = rawWacc <= terminalGrowth ? terminalGrowth + 0.02 : rawWacc
   const mcResult = runMonteCarloSimulation({
     baseRevenue: inputs.annual_revenue > 0 ? inputs.annual_revenue : 1_000_000, // min Rs 10L proxy (same as worker)
     growthRate: inputs.revenue_growth_pct / 100,
     grossMargin: inputs.gross_margin_pct / 100,
     wacc: mcWacc,
     iterations: 10000,
   })
   ```
4. Replace return values:
   - `composite_low: compositeValue * 0.7` → `composite_low: mcResult.p10`
   - `composite_high: compositeValue * 1.3` → `composite_high: mcResult.p90`
   - `monte_carlo: null` → `monte_carlo: mcResult`

**Note on MCParams type:** The actual `MCParams` interface (in `monte-carlo.worker.ts` lines 4-10) is DCF-based:
```typescript
interface MCParams {
  baseRevenue: number
  growthRate: number
  grossMargin: number
  wacc: number
  iterations: number
}
```
The orchestrator must source these from `inputs` and `getDamodaranBenchmark()`. WACC comes from the Damodaran benchmark for the sector (same source as `dcf.ts` line 14). Revenue growth and gross margin come directly from wizard inputs (converted from percentage to decimal).

**Note on `monte-carlo.worker.ts` exports:** The function is already exported (`export function runMonteCarloSimulation` at line 74). No changes needed to this file.

**Note on variable names:** The orchestrator uses `qualifying` (line 59), not `applicableMethods`.

**Performance:** 10K iterations of Box-Muller takes ~50-100ms. The wizard container already has `setTimeout(100ms)` with a "Computing..." loading spinner, so MC runs invisibly behind that delay.

**Impact on existing code:**
- `MonteCarloChart` component will now receive non-null `monte_carlo` data and render
- `ValuationReveal` animated counters will show real statistical bounds instead of ±30%
- PDF generator already handles `monte_carlo` being non-null — MC section will now render in PDFs
- Report page gets MC data via Zustand store or Supabase fetch

### 2. Razorpay Certified Checkout Flow

**Current state:** `CertifiedCTA` component (in `src/components/report/certified-cta.tsx`) has `window.open('/api/certified/checkout', '_blank')` which 404s. The webhook handler (`src/app/api/razorpay-webhook/route.ts`) exists and inserts into `certified_requests` on `payment.captured` events, but no upstream route creates Razorpay orders.

**Fix — 3 files:**

#### 2a. New API route: `src/app/api/certified/checkout/route.ts`

POST endpoint that creates a Razorpay order:

```typescript
// Request body
interface CheckoutRequest {
  valuation_id: string
  email: string
}

// Response
interface CheckoutResponse {
  order_id: string
  amount: number      // 1499900 (paise)
  currency: string    // 'INR'
  key_id: string      // NEXT_PUBLIC_RAZORPAY_KEY_ID
}
```

Flow:
1. Validate `valuation_id` is a non-empty string and `email` passes EMAIL_REGEX
2. Import Razorpay from `razorpay` package
3. Create order: `razorpay.orders.create({ amount: 1499900, currency: 'INR', receipt: valuation_id, notes: { valuation_id, email } })`
4. Return `{ order_id: order.id, amount: order.amount, currency: order.currency, key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID }`
5. If Razorpay env vars missing, return `503 { error: 'Payment service not configured' }`

#### 2b. Modify: `src/components/report/certified-cta.tsx`

The current component has no props and no access to `valuation_id` or `email`. Fix:

1. Add props: `interface CertifiedCTAProps { valuationId: string; email: string }` — these are passed from the parent report page (`src/app/report/[id]/page.tsx`) which already has both values (`valuation.id` and `valuation.email`). Update the parent to pass: `<CertifiedCTA valuationId={valuation.id} email={valuation.email || ''} />`
2. Add `'use client'` directive (already present)
3. Add state: `loading`, `paid`
4. On CTA click:
   - Set `loading = true`
   - POST to `/api/certified/checkout` with `{ valuation_id: props.valuationId, email: props.email }`
   - If 503 (not configured), show toast: "Payment service is being set up. Contact us directly."
   - Load Razorpay script dynamically: append `<script src="https://checkout.razorpay.com/v1/checkout.js">` to document head (if not already loaded)
   - Open Razorpay modal with options:
     ```typescript
     {
       key: response.key_id,
       amount: response.amount,
       currency: response.currency,
       order_id: response.order_id,
       name: 'First Unicorn Startup',
       description: 'IBBI-Certified Valuation Report',
       handler: (paymentResponse) => { setPaid(true); toast.success(...) },
       modal: { ondismiss: () => setLoading(false) },
       theme: { color: '#f59e0b' },  // amber-500
     }
     ```
5. Error handling for all response codes:
   - 503: toast "Payment service is being set up. Contact us directly."
   - 400 (invalid email / missing valuation_id): toast "Please complete a valuation and provide your email first."
   - Other errors: toast "Something went wrong. Please try again."
   - Always `setLoading(false)` on error
6. If `email` prop is empty, disable the CTA button and show helper text: "Complete the email gate above to purchase"
7. If `paid === true`, show success state: "Payment received — your certified report will be delivered within 48 hours"

**Script loading:** Use a simple `loadScript()` helper that returns a promise. Check `window.Razorpay` before loading to avoid duplicate script tags.

#### 2c. Modify: `src/app/api/razorpay-webhook/route.ts`

The webhook already extracts `valuation_id` from `payment.notes` (line 44) and inserts it correctly. The only missing piece is `user_id` lookup.

Changes:
1. After extracting `notes` from the payment entity (line 36), look up `user_id` from `users` table: `supabase.from('users').select('id').eq('email', notes.email).single()` (the `users` table has an `email TEXT UNIQUE` column per the schema at `001_schema.sql` line 5)
2. Include `user_id` in the `certified_requests` insert (currently omitted). If user lookup fails (no matching email), set `user_id: null`

### 3. Database Schema Fixes

**Current state:** `src/app/api/ai-analysis/route.ts` line 62 queries `.gte('updated_at', todayStart.toISOString())` for rate limiting, but the `valuations` table has no `updated_at` column. The rate limit silently fails (PostgREST returns error or 0 count), making the 100-call/day cap non-functional.

#### 3a. New migration: `supabase/migrations/002_add_updated_at.sql`

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

-- Attach trigger
CREATE TRIGGER valuations_updated_at
  BEFORE UPDATE ON valuations
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Composite index for rate limiting in /api/capture
CREATE INDEX idx_valuations_ip_created ON valuations(ip_address, created_at);
```

#### 3b. Modify: `src/app/api/ai-analysis/route.ts`

Change line 62 from:
```typescript
.gte('updated_at', todayStart.toISOString())
```
to:
```typescript
.gte('created_at', todayStart.toISOString())
```

**Rationale:** Using `created_at` counts how many valuations created today have received an AI narrative, which serves as a reasonable daily cap proxy. The early-return cache check (line 51-53) prevents duplicate API calls for the same valuation, so the count reflects unique AI analyses. The `updated_at` column is useful for future cache invalidation but not for rate limiting.

## File Changes Summary

**New files (2):**
- `src/app/api/certified/checkout/route.ts`
- `supabase/migrations/002_add_updated_at.sql`

**Modified files (5):**
- `src/lib/valuation/index.ts` — import MC function, call it, replace placeholders
- `src/components/report/certified-cta.tsx` — add props, Razorpay modal integration
- `src/app/report/[id]/page.tsx` — pass valuationId and email props to CertifiedCTA
- `src/app/api/ai-analysis/route.ts` — fix rate limit query column
- `src/app/api/razorpay-webhook/route.ts` — add user_id lookup

## Testing

- All 166 existing tests must continue passing
- The orchestrator test (`orchestrator.test.ts`) currently asserts `monte_carlo: null` — update it to assert `monte_carlo` is non-null with valid P10/P50/P90 values
- No new test files needed for checkout (requires Razorpay API mocking — out of scope)
- Manual verification: run `npm run dev`, complete a valuation, verify MC chart renders and composite range is realistic

## Dependencies

No new dependencies. All packages already installed:
- `razorpay` v2.9.6 — for order creation
- `@supabase/supabase-js` v2.99.1 — for DB queries
- Razorpay checkout.js — loaded dynamically from CDN (client-side only)
