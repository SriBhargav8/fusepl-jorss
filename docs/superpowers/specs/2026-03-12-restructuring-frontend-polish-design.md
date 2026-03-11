# Restructuring & Frontend Polish Design Spec

## Goal

Transform firstunicornstartup.com from a functional 59-task MVP into a properly bucketed, systematized codebase with premium frontend design. Fix structural gaps (barrel exports, centralized constants, CSS theme wiring, shared navigation), overhaul the landing page with Framer Motion animations and glassmorphism, add wizard step transitions, polish the results reveal, and fix the broken report page.

## Scope

**In scope:**
- Barrel exports for all lib/ subdirectories
- Centralize shared constants (METHOD_LABELS, STEP_LABELS, EMAIL_REGEX)
- Wire CSS theme vars to amber/slate (replace hardcoded classes)
- Shared header/navigation component
- Landing page premium redesign with Framer Motion
- Wizard step animations
- Results page animation polish
- Fix report page (remove hardcoded error, add Supabase fetch + local fallback)
- Error boundaries and loading skeletons
- Footer upgrade

**Out of scope:**
- Light/dark theme toggle (always dark)
- Storybook
- Visual regression tests
- New features or valuation methods
- Authentication/auth flows

## Architecture

### 1. Barrel Exports

Create `index.ts` in each lib/ subdirectory for clean re-exports:

```
src/lib/data/index.ts
  → getDamodaranBenchmark, getSectorLabel, SECTOR_MAPPING  (from sector-mapping.ts)
  → COMPARABLE_COMPANIES, findComparables                   (from comparable-companies.ts)
  → STAGE_BENCHMARKS, getSectorBenchmarks                   (from sector-benchmarks.ts)
  → getIBCRecovery, IBC_SECTORS                             (from ibc-recovery.ts)
  → INVESTORS                                                (from investors.ts)

src/lib/calculators/index.ts
  → computeDerivedFields       (from burn-rate.ts)
  → calculateESOPValue         (from esop-valuation.ts — takes ESOPParams, returns ESOPResult)
  → simulateRound              (from cap-table.ts)
  → simulateMultiRound         (from cap-table.ts)

src/lib/matching/index.ts
  → matchInvestors             (from investor-match.ts)

src/lib/export/index.ts
  → generateValuationPDF       (from pdf-generator.ts)
```

### 2. Centralized Constants

Move to `src/lib/constants.ts`:

```typescript
// Already exists: MARKET_CONSTANTS, DEFAULT_ESOP_PCT, ILLIQUIDITY_DISCOUNT, MC_ITERATIONS

// ADD:
// Short-form labels for UI display. The PDF generator (pdf-generator.ts) has its own
// long-form labels (e.g. "Discounted Cash Flow (DCF)") — keep those separate for PDF.
export const METHOD_LABELS: Record<string, string> = {
  dcf: 'DCF Analysis',
  pwerm: 'PWERM',
  revenue_multiple: 'Revenue Multiple',
  ebitda_multiple: 'EV/EBITDA Multiple',
  comparable_txn: 'Comparable Transactions',
  nav: 'Net Asset Value',
  replacement_cost: 'Replacement Cost',
  scorecard: 'Scorecard (Bill Payne)',
  berkus: 'Berkus Method',
  risk_factor: 'Risk Factor Summation',
}

export const WIZARD_STEPS = [
  'Company Profile',
  'Team',
  'Financials',
  'Market & Product',
  'Strategic Factors',
  'ESOP & Cap Table',
]
```

**Migration note for `wizard-container.tsx`:** Delete the local `STEP_LABELS` constant at line 44 and replace all 3 references with the imported `WIZARD_STEPS` from `@/lib/constants`. Also delete the local `METHOD_LABELS` in `method-cards.tsx` and import from `@/lib/constants`.

**Note on `pdf-generator.ts`:** The PDF generator has its own `METHOD_LABELS` with longer-form names suitable for PDF output. Keep those as a local constant in `pdf-generator.ts` — do NOT replace them with the shorter UI labels.

