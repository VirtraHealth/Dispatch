import { Resend } from 'resend'
import { parseBodyToHtml } from '@/lib/parse-digest'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendDigestEmail({
  to,
  subject,
  body,
  docNames,
  today,
  digestId,
}: {
  to: string
  subject: string
  body: string
  docNames: string[]
  today: string
  digestId?: string
}) {
  const html = buildEmailHtml({ body, docNames, today })

  await resend.emails.send({
    from: 'My Daily Journal <digest@mydailyjournal.net>',
    to,
    subject,
    html,
    ...(digestId ? { tags: [{ name: 'digest_id', value: digestId }] } : {}),
  })
}

export async function sendContextNudgeEmail({ to, nudgeNumber = 1 }: { to: string; nudgeNumber?: number }) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
  const settingsUrl = `${process.env.NEXT_PUBLIC_APP_URL}/settings`

  const isFirst = nudgeNumber === 1

  const subject = isFirst
    ? 'Your My Daily Journal digest is almost ready'
    : 'Your morning digest is waiting on your notes'

  const headline = isFirst
    ? 'Your digest is almost ready.'
    : 'Still waiting on your notes.'

  const body1 = isFirst
    ? `We couldn&apos;t find any writing in your connected folders yet — so we&apos;re holding your digest until there&apos;s something to read.`
    : `We check your connected folders every morning at 8 AM, but haven&apos;t found any notes to read yet — so your digest hasn&apos;t gone out.`

  const body2 = isFirst
    ? `Connect a Google Drive folder or add an individual doc — even a few rough lines is enough for Claude to work with.`
    : `Once you add a doc or folder with some writing in it, your digest will start arriving every morning automatically.`

  const ctaText = isFirst ? 'Connect my notes →' : 'Add notes and start my digest →'

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="font-family:Georgia,'Times New Roman',serif;background:#f8f7f3;margin:0;padding:0;color:#1a1a2e">
  <div style="max-width:640px;margin:0 auto;padding:48px 24px">

    <div style="margin-bottom:40px;padding-bottom:24px;border-bottom:1px solid #e0ddd4">
      <div style="font-family:-apple-system,sans-serif;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#4a3f8f;margin-bottom:8px">My Daily Journal</div>
    </div>

    <p style="font-size:20px;font-weight:normal;color:#1a1a2e;margin:0 0 16px">${headline}</p>
    <p style="font-family:-apple-system,sans-serif;font-size:15px;color:#555;line-height:1.7;margin:0 0 20px">${body1}</p>
    <p style="font-family:-apple-system,sans-serif;font-size:15px;color:#555;line-height:1.7;margin:0 0 32px">${body2}</p>

    <a href="${settingsUrl}" style="display:inline-block;background:#4a3f8f;color:#fff;font-family:-apple-system,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:10px">
      ${ctaText}
    </a>

    <div style="border-top:1px solid #e0ddd4;padding-top:24px;margin-top:48px;font-family:-apple-system,sans-serif;font-size:12px;color:#bbb;text-align:center;line-height:1.6">
      My Daily Journal · Your thinking, amplified<br>
      <a href="${settingsUrl}" style="color:#bbb">Manage settings</a>
    </div>

  </div>
</body>
</html>`

  await resend.emails.send({
    from: 'My Daily Journal <digest@mydailyjournal.net>',
    to,
    subject,
    html,
  })
}

export async function sendMarketingEmail({
  to,
  subject,
  body,
}: {
  to: string
  subject: string
  body: string
}) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="font-family:Georgia,'Times New Roman',serif;background:#f8f7f3;margin:0;padding:0;color:#1a1a2e">
  <div style="max-width:640px;margin:0 auto;padding:48px 24px">
    <div style="margin-bottom:40px;padding-bottom:24px;border-bottom:1px solid #e0ddd4">
      <div style="font-family:-apple-system,sans-serif;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#4a3f8f;margin-bottom:8px">My Daily Journal</div>
    </div>
    <div style="font-size:16px;line-height:1.8;color:#1a1a2e">
      ${body.replace(/\n/g, '<br>')}
    </div>
    <div style="border-top:1px solid #e0ddd4;padding-top:24px;margin-top:48px;font-family:-apple-system,sans-serif;font-size:12px;color:#bbb;text-align:center;line-height:1.6">
      My Daily Journal · Your thinking, amplified<br>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color:#bbb">Manage settings</a>
    </div>
  </div>
</body>
</html>`

  await resend.emails.send({
    from: 'My Daily Journal <digest@mydailyjournal.net>',
    to,
    subject,
    html,
  })
}

