# First Unicorn Startup — UI/UX Design System Spec

## Overview

**Goal:** World-class UI/UX for firstunicornstartup.com that makes enthusiastic Indian startup founders feel like they're getting a premium experience — educational, enjoyable, and shareable — while backed by the most robust professional valuation backend.

**Target User Psychology:** Enthusiastic startup founders (GenZ to boomers) who ask "What am I worth?" — not valuation professionals. The UX should feel like a personal discovery journey, not a consulting engagement. Professional credibility is the reason they trust the number, not the reason they visit.

**Design Philosophy:** Premium Professional with founder-first messaging. Dark navy/gold aesthetic conveys authority. Cinematic reveal creates shareable moments. Educational tooltips demystify valuation. Mobile-first for WhatsApp sharing culture.

**Tech Stack Addition:** Framer Motion (8kb gzipped) for animations on top of existing Next.js 14 + Tailwind CSS + shadcn/ui stack.

---

## Design System Foundation

### Color Palette

```
Primary Navy:    hsl(222, 47%, 11%)  — #0f172a  (backgrounds, hero)
Deep Slate:      hsl(217, 33%, 17%)  — #1e293b  (cards, surfaces)
Gold Accent:     hsl(38, 92%, 50%)   — #f59e0b  (CTAs, highlights, confidence)
Gold Light:      hsl(45, 93%, 47%)   — #eab308  (hover states)
Warm White:      hsl(210, 40%, 98%)  — #f8fafc  (text on dark)
Muted Slate:     hsl(215, 20%, 65%)  — #94a3b8  (secondary text)
Success Green:   hsl(142, 71%, 45%)  — #22c55e  (positive metrics, >70% confidence)
Warning Amber:   hsl(38, 92%, 50%)   — #f59e0b  (40-70% confidence)
Risk Red:        hsl(0, 84%, 60%)    — #ef4444  (warnings, <40% confidence)
Chart Blue:      hsl(217, 91%, 60%)  — #3b82f6  (Income approach)
Chart Purple:    hsl(262, 83%, 58%)  — #8b5cf6  (Market approach)
Chart Emerald:   hsl(160, 84%, 39%)  — #10b981  (Asset/Cost approach)
Chart Amber:     hsl(38, 92%, 50%)   — #f59e0b  (VC/Startup methods)
```

**Approach color coding is consistent across every chart, card, and section in the app.** Income = blue, Market = purple, Asset = emerald, VC = amber.

### Typography

```
Hero H1:         Clash Display (700)     — geometric bold display, modern authority
Section Heads:   Cabinet Grotesk (700)   — distinctive grotesque, premium feel
Sub-headings:    Cabinet Grotesk (500)   — lighter weight for hierarchy
Body:            Satoshi (400/500)        — humanist sans, warm readability
Financial Figs:  Space Grotesk (600)      — monospace-adjacent for Rs figures
Micro Labels:    Satoshi (500 uppercase)  — badges, labels, categories
```

**Type Scale:**
```
Desktop:  H1: 72px | H2: 40px | H3: 24px | Body: 16px | Small: 14px | Micro: 12px
Tablet:   H1: 52px | H2: 32px | H3: 22px | Body: 16px | Small: 14px | Micro: 12px
Mobile:   H1: 36px | H2: 28px | H3: 20px | Body: 16px | Small: 14px | Micro: 12px
```

All fonts from Fontshare (Indian Type Foundry) — free, WOFF2, `font-display: swap`.

### Spacing & Layout

- 8px grid system
- Max content width: 1280px (centered)
- Cards: 24px padding, 12px border-radius, `border border-slate-700/50`
- Glass effect: `bg-slate-800/60 backdrop-blur-xl`
- Touch targets: minimum 44px × 44px on all interactive elements

### Responsive Breakpoints

```
Mobile:    320px — 640px    (single column, stacked, bottom sheets)
Tablet:    641px — 1024px   (2-column where natural, sidebar TOC)
Desktop:   1025px — 1280px  (full sidebar TOC, 3-col grids)
Wide:      1281px+          (max-width container centered)
```

### Motion System (Framer Motion)

