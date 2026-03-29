import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund policy for First Unicorn Startup valuation platform.',
}

export default function RefundPolicyPage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-[oklch(0.985 0.002 260)] py-16 px-6">
      <article className="max-w-3xl mx-auto prose-invert">
        <p className="text-[11px] font-semibold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em] mb-4">
          Legal
        </p>
        <h1 className="font-heading text-3xl text-[oklch(0.15 0.02 260)] mb-8">
          Refund Policy
        </h1>
        <p className="text-[11px] text-[oklch(0.45_0.01_250)] mb-10">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="space-y-8 text-sm text-[oklch(0.45 0.01 260)] leading-relaxed">
          <Section title="1. Final Sale Policy">
            <p>
              At First Unicorn Startup, we provide digital, instant valuation reports based on complex algorithms and proprietary data. Due to the nature of digital products and the immediate delivery of service, <strong className="text-[oklch(0.62 0.22 330)]">all sales are final.</strong>
            </p>
            <p>
              We do not offer refunds, returns, or exchanges for any valuation reports once the payment is completed and the report is generated.
            </p>
          </Section>

          <Section title="2. Accuracy and Responsibility">
            <p>
              Before making a payment, please ensure that all business data entered into the platform is accurate. The valuation results are highly dependent on user inputs. We do not provide refunds for reports generated using incorrect or incomplete data provided by the user.
            </p>
          </Section>

          <Section title="3. Exceptional Circumstances">
            <p>
              In extreme cases where a technical error prevents the generation of a report despite a successful payment, please contact our support team. We will ensure your report is delivered or resolve the technical issue. If we are unable to provide the service due to a technical failure on our end, we may issue a manual refund at our sole discretion.
            </p>
          </Section>

          <Section title="4. Contact Information">
            <p>
              For any questions regarding our refund policy, please contact us at{' '}
              <a href="mailto:support@firstunicornstartup.com" className="text-[oklch(0.62 0.22 330)] hover:underline">
                support@firstunicornstartup.com
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
      <h2 className="font-heading text-lg text-[oklch(0.15 0.02 260)] mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