export async function sendDemoWelcomeEmail({
  to,
  name,
  briefingSubject,
  briefingBody,
}: {
  to: string
  name: string | null
  briefingSubject: string
  briefingBody: string
}) {
  const trialUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mydailyjournal.net'
  const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hi,'

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="font-family:Georgia,'Times New Roman',serif;background:#f0ece0;margin:0;padding:0;color:#1a1a2e">
  <div style="max-width:640px;margin:0 auto;padding:48px 24px">

    <div style="margin-bottom:40px;padding-bottom:24px;border-bottom:1px solid #d4cfc3">
      <div style="font-family:-apple-system,sans-serif;font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#4a3f8f;margin-bottom:12px">My Daily Journal</div>
      <p style="font-family:-apple-system,sans-serif;font-size:14px;color:#8a7d6b;line-height:1.6;margin:0">
        ${greeting} Here is the briefing we wrote for you — based on what you shared with us.<br>
        Connect your real notes and every morning will look like this.
      </p>
    </div>

    ${parseBodyToHtml(briefingBody)}

    <div style="background:#1a1511;border-radius:16px;padding:36px;margin-top:48px;text-align:center">
      <div style="font-family:Georgia,serif;font-size:20px;color:#f0ead6;font-weight:400;margin-bottom:12px">
        Your thinking, amplified — every morning.
      </div>
      <p style="font-family:-apple-system,sans-serif;font-size:14px;color:#8a7d6b;line-height:1.7;margin:0 0 28px">
        Connect your Google Drive notes. Claude reads everything you write<br>and delivers a personal briefing at 8 AM every morning.
      </p>
      <a href="${trialUrl}" style="display:inline-block;background:#c8a96e;color:#0f0d0b;font-family:-apple-system,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:10px;letter-spacing:0.5px">
        Start my free trial →
      </a>
      <div style="font-family:-apple-system,sans-serif;font-size:11px;color:#4a4035;margin-top:12px">
        7-day free trial · $4.99/mo after · Cancel anytime
      </div>
    </div>

    <div style="border-top:1px solid #d4cfc3;padding-top:24px;margin-top:48px;font-family:-apple-system,sans-serif;font-size:12px;color:#aaa;text-align:center;line-height:1.6">
      My Daily Journal · Your thinking, amplified<br>
      You joined at mydailyjournal.net/join
    </div>

  </div>
</body>
</html>`

  await resend.emails.send({
    from: 'My Daily Journal <digest@mydailyjournal.net>',
    to,
    subject: `${briefingSubject} — your preview briefing`,
    html,
  })
}

export async function sendFeatureRequestEmail({ from, text }: { from: string; text: string }) {
  await resend.emails.send({
    from: 'My Daily Journal <digest@mydailyjournal.net>',
    to: 'digest@mydailyjournal.net',
    subject: `Feature request from ${from}`,
    html: `<p><strong>From:</strong> ${from}</p><p>${text.replace(/\n/g, '<br>')}</p>`,
  })
}

function buildEmailHtml({
  body,
  docNames,
  today,
}: {
  body: string
  docNames: string[]
  today: string
}): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="font-family:Georgia,'Times New Roman',serif;background:#f8f7f3;margin:0;padding:0;color:#1a1a2e">
  <div style="max-width:640px;margin:0 auto;padding:48px 24px">

    <!-- Header -->
    <div style="margin-bottom:40px;padding-bottom:24px;border-bottom:1px solid #e0ddd4">
      <div style="font-family:-apple-system,sans-serif;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#4a3f8f;margin-bottom:8px">My Daily Journal</div>
      <div style="font-size:26px;font-weight:normal;color:#1a1a2e;margin-bottom:6px">${today}</div>
      <div style="font-size:12px;color:#aaa;font-family:-apple-system,sans-serif">Reading from: ${docNames.slice(0, 5).join(' · ')}</div>
    </div>

    <!-- Digest body -->
    ${parseBodyToHtml(body)}

    <!-- Footer -->
    <div style="border-top:1px solid #e0ddd4;padding-top:24px;margin-top:48px;font-family:-apple-system,sans-serif;font-size:12px;color:#bbb;text-align:center;line-height:1.6">
      My Daily Journal · Your thinking, amplified<br>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color:#bbb">Manage settings</a>
    </div>

  </div>
</body>
</html>`
}
