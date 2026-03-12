import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How First Unicorn Startup collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-[oklch(0.14_0.015_250)] py-16 px-6">
      <article className="max-w-3xl mx-auto prose-invert">
        <p className="text-[11px] font-semibold text-[oklch(0.72_0.17_162)] uppercase tracking-[0.2em] mb-4">
          Legal
        </p>
        <h1 className="font-heading text-3xl text-[oklch(0.95_0.002_250)] mb-8">
          Privacy Policy
        </h1>
        <p className="text-[11px] text-[oklch(0.45_0.01_250)] mb-10">
          Last updated: March 12, 2026
        </p>

        <div className="space-y-8 text-sm text-[oklch(0.60_0.01_250)] leading-relaxed">
          <Section title="1. Information We Collect">
            <p>
              <strong className="text-[oklch(0.75_0.005_80)]">Information you provide:</strong> When you use our valuation tools, we collect the company data you enter (revenue, growth rate, sector, team size, etc.), your email address, and valuation purpose selection.
            </p>
            <p>
              <strong className="text-[oklch(0.75_0.005_80)]">Automatically collected:</strong> IP address (for rate limiting only), browser type, and page visit timestamps. We do not use third-party tracking cookies.
            </p>
            <p>
              <strong className="text-[oklch(0.75_0.005_80)]">Payment data:</strong> Payment processing is handled entirely by Razorpay. We never store your card number, CVV, or banking credentials on our servers.
            </p>
          </Section>

          <Section title="2. How We Use Your Data">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Generate your startup valuation report</li>
              <li>Send you your report link via email</li>
              <li>Process payments for premium reports</li>
              <li>Rate limiting to prevent abuse (IP-based, not stored long-term)</li>
              <li>Improve our valuation models with anonymized, aggregated data</li>
            </ul>
          </Section>

          <Section title="3. Data Storage &amp; Security">
            <p>
              Your data is stored on Supabase (hosted on AWS infrastructure) with Row-Level Security policies. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We retain your valuation data for 2 years to allow report access.
            </p>
          </Section>

          <Section title="4. Data Sharing">
            <p>
              We do not sell, rent, or share your personal data with third parties except:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-[oklch(0.75_0.005_80)]">Razorpay</strong> — for payment processing</li>
              <li><strong className="text-[oklch(0.75_0.005_80)]">Anthropic (Claude AI)</strong> — for AI-generated narrative analysis (company data is sent without your email)</li>
              <li><strong className="text-[oklch(0.75_0.005_80)]">Legal compliance</strong> — if required by Indian law or court order</li>
            </ul>
          </Section>

          <Section title="5. Your Rights">
            <p>
              You may request access to, correction of, or deletion of your personal data at any time by emailing us. Under the Digital Personal Data Protection Act, 2023 (DPDPA), you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request erasure of your data</li>
              <li>Withdraw consent for data processing</li>
              <li>Nominate another person to exercise rights on your behalf</li>
            </ul>
          </Section>

          <Section title="6. Cookies">
            <p>
              We use only essential cookies for session management (localStorage for wizard progress). We do not use advertising or analytics cookies.
            </p>
          </Section>

          <Section title="7. Contact">
            <p>
              For privacy-related inquiries, contact us at{' '}
              <a href="mailto:privacy@firstunicornstartup.com" className="text-[oklch(0.72_0.17_162)] hover:underline">
                privacy@firstunicornstartup.com
              </a>
            </p>
          </Section>
        </div>
      </article>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-heading text-lg text-[oklch(0.95_0.002_250)] mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