**Principles:**
- Every animation serves a purpose: guide attention, show relationships, or celebrate progress
- 60fps minimum — no janky animations
- `prefers-reduced-motion` → instant transitions, no animation

**Catalog:**
```
Enter:      fade up + scale 0.95→1.0, 400ms ease-out
Exit:       fade down + scale→0.95, 200ms ease-in
Stagger:    children enter 50ms apart
Numbers:    useSpring counting, 800ms
Charts:     pathLength draw 0→1, 1200ms
Scroll:     useInView(threshold: 0.2, once: true)
Page:       AnimatePresence — slide left/right 200ms
Hover:      translateY(-4px) + subtle shadow, 150ms
Press:      scale(0.98), 100ms
```

**Mobile motion reductions:**
- No particle effects (battery + performance)
- Simplified reveal animation (count-up + gauge only, no convergence)
- Swipe gestures via `drag` prop instead of complex transitions

---

## Screen 1: Landing Page

### Hero Section (Full Viewport)

**Desktop:**
- Dark navy gradient (`#0f172a` → `#1e293b`) with subtle dot grid at 5% opacity
- Gold particle effect: ~30 CSS `@keyframes` particles drifting upward (not Three.js)
- H1: "What's Your Startup Actually Worth?" — Clash Display 72px, warm white
- Subtitle: "Find out in 3 minutes. 10 valuation methods. Zero cost. Built by India's top valuation professionals." — Satoshi 20px, muted slate
- Primary CTA: "Know Your Worth (Takes 3 minutes)" — solid gold `#f59e0b`, black text, `hover:scale-1.02` + gold glow shadow, subtle pulse animation
- Secondary CTAs: "Cap Table Simulator" + "ESOP Calculator" — gold outline, transparent bg
- Social proof: "5,000+ founders have valued their startups" + star rating + anonymous testimonial
- Animated counter at bottom: "Rs 47,000 Cr valued" counting from 0
- Scroll indicator: animated bounce chevron
- Entry animation: H1 slides up (400ms), subtitle fades (600ms), buttons pop (800ms)

**Tablet:**
- H1: 52px, same layout but tighter spacing
- CTAs: 2+1 layout (primary + cap table on row 1, ESOP on row 2)

**Mobile:**
- No particles (performance)
- No dot grid background
- H1: 36px
- CTAs: full-width stacked
- Social proof: simplified to counter only

### Trust Signals Section

**Heading:** "Why founders trust us"

**6 signals in glass cards:**
1. "Built by IBBI-Registered Valuer (not a random AI)" — Lucide `Shield` icon
2. "Powered by the same Damodaran data VCs use" — Lucide `BarChart` icon
3. "10 methods that real investors use" — Lucide `Target` icon
4. "Your data stays private. Always." — Lucide `Lock` icon
5. "Free. No credit card. Results in 3 minutes." — Lucide `Zap` icon
6. "Used for actual fundraising rounds" — Lucide `Trophy` icon

**Layout:** 3-col grid (desktop), 2-col grid (tablet), vertical stack (mobile)
**Animation:** Scroll-triggered stagger from bottom, 50ms apart
**Style:** Glass cards with gold-tinted Lucide icon, metric text in Cabinet Grotesk

### How It Works Section

**3-step horizontal timeline:**
1. "Answer 6 Questions" — "Like a founder quiz" — Lucide `MessageSquare`
2. "See Your Number Instantly" — "10 methods calculate your range, FREE" — Lucide `TrendingUp`
3. "Get Your Full Report" — "Investor matching, cap table, AI insights" — Lucide `FileText`

**Animation:** Connecting line draws left-to-right on scroll, circles pulse gold on completion
**Mobile:** Vertical timeline (steps stack), line draws downward

### Method Showcase Section

**4 approach cards, color-coded:**
- Income (blue): DCF, PWERM — "IVS 105 Income Approach"
- Market (purple): Revenue Multiple, EV/EBITDA, Comparable Transaction — "Damodaran India Data"
- Asset/Cost (emerald): NAV, Replacement Cost — "Valuation Floor"
- VC Methods (amber): Scorecard, Berkus, Risk Factor — "Proven VC Frameworks"

