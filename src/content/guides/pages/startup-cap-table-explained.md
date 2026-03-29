---
title: Startup Cap Table Explained
category: Cap Table & ESOP
excerpt: >-
  Understand what a startup cap table is, how to build one correctly, and how it
  evolves through funding rounds — with Indian regulatory compliance
  requirements included.
author: FirstUnicorn Editorial Team
lastUpdated: '2024-03-19'
image: /images/guides/captable.png
slug: startup-cap-table-explained
readTime: 12 min
---

> **Expert Summary:** A cap table is the single most important financial document in your startup — more immediately consequential than your P&L, because it determines who owns what, who controls what, and how exit proceeds are distributed. In India, it also carries direct regulatory obligations: every share issuance must be backed by Board resolutions and filed with the MCA via form PAS-3. Founders who do not maintain a clean, accurate cap table discover the consequences at the worst possible time — during a due diligence process that has already generated investor interest.

## What Is a Cap Table?

A **cap table (capitalisation table)** is a detailed record of a startup's ownership structure — who owns shares, how many, at what price, and under what terms.

At its most basic, it answers three questions:
- **Who owns the company?** (Shareholders and their ownership percentages)
- **How much is each ownership stake worth?** (Based on current or exit valuation)
- **How will ownership change after the next funding round?** (Dilution modelling)

---

## What a Cap Table Contains

### Basic Elements

| Column | What It Represents |
|---|---|
| Shareholder Name | Individual, entity, or fund |
| Share Class | Equity, preference, ESOP pool |
| Number of Shares | Absolute share count |
| % Ownership | Shares ÷ Total fully diluted shares |
| Price Per Share | At what price shares were issued |
| Total Investment | Price × shares (for investors) |
| Round | Which funding round |

### Advanced Elements (Post-First Round)

- **Liquidation preferences**: Do preference shareholders get paid before equity holders at exit?
- **Anti-dilution provisions**: How are existing shareholders protected if a future round is at a lower valuation?
- **Conversion rights**: When do preference shares convert to equity (typically at IPO)?
- **Pro-rata rights**: Does an investor have the right to participate in future rounds to maintain their ownership?
- **ESOP pool**: Reserved shares for employee stock options, shown as unissued but part of the fully diluted count

---

## Fully Diluted vs Issued Shares: The Critical Distinction

**Issued shares** = Shares currently outstanding and owned by identifiable shareholders.

**Fully diluted shares** = Issued shares + all shares that could be issued (unexercised options, convertible note conversions, warrants).

**Always use fully diluted share count when calculating ownership percentages.** Using issued-only shares overstates your percentage and will mismatch with how investors calculate dilution.

**Example:**

| Component | Shares |
|---|---|
| Founder A | 4,000,000 |
| Founder B | 3,500,000 |
| Angel Investor | 500,000 |
| ESOP Pool (unissued) | 1,000,000 |
| Convertible Note (not yet converted) | 500,000 |
| **Total Fully Diluted** | **9,500,000** |

Founder A's ownership on a fully diluted basis: 4,000,000 ÷ 9,500,000 = **42.1%**, not 44.4% (which you would get using only issued shares).

---

## How the Cap Table Evolves Through Funding Rounds

### At Incorporation

Two founders split 100% of the company. Typical founding split:
- **50/50**: Equal split — cleanest for equal contribution but requires strong conflict resolution mechanisms
- **60/40 or 70/30**: Reflects a lead founder/co-founder dynamic
- The split should reflect long-term value contribution, not short-term cash input

### After Pre-Seed / Angel Round

An ESOP pool is typically created at this stage (10–15% of fully diluted shares). The angel investor receives newly issued shares, diluting all existing shareholders.

**Pre-money and post-money dilution example:**

| | Pre-Round | Post-Round (10% angel, ₹50L at ₹5 Cr pre-money) |
|---|---|---|
| Founder A | 50% | 45% |
| Founder B | 50% | 45% |
| Angel | 0% | 10% |
| **Total** | **100%** | **100%** |

### After Seed Round

A new ESOP pool top-up may be required (investors often mandate expanding the ESOP pool as part of seed terms, which happens pre-money — meaning it dilutes founders, not the new investor).

### After Series A and Beyond

