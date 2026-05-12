import { Resend } from 'resend'
import { parseBodyToHtml } from '@/lib/parse-digest'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendDigestEmail({
  to,
  subject,
  body,
  docNames,
  today,
}: {
  to: string
  subject: string
  body: string
  docNames: string[]
  today: string
}) {
  const html = buildEmailHtml({ body, docNames, today })

  await resend.emails.send({
    from: 'Dispatch <digest@mydailyjournal.net>',
    to,
    subject,
    html,
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
      <div style="font-family:-apple-system,sans-serif;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#4a3f8f;margin-bottom:8px">Dispatch</div>
      <div style="font-size:26px;font-weight:normal;color:#1a1a2e;margin-bottom:6px">${today}</div>
      <div style="font-size:12px;color:#aaa;font-family:-apple-system,sans-serif">Reading from: ${docNames.slice(0, 5).join(' · ')}</div>
    </div>

    <!-- Digest body -->
    ${parseBodyToHtml(body)}

    <!-- Footer -->
    <div style="border-top:1px solid #e0ddd4;padding-top:24px;margin-top:48px;font-family:-apple-system,sans-serif;font-size:12px;color:#bbb;text-align:center;line-height:1.6">
      Dispatch · Your thinking, amplified<br>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color:#bbb">Manage settings</a>
    </div>

  </div>
</body>
</html>`
}