**Style:** Glass cards with colored left border, hover lifts `translateY(-4px)` + border glow
**Layout:** 4-col (desktop), 2-col (tablet), vertical stack (mobile)

### Social Proof Section

**Anonymous testimonial carousel (3 cards rotating):**
- "Raised Rs 5 Cr using this as anchor" — Pre-Seed, SaaS
- "Saved Rs 2L on CA fees" — Series A, SaaS
- "Finally understood my cap table" — Seed, D2C

**Style:** Glass cards, auto-rotating 5s interval, swipeable on mobile

### Footer

**Links:** Valuation | Cap Table | ESOP Calculator | Privacy Policy | Terms of Service
**Credit:** "firstunicornstartup.com — Built by an IBBI-Registered IP & SFA-Licensed Valuer"

---

## Screen 2: 6-Step Wizard — "The Founder Quiz"

### Wizard Shell

**Full-page steps, Typeform-style.** Each step takes the full viewport (below the progress bar).

**Progress bar:**
- Desktop: Step names visible — "① Company ② Team ③ Money ④ Market ⑤ Strategy ⑥ ESOP"
- Mobile: Step number + bar only — "Step 1 of 6" + filled bar
- Active step highlighted in gold, completed steps have checkmarks
- Progress formula: `((currentStep - 1) / 5) * 100`

**Navigation:**
- Desktop: "← Back" (left) + "Continue →" (right) + "Press Enter ↵" hint
- Mobile: Sticky bottom "Continue →" button + swipe left/right gestures
- Keyboard: Enter advances, Escape goes back, Tab between fields

**Live Preview Ticker (bottom bar):**
- Updates as fields are completed: "Based on what you've told us: 3 methods can already calculate your range"
- Progresses: "5 methods ready" → "8 methods ready" → "All 10 methods ready — let's compute!"
- Mobile: Single line, truncated, tappable for detail

**Auto-save:** Zustand + localStorage. Browser close → resume where left off.

**Transitions:** Framer Motion `AnimatePresence` — current step slides left, next slides in from right, 200ms.

### Step 1: "Tell us about your startup"

**Fields:**
1. **Company name** — Text input, placeholder "e.g. Razorpay"
2. **Sector** — Searchable dropdown with popular chips ("SaaS", "Fintech", "D2C", "EdTech") for quick selection. Mobile: opens as bottom sheet with search
3. **Stage** — Visual card selector with icons: 💡 Idea | 🌱 Seed | 🚀 Series A | 📈 Series B | 🏢 Series C+. Each card has one-line description on hover/tap
4. **Business model** — Card selector (not dropdown): SaaS/Monthly, Marketplace/Commission, D2C/One-time, Freemium/Upsell, Services, Other
5. **City** — Text input with auto-suggest (Bangalore, Mumbai, Delhi, Hyderabad, Pune, Chennai...). Auto-filled from geolocation with permission
6. **Founded** — Year picker (2015–2026)

**Layout:** Desktop: 2-col where natural pairs (city + year). Mobile: single column.

### Step 2: "Who's building this?"

**Fields:**
1. **Team size** — Slider 1→200, contextual labels: "5 = typical seed team", "50 = Series A average"
2. **Founder experience** — Star rating (1-5) with descriptive labels at each level: "1 = First-time founder" to "5 = Serial entrepreneur, same industry"
3. **Domain expertise** — Star rating (1-5) with descriptive labels
4. **Previous exits** — Toggle switch (not checkbox), contextual insight: "Teams with exits get 1.5× higher investor interest"
5. **Technical co-founder** — Toggle switch
6. **Key hires** — Checkbox group: CTO, CFO, Sales Lead

**Educational micro-copy** beneath each field explains why this matters for valuation.

### Step 3: "Show us the numbers"

**Fields:**
1. **Annual revenue** — Currency input with live INR formatting ("= Rs 1 Cr" appears beside field as you type)
2. **Revenue growth (YoY %)** — Slider 0-500%, contextual: "100% = doubling annually", "SaaS median: 80%"
3. **Gross margin %** — Slider 0-100%, benchmark: "SaaS benchmark: 70-85%"
4. **Monthly burn** — Currency input with INR formatting
5. **Cash in bank** — Currency input with INR formatting
6. **Auto-calculated runway** — Appears instantly: green (>12mo), amber (6-12mo), red (<6mo) with warning: "Below 6 months — VCs will flag this"