Preference shares with liquidation preferences, anti-dilution provisions, and board rights are introduced. The cap table becomes a multi-class structure that must be carefully modelled to understand the real economics at various exit scenarios.

---

## Indian Regulatory Requirements for Cap Table Maintenance

### Form PAS-3 (Return of Allotment)

Every time new shares are issued, the company must file **Form PAS-3** with the MCA (Ministry of Corporate Affairs) within **30 days** of allotment. This includes:
- New share issuances (funding rounds)
- ESOP exercises
- Conversion of convertible instruments

**Penalty for late filing:** ₹200 per day of delay. Unfiled allotments discovered in due diligence are a serious compliance issue requiring legal remediation.

### Register of Members

Section 88 of the Companies Act, 2013 mandates maintaining a **Register of Members** — a legal record of all shareholders, their addresses, share counts, and allotment dates. This must be updated within 7 days of each allotment.

### Board Resolutions

Every share allotment must be backed by a **Board Resolution** (and in some cases, a Special Resolution approved by shareholders). A share allotment without a Board resolution is legally invalid, regardless of whether payment was received.

### Rule 11UA Compliance

When issuing shares at a premium to Face Value, the issue price must be defensible under **Rule 11UA** (Fair Market Value). For DPIIT-recognised startups, this is primarily relevant for maintaining Angel Tax exemption.

---

## ESOP Pool in the Cap Table

**Employee Stock Options (ESOPs)** are reserved but unissued shares set aside for employee grants. In the cap table:
- The ESOP pool appears as a block of reserved shares
- Ungranted options show as the pool's "unused" portion
- Granted but unvested options show as pending
- Granted, vested, and exercised options convert to issued equity

**Standard ESOP pool size by stage:**

| Stage | ESOP Pool (% of Fully Diluted) |
|---|---|
| Pre-seed | 5–10% |
| Post-seed | 10–15% |
| Post-Series A | 15–20% |

---

## Cap Table Tools Indian Startups Use

- **Carta** — global standard; full compliance, waterfall modelling; international pricing
- **Ledgy** — European alternative with India support; more cost-effective
- **Trica** — India-built cap table software with MCA compliance features; recommended for Indian startups
- **Excel/Google Sheets** — acceptable at pre-seed; becomes error-prone as complexity increases post-seed

---

## Frequently Asked Questions

### What is a cap table and why is it important for startups?

A cap table is a record of your startup's full ownership structure — who owns shares, how many, and under what terms. It is important because it determines founder dilution at every funding round, governs how exit proceeds are distributed, and is required documentation for every investor due diligence process. An inaccurate or poorly maintained cap table can delay or kill funding deals.

### How do I create a cap table for my startup in India?

Start with a spreadsheet listing all shareholders, their share classes, share counts, and ownership percentages on a fully diluted basis. Add columns for price per share and total investment. As you raise rounds, model the pre-money and post-money dilution impact before issuing shares. Ensure every allotment is backed by a Board resolution and filed via Form PAS-3 within 30 days.

### When should I create an ESOP pool?

Create an ESOP pool before your first external funding round — typically at pre-seed or seed stage. Most investors will require a 10–15% ESOP pool as a condition of their investment. If you create the pool pre-investment (before the new money comes in), it dilutes existing shareholders (founders) rather than the new investor — this is standard practice but founders should model the dilution impact before agreeing.

### How does a funding round change the cap table?

A funding round introduces new shareholders (the investors) at a defined price per share. Existing shareholders are diluted proportionally — their absolute share count stays the same, but their percentage ownership decreases because the total share count increases. The pre-money valuation divided by the post-round total share count gives you the price per share at which new shares are issued.

### What happens to the cap table if a startup does a down round?

A down round — where new shares are issued at a lower price than the previous round — triggers anti-dilution protections for investors who negotiated them. Under a weighted average anti-dilution clause (the Indian standard), existing preference shareholders receive additional shares to compensate for the valuation decrease, which further dilutes founders. Down rounds are damaging to the cap table and to founder morale — the best mitigation is raising enough capital to avoid them.

---

**Need help setting up and maintaining a compliant cap table for your startup?**

[Message an Expert on WhatsApp](https://wa.me/919667744073?text=Hi%2C%20I%20just%20read%20your%20guide%20on%20Startup%20Cap%20Table%20Explained%20and%20had%20a%20question...)
