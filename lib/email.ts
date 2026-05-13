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

export async function sendContextNudgeEmail({ to }: { to: string }) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
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

    <p style="font-size:20px;font-weight:normal;color:#1a1a2e;margin:0 0 16px">Your first digest is almost ready.</p>
    <p style="font-family:-apple-system,sans-serif;font-size:15px;color:#555;line-height:1.7;margin:0 0 24px">
      We couldn&apos;t find any writing in your connected folders yet — so we held off on sending your digest until there&apos;s something to read.
    </p>
    <p style="font-family:-apple-system,sans-serif;font-size:15px;color:#555;line-height:1.7;margin:0 0 32px">
      In the meantime, adding a short note about what you&apos;re working on and thinking about lets My Daily Journal write something personal for you right now — even before your first notes are in.
    </p>

    <a href="${dashboardUrl}" style="display:inline-block;background:#4a3f8f;color:#fff;font-family:-apple-system,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:10px">
      Add context &amp; get my first digest →
    </a>

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
    subject: 'Your first My Daily Journal digest is almost ready',
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

export async function sendFeatureRequestEmail({ from, text }: { from: string; text: string }) {
  await resend.emails.send({
    from: 'My Daily Journal <digest@mydailyjournal.net>',
    to: process.env.ADMIN_EMAIL!,
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