**Optional collapsible section:** CAC, LTV, last round size, last round valuation — clearly marked "(Optional — helps improve accuracy)"

**Pre-revenue handling:** If annual_revenue = 0, show: "Pre-revenue? No problem — 5 of our 10 methods don't need revenue data."

### Step 4: "Your market & product"

**Fields:**
1. **TAM** — Currency input with tooltip: "Total Addressable Market in Rs Cr. Think: how big is the entire pie?"
2. **Development stage** — Visual card selector: Idea → MVP → Beta → Live/Revenue → Scaling
3. **Competition level** — Slider 1-5 with labels: "1 = Blue ocean" to "5 = Red ocean, 10+ funded competitors"
4. **Competitive advantages** — Multi-select chips: Network Effects, Proprietary Tech/IP, First Mover, Brand Recognition, Regulatory Moat, Data Moat, Other
5. **Patents/IP** — Toggle + count input (if yes)

### Step 5: "Strategic factors"

**Fields:**
1. **Strategic partnerships** — Card selector: None, One major partner, Multiple partners
2. **Regulatory risk** — Slider 1-5 with industry-specific context
3. **Revenue concentration** — Slider 0-100%: "Top client's share of revenue". Warning at >40%: "High concentration is a risk flag"
4. **International revenue %** — Slider 0-100%: relevant for FEMA pricing

### Step 6: "ESOP & Cap Table" (Optional)

**Skip option prominent:** "This step is optional but powerful. Skip → Get My Valuation"

**Fields:**
1. **ESOP pool %** — Slider with stage-based default recommendation shown
2. **Time to liquidity** — Slider 2-8 years, default 4
3. **Current cap table** — Interactive table:
   - Pre-filled: Founders 70%, ESOP 10%, Angels 20% (editable)
   - "+" Add holder button
   - Live pie chart updates as percentages change
   - Validation: total must = 100%
4. **Target raise amount** — Currency input
5. **Expected dilution %** — Auto-calculated from raise + current valuation estimate, shown as: "Post-money: Rs 25 Cr → 20% dilution"

**Layout:** Cap table has inline pie chart (desktop: side-by-side, mobile: stacked above table)

### Validation Rules Per Step

Step 1: company_name required, sector required, stage required
Step 2: team_size ≥ 1
Step 3: revenue ≥ 0, margins 0-100%
Step 4: TAM > 0
Step 5: No required fields
Step 6: If filled, ESOP 0-30%, cap table sum = 100%

**Validation UX:** Inline error messages below fields (red text), field border turns red. "Continue" button disabled until valid. Shake animation on submit attempt with errors.

---

## Screen 3: Valuation Reveal — "The Moment"

### Cinematic Sequence (3 seconds total)

**Frame 1 (0-1s): "Calculating..."**
- Dark screen, centered content
- Text: "Crunching 10 methods across 3 valuation approaches..."
- 10 method progress bars fill one by one (200ms each, staggered)
- Below: "Running 10,000 Monte Carlo iterations" with particle-like dots randomizing

**Frame 2 (1-2s): "Converging..."**
- All 10 bars hit 100%
- Bars morph into a single converging line toward center
- Text: "✓ All methods computed. Combining with confidence weights..."

**Frame 3 (2-3s): "THE NUMBER"**
- Line bursts into the valuation range
- Number counts up from Rs 0 to final range using `useSpring`
- Confidence gauge fills from 0 to score (circular arc)
- Haptic feedback on mobile (light tap on completion)

**Mobile simplification:** Skip Frame 1 and 2 convergence. Jump to: loading spinner (1s) → number count-up (1.5s) → gauge fill (0.5s).

### Post-Reveal Content

