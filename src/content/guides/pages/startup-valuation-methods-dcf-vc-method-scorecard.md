---
title: 'Startup Valuation Methods: DCF vs VC Method vs Scorecard'
category: Startup Valuation
excerpt: >-
  Compare the three primary startup valuation methods — DCF, VC Method, and
  Scorecard — to understand when each applies and how Indian investors use them
  in practice.
author: FirstUnicorn Editorial Team
lastUpdated: '2024-03-19'
image: /images/guides/valuation_methods.png
slug: startup-valuation-methods-dcf-vc-method-scorecard
readTime: 15 min
---

> **Expert Summary:** There is no universally correct startup valuation method — the right method depends on your stage, available data, and the regulatory context of your fundraise. In India, the DCF method is mandated for Rule 11UA compliance, the VC method is what most investors actually use internally, and the Scorecard method bridges the gap for pre-revenue companies. Founders who understand all three can navigate valuation conversations with investors from a position of genuine sophistication rather than guesswork.

## Why Multiple Valuation Methods Exist

Valuing a startup is fundamentally different from valuing a mature business. A traditional company has historical earnings, comparable public market peers, and predictable cash flows. A startup — particularly an early-stage one — has none of these.

Each valuation method exists to answer a different version of the same question: *What is this company worth today, given that most of its value lies in uncertain future performance?*

The three core methods are:
- **DCF (Discounted Cash Flow)**: Value based on projected future cash flows
- **VC Method**: Value based on projected exit and required investor return
- **Scorecard Method**: Value based on qualitative benchmarking against comparable startups

---

## Method 1: Discounted Cash Flow (DCF)

### What It Is

The **DCF method** calculates the present value of a startup's projected future free cash flows, discounted at a rate that reflects the risk that those cash flows will materialise.

**Core formula:**
> Intrinsic Value = Σ [FCF_t ÷ (1 + r)^t] + Terminal Value ÷ (1 + r)^n

Where:
- **FCF_t** = Free Cash Flow in year t
- **r** = Discount rate (risk-adjusted)
- **Terminal Value** = Value of all cash flows beyond the projection period

### Terminal Value Calculation
> Terminal Value = FCF_n × (1 + g) ÷ (r − g)

Where **g** is the long-term sustainable growth rate (typically 5–8% for Indian businesses).

### Discount Rates for Indian Startups

| Stage | Discount Rate Range |
|---|---|
| Pre-revenue | 60–80% |
| Early revenue (seed) | 40–60% |
| Growth stage (Series A+) | 25–40% |
| Mature growth | 15–25% |

These rates reflect the **probability-adjusted risk** of early-stage businesses — at pre-revenue, the majority of startups do not survive to generate the projected cash flows.

### When DCF Is Used in India

**Regulatory mandate:** Rule 11UA of the Income Tax Rules requires DCF-based Fair Market Value certification by a SEBI-registered Merchant Banker when:
- Issuing shares to non-residents
- Defending against Angel Tax (Section 56(2)(viib)) claims
- Allotting shares in any closely held company above FMV

**Limitation of DCF for early-stage startups:** DCF is only as credible as the cash flow projections feeding it. At pre-revenue stage, projections are speculative — two analysts using slightly different assumptions can produce valuations that differ by 300%. This is why DCF is mandated for regulatory purposes but rarely used as the primary commercial negotiation tool at early stages.

---

## Method 2: The VC Method

### What It Is

The **VC Method** is the reverse of DCF. Instead of projecting forward and discounting back, it starts at the expected exit and works backwards to determine what entry valuation allows the investor to achieve their target return.

**Core formula:**
> Post-Money Valuation = Exit Value ÷ Required Return Multiple
> Pre-Money Valuation = Post-Money Valuation − Investment Amount

### Step-by-Step VC Method Calculation

**Step 1:** Estimate exit value
- What is a realistic acquisition or IPO valuation for this company in 5–7 years?
- Use revenue multiple of comparable exits: Exit Value = Projected ARR at Year 5 × Exit Multiple

**Step 2:** Apply required return multiple
- Seed stage investors typically require 10x–15x
- Series A investors typically require 5x–8x

**Step 3:** Calculate post-money valuation
- Post-Money = Exit Value ÷ Required Multiple

**Step 4:** Adjust for dilution in future rounds
- A company that raises seed, Series A, and Series B will dilute seed investors at each round
- Investors build this in: Dilution-adjusted post-money = Post-Money ÷ (1 − future dilution %)

**Example:**

| Variable | Value |
|---|---|
| Projected ARR at Year 5 | ₹100 Cr |
| Exit multiple (SaaS, India) | 5x ARR |
| Projected exit value | ₹500 Cr |
| Required return (10x) | ÷ 10 |
| Post-money valuation | ₹50 Cr |
| Investment amount | ₹5 Cr |
| **Pre-money valuation** | **₹45 Cr** |
| Future dilution adjustment (40%) | ÷ 0.60 |
| **Dilution-adjusted pre-money** | **₹27 Cr** |