Move to `src/lib/utils.ts`:
```typescript
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

Update `email-gate.tsx` (line 30) and `capture/route.ts` (line 28) to import and use `EMAIL_REGEX` from `@/lib/utils` instead of inline regex.

### 3. CSS Theme Wiring

Update `globals.css` `.dark` block to use amber as primary:

```css
.dark {
  --background: oklch(0.10 0.01 260);    /* slate-950 */
  --foreground: oklch(0.97 0 0);          /* white */
  --card: oklch(0.15 0.01 260);           /* slate-900 */
  --card-foreground: oklch(0.97 0 0);
  --primary: oklch(0.77 0.17 75);         /* amber-500 */
  --primary-foreground: oklch(0.15 0 0);  /* dark text on amber */
  --secondary: oklch(0.20 0.01 260);      /* slate-800 */
  --muted: oklch(0.25 0.01 260);          /* slate-700 */
  --muted-foreground: oklch(0.60 0 0);    /* slate-400 */
  --border: oklch(0.25 0.01 260);         /* slate-800 */
  --input: oklch(0.20 0.01 260);          /* slate-800 */
  --accent: oklch(0.77 0.17 75 / 10%);   /* amber-500/10 */
  --accent-foreground: oklch(0.85 0.15 75); /* amber-400 */
  /* chart colors: approach-specific */
  --chart-1: oklch(0.62 0.21 260);        /* blue (income) */
  --chart-2: oklch(0.62 0.19 145);        /* green (market) */
  --chart-3: oklch(0.77 0.17 75);         /* amber (asset) */
  --chart-4: oklch(0.65 0.24 300);        /* purple (vc) */
  --chart-5: oklch(0.60 0.20 25);         /* red (accent) */
}
```

Components should then use semantic classes:
- `bg-card` instead of `bg-slate-900`
- `text-primary` instead of `text-amber-400`
- `border-border` instead of `border-slate-800`

**Migration strategy:** Don't change all 50+ component files at once. Change CSS vars first, then migrate components incrementally. Both hardcoded and semantic classes will work simultaneously.

**Note on `:root` block:** Leave the `:root` (light theme) block unchanged. The `html` element has `className="dark"` set statically in `layout.tsx`, so `:root` values are never applied at runtime. No SSR flash risk.

### 4. Shared Navigation Header

Create `src/components/layout/header.tsx`:

```
┌────────────────────────────────────────────────────────────────┐
│ 🦄 First Unicorn Startup    Valuation  Cap Table  ESOP  │ CTA │
└────────────────────────────────────────────────────────────────┘
```

- Sticky top, `backdrop-blur-xl bg-slate-950/80`
- Logo with gradient text (amber → orange)
- Nav links with active state indicator: Valuation (`/valuation`), Cap Table (`/cap-table`), ESOP (`/esop-calculator`)
- "Get Valuation" CTA button (amber) → `/valuation`
- Mobile: hamburger menu with slide-out sheet
- Wrap in root layout

### 5. Landing Page Premium Redesign

**Hero section:**
- Animated gradient mesh background using CSS `@keyframes` (not heavy JS)
- Large headline with `motion.div` fade-up animation
- Animated stat counters: "10 Methods", "3 Approaches", "25 Sectors", "10,000 Simulations"
- Pulsing amber CTA button
- Subtle floating particles or grid pattern background

**Trust signals:**
- Glassmorphism cards: `bg-white/5 backdrop-blur-lg border border-white/10`
- Staggered `motion.div` with `whileInView` for scroll-triggered entrance
- Small icon/emoji per signal

**How it works:**
- Connected vertical timeline on mobile, horizontal on desktop
- Animated connecting line between steps
- Each step card slides in from alternating sides

**Method showcase:**
- 4 approach cards with distinctive border colors (blue, green, amber, purple)
- Expand/collapse animation showing methods
- Approach icon or badge

**CTA section:**
- Full-width gradient amber→orange background
- "Know your startup's true worth" headline
- Large CTA button

### 6. Wizard Step Transitions

Using Framer Motion `AnimatePresence`:

Add `const [direction, setDirection] = useState(1)` to `WizardContainer`. Call `setDirection(1)` before `nextStep()`, `setDirection(-1)` before `prevStep()`. For `handleStepClick`, set `setDirection(step > currentStep ? 1 : -1)` before `goToStep(step)`.

```tsx
<AnimatePresence mode="wait" custom={direction}>
  <motion.div
    key={currentStep}
    custom={direction}
    initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
    transition={{ duration: 0.25, ease: 'easeInOut' }}
  >
    <StepComponent />
  </motion.div>