**Valuation Range Card (hero):**
- "Your Startup is Worth" — Cabinet Grotesk 24px
- "Rs 8 — 12 Cr" — Clash Display 48px (desktop), 36px (mobile), Space Grotesk for numbers
- Confidence gauge: circular arc, gold fill, score in center (78/100)
- Context: "Weighted average of 10 methods across Income, Market, Asset & VC approaches"

**AI-Generated Context Box (glass card):**
- "Your valuation falls in the top 30% of Seed-stage SaaS startups in India. 78/100 confidence means strong data quality across most methods."
- Generated client-side from pre-computed percentile data (no API call)
- Cabinet Grotesk heading, Satoshi body

**Method Breakdown:**
- Grouped by 4 approaches (Income, Market, Asset, VC)
- Each approach has its color-coded header
- Each method: name (METHOD_LABELS) + value (Space Grotesk) + confidence bar (colored)
- `(?)` tooltip on each method: plain-English one-liner explanation
- Expandable: click method to see inputs used
- Desktop: 2-col grid of method cards. Mobile: vertical stack

**Monte Carlo Distribution Chart:**
- Recharts AreaChart, animated draw (pathLength)
- P10, P25, P50, P75, P90 reference lines with labels
- Shaded area between P10 and P90
- Color: gradient blue-to-purple

**Method Contribution Pie Chart:**
- Recharts PieChart showing approach weights
- Color-coded by approach (blue, purple, emerald, amber)
- Interactive: click slice to highlight those methods

**Confidence Breakdown:**
- 4-factor score display: Data Completeness, Method Agreement, Revenue Maturity, Data Quality
- Each factor: horizontal bar + percentage
- Glass card, scroll-triggered animation

**IBC Downside Card:**
- "In insolvency, similar SaaS companies recovered 15-35%"
- Muted tone, educational not alarming
- Expandable: "What does this mean?" → explains IBC context for founders

**Share Buttons:**
- Mobile: WhatsApp primary (full-width button), LinkedIn + Twitter secondary
- Desktop: LinkedIn primary, Twitter + WhatsApp secondary
- All: `window.open` with `noopener,noreferrer`
- Pre-filled text: "My startup is worth Rs 8-12 Cr according to 10 valuation methods! Try yours free → firstunicornstartup.com"

---

## Screen 4: Email Gate

### Layout

**Centered card on dark background:**
- Heading: "Unlock your complete valuation intelligence report" — Cabinet Grotesk
- 9 unlock items with checkmarks, each with founder-language description:
  1. "Full methodology — see exactly how each method calculated your number"
  2. "Damodaran India benchmarks — how your sector compares"
  3. "AI-Powered VC Analysis — what a real investor would say"
  4. "Cap Table Simulator — model your next round interactively"
  5. "ESOP Calculator — Black-Scholes valuation of your pool"
  6. "Top 5 Investor Matches — Indian VCs most likely to fund you"
  7. "Comparable Indian Startups — 5 closest matches"
  8. "IBC Downside Analysis — full recovery data for your sector"
  9. "Downloadable PDF Report — 15+ pages, shareable"

- Email input field: "your@email.com"
- CTA: "Unlock My Full Report" — gold, full-width
- Privacy: "No spam. We only email your report." + "Your data stays private. Always."
- Social proof: "5,000+ founders have unlocked their reports"
- Graceful skip: "View basic results only" link below CTA

### Offline Handling

If offline when submitting:
- Queue email capture request
- Show results from local Zustand state computation
- Sync when back online

---

## Screen 5: Detailed Report — Scrollytelling

### Desktop Layout

**2-column: sticky sidebar TOC (240px) + main content (rest)**

**Sidebar TOC:**
- Section list with active highlight (gold left border)
- Tracks scroll position — active section updates as user scrolls
- Fixed "Download PDF" button and "Get Certified" button at bottom
- Collapses to icon-only at 1025px breakpoint

**Tablet:** Sidebar TOC at 200px width, otherwise same.

**Mobile:** TOC is a collapsible dropdown at top of page, not sidebar. Tapping opens bottom sheet with section list. Sticky bottom bar alternates between "Download PDF" and "Get Certified" based on scroll position. "Back to top" floating button after 3 screens of scrolling.

### Main Content Sections (12 sections)

