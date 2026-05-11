import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Dispatch',
  description: 'Terms of Service for using the Dispatch daily AI digest.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Dispatch
        </Link>
        <Link
          href="/"
          className="text-sm font-sans text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to home
        </Link>
      </nav>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-6 pt-12 pb-24">
        <div className="mb-10">
          <div className="text-xs font-sans font-semibold tracking-widest uppercase text-indigo-600 mb-4">
            Legal
          </div>
          <h1 className="font-serif text-4xl text-ink mb-3">Terms of Service</h1>
          <p className="text-sm text-gray-400 font-sans">Effective date: May 11, 2026</p>
        </div>

        <div className="font-serif text-base text-ink leading-[1.85] space-y-8">

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              1. Agreement to terms
            </h2>
            <p>
              By accessing or using Dispatch (&ldquo;the Service&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), you agree to be bound by these
              Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not use
              the Service. Questions can be directed to{' '}
              <a href="mailto:dispatch@mydailyjournal.net" className="text-indigo-600 underline underline-offset-2">
                dispatch@mydailyjournal.net
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              2. Description of service
            </h2>
            <p>
              Dispatch is a daily AI email digest service. It reads documents from the Google
              Drive folders you select, synthesises them using an AI model (Claude by Anthropic),
              and sends a formatted digest to your email address on a schedule you configure.
              The Service requires a Google account and grants Dispatch read-only access to your
              selected Drive folders and the ability to send email via your Gmail account solely
              for digest delivery.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              3. Eligibility
            </h2>
            <p>
              You must be at least 13 years old to use the Service. By using Dispatch, you
              represent that you meet this requirement and that any information you provide is
              accurate and complete.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              4. User responsibilities
            </h2>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>
                You are responsible for the content of the documents you make available to
                Dispatch. Do not point Dispatch at folders containing sensitive personal data
                belonging to others, confidential business information you are not authorised to
                share, or any content that is illegal or violates third-party rights.
              </li>
              <li>
                You agree not to use the Service to circumvent, disable, or interfere with
                security features, or to attempt to gain unauthorised access to any part of the
                Service or its infrastructure.
              </li>
              <li>
                You agree not to misuse the Gmail send permission. Dispatch uses it exclusively
                to deliver your digests. You must not attempt to trigger sending to addresses
                other than your own delivery email.
              </li>
              <li>
                You are responsible for maintaining the security of your Google account and for
                any activity that occurs under your Dispatch account.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              5. Intellectual property
            </h2>
            <p>
              You retain all ownership rights to the documents in your Google Drive. The digest
              content generated by Dispatch is produced from your documents and delivered to you.
              The Dispatch application, branding, and underlying software are owned by Dispatch and may not be copied, modified, or redistributed without written permission.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              6. Privacy
            </h2>
            <p>
              Your use of the Service is also governed by our{' '}
              <Link href="/privacy" className="text-indigo-600 underline underline-offset-2">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              7. Service availability and modifications
            </h2>
            <p>
              We reserve the right to modify, suspend, or discontinue the Service (or any part of
              it) at any time, with or without notice. We will make reasonable efforts to notify
              users of material changes. We are not liable for any modification, suspension, or
              discontinuation of the Service.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              8. Disclaimer of warranties
            </h2>
            <p>
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
              WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
              NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
              ERROR-FREE, OR FREE OF HARMFUL COMPONENTS, OR THAT ANY CONTENT GENERATED WILL
              BE ACCURATE OR COMPLETE.
            </p>
            <p className="mt-3">
              The AI-generated digest content is synthesised from your documents and is provided
              for informational and reflective purposes only. It does not constitute professional
              advice of any kind.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              9. Limitation of liability
            </h2>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, DISPATCH SHALL NOT BE
              LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
              OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR
              ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR
              RELATED TO YOUR USE OF OR INABILITY TO USE THE SERVICE.
            </p>
            <p className="mt-3">
              IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR
              RELATED TO THE SERVICE EXCEED THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING
              THE CLAIM, OR ONE HUNDRED US DOLLARS ($100), WHICHEVER IS GREATER.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              10. Account termination
            </h2>
            <p>
              You may stop using the Service at any time. To delete your account and all
              associated data, email{' '}
              <a href="mailto:dispatch@mydailyjournal.net" className="text-indigo-600 underline underline-offset-2">
                dispatch@mydailyjournal.net
              </a>{' '}
              with &ldquo;Delete my account&rdquo; as the subject. We may also suspend or terminate
              your access if you violate these Terms or if we determine, in our sole discretion,
              that your use of the Service poses a risk to us or other users. We will provide
              notice where reasonably practicable.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              11. Governing law and disputes
            </h2>
            <p>
              These Terms are governed by the laws of the State of California, United States,
              without regard to its conflict-of-law provisions. Any disputes arising out of or
              relating to these Terms or the Service shall be resolved exclusively in the state or
              federal courts located in California, and you consent to personal jurisdiction in
              those courts.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              12. Changes to these terms
            </h2>
            <p>
              We may update these Terms from time to time. When we do, we will update the
              effective date above. Material changes will be communicated to registered users by
              email. Continued use of the Service after changes take effect constitutes acceptance
              of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              13. Contact
            </h2>
            <p>
              For questions about these Terms, please contact us at{' '}
              <a href="mailto:dispatch@mydailyjournal.net" className="text-indigo-600 underline underline-offset-2">
                dispatch@mydailyjournal.net
              </a>
              .
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-sans text-xs font-bold tracking-widest uppercase text-gray-300">Dispatch</span>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-xs text-gray-400 font-sans hover:text-gray-600 transition-colors">About</Link>
            <Link href="/privacy" className="text-xs text-gray-400 font-sans hover:text-gray-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-400 font-sans hover:text-gray-600 transition-colors">Terms of Service</Link>
          </div>
          <p className="text-xs text-gray-400 font-sans">Your thinking, amplified.</p>
        </div>
      </footer>
    </div>
  )
}
