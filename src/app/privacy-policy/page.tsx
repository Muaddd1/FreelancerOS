import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6 text-sm">
          <p className="text-muted-foreground">Last updated: September 5, 2026</p>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly, including: name, email address, and any business
              information you enter while using our service. We also collect usage data such as features
              used, timestamps, and device information to improve our service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">3. Data Storage and Security</h2>
            <p className="text-muted-foreground">
              Your data is stored securely using industry-standard encryption. We use third-party
              service providers who are compliant with data protection standards. Your data may be
              stored and processed in the United States or other countries where our service
              providers operate.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">4. Cookies and Tracking</h2>
            <p className="text-muted-foreground">
              We use essential cookies to keep you logged in and remember your preferences.
              We may use analytics tools to understand how our service is used. You can control
              cookie preferences through your browser settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">5. Data Sharing</h2>
            <p className="text-muted-foreground">
              We do not sell your personal information. We may share data with: service providers
              who assist in operating our service (hosting, payment processing), legal authorities
              when required by law, or in connection with a business transfer (merger, acquisition).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">6. Your Rights</h2>
            <p className="text-muted-foreground">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">7. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your data for as long as your account is active or as needed to provide
              services. If you delete your account, we will delete your data within 30 days,
              except where retention is required by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">8. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our service is not intended for users under 18. We do not knowingly collect
              information from children. If you believe a child has provided us with personal
              data, please contact us immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">9. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this policy periodically. We will notify you of material changes
              by posting the new policy on this page and updating the "Last updated" date.
              Your continued use after changes constitutes acceptance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">10. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, contact us at:
              <br />
              <span className="text-foreground">support@yourdomain.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