This means the investor can justify a pre-money valuation of up to ₹27 Cr on this deal.

### When Investors Use the VC Method

The VC Method is the **primary internal tool** for most Indian seed and Series A investors. It is used to:
- Set the maximum valuation they can justify on any deal
- Evaluate whether a founder's asking valuation is realistic
- Structure the investment thesis for the investment committee

---

## Method 3: The Scorecard Method

### What It Is

The **Scorecard Method** compares a startup to a reference set of similar companies at the same stage and adjusts from a benchmark valuation based on relative strengths and weaknesses across defined criteria.

**Formula:**
> Startup Valuation = Benchmark Average Valuation × Sum of Weighted Scores

### Scorecard Criteria and Weights

| Criterion | Weight |
|---|---|
| Strength of founding team | 30% |
| Market size and opportunity | 25% |
| Product and technology | 15% |
| Competitive environment | 10% |
| Sales and marketing capability | 10% |
| Need for additional capital | 5% |
| Other factors | 5% |

**Scoring scale:** Each criterion is scored from 0% (well below average) to 150% (well above average), with 100% representing the benchmark.

**Example:**

| Criterion | Weight | Score | Weighted Score |
|---|---|---|---|
| Founding team | 30% | 130% | 39% |
| Market size | 25% | 110% | 27.5% |
| Product | 15% | 100% | 15% |
| Competition | 10% | 90% | 9% |
| Sales | 10% | 80% | 8% |
| Capital need | 5% | 100% | 5% |
| Other | 5% | 100% | 5% |
| **Total** | | | **108.5%** |

If the benchmark average pre-seed valuation is ₹4 Cr → **Indicated valuation = ₹4.34 Cr**

### When the Scorecard Method Is Used

- Pre-revenue startups where DCF is not meaningful
- Angel investors and early-stage funds making quick assessments
- As a sanity check alongside the VC method

---

## Comparison: Which Method to Use When

| Scenario | Recommended Method | Reason |
|---|---|---|
| Pre-revenue startup | Scorecard + Berkus | No cash flows to discount |
| Seed stage with early revenue | VC Method + Revenue Multiple | Exit-oriented; investor reality |
| Rule 11UA compliance | DCF (Merchant Banker certified) | Regulatory mandate |
| Series A and beyond | DCF + Comparables | Sufficient data for modelling |
| Angel Tax dispute | DCF (Rule 11UA) | Statutory requirement |
| Founder's negotiation anchor | VC Method | Speaks investor language |

---

## The Indian Regulatory Layer: Why You Need DCF Regardless of Stage

Even if you primarily use the VC Method or Scorecard for commercial negotiation, **you cannot avoid DCF for Indian regulatory compliance.** Here is why:

- **Section 56(2)(viib)** taxes the premium above FMV as income when shares are issued to residents at above-FMV prices
- **Rule 11UA** defines FMV using either NAV or DCF — founders must choose DCF (NAV is typically lower and unfavourable for early-stage companies)
- Only a **SEBI-registered Merchant Banker** can certify the DCF valuation for Rule 11UA purposes
- **DPIIT recognition** exempts you from Angel Tax entirely — making this the cleanest solution

---

## Frequently Asked Questions

### Which startup valuation method is most accurate?

No single method is most accurate — each measures a different aspect of value. The most defensible approach for Indian startups is to triangulate across two or three methods and present the range and rationale. For regulatory compliance, DCF certified by a Merchant Banker under Rule 11UA is mandatory regardless of which commercial method you use.

### Why do VCs use the VC Method instead of DCF?

DCF requires detailed cash flow projections that are largely speculative at early stage. The VC Method is simpler, more transparent, and aligns directly with how venture funds measure success — through exit multiples. Investors use it because it answers the question they actually care about: "Can I make my required return on this deal?"

### What discount rate should I use for an Indian startup DCF?

Discount rates for Indian startups range from 25% to 80% depending on stage. Pre-revenue startups typically use 60–80% to reflect the high probability that projected cash flows will not materialise. Growth-stage companies with 2+ years of revenue history use 25–40%. These rates are significantly higher than those applied to mature businesses due to the illiquidity premium and execution risk inherent in early-stage investing.

### Can I use the Scorecard Method for my Rule 11UA compliance valuation?

No. Rule 11UA of the Income Tax Rules specifically requires either the NAV method or the DCF method, certified by a SEBI-registered Merchant Banker. The Scorecard Method has no regulatory standing for tax compliance purposes in India.

### How do I reconcile different valuations from different methods?

When different methods produce different valuations, take the median or a weighted average, with weights assigned based on the applicability of each method to your specific stage. Document your methodology — investors and the tax authorities may both ask you to justify your number.

---

**Need help running a multi-method valuation for your startup and building a defensible number for your next round?**

[Message an Expert on WhatsApp](https://wa.me/919667744073?text=Hi%2C%20I%20just%20read%20your%20guide%20on%20Startup%20Valuation%20Methods%20DCF%20vs%20VC%20Method%20vs%20Scorecard%20and%20had%20a%20question...)