Each section:
- Fades in on scroll (Framer Motion `useInView`, `once: true`)
- Has alternating layouts to prevent monotony:
  - Full-width charts
  - Two-column data tables
  - Glass cards for key metrics
  - Interactive tools (cap table, ESOP)

**3-Layer Information Architecture for every metric:**
1. **Headline** — the number (Rs 9.2 Cr) — Space Grotesk
2. **One-liner** — what it means ("DCF values your future cash flows at Rs 9.2 Cr") — Satoshi
3. **Expandable detail** — click to see inputs, formula, Damodaran data used

**Educational tooltips on every financial term:**
- "WACC = the minimum return investors expect. Lower WACC = higher valuation."
- "Beta = how volatile your sector is compared to the overall market."
- Triggered by `(?)` icon, shown as popover (desktop) or bottom sheet (mobile)

### Section 1: Valuation Summary
- Valuation range card (reuse from reveal)
- 10-method breakdown grouped by approach
- Confidence score with breakdown

### Section 2: Monte Carlo Distribution
- Full-width AreaChart with P10-P90 reference lines
- Animated draw on scroll entry
- Tooltip shows exact value at each percentile

### Section 3: Methodology (10 methods)
- Each method: METHOD_LABELS display name, value, confidence, approach color
- Expandable: inputs used, formula applied, Damodaran inputs
- METHOD_DESCRIPTIONS for educational context

### Section 4: Damodaran India Benchmarks
- Table: Beta, WACC, EV/Revenue, EV/EBITDA, Net Margin
- Comparison to sector average with arrows (above/below)
- Source attribution: "Damodaran Online, January 2026"

### Section 5: Comparable Indian Startups
- Top 5 matches with funding data
- Cards with similarity score, sector, stage, valuation

### Section 6: Listed Company Comparables
- Public market multiples for sector
- Illiquidity discount sensitivity table (20%/30%/40%)

### Section 7: IBC Downside Analysis
- Recovery range for sector
- Context from 3,952 corporate debtor outcomes
- Educational: "What IBC recovery means for your startup"

### Section 8: ESOP Valuation
- Black-Scholes calculation with sensitivity (conservative/base/optimistic)
- Interactive: adjust ESOP %, time to liquidity, see value change
- 3-scenario table

### Section 9: Cap Table Simulator (Interactive)
- Pre-round and post-round pie charts (Recharts)
- Drag sliders to adjust raise amount, dilution
- Toggle: pre-ESOP vs post-ESOP view
- Touch-friendly sliders on mobile (44px targets)

### Section 10: AI-Powered VC Analysis
- On-demand generation: "Generate AI Analysis" button
- Not auto-triggered (cost control)
- 4 sections: Investment Thesis, Key Risks, Valuation Opinion, Fundraise Playbook
- Retry: 4 attempts with 1s/4s/16s exponential backoff
- Loading state: skeleton with shimmer animation

### Section 11: Investor Matches
- Top 5 Indian VCs with match reasons
- Cards: name, type, sectors, stages, check size
- "Why this investor?" expandable

### Section 12: Recommendations
- Dynamic checklist based on confidence, stage, method results
- Actionable items: "Improve your gross margin to unlock higher DCF valuation"
- Priority-ordered

### Certified Report CTA (Bottom)
- Full-width glass card with gold border
- "Need a Legally Valid Valuation?" — Cabinet Grotesk
- "Get a certified Rule 11UA / FEMA report — Rs 14,999"
- 5 bullet points: Rule 11UA compliant, FEMA valid, 15-20 page report, Signed by registered valuer, Delivered within 48 hours
- Gold CTA button: "Get Certified Report — Rs 14,999"
- Connected to Razorpay checkout

---

## Screen 6: Standalone SEO Pages

### Cap Table Simulator (/cap-table)

- Full interactive cap table with SEO metadata
- Server component shell with client interactive component
- Same design language as report cap table section
- CTA: "Get your full valuation → includes cap table, ESOP, investor matching"

### ESOP Calculator (/esop-calculator)

