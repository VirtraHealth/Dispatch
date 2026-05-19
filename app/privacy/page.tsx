import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — My Daily Journal',
  description: 'How My Daily Journal collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          My Daily Journal
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
          <h1 className="font-serif text-4xl text-ink mb-3">Privacy Policy</h1>
          <p className="text-sm text-gray-400 font-sans">Effective date: May 19, 2026</p>
        </div>

        <div className="font-serif text-base text-ink leading-[1.85] space-y-8">

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              1. Who we are
            </h2>
            <p>
              My Daily Journal is a daily AI email digest service (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). My Daily Journal reads documents you
              select from Google Drive, synthesises them using Claude (Anthropic), and delivers a
              formatted digest to your inbox each morning. Questions about this policy can be sent
              to <a href="mailto:digest@mydailyjournal.net" className="text-indigo-600 underline underline-offset-2">digest@mydailyjournal.net</a>.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              2. Information we collect
            </h2>
            <p className="mb-3">
              We collect the minimum information required to deliver the service:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>
                <strong>Account information.</strong> Your name and email address, obtained via
                Google OAuth when you sign in.
              </li>
              <li>
                <strong>Google OAuth tokens.</strong> An access token and refresh token that allow
                us to read Google Drive files on your behalf. These tokens are stored in our
                database and refreshed automatically so the service keeps running between your
                visits.
              </li>
              <li>
                <strong>Drive selections and delivery preferences.</strong> Which Google Drive folders
                and individual documents you want My Daily Journal to read, what time you want your digest
                delivered, your timezone, and any personal instructions you give Claude.
              </li>
              <li>
                <strong>Journal entries.</strong> Notes you write directly in the My Daily Journal dashboard
                are stored in our database and included in your digest alongside your Drive documents.
              </li>
              <li>
                <strong>Digest history.</strong> The rendered HTML of each digest we send you is
                stored so you can review past digests in your dashboard.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              3. Google Drive — what we read and what we store
            </h2>
            <p className="mb-3">
              When generating your digest, our server temporarily reads the text content of
              the Google Drive folders and individual documents you have selected. This reading
              happens in memory, on our server, at digest-generation time. <strong>We never
              permanently store the raw contents of your Google Drive documents.</strong> The
              document text is passed directly to Claude (Anthropic&rsquo;s API) to produce the
              digest, and then discarded. Only the finished digest HTML is saved.
            </p>
            <p className="mb-3">
              For folders, we recursively read documents up to three levels deep, prioritising
              the most recently modified files. For individual documents, we read only the
              specific file you selected.
            </p>
            <p>
              We request <strong>read-only</strong> Drive access (<code className="font-sans text-sm bg-indigo-50 px-1.5 py-0.5 rounded">drive.readonly</code>).
              My Daily Journal cannot create, edit, move, or delete any of your files.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              4. Google OAuth scopes
            </h2>
            <p className="mb-3">We request the following Google OAuth scopes:</p>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>
                <code className="font-sans text-sm bg-indigo-50 px-1.5 py-0.5 rounded">openid</code>,{' '}
                <code className="font-sans text-sm bg-indigo-50 px-1.5 py-0.5 rounded">email</code>,{' '}
                <code className="font-sans text-sm bg-indigo-50 px-1.5 py-0.5 rounded">profile</code>{' '}
                — to identify your account and pre-fill your delivery email.
              </li>
              <li>
                <code className="font-sans text-sm bg-indigo-50 px-1.5 py-0.5 rounded">https://www.googleapis.com/auth/drive.readonly</code>{' '}
                — to read documents in the folders you select. Used only when generating your
                digest.
              </li>
            </ul>
            <p className="mt-3">
              My Daily Journal&rsquo;s use of information received from Google APIs adheres to the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline underline-offset-2"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              5. How we use your information
            </h2>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>To authenticate you and maintain your session.</li>
              <li>To read your selected Drive folders and documents and generate your daily digest.</li>
              <li>To store and include journal entries you write in the dashboard.</li>
              <li>To send the digest to your delivery email address.</li>
              <li>To display your digest history in your dashboard.</li>
              <li>To improve the service (aggregate, anonymised usage metrics only).</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal data. We do not use your Drive contents or digest
              content to train AI models. Your document content is sent to Anthropic solely to
              generate your digest under their{' '}
              <a
                href="https://www.anthropic.com/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline underline-offset-2"
              >
                privacy policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              6. Data storage and security
            </h2>
            <p>
              Your account data, OAuth tokens, preferences, and digest history are stored in a
              Supabase-hosted PostgreSQL database. Data is encrypted at rest and in transit.
              OAuth tokens are stored with restricted access and are used exclusively for the
              operations described in this policy.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              7. Third-party services
            </h2>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li><strong>Google</strong> — authentication and Drive read access.</li>
              <li><strong>Anthropic (Claude API)</strong> — AI synthesis of your digest content.</li>
              <li><strong>Resend</strong> — transactional email delivery.</li>
              <li><strong>Supabase</strong> — database hosting.</li>
              <li><strong>Vercel</strong> — application hosting and edge infrastructure.</li>
            </ul>
            <p className="mt-3">
              Each provider processes data only as necessary to deliver their service. We do not
              share your personal data with any other third parties.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              8. Revoking access
            </h2>
            <p className="mb-3">
              You can revoke My Daily Journal&rsquo;s access to your Google account at any time from your{' '}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline underline-offset-2"
              >
                Google Account permissions page
              </a>
              . Revoking access stops all future digests immediately.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              9. Deleting your account and data
            </h2>
            <p>
              To delete your account and all associated data (including OAuth tokens, settings,
              and digest history), email us at{' '}
              <a href="mailto:digest@mydailyjournal.net" className="text-indigo-600 underline underline-offset-2">
                digest@mydailyjournal.net
              </a>{' '}
              with the subject line &ldquo;Delete my account&rdquo; from the email address
              associated with your My Daily Journal account. We will complete deletion within 30 days and
              confirm by email.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              10. Children&rsquo;s privacy
            </h2>
            <p>
              My Daily Journal is not directed to children under the age of 13. We do not knowingly
              collect personal information from children under 13. If you believe a child has
              provided us with personal information, please contact us and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              11. Changes to this policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the
              effective date above. Continued use of My Daily Journal after changes constitutes acceptance
              of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-50">
              12. Contact
            </h2>
            <p>
              For any questions or requests regarding this Privacy Policy, please contact us at{' '}
              <a href="mailto:digest@mydailyjournal.net" className="text-indigo-600 underline underline-offset-2">
                digest@mydailyjournal.net
              </a>
              .
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-sans text-xs font-bold tracking-widest uppercase text-gray-300">My Daily Journal</span>
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
