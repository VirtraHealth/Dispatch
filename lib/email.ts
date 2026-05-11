import { google } from 'googleapis'

async function getGmailClient(accessToken: string, refreshToken: string) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  auth.setCredentials({ access_token: accessToken, refresh_token: refreshToken })
  return google.gmail({ version: 'v1', auth })
}

const SECTION_HEADERS = [
  'PHILOSOPHY',
  'BUSINESS & SYSTEMS',
  'REFLECTIONS',
  'NEW THOUGHTS & QUESTIONS',
]

function parseBodyToHtml(body: string): string {
  let html = ''

  SECTION_HEADERS.forEach((header, i) => {
    const patterns = [`**${header}**`, `## ${header}`, `# ${header}`, header]
    let start = -1
    let headerLen = 0

    for (const p of patterns) {
      const idx = body.indexOf(p)
      if (idx !== -1) {
        start = idx
        headerLen = p.length
        break
      }
    }

    if (start === -1) return

    let end = body.length
    for (let j = i + 1; j < SECTION_HEADERS.length; j++) {
      for (const p of [
        `**${SECTION_HEADERS[j]}**`,
        `## ${SECTION_HEADERS[j]}`,
        SECTION_HEADERS[j],
      ]) {
        const idx = body.indexOf(p)
        if (idx !== -1 && idx < end) {
          end = idx
          break
        }
      }
    }

    const content = body.slice(start + headerLen, end).trim()
    const paragraphs = content
      .split(/\n\n+/)
      .filter(p => p.trim())
      .map(
        p =>
          `<p style="margin:0 0 18px;font-size:16px;line-height:1.9;color:#1a1a2e">${p
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .trim()}</p>`
      )
      .join('')

    html += `
    <div style="margin-bottom:44px">
      <div style="font-family:-apple-system,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#4a3f8f;margin-bottom:18px;padding-bottom:10px;border-bottom:2px solid #eeedfe">${header}</div>
      ${paragraphs}
    </div>`
  })

  return (
    html ||
    `<p style="font-size:16px;line-height:1.9;color:#1a1a2e">${body}</p>`
  )
}

export async function sendDigestEmail({
  to,
  subject,
  body,
  docNames,
  today,
  accessToken,
  refreshToken,
}: {
  to: string
  subject: string
  body: string
  docNames: string[]
  today: string
  accessToken: string
  refreshToken: string
}) {
  const htmlBody = buildEmailHtml({ body, docNames, today })
  const gmail = await getGmailClient(accessToken, refreshToken)

  // Gmail API requires a base64url-encoded RFC 2822 message
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    htmlBody,
  ].join('\r\n')

  const encoded = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encoded },
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