</AnimatePresence>
```

- Progress bar: `motion.div` with `layout` for smooth width transitions
- Step indicators: scale animation on active state change
- "Get Valuation" button: loading spinner while computing

### 7. Results Page Polish

- **Valuation reveal**: Animated counter from 0 → final value using `useSpring` or simple requestAnimationFrame counter
- **Method cards**: Staggered `whileInView` fade-in (50ms delay between each)
- **Charts**: Wrapped in `motion.div` with `whileInView` trigger
- **Email gate**: Locked content shows blurred preview, smooth height transition on unlock

### 8. Report Page Fix

Current: hardcoded `setError(true)`, never loads real data.

Fix:
1. Try Supabase fetch by `[id]` param
2. If Supabase env vars missing or fetch fails, fall back to `useValuationStore` data
3. **Data integrity guard:** When using local store fallback and the URL ID is not `'local'`, display a disclaimer: "Showing your last locally computed valuation — this may not correspond to the shared report."
4. If store also empty, show "Report not found" with CTA to create new valuation
5. Add proper loading skeleton (pulsing card placeholders)
6. Add retry button on error

### 9. Error Boundaries

Create `src/components/error-boundary.tsx`:
- **Must be a React class component** (React requires `static getDerivedStateFromError` and `componentDidCatch` for error boundaries — functional components cannot catch render errors)
- Wraps valuation engine calls
- Shows friendly error message with "Try Again" button
- Logs error to console (future: Sentry)

### 10. Loading Skeletons

Add base skeleton via `npx shadcn@latest add skeleton`, then build three named skeleton components on top of it:
- `ValuationSkeleton` — card with pulsing lines for results page
- `WizardSkeleton` — form field placeholders for wizard loading
- `ReportSkeleton` — section headers with pulsing content blocks for report page

## File Changes Summary

**New files (10):**
- `src/lib/data/index.ts`
- `src/lib/calculators/index.ts`
- `src/lib/matching/index.ts`
- `src/lib/export/index.ts`
- `src/components/layout/header.tsx`
- `src/components/layout/mobile-nav.tsx`
- `src/components/error-boundary.tsx`
- `src/components/ui/skeleton.tsx` (if missing)
- `src/components/ui/animated-counter.tsx`
- `src/components/landing/cta-section.tsx`

**Modified files (~20):**
- `src/app/globals.css` — amber theme vars
- `src/app/layout.tsx` — add Header component
- `src/app/page.tsx` — premium landing redesign
- `src/components/landing/hero.tsx` — Framer Motion + mesh gradient
- `src/components/landing/trust-signals.tsx` — glassmorphism + scroll animation
- `src/components/landing/how-it-works.tsx` — timeline animation
- `src/components/landing/method-showcase.tsx` — approach colors + expand
- `src/components/landing/footer.tsx` — upgrade links/branding
- `src/components/wizard/wizard-container.tsx` — AnimatePresence + loading state
- `src/components/results/valuation-reveal.tsx` — animated counter
- `src/components/results/method-cards.tsx` — staggered animation
- `src/components/results/email-gate.tsx` — use EMAIL_REGEX from utils
- `src/app/report/[id]/page.tsx` — fix data fetching, add skeleton
- `src/lib/constants.ts` — add METHOD_LABELS, WIZARD_STEPS
- `src/lib/utils.ts` — add EMAIL_REGEX
- `src/app/api/capture/route.ts` — use EMAIL_REGEX from utils

## Testing

- All 166 existing tests must continue passing
- No new test files needed (structural changes don't alter business logic)
- Manual verification: run `npm run dev` and check each page visually

## Dependencies

Already installed but unused:
- `framer-motion` v12 — for animations

No new dependencies needed.