- Full Black-Scholes calculator with SEO metadata
- Sector selector, valuation input, ESOP %, time to liquidity
- Sensitivity table (conservative/base/optimistic)
- CTA: "Get your full valuation → includes ESOP, cap table, 10-method analysis"

---

## Performance Budget

```
First Contentful Paint:  < 1.5s  (3G India connection)
Largest Contentful Paint: < 2.5s
Total JS bundle:          < 200kb gzipped
Fonts:                    4 fonts (Clash Display, Cabinet Grotesk, Satoshi, Space Grotesk)
                          WOFF2 only, font-display: swap, subset to latin
Images:                   Zero raster images (all SVG icons via Lucide, CSS effects)
Framer Motion:            Tree-shaken, ~8kb used features
Charts (Recharts):        Lazy-loaded, only on pages that need them
```

### Mobile-Specific Performance

- No particle effects (battery conservation)
- Simplified reveal animation
- Lazy-load report sections below fold
- Service worker for offline wizard state persistence

---

## Accessibility

- WCAG 2.1 AA compliance minimum
- All interactive elements: 44px minimum touch target
- Color contrast: 4.5:1 minimum for body text, 3:1 for large text
- `prefers-reduced-motion`: instant transitions, no animation
- `prefers-color-scheme`: dark mode is default, light mode support deferred to Phase 2
- Screen reader: all charts have `aria-label` with text description of data
- Keyboard: full wizard navigation via Tab/Enter/Escape
- Focus visible: gold outline ring on all focusable elements

---

## Interaction Patterns

### Bottom Sheets (Mobile)
- Sector selector opens as bottom sheet with search
- Method detail cards open as bottom sheets (swipe down to dismiss)
- TOC on report page opens as bottom sheet overlay
- All bottom sheets: Framer Motion `drag` with `dragConstraints`

### Haptic Feedback (Where Supported)
- Number count-up completion: light tap
- Step transition: light tap
- CTA press: medium tap
- Validation error: error pattern

### Offline Support
- Wizard inputs: Zustand + localStorage persistence
- Email gate offline: queue request, show local computation results
- Report page: works offline once loaded (all data in Zustand state)
- Sync queue processes when back online

### Pull-to-Refresh
- Report page supports pull-to-refresh for AI narrative re-fetch

### Orientation (Mobile)
- Charts in landscape: expand to full viewport
- Cap table pie chart gets larger in landscape
- Wizard: no orientation change behavior

---

## Backend & AI Integration Notes

The UI/UX spec layers on top of the existing functional spec. Backend requirements from the original spec remain unchanged:

- **10-method valuation engine** runs client-side in browser (zero API cost)
- **Monte Carlo simulation** (10,000 iterations) runs in Web Worker
- **AI narrative** via Claude API (claude-haiku-4-5) — server-side, on-demand only
- **Rate limits:** /api/capture: 10/IP/hour, /api/ai-analysis: 100/day
- **Supabase:** service_role for server routes, RLS for client access
- **Razorpay:** webhook with HMAC SHA256 signature verification
- **Damodaran data:** pre-processed JSON, loaded at build time
- **IBC recovery data:** from 190+ landmark cases, 3,952 corporate debtor outcomes

The UI/UX design adds:
- Framer Motion for all animations (8kb gzipped)
- 4 premium fonts from Fontshare (~40kb total WOFF2)
- Educational tooltip system (client-side, no API)
- Cinematic reveal sequence (client-side state machine)
- Bottom sheet components for mobile (Framer Motion drag)
- Scrollytelling intersection observer for report sections

---

## Implementation Notes

This UI/UX spec is designed as an **additive layer** on the existing 59-task implementation plan. It does NOT replace the functional spec or plan — it enhances every component with:

1. **Design tokens** (colors, typography, spacing) → applied via Tailwind config + CSS custom properties
2. **Motion patterns** (enter, exit, stagger, scroll) → Framer Motion wrappers around existing components
3. **Mobile adaptations** (bottom sheets, swipe, sticky CTAs) → responsive variants of existing components
4. **Educational content** (tooltips, benchmarks, context) → additional copy integrated into existing components

The existing plan's component structure (wizard steps, result cards, report sections) maps directly to this spec's screen designs.
