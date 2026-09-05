import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Terms of Service</h1>
        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6 text-sm">
          <p className="text-muted-foreground">Last updated: September 5, 2026</p>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using our service, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, do not use our service. These terms constitute
              a legally binding agreement between you and us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">2. Description of Service</h2>
            <p className="text-muted-foreground">
              Freelancer OS provides a business management platform for freelancers and agencies,
              including tools for client management, project tracking, invoicing, time tracking,
              and related features. We reserve the right to modify, suspend, or discontinue
              any part of the service at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">3. Account Registration</h2>
            <p className="text-muted-foreground">
              To use our service, you must create an account with accurate information. You are
              responsible for maintaining the confidentiality of your login credentials and for all
              activities under your account. You must be at least 18 years old to create an account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">4. Acceptable Use</h2>
            <p className="text-muted-foreground">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Use the service for any illegal purpose</li>
              <li>Violate any laws or regulations</li>
              <li>Attempt to gain unauthorized access to the service</li>
              <li>Interfere with or disrupt the service</li>
              <li>Use automated tools to scrape or extract data</li>
              <li>Resell or redistribute the service without permission</li>
              <li>Upload viruses or malicious code</li>
              <li>Harass, abuse, or harm other users</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">5. Fees and Payment</h2>
            <p className="text-muted-foreground">
              Access to certain features requires a paid subscription. All fees are charged
              in advance and are non-refundable except as required by law. We reserve the
              right to change pricing with 30 days notice. Failed payments may result in
              service suspension.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">6. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The service, including its design, features, and content, is owned by us and
              protected by intellectual property laws. You retain ownership of any data you
              input into the service. We may use your data to operate and improve the service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">7. Data and Content</h2>
            <p className="text-muted-foreground">
              You are solely responsible for the content you create and data you input while
              using the service. You represent that you have all necessary rights to the data
              you provide. We do not claim ownership of your data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">8. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED,
              SECURE, OR ERROR-FREE. WE DISCLAIM ALL WARRANTIES INCLUDING MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">9. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS,
              REVENUE, DATA, OR GOODWILL, ARISING OUT OF OR RELATED TO THE SERVICE.
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNTS PAID BY YOU IN THE 12 MONTHS
              PRECEDING THE CLAIM.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">10. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify, defend, and hold us harmless from any claims, damages,
              losses, or expenses (including legal fees) arising out of your use of the service,
              your violation of these terms, or your violation of any rights of a third party.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">11. Account Termination</h2>
            <p className="text-muted-foreground">
              You may terminate your account at any time through the service settings. We may
              suspend or terminate your account if you violate these terms or engage in
              prohibited conduct. Upon termination, your right to use the service ceases
              immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">12. Modifications to Terms</h2>
            <p className="text-muted-foreground">
              We may modify these terms at any time. We will notify you of material changes
              by posting the updated terms on this page with a new "Last updated" date.
              Your continued use after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">13. Governing Law</h2>
            <p className="text-muted-foreground">
              These terms shall be governed by and construed in accordance with the laws of
              the jurisdiction in which our company is registered, without regard to its
              conflict of law provisions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">14. Dispute Resolution</h2>
            <p className="text-muted-foreground">
              Any disputes arising from these terms or your use of the service shall first
              be attempted to be resolved through good-faith negotiation. If unable to resolve,
              disputes shall be subject to binding arbitration or the exclusive jurisdiction
              of the courts in our registered jurisdiction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">15. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have questions about these Terms of Service, contact us at:
              <br />
              <span className="text-foreground">support@yourdomain.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
